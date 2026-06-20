// routes/portfolio.js
// ─────────────────────────────────────────────────────────────
//  Rutas para las fotos del portafolio público, organizadas por álbum.
//  Los álbumes son las 6 categorías fijas del sitio:
//  bodas, maternidad, retratos, comercial, food, eventos
//
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

// Álbumes válidos — deben coincidir exactamente con los data-filter del HTML público
const VALID_ALBUMS = ['bodas', 'maternidad', 'retratos', 'comercial', 'food', 'eventos'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 15 * 1024 * 1024 }, // 15 MB por foto
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
});

function isValidAlbum(album){
  return VALID_ALBUMS.includes(album);
}

// ── GET /api/portfolio — todas las fotos, agrupadas por álbum ──
// Pública (sin login) porque el sitio principal la consulta para pintar el portafolio.
router.get('/', (req, res) => {
  const rows = db.prepare(
    'SELECT * FROM portfolio_photos ORDER BY album ASC, sort_order ASC, id ASC'
  ).all();

  const byAlbum = {};
  VALID_ALBUMS.forEach(a => byAlbum[a] = []);
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
    return res.status(400).json({ error: `Álbum inválido. Debe ser uno de: ${VALID_ALBUMS.join(', ')}` });
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
    return res.status(400).json({ error: `Álbum inválido. Debe ser uno de: ${VALID_ALBUMS.join(', ')}` });
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
