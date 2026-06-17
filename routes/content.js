// routes/content.js
// ─────────────────────────────────────────────────────────────
//  Rutas para el contenido editable del sitio público:
//
//  GET   /api/content        → obtener TODO el contenido (público, sin login)
//  PATCH /api/content        → actualizar uno o varios campos (admin)
//  GET   /api/content/:key   → obtener un solo campo (público)
// ─────────────────────────────────────────────────────────────

const express = require('express');
const db      = require('../database/db');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const router  = express.Router();

// ── GET /api/content — todo el contenido, como objeto { key: value } ──
// Esta ruta es PÚBLICA (sin login) porque el sitio principal la consulta
// cada vez que un visitante carga la página.
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT key, value FROM site_content').all();

  // Convertir el array de filas en un objeto plano { key: value }
  const content = {};
  rows.forEach(row => { content[row.key] = row.value; });

  res.json({ content });
});

// ── GET /api/content/:key — un solo campo ──
router.get('/:key', (req, res) => {
  const row = db.prepare('SELECT value FROM site_content WHERE key = ?').get(req.params.key);
  if (!row) return res.status(404).json({ error: 'Campo no encontrado.' });
  res.json({ key: req.params.key, value: row.value });
});

// ── PATCH /api/content — actualizar campos (admin) ──
// Body esperado: { "updates": { "hero_title_es": "...", "pkg_basic_price": "200" } }
router.patch('/', requireAdminAuth, (req, res) => {
  const { updates } = req.body;

  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Se requiere un objeto "updates" con los campos a actualizar.' });
  }

  const upsert = db.prepare(`
    INSERT INTO site_content (key, value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `);

  const updated = [];
  const runUpdates = db.transaction((entries) => {
    for (const [key, value] of entries) {
      upsert.run(key, String(value));
      updated.push(key);
    }
  });

  try {
    runUpdates(Object.entries(updates));
    res.json({ message: 'Contenido actualizado correctamente.', updated_keys: updated });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el contenido.', detail: err.message });
  }
});

module.exports = router;
