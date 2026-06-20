// routes/projects.js
// ─────────────────────────────────────────────────────────────
//  Rutas para gestionar proyectos / entregas:
//
//  GET    /api/projects          → listar todos (admin)
//  POST   /api/projects          → crear nuevo proyecto (admin)
//  GET    /api/projects/:id      → detalle de un proyecto (cliente o admin)
//  PATCH  /api/projects/:id      → actualizar proyecto (admin)
//  DELETE /api/projects/:id      → eliminar proyecto (admin)
// ─────────────────────────────────────────────────────────────

const express    = require('express');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const db         = require('../database/db');
const { requireClientAuth, requireAdminAuth } = require('../middleware/authMiddleware');
const router   = express.Router();

// ── Genera una clave legible y única: CORA-XXXX-XXXX ─────────
function generateAccessKey(clientName) {
  // Toma las primeras 4 letras del nombre del cliente
  const prefix = clientName
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 4)
    .toUpperCase()
    .padEnd(4, 'X');

  const num1 = Math.floor(1000 + Math.random() * 9000);
  const num2 = Math.floor(1000 + Math.random() * 9000);

  return `CORA-${num1}-${prefix}`;
}

// ── GET /api/projects — listar todos los proyectos (admin) ───
router.get('/', requireAdminAuth, (req, res) => {
  const projects = db.prepare(`
    SELECT
      p.*,
      COUNT(f.id) as file_count,
      SUM(f.file_size) as total_size
    FROM projects p
    LEFT JOIN files f ON f.project_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `).all();

  res.json({ projects });
});

// ── POST /api/projects — crear nuevo proyecto (admin) ────────
router.post('/', requireAdminAuth, (req, res) => {
  const { client_name, project_name, expires_in_days } = req.body;

  if (!client_name || !project_name) {
    return res.status(400).json({ error: 'client_name y project_name son requeridos.' });
  }

  // Calcular fecha de vencimiento
  let expires_at = null;
  if (expires_in_days && expires_in_days !== 'never') {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(expires_in_days));
    expires_at = date.toISOString();
  }

  // Generar clave única — reintentar si ya existe
  let access_key;
  let attempts = 0;
  do {
    access_key = generateAccessKey(client_name);
    attempts++;
    if (attempts > 10) break; // salvaguarda
  } while (db.prepare('SELECT id FROM projects WHERE access_key = ?').get(access_key));

  const result = db.prepare(`
    INSERT INTO projects (client_name, project_name, access_key, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(client_name, project_name, access_key, expires_at);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({ project });
});

// ── GET /api/projects/:id — detalle de proyecto ───────────────
// Accesible tanto por el cliente (con su token) como por el admin
router.get('/:id', requireClientAuth, (req, res) => {
  const { id } = req.params;

  // Si es cliente, solo puede ver su propio proyecto
  if (req.project.role === 'client' && req.project.project_id !== parseInt(id)) {
    return res.status(403).json({ error: 'No tienes acceso a este proyecto.' });
  }

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

  const files = db.prepare(
    'SELECT * FROM files WHERE project_id = ? ORDER BY created_at DESC'
  ).all(id);

  res.json({ project, files });
});

// ── PATCH /api/projects/:id — actualizar proyecto (admin) ─────
router.patch('/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const { client_name, project_name, is_active, expires_in_days } = req.body;

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

  let expires_at = project.expires_at;
  if (expires_in_days === 'never') {
    expires_at = null;
  } else if (expires_in_days) {
    const date = new Date();
    date.setDate(date.getDate() + parseInt(expires_in_days));
    expires_at = date.toISOString();
  }

  db.prepare(`
    UPDATE projects
    SET client_name  = COALESCE(?, client_name),
        project_name = COALESCE(?, project_name),
        is_active    = COALESCE(?, is_active),
        expires_at   = ?
    WHERE id = ?
  `).run(client_name || null, project_name || null, is_active ?? null, expires_at, id);

  const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  res.json({ project: updated });
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── DELETE /api/projects/:id — eliminar proyecto (admin) ──────
// Elimina el proyecto, sus archivos en la base de datos (en cascada),
// y también las fotos/videos reales en Cloudinary para no dejar
// archivos huérfanos ocupando espacio de almacenamiento.
router.delete('/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

  const files = db.prepare('SELECT * FROM files WHERE project_id = ?').all(id);

  // Eliminar cada archivo de Cloudinary (si alguno falla, seguimos con los demás)
  for (const file of files) {
    try {
      await cloudinary.uploader.destroy(file.cloudinary_id, {
        resource_type: file.file_type === 'video' ? 'video' : 'image',
        type: 'upload'
      });
    } catch (err) {
      console.warn(`Aviso: no se pudo eliminar de Cloudinary el archivo ${file.cloudinary_id}:`, err.message);
    }
  }

  // Los registros de archivos se eliminan en cascada por la constraint de la DB
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);

  res.json({ message: 'Proyecto y todos sus archivos eliminados correctamente.' });
});

module.exports = router;
