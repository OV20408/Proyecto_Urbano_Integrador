import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // ✅ Solo importa
import { sequelize } from './config/db.js'; // ✅ Solo importa
import { authenticateToken } from './middleware/auth.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';

// ✅ Conexión/Sync de BD opcional al iniciar (no tumba el servidor si falla)
const DB_ENABLED = process.env.DB_ENABLED !== 'false';
const DB_SYNC_ON_START = process.env.DB_SYNC_ON_START !== 'false';

async function initDatabaseIfEnabled() {
  if (!DB_ENABLED) {
    console.log('⚠️ DB deshabilitada por configuración (DB_ENABLED=false)');
    return;
  }
  try {
    await sequelize.authenticate();
    console.log('🗄️ Conexión a BD establecida');
    if (DB_SYNC_ON_START) {
      await sequelize.sync();
      console.log('🗄️ Base de datos sincronizada (User)');
    }
  } catch (err) {
    console.warn('⚠️ No se pudo conectar/sincronizar la BD (continuando sin DB):', err.message);
  }
}

initDatabaseIfEnabled();

/* ============================================================
   🔹 Rutas
   ============================================================ */

// Health check
router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'auth', ts: Date.now() });
});

/* ------------------------------------------------------------
   🔸 Registro de usuario
   ------------------------------------------------------------ */
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body || {};
  
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Verificar si el usuario ya existe
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    // Crear nuevo usuario
    const password_hash = bcrypt.hashSync(password, 10);
    const user = await User.create({ nombre, email, password_hash });

    console.log('✅ Usuario registrado en BD:', user.email);
    
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { usuario_id: user.usuario_id, nombre: user.nombre, email: user.email },
    });

  } catch (err) {
    console.error('❌ Error al registrar:', err);
    return res.status(500).json({ 
      message: 'Error al registrar usuario',
      error: err.message 
    });
  }
});

/* ------------------------------------------------------------
   🔸 Login
   ------------------------------------------------------------ */
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: user.usuario_id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    
    return res.json({ 
      token, 
      user: { usuario_id: user.usuario_id, nombre: user.nombre, email: user.email } 
    });

  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    return res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: err.message 
    });
  }
});

/* ------------------------------------------------------------
   🔸 Obtener información del usuario logueado
   ------------------------------------------------------------ */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const usuarioId = req.user?.sub || req.user?.usuario_id;
    
    if (!usuarioId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const user = await User.findByPk(usuarioId, {
      attributes: { exclude: ['password_hash'] } // Excluir password_hash de la respuesta
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.json({
      success: true,
      user: {
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        email: user.email,
        fecha_creacion: user.fecha_creacion,
        fecha_actualizacion: user.fecha_actualizacion
      }
    });

  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    return res.status(500).json({ 
      message: 'Error al obtener información del usuario',
      error: err.message 
    });
  }
});

export default router;