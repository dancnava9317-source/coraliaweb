// database/db.js
// ─────────────────────────────────────────────────────────────
//  Conexión a SQLite y creación automática de tablas
//  SQLite guarda todo en un único archivo: coralia.db
//  No requiere instalar ningún servidor de base de datos
// ─────────────────────────────────────────────────────────────

const Database = require('better-sqlite3');
const path     = require('path');

// El archivo de base de datos se crea automáticamente si no existe
const db = new Database(path.join(__dirname, '..', 'coralia.db'));

// Activar modo WAL: mejora la velocidad en lecturas concurrentes
db.pragma('journal_mode = WAL');

// ── Crear tablas si no existen ────────────────────────────────

db.exec(`
  -- Tabla de proyectos / entregas
  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT    NOT NULL,
    project_name TEXT   NOT NULL,
    access_key  TEXT    NOT NULL UNIQUE,   -- clave que recibe el cliente
    expires_at  TEXT,                       -- fecha ISO de vencimiento (null = sin vencimiento)
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    is_active   INTEGER NOT NULL DEFAULT 1  -- 1 activo, 0 desactivado
  );

  -- Tabla de archivos asociados a cada proyecto
  CREATE TABLE IF NOT EXISTS files (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    filename     TEXT    NOT NULL,          -- nombre original del archivo
    cloudinary_id TEXT,                     -- public_id en Cloudinary
    cloudinary_url TEXT,                    -- URL segura de Cloudinary
    file_type    TEXT    NOT NULL DEFAULT 'photo', -- 'photo' | 'video' | 'raw'
    file_size    INTEGER,                   -- tamaño en bytes
    width        INTEGER,
    height       INTEGER,
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Tabla de accesos: registra cada vez que un cliente inicia sesión
  CREATE TABLE IF NOT EXISTS access_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    accessed_at TEXT   NOT NULL DEFAULT (datetime('now')),
    ip_address  TEXT
  );

  -- Tabla de contenido editable del sitio público (textos, precios, clientes, etc.)
  -- Cada fila es una pieza de contenido identificada por una "key" única,
  -- p. ej. "hero_title_es", "package_basic_price", "client_logo_1"
  CREATE TABLE IF NOT EXISTS site_content (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

console.log('✅ Base de datos lista: coralia.db');

module.exports = db;
