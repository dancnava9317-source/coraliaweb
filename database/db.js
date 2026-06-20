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

  -- Tabla de fotos del portafolio público, organizadas por álbum.
  -- "album" es el identificador interno del álbum (ver tabla portfolio_albums).
  CREATE TABLE IF NOT EXISTS portfolio_photos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    album         TEXT    NOT NULL,
    cloudinary_id TEXT    NOT NULL,
    url           TEXT    NOT NULL,
    caption_es    TEXT    DEFAULT '',
    caption_en    TEXT    DEFAULT '',
    sort_order    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Tabla de álbumes del portafolio público — administrable: se pueden
  -- crear, eliminar y renombrar (el texto visible) desde el panel.
  -- "slug" es el identificador interno (fijo una vez creado, ej. "bodas"),
  -- usado para relacionar fotos en portfolio_photos y carpetas en Cloudinary.
  -- "name_es"/"name_en" son el texto que ve el visitante y sí se puede editar.
  CREATE TABLE IF NOT EXISTS portfolio_albums (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    slug        TEXT    NOT NULL UNIQUE,
    name_es     TEXT    NOT NULL,
    name_en     TEXT    NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// Sembrar los 6 álbumes originales — solo ocurre una vez, la primera vez
// que esta tabla esté vacía. Si ya tienes álbumes (incluso si los renombraste
// o agregaste más), esto no hace nada para no pisar tus cambios.
const albumCount = db.prepare('SELECT COUNT(*) as c FROM portfolio_albums').get().c;
if (albumCount === 0) {
  const insertAlbum = db.prepare(`
    INSERT INTO portfolio_albums (slug, name_es, name_en, sort_order) VALUES (?, ?, ?, ?)
  `);
  const seedAlbums = db.transaction((albums) => {
    albums.forEach((a, i) => insertAlbum.run(a.slug, a.es, a.en, i));
  });
  seedAlbums([
    { slug: 'comercial',  es: 'Comercial',    en: 'Commercial' },
    { slug: 'food',       es: 'Gastronomía',  en: 'Food'       },
    { slug: 'eventos',    es: 'Eventos',      en: 'Events'     },
    { slug: 'bodas',      es: 'Bodas',        en: 'Weddings'   },
    { slug: 'maternidad', es: 'Maternidad',   en: 'Maternity'  },
    { slug: 'retratos',   es: 'Retratos',     en: 'Portraits'  }
  ]);
  console.log('✅ Álbumes iniciales del portafolio sembrados.');
}

console.log('✅ Base de datos lista: coralia.db');

module.exports = db;
