// routes/migrate-portfolio.js
// ─────────────────────────────────────────────────────────────
//  RUTA TEMPORAL DE MIGRACIÓN — úsala UNA SOLA VEZ.
//
//  Migra las fotos del portafolio que actualmente viven como archivos
//  estáticos en Netlify (carpeta /assets/portfolio/) hacia Cloudinary,
//  y las registra en la tabla portfolio_photos para que sean
//  administrables desde el panel /admin → pestaña "Portafolio".
//
//  Es segura de ejecutar más de una vez: si una foto ya fue migrada
//  (mismo cloudinary_id), no la duplica.
//
//  Una vez migrado todo, puedes eliminar este archivo y su línea en
//  server.js — ya no se necesita para el funcionamiento normal del sitio.
// ─────────────────────────────────────────────────────────────

const express    = require('express');
const cloudinary = require('cloudinary').v2;
const https      = require('https');
const db         = require('../database/db');
const { requireAdminAuth } = require('../middleware/authMiddleware');
const router     = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Lista de las 26 fotos actuales: archivo en Netlify → álbum correspondiente.
// La URL base se arma con el dominio del frontend que mandes en el body.
const PHOTOS_TO_MIGRATE = [
  { file: 'portfolio-bodas-bouquet.jpg',              album: 'bodas' },
  { file: 'portfolio-bodas-velero.jpg',                album: 'bodas' },
  { file: 'portfolio-bodas-atardecer.jpg',             album: 'bodas' },
  { file: 'portfolio-bodas-rocas-01.jpg',              album: 'bodas' },
  { file: 'portfolio-bodas-rocas-02.jpg',              album: 'bodas' },
  { file: 'portfolio-comercial-carfan-01.jpg',         album: 'comercial' },
  { file: 'portfolio-comercial-carfan-02.jpg',         album: 'comercial' },
  { file: 'portfolio-eventos-corona-01.jpg',           album: 'eventos' },
  { file: 'portfolio-eventos-corona-02.jpg',           album: 'eventos' },
  { file: 'portfolio-eventos-corona-03.jpg',           album: 'eventos' },
  { file: 'portfolio-eventos-karts.jpg',               album: 'eventos' },
  { file: 'portfolio-eventos-religioso-01.jpg',        album: 'eventos' },
  { file: 'portfolio-eventos-religioso-02.jpg',        album: 'eventos' },
  { file: 'portfolio-eventos-romantica.jpg',           album: 'eventos' },
  { file: 'portfolio-gastronomia-cerveza.jpg',         album: 'food' },
  { file: 'portfolio-gastronomia-mojito.jpg',          album: 'food' },
  { file: 'portfolio-maternidad-gemelas-01.jpg',       album: 'maternidad' },
  { file: 'portfolio-maternidad-gemelas-02.jpg',       album: 'maternidad' },
  { file: 'portfolio-maternidad-madre-bebe.jpg',       album: 'maternidad' },
  { file: 'portfolio-maternidad-pareja-detalle.jpg',   album: 'maternidad' },
  { file: 'portfolio-maternidad-pareja-playa.jpg',     album: 'maternidad' },
  { file: 'portfolio-maternidad-pies-bebe.jpg',        album: 'maternidad' },
  { file: 'portfolio-retratos-editorial-01.jpg',       album: 'retratos' },
  { file: 'portfolio-retratos-editorial-02.jpg',       album: 'retratos' },
  { file: 'portfolio-retratos-hombre-01.jpg',          album: 'retratos' },
  { file: 'portfolio-retratos-hombre-02.jpg',          album: 'retratos' }
];

function downloadImage(url){
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode} al descargar ${url}`));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

// ── POST /api/migrate-portfolio — ejecutar la migración (admin) ──
// Body esperado: { "siteUrl": "https://coraliastudio.mx" }  (sin barra al final)
router.post('/', requireAdminAuth, async (req, res) => {
  const { siteUrl } = req.body;
  if (!siteUrl) {
    return res.status(400).json({ error: 'Falta "siteUrl" en el body (ej: https://coraliastudio.mx)' });
  }

  const baseUrl = siteUrl.replace(/\/$/, '');
  const results = { migrated: [], skipped: [], errors: [] };

  // Para no duplicar si se corre dos veces, revisamos qué ya existe
  const existingCount = db.prepare('SELECT COUNT(*) as c FROM portfolio_photos').get().c;
  if (existingCount > 0) {
    return res.status(400).json({
      error: `Ya hay ${existingCount} fotos registradas en el portafolio administrable. Para evitar duplicados, esta migración solo corre cuando la tabla está vacía. Si quieres forzar de todas formas, elimínalas primero desde el panel.`
    });
  }

  // Siguiente orden por álbum
  const nextOrderByAlbum = {};

  for (const item of PHOTOS_TO_MIGRATE) {
    const fileUrl = `${baseUrl}/assets/portfolio/${item.file}`;
    try {
      const buffer = await downloadImage(fileUrl);

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder:        `coralia/portfolio/${item.album}`,
            resource_type: 'image',
            type:          'upload'
          },
          (error, result) => error ? reject(error) : resolve(result)
        );
        stream.end(buffer);
      });

      const order = nextOrderByAlbum[item.album] ?? 0;
      db.prepare(`
        INSERT INTO portfolio_photos (album, cloudinary_id, url, sort_order)
        VALUES (?, ?, ?, ?)
      `).run(item.album, result.public_id, result.secure_url, order);
      nextOrderByAlbum[item.album] = order + 1;

      results.migrated.push({ file: item.file, album: item.album, url: result.secure_url });
    } catch (err) {
      results.errors.push({ file: item.file, error: err.message });
    }
  }

  res.json({
    message: `Migración completada: ${results.migrated.length} fotos migradas, ${results.errors.length} errores.`,
    ...results
  });
});

module.exports = router;
