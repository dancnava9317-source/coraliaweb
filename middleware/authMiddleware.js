// middleware/authMiddleware.js
// ─────────────────────────────────────────────────────────────
//  Protege las rutas que requieren autenticación.
//
//  Cómo funciona:
//  1. El cliente hace login con su clave → recibe un JWT (token)
//  2. En cada petición siguiente, manda el token en el header:
//       Authorization: Bearer <token>
//  3. Este middleware verifica que el token sea válido
//     antes de permitir el acceso a la ruta
// ─────────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken');

// ── Middleware para clientes ───────────────────────────────────
function requireClientAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  // El header debe tener el formato: "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acceso denegado. Inicia sesión con tu clave.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar los datos del proyecto al request para usarlos en la ruta
    req.project = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      error: 'Sesión expirada o inválida. Vuelve a ingresar tu clave.'
    });
  }
}

// ── Middleware para administrador ─────────────────────────────
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso de administrador requerido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permisos de administrador.' });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Sesión de administrador expirada.' });
  }
}

module.exports = { requireClientAuth, requireAdminAuth };
