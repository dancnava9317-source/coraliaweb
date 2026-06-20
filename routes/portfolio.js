// routes/portfolio.js
// ─────────────────────────────────────────────────────────────
//  Rutas para los álbumes y fotos del portafolio público.
//
//  Álbumes (administrables: crear, eliminar, renombrar texto visible):
//  GET    /api/portfolio/albums         → lista de álbumes (público)
//  POST   /api/portfolio/albums         → crear álbum nuevo (admin)
//  PATCH  /api/portfolio/albums/:slug   → renombrar texto visible (admin)
//  DELETE /api/portfolio/albums/:slug   → eliminar álbum y sus fotos (admin)
//
//  Fotos:
//  GET    /api/portfolio              → todas las fotos de todos los álbumes (público)
//  GET    /api/portfolio/:album       → fotos de un álbum específico (público)
//  POST   /api/portfolio/:album/upload → subir fotos a un álbum (admin, máx 20 por álbum)
//  DELETE /api/portfolio/photo/:id    → eliminar una foto específica (admin)
//  PATCH  /api/portfolio/:album/order → reordenar fotos de un álbum (admin)
// ─────────────────────────────────────────────────────────────

const express    = require('express');
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const db         = require('../database/db');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const router     = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MAX_PHOTOS_PER_ALBUM = 20;

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 15 * 1024 * 1024 }, // 15 MB por foto
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
});

function isValidAlbum(slug){
  const row = db.prepare('SELECT 1 FROM portfolio_albums WHERE slug = ?').get(slug);
  return !!row;
}

function getAllAlbumSlugs(){
  return db.prepare('SELECT slug FROM portfolio_albums').all().map(r => r.slug);
}

// Convierte un nombre escrito por el usuario ("Bodas y Compromisos") en un
// identificador interno seguro ("bodas-y-compromisos"): sin acentos, espacios
// reemplazados por guiones, solo minúsculas y caracteres alfanuméricos.
function slugify(text){
  return text
    .toString()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ═══════════════════════════════════════════════════════════
//  ÁLBUMES
// ═══════════════════════════════════════════════════════════

// ── GET /api/portfolio/albums — lista de álbumes con su conteo de fotos ──
router.get('/albums', (req, res) => {
  const albums = db.prepare(`
    SELECT a.*, COUNT(p.id) as photo_count
    FROM portfolio_albums a
    LEFT JOIN portfolio_photos p ON p.album = a.slug
    GROUP BY a.id
    ORDER BY a.sort_order ASC, a.id ASC
  `).all();

  res.json({ albums });
});

// ── POST /api/portfolio/albums — crear álbum nuevo (admin) ──
// Body: { "name_es": "Bodas y Compromisos", "name_en": "Weddings & Engagements" }
router.post('/albums', requireAdminAuth, (req, res) => {
  const { name_es, name_en } = req.body;
  if (!name_es || !name_es.trim()) {
    return res.status(400).json({ error: 'El nombre del álbum en español es obligatorio.' });
  }

  const baseSlug = slugify(name_es);
  if (!baseSlug) {
    return res.status(400).json({ error: 'El nombre del álbum debe contener al menos una letra o número.' });
  }

  // Si el slug ya existe, le agregamos un sufijo numérico para que sea único
  let slug = baseSlug;
  let suffix = 2;
  while (isValidAlbum(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  const { maxOrder } = db.prepare(
    'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM portfolio_albums'
  ).get();

  const result = db.prepare(`
    INSERT INTO portfolio_albums (slug, name_es, name_en, sort_order)
    VALUES (?, ?, ?, ?)
  `).run(slug, name_es.trim(), (name_en || name_es).trim(), maxOrder + 1);

  res.json({
    message: 'Álbum creado correctamente.',
    album: { id: result.lastInsertRowid, slug, name_es, name_en: name_en || name_es }
  });
});

// ── PATCH /api/portfolio/albums/:slug — renombrar el texto visible (admin) ──
// El identificador interno (slug) NUNCA cambia, solo name_es / name_en.
router.patch('/albums/:slug', requireAdminAuth, (req, res) => {
  const { slug } = req.params;
  const { name_es, name_en } = req.body;

  if (!isValidAlbum(slug)) {
    return res.status(404).json({ error: 'Álbum no encontrado.' });
  }
  if (!name_es || !name_es.trim()) {
    return res.status(400).json({ error: 'El nombre del álbum en español es obligatorio.' });
  }

  db.prepare(`
    UPDATE portfolio_albums SET name_es = ?, name_en = ? WHERE slug = ?
  `).run(name_es.trim(), (name_en || name_es).trim(), slug);

  res.json({ message: 'Álbum actualizado correctamente.' });
});

// ── DELETE /api/portfolio/albums/:slug — eliminar álbum y sus fotos (admin) ──
// Protección: no se permite eliminar si es el único álbum que queda.
router.delete('/albums/:slug', requireAdminAuth, async (req, res) => {
  const { slug } = req.params;

  if (!isValidAlbum(slug)) {
    return res.status(404).json({ error: 'Álbum no encontrado.' });
  }

  const { total } = db.prepare('SELECT COUNT(*) as total FROM portfolio_albums').get();
  if (total <= 1) {
    return res.status(400).json({
      error: 'No puedes eliminar el último álbum del portafolio. Crea otro antes de borrar este, o simplemente renómbralo.'
    });
  }

  // Borrar también las fotos del álbum, tanto de Cloudinary como de la base de datos
  const photos = db.prepare('SELECT * FROM portfolio_photos WHERE album = ?').all(slug);
  for (const photo of photos) {
    try {
      await cloudinary.uploader.destroy(photo.cloudinary_id, { resource_type: 'image', type: 'upload' });
    } catch (err) {
      console.warn(`Aviso: no se pudo eliminar de Cloudinary la foto ${photo.cloudinary_id}:`, err.message);
    }
  }
  db.prepare('DELETE FROM portfolio_photos WHERE album = ?').run(slug);
  db.prepare('DELETE FROM portfolio_albums WHERE slug = ?').run(slug);

  res.json({ message: `Álbum eliminado junto con sus ${photos.length} foto(s).` });
});

// ═══════════════════════════════════════════════════════════
//  FOTOS
// ═══════════════════════════════════════════════════════════

// ── GET /api/portfolio — todas las fotos, agrupadas por álbum ──
// Pública (sin login) porque el sitio principal la consulta para pintar el portafolio.
router.get('/', (req, res) => {
  const albumSlugs = getAllAlbumSlugs();
  const rows = db.prepare(
    'SELECT * FROM portfolio_photos ORDER BY album ASC, sort_order ASC, id ASC'
  ).all();

  const byAlbum = {};
  albumSlugs.forEach(a => byAlbum[a] = []);
  rows.forEach(photo => {
    if (!byAlbum[photo.album]) byAlbum[photo.album] = [];
    byAlbum[photo.album].push(photo);
  });

  res.json({ albums: byAlbum });
});

// ── GET /api/portfolio/:album — fotos de un álbum específico ──
router.get('/:album', (req, res) => {
  const { album } = req.params;
  if (!isValidAlbum(album)) {
    return res.status(400).json({ error: `Álbum inválido.` });
  }

  const photos = db.prepare(
    'SELECT * FROM portfolio_photos WHERE album = ? ORDER BY sort_order ASC, id ASC'
  ).all(album);

  res.json({ album, photos });
});

// ── POST /api/portfolio/:album/upload — subir fotos a un álbum (admin) ──
// Acepta hasta 20 archivos en una sola petición, pero también respeta el
// límite total de 20 fotos POR ÁLBUM (si ya hay algunas, solo permite las que falten).
router.post('/:album/upload', requireAdminAuth, upload.array('photos', 20), async (req, res) => {
  const { album } = req.params;
  if (!isValidAlbum(album)) {
    return res.status(400).json({ error: `Álbum inválido.` });
  }

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se recibieron fotos.' });
  }

  // Verificar cuántas fotos ya tiene el álbum para no pasarnos del límite
  const { count } = db.prepare(
    'SELECT COUNT(*) as count FROM portfolio_photos WHERE album = ?'
  ).get(album);

  const spaceLeft = MAX_PHOTOS_PER_ALBUM - count;
  if (spaceLeft <= 0) {
    return res.status(400).json({
      error: `Este álbum ya tiene el máximo de ${MAX_PHOTOS_PER_ALBUM} fotos. Elimina alguna antes de subir más.`
    });
  }

  const filesToUpload = req.files.slice(0, spaceLeft);
  const skipped = req.files.length - filesToUpload.length;

  const uploaded = [];
  const errors   = [];

  // Siguiente número de orden disponible (para que las nuevas se agreguen al final)
  const { maxOrder } = db.prepare(
    'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM portfolio_photos WHERE album = ?'
  ).get(album);
  let nextOrder = maxOrder + 1;

  for (const file of filesToUpload) {
    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder:        `coralia/portfolio/${album}`,
            resource_type: 'image',
            type:          'upload' // públicas, se muestran en el sitio principal
          },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(file.buffer);
      });

      const dbResult = db.prepare(`
        INSERT INTO portfolio_photos (album, cloudinary_id, url, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(album, result.public_id, result.secure_url, nextOrder);

      uploaded.push({
        id:  dbResult.lastInsertRowid,
        url: result.secure_url
      });
      nextOrder++;
    } catch (err) {
      errors.push({ filename: file.originalname, error: err.message });
    }
  }

  res.json({
    uploaded_count: uploaded.length,
    error_count:    errors.length,
    skipped_count:  skipped, // archivos no subidos por exceder el límite de 20
    uploaded,
    errors
  });
});

// ── DELETE /api/portfolio/photo/:id — eliminar una foto (admin) ──
router.delete('/photo/:id', requireAdminAuth, async (req, res) => {
  const { id } = req.params;
  const photo = db.prepare('SELECT * FROM portfolio_photos WHERE id = ?').get(id);
  if (!photo) return res.status(404).json({ error: 'Foto no encontrada.' });

  try {
    await cloudinary.uploader.destroy(photo.cloudinary_id, {
      resource_type: 'image',
      type: 'upload'
    });
  } catch (err) {
    console.warn('Aviso: no se pudo eliminar de Cloudinary:', err.message);
  }

  db.prepare('DELETE FROM portfolio_photos WHERE id = ?').run(id);

  res.json({ message: 'Foto eliminada correctamente.' });
});

// ── PATCH /api/portfolio/:album/order — reordenar fotos (admin) ──
// Body esperado: { "order": [12, 7, 15, 3] }  ← array de IDs en el nuevo orden deseado
router.patch('/:album/order', requireAdminAuth, (req, res) => {
  const { album } = req.params;
  const { order } = req.body;

  if (!isValidAlbum(album)) {
    return res.status(400).json({ error: `Álbum inválido.` });
  }
  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Se requiere un array "order" con los ids en el nuevo orden.' });
  }

  const update = db.prepare('UPDATE portfolio_photos SET sort_order = ? WHERE id = ? AND album = ?');
  const runUpdates = db.transaction((ids) => {
    ids.forEach((id, index) => update.run(index, id, album));
  });

  try {
    runUpdates(order);
    res.json({ message: 'Orden actualizado correctamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el orden.', detail: err.message });
  }
});

module.exports = router;
