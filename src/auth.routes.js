import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto';

// “Base de datos” en memoria (solo para demo)
const users = [
  { id: 1, name: 'Omar Velasco', email: 'omar@gmail.com', passwordHash: bcrypt.hashSync('123456', 10) }
];

// Health check
router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'auth', ts: Date.now() });
});

// Registro
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Datos incompletos' });

  const exists = users.find(u => u.email === email);
  if (exists) return res.status(409).json({ message: 'Email ya registrado' });

  const id = users.length + 1;
  const passwordHash = bcrypt.hashSync(password, 10);
  users.push({ id, name, email, passwordHash });

  return res.status(201).json({ message: 'Usuario registrado correctamente', id });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

export default router;
