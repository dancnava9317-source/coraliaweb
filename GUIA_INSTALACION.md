# 🚀 Coralia Backend — Guía de instalación y despliegue

## Requisitos previos

Antes de empezar necesitas instalar en tu computadora:
- **Node.js** versión 18 o superior → https://nodejs.org
- **Git** → https://git-scm.com
- Una cuenta en **Cloudinary** (gratis) → https://cloudinary.com
- Una cuenta en **Railway** (free tier) → https://railway.app

---

## Paso 1 — Instalar Node.js

1. Ve a https://nodejs.org
2. Descarga la versión LTS (la recomendada)
3. Instala normalmente
4. Verifica en la terminal:
   ```bash
   node --version   # debe mostrar v18 o superior
   npm --version    # debe mostrar 9 o superior
   ```

---

## Paso 2 — Clonar/copiar el proyecto

Si usas Git:
```bash
git clone https://github.com/tu-usuario/coralia-backend.git
cd coralia-backend
```

O simplemente copia la carpeta `coralia-backend` a tu computadora.

---

## Paso 3 — Instalar dependencias

Dentro de la carpeta del proyecto:
```bash
npm install
```

Esto descarga todas las librerías necesarias (puede tardar 1-2 minutos).

---

## Paso 4 — Configurar las variables de entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env
   ```

2. Abre `.env` en cualquier editor de texto y rellena:

   ```
   JWT_SECRET=       # escribe 40+ caracteres aleatorios, ej: Kj83nP9xQ2...
   ADMIN_PASSWORD=   # la contraseña con la que entrarás al panel admin
   CLOUDINARY_CLOUD_NAME=   # del dashboard de Cloudinary
   CLOUDINARY_API_KEY=      # del dashboard de Cloudinary
   CLOUDINARY_API_SECRET=   # del dashboard de Cloudinary
   ```

### ¿Cómo obtener las credenciales de Cloudinary?

1. Crea una cuenta en https://cloudinary.com (gratis, sin tarjeta)
2. En el dashboard principal verás tu **Cloud Name**, **API Key** y **API Secret**
3. Cópialos al `.env`

---

## Paso 5 — Arrancar el servidor localmente

```bash
npm run dev
```

Deberías ver:
```
╔═══════════════════════════════════════╗
║   CORALIA BACKEND                     ║
║   Servidor corriendo en puerto 3001   ║
╚═══════════════════════════════════════╝
✅ Base de datos lista: coralia.db
```

Prueba que funciona abriendo en tu navegador:
http://localhost:3001/health

---

## Paso 6 — Despliegue en Railway (servidor en internet)

Railway es una plataforma que corre tu servidor Node.js en la nube.
Costo: ~$5/mes en el plan Starter (suficiente para Coralia).

### 6.1 Subir el código a GitHub

```bash
git init
git add .
git commit -m "Coralia backend inicial"
git remote add origin https://github.com/tu-usuario/coralia-backend.git
git push -u origin main
```

**Importante:** Asegúrate de que `.env` esté en `.gitignore` (nunca subas las claves a GitHub):
```
# .gitignore
.env
node_modules/
coralia.db
uploads/
```

### 6.2 Crear el proyecto en Railway

1. Ve a https://railway.app e inicia sesión con GitHub
2. Haz clic en **New Project → Deploy from GitHub repo**
3. Selecciona tu repositorio `coralia-backend`
4. Railway detectará automáticamente que es Node.js y lo desplegará

### 6.3 Agregar las variables de entorno en Railway

1. En tu proyecto de Railway, ve a **Variables**
2. Agrega cada variable de tu `.env`:
   - `JWT_SECRET`
   - `ADMIN_PASSWORD`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `NODE_ENV` = `production`

3. Railway reiniciará el servidor automáticamente.

### 6.4 Obtener la URL de tu backend

Railway te asigna una URL como:
`https://coralia-backend-production.up.railway.app`

Guárdala — la necesitarás en el frontend.

---

## Paso 7 — Conectar el frontend con el backend

En el archivo del portal de clientes (`clientes/index.html`), cambia:

```javascript
// Antes (demo):
const DEMO_KEY = 'CORA-2481-FLOR';

// Después (producción):
const API_URL = 'https://coralia-backend-production.up.railway.app';
```

---

## 📡 Referencia rápida de la API

| Método | Ruta | Quién | Descripción |
|--------|------|-------|-------------|
| POST | `/api/auth/login` | Cliente | Login con clave de acceso |
| POST | `/api/auth/admin-login` | Admin | Login de administrador |
| GET | `/api/projects` | Admin | Listar todos los proyectos |
| POST | `/api/projects` | Admin | Crear nuevo proyecto |
| GET | `/api/projects/:id` | Cliente | Ver detalle del proyecto |
| PATCH | `/api/projects/:id` | Admin | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Admin | Eliminar proyecto |
| POST | `/api/files/upload/:id` | Admin | Subir fotos/videos |
| GET | `/api/files/:id` | Cliente | Listar archivos del proyecto |
| GET | `/api/files/download/:id` | Cliente | Descargar ZIP de todo |
| DELETE | `/api/files/:fileId` | Admin | Eliminar un archivo |
| GET | `/api/content` | Público | Obtener todo el contenido editable del sitio |
| PATCH | `/api/content` | Admin | Actualizar contenido (textos, precios, clientes) |

---

## ✏️ Editar el contenido del sitio sin tocar código

Los textos, precios y nombres de clientes del sitio se cargan dinámicamente
desde la base de datos a través de `/api/content`, en vez de estar escritos
directamente en el HTML.

### ¿Cómo editar?

1. Entra a tu panel de administración: `tudominio.com/admin`
2. Inicia sesión con tu contraseña de administrador
3. Haz clic en la pestaña **"Contenido del Sitio"**
4. Edita cualquier campo: textos del hero, descripciones, precios de paquetes, nombres de clientes, datos de contacto
5. Haz clic en **"Guardar Cambios"**

Los cambios se reflejan en el sitio público la próxima vez que alguien lo
cargue — no requiere volver a desplegar nada.

### ¿Qué pasa si el backend no está disponible?

El sitio sigue funcionando con los textos por defecto que están escritos en
el HTML como respaldo. El sistema de contenido dinámico es una mejora, no
una dependencia crítica.

### ¿Cómo agrego más campos editables en el futuro?

1. Agrega `data-content-key="mi_nueva_clave"` al elemento en `index.html`
2. Agrega un campo `<input id="c_mi_nueva_clave">` en `/admin/index.html`
3. Agrega `'mi_nueva_clave'` al array `CONTENT_FIELD_IDS` del script admin
4. Agrega el valor por defecto en `database/seed-content.js`

---

## 🔐 Seguridad

- Nunca compartas el archivo `.env`
- Cambia `ADMIN_PASSWORD` y `JWT_SECRET` regularmente
- Las fotos en Cloudinary están en modo `authenticated` — solo accesibles con URLs firmadas
- Cada URL firmada expira en 1 hora

---

## 💰 Costos estimados mensuales

| Servicio | Plan | Costo |
|----------|------|-------|
| Railway (servidor) | Starter | ~$5/mes |
| Cloudinary (fotos) | Free (25 GB) | Gratis |
| Cloudinary (fotos) | Plus (100 GB) | ~$89/mes |
| Netlify (frontend) | Free | Gratis |
| Dominio (.mx) | Anual | ~$15/año |
| **Total básico** | | **~$5-10/mes** |

Para ~10 GB por cliente y hasta ~15 clientes activos simultáneos,
el plan gratuito de Cloudinary + Railway Starter es más que suficiente.
