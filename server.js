// server.js
// ─────────────────────────────────────────────────────────────
//  Servidor principal de Coralia Backend
//  Arranca con: node server.js  (o npm run dev en desarrollo)
// ─────────────────────────────────────────────────────────────

require('dotenv').config(); // Cargar variables de entorno desde .env

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Importar rutas
const authRoutes     = require('./routes/auth');
const projectRoutes  = require('./routes/projects');
const fileRoutes     = require('./routes/files');
const contentRoutes  = require('./routes/content');
const portfolioRoutes = require('./routes/portfolio');
const migratePortfolioRoutes = require('./routes/migrate-portfolio');

// Inicializar la base de datos (crea las tablas si no existen)
require('./database/db');
// Cargar el contenido inicial del sitio (solo agrega lo que falte, no sobrescribe ediciones)
require('./database/seed-content').seedContent();

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares globales ───────────────────────────────────────

// CORS: permite que el frontend (en otro dominio) se comunique con este servidor
app.use(cors({
  origin: [
    'http://localhost:5500',    // desarrollo local (Live Server de VS Code)
    'http://localhost:3000',    // desarrollo local alternativo
    'https://jovial-mooncake-3a060a.netlify.app', // URL temporal de Netlify
    'https://coraliastudio.mx',       // dominio real
    'https://www.coraliastudio.mx'
  ],
  methods:     ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

// Parsear JSON en el body de las peticiones
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rutas de la API ────────────────────────────────────────────

// Salud del servidor — útil para Railway/Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Coralia Backend', timestamp: new Date().toISOString() });
});

// Rutas principales
app.use('/api/auth',     authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files',    fileRoutes);
app.use('/api/content',  contentRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/migrate-portfolio', migratePortfolioRoutes);

// ── Manejo de errores global ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  // Errores de Multer (subida de archivos)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'El archivo es demasiado grande (máx. 50 MB por archivo).' });
  }

  res.status(500).json({ error: 'Error interno del servidor.', detail: err.message });
});

// ── Arrancar el servidor ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║   CORALIA BACKEND                     ║
  ║   Servidor corriendo en puerto ${PORT}  ║
  ║   http://localhost:${PORT}              ║
  ╚═══════════════════════════════════════╝
  `);
});
