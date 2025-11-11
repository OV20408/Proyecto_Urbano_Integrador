import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js'; // ✅ Solo importa
import { sequelize } from './config/db.js'; // ✅ Solo importa

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';

// ✅ Sincronizar BD (solo una vez al iniciar)
sequelize.sync()
  .then(() => console.log('🗄️ Base de datos sincronizada (User)'))
  .catch(console.error);

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
  const { name, email, password } = req.body || {};
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Datos incompletos' });
  }

  try {
    // Verificar si el usuario ya existe
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: 'Email ya registrado' });
    }

    // Crear nuevo usuario
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await User.create({ name, email, passwordHash });

    console.log('✅ Usuario registrado en BD:', user.email);
    
    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: { id: user.id, name: user.name, email: user.email },
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

    const ok = bcrypt.compareSync(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    
    return res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email } 
    });

  } catch (err) {
    console.error('❌ Error al iniciar sesión:', err);
    return res.status(500).json({ 
      message: 'Error al iniciar sesión',
      error: err.message 
    });
  }
});

export default router;