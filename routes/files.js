// routes/files.js
// ─────────────────────────────────────────────────────────────
//  Rutas para manejo de archivos:
//
//  POST   /api/files/upload/:projectId  → subir fotos (admin)
//  GET    /api/files/:projectId         → listar archivos (cliente)
//  DELETE /api/files/:fileId            → eliminar archivo (admin)
//  GET    /api/files/download/:projectId → descargar TODO en ZIP (cliente)
// ─────────────────────────────────────────────────────────────

const express    = require('express');
const multer     = require('multer');
const cloudinary = require('cloudinary').v2;
const archiver   = require('archiver');
const https      = require('https');
const db         = require('../database/db');
const { requireClientAuth, requireAdminAuth } = require('../middleware/authMiddleware');
const router     = express.Router();

// ── Configurar Cloudinary ────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── Configurar Multer (almacenamiento temporal en memoria) ────
// Los archivos se guardan en RAM temporalmente antes de ir a Cloudinary.
// Límite de 50 MB por archivo — ajusta según tus necesidades.
const storage = multer.memoryStorage();
const upload  = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'video/mp4', 'video/quicktime'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
    }
  }
});

// ── POST /api/files/upload/:projectId — subir archivos ───────
// El admin sube N fotos/videos. Se van a Cloudinary en la carpeta
// privada del proyecto: "coralia/project-{id}/"
router.post('/upload/:projectId', requireAdminAuth, upload.array('files', 200), async (req, res) => {
  const { projectId } = req.params;

  // Verificar que el proyecto existe
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No se recibieron archivos.' });
  }

  const uploaded = [];
  const errors   = [];

  // Subir cada archivo a Cloudinary en paralelo (máx 5 a la vez)
  const BATCH_SIZE = 5;
  for (let i = 0; i < req.files.length; i += BATCH_SIZE) {
    const batch = req.files.slice(i, i + BATCH_SIZE);

    const results = await Promise.allSettled(
      batch.map(file => uploadToCloudinary(file, projectId))
    );

    results.forEach((result, idx) => {
      const file = batch[idx];
      if (result.status === 'fulfilled') {
        const { cloudinaryId, url, width, height } = result.value;
        const isVideo = file.mimetype.startsWith('video/');

        // Guardar en la base de datos
        const dbResult = db.prepare(`
          INSERT INTO files (project_id, filename, cloudinary_id, cloudinary_url, file_type, file_size, width, height)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          projectId,
          file.originalname,
          cloudinaryId,
          url,
          isVideo ? 'video' : 'photo',
          file.size,
          width || null,
          height || null
        );

        uploaded.push({
          id:       dbResult.lastInsertRowid,
          filename: file.originalname,
          url,
          file_type: isVideo ? 'video' : 'photo'
        });
      } else {
        errors.push({ filename: file.originalname, error: result.reason.message });
      }
    });
  }

  res.json({
    uploaded_count: uploaded.length,
    error_count:    errors.length,
    uploaded,
    errors
  });
});

// Función auxiliar: sube un archivo a Cloudinary desde buffer
function uploadToCloudinary(file, projectId) {
  return new Promise((resolve, reject) => {
    const isVideo    = file.mimetype.startsWith('video/');
    const uploadOpts = {
      folder:         `coralia/project-${projectId}`,
      resource_type:  isVideo ? 'video' : 'image',
      // Las imágenes en Cloudinary son privadas por defecto con signed URLs
      type:           'upload',
      access_mode:    'authenticated' // requiere firma para acceder
    };

    const stream = cloudinary.uploader.upload_stream(uploadOpts, (error, result) => {
      if (error) return reject(error);
      resolve({
        cloudinaryId: result.public_id,
        url:          result.secure_url,
        width:        result.width,
        height:       result.height
      });
    });

    stream.end(file.buffer);
  });
}

// ── GET /api/files/:projectId — listar archivos del proyecto ──
// El cliente puede ver la lista de sus archivos.
// Las URLs son firmadas y expiran en 1 hora para mayor seguridad.
router.get('/:projectId', requireClientAuth, (req, res) => {
  const { projectId } = req.params;

  // El cliente solo puede ver sus propios archivos
  if (req.project.project_id !== parseInt(projectId)) {
    return res.status(403).json({ error: 'No tienes acceso a estos archivos.' });
  }

  const files = db.prepare(
    'SELECT * FROM files WHERE project_id = ? ORDER BY created_at ASC'
  ).all(projectId);

  // Generar URLs firmadas para cada archivo (expiran en 1 hora)
  const filesWithSignedUrls = files.map(file => ({
    ...file,
    signed_url: cloudinary.url(file.cloudinary_id, {
      type:      'authenticated',
      sign_url:  true,
      expires_at: Math.floor(Date.now() / 1000) + 3600 // 1 hora
    })
  }));

  res.json({ files: filesWithSignedUrls });
});

// ── GET /api/files/download/:projectId — descargar ZIP ───────
// Genera un ZIP al vuelo con todos los archivos del proyecto.
// Útil para que el cliente descargue todo de una vez.
router.get('/download/:projectId', requireClientAuth, async (req, res) => {
  const { projectId } = req.params;

  if (req.project.project_id !== parseInt(projectId)) {
    return res.status(403).json({ error: 'No tienes acceso a estos archivos.' });
  }

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
  const files   = db.prepare('SELECT * FROM files WHERE project_id = ?').all(projectId);

  if (files.length === 0) {
    return res.status(404).json({ error: 'No hay archivos en este proyecto.' });
  }

  // Nombre del archivo ZIP
  const zipName = `Coralia_${project.client_name.replace(/\s+/g, '_')}_${project.project_name.replace(/\s+/g, '_')}.zip`;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);

  const archive = archiver('zip', { zlib: { level: 0 } }); // level 0 = sin compresión extra (las fotos ya están comprimidas)
  archive.pipe(res);

  // Descargar cada archivo de Cloudinary y añadirlo al ZIP
  for (const file of files) {
    const signedUrl = cloudinary.url(file.cloudinary_id, {
      type:      'authenticated',
      sign_url:  true,
      expires_at: Math.floor(Date.now() / 1000) + 600 // 10 min, suficiente para el ZIP
    });

    await new Promise((resolve, reject) => {
      https.get(signedUrl, stream => {
        archive.append(stream, { name: file.filename });
        stream.on('end', resolve);
        stream.on('error', reject);
      }).on('error', reject);
    });
  }

  await archive.finalize();
});

// ── DELETE /api/files/:fileId — eliminar archivo (admin) ──────
router.delete('/:fileId', requireAdminAuth, async (req, res) => {
  const { fileId } = req.params;

  const file = db.prepare('SELECT * FROM files WHERE id = ?').get(fileId);
  if (!file) return res.status(404).json({ error: 'Archivo no encontrado.' });

  // Eliminar de Cloudinary
  try {
    await cloudinary.uploader.destroy(file.cloudinary_id, {
      resource_type: file.file_type === 'video' ? 'video' : 'image',
      type: 'authenticated'
    });
  } catch (err) {
    console.warn('Aviso: no se pudo eliminar de Cloudinary:', err.message);
  }

  // Eliminar de la base de datos
  db.prepare('DELETE FROM files WHERE id = ?').run(fileId);

  res.json({ message: 'Archivo eliminado correctamente.' });
});

module.exports = router;
