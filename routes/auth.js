// routes/auth.js
// ─────────────────────────────────────────────────────────────
//  Rutas de autenticación:
//  POST /api/auth/login        → login del cliente con su clave
//  POST /api/auth/admin-login  → login del administrador
// ─────────────────────────────────────────────────────────────

const express = require('express');
const jwt     = require('jsonwebtoken');
const db      = require('../database/db');
const router  = express.Router();

// ── POST /api/auth/login ──────────────────────────────────────
// El cliente manda su nombre y su clave de acceso.
// Si la clave existe y está activa → devuelve un JWT válido por 7 días.
router.post('/login', (req, res) => {
  const { client_name, access_key } = req.body;

  // Validar que llegaron los datos
  if (!client_name || !access_key) {
    return res.status(400).json({ error: 'Nombre y clave son requeridos.' });
  }

  // Buscar el proyecto con esa clave en la base de datos
  const project = db.prepare(`
    SELECT * FROM projects
    WHERE access_key = ? AND is_active = 1
  `).get(access_key.trim().toUpperCase());

  if (!project) {
    return res.status(401).json({ error: 'Clave de acceso incorrecta o inactiva.' });
  }

  // Verificar si el proyecto ha vencido
  if (project.expires_at) {
    const expiry = new Date(project.expires_at);
    if (expiry < new Date()) {
      return res.status(403).json({
        error: 'Esta entrega ha vencido. Contacta a Coralia para extender el acceso.'
      });
    }
  }

  // Registrar el acceso en el log
  db.prepare(`
    INSERT INTO access_log (project_id, ip_address)
    VALUES (?, ?)
  `).run(project.id, req.ip);

  // Generar el token JWT — expira en 7 días
  const token = jwt.sign(
    {
      project_id:   project.id,
      client_name:  project.client_name,
      project_name: project.project_name,
      role:         'client'
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Contar cuántos archivos tiene este proyecto
  const fileCount = db.prepare(
    'SELECT COUNT(*) as count FROM files WHERE project_id = ?'
  ).get(project.id);

  res.json({
    token,
    project: {
      id:           project.id,
      client_name:  project.client_name,
      project_name: project.project_name,
      expires_at:   project.expires_at,
      file_count:   fileCount.count
    }
  });
});

// ── POST /api/auth/admin-login ────────────────────────────────
// El administrador (tú) inicia sesión con la contraseña del .env
router.post('/admin-login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Contraseña requerida.' });
  }

  // Comparar con la contraseña en las variables de entorno
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta.' });
  }

  // Token de admin — expira en 24 horas
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
});

module.exports = router;
