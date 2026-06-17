// database/seed-content.js
// ─────────────────────────────────────────────────────────────
//  Contenido inicial del sitio público de Coralia.
//  Esto puebla la tabla site_content la primera vez que arranca
//  el servidor, para que el panel de edición ya tenga tus textos
//  reales en vez de estar vacío.
//
//  Cada "key" corresponde a un campo editable específico del sitio.
//  El frontend pedirá este contenido a /api/content y lo pintará
//  dinámicamente en cada sección.
// ─────────────────────────────────────────────────────────────

const db = require('./db');

const defaultContent = {
  // ── Hero ──
  hero_label_es: 'Producción Audiovisual · Cabo San Lucas, BCS',
  hero_label_en: 'Audiovisual Production · Cabo San Lucas, BCS',
  hero_title_es: 'Cada imagen<br>cuenta <em>tu</em><br>historia.',
  hero_title_en: 'Every image<br>tells <em>your</em><br>story.',
  hero_sub_es: 'Producimos contenido visual que conecta marcas con personas. Comercial, editorial, gastronomía, eventos y más.',
  hero_sub_en: 'We produce visual content that connects brands with people. Commercial, editorial, food, events and more.',

  // ── Sobre nosotros ──
  about_title_es: 'Creamos imágenes que viven en la memoria.',
  about_title_en: 'We create images that live in memory.',
  about_p1_es: 'Somos un estudio de profesionales dedicados a generar imagen y video de la más alta calidad, comprometidos con el servicio y el resultado, para traer a la realidad lo que hay en la imaginación.',
  about_p1_en: 'We are a studio of professionals dedicated to creating the highest quality image and video, committed to service and results — bringing imagination into reality.',
  about_p2_es: 'Con 8 años de experiencia y un equipo de dos creadores apasionados, llevamos cada proyecto con la misma dedicación: desde activaciones comerciales hasta imagen corporativa completa en Cabo San Lucas y Baja California Sur.',
  about_p2_en: 'With 8 years of experience and a team of two passionate creators, we approach every project with the same dedication — from commercial activations to full corporate identity in Cabo San Lucas and Baja California Sur.',
  about_years: '8',
  about_stat_projects: '80',
  about_stat_brands: '20',
  about_stat_categories: '6',
  about_stat_satisfaction: '100%',

  // ── Clientes ──
  client_1: 'Maja',
  client_2: 'Carfan',
  client_3: 'DanMar',
  client_4: 'Nhera',
  client_5: 'Arturo Martínez',
  client_6: 'Armando Ramírez',

  // ── Paquetes ──
  pkg_basic_name_es: 'Esencial',
  pkg_basic_name_en: 'Essential',
  pkg_basic_price: '150',
  pkg_basic_desc_es: 'Ideal para negocios que dan sus primeros pasos en el contenido visual profesional.',
  pkg_basic_desc_en: 'Ideal for businesses taking their first steps in professional visual content.',

  pkg_pro_name_es: 'Profesional',
  pkg_pro_name_en: 'Professional',
  pkg_pro_price: '450',
  pkg_pro_desc_es: 'Para marcas que necesitan presencia visual sólida y contenido de alto impacto.',
  pkg_pro_desc_en: 'For brands that need solid visual presence and high-impact content.',

  pkg_full_name_es: 'Producción Completa',
  pkg_full_name_en: 'Full Production',
  pkg_full_desc_es: 'Campañas completas, producciones cinematográficas y proyectos de gran escala.',
  pkg_full_desc_en: 'Full campaigns, cinematic productions and large-scale projects.',

  // ── Contacto ──
  contact_email: 'coraliaoq97@gmail.com',
  contact_whatsapp: '+52 556 440 0736',
  contact_location: 'Cabo San Lucas, BCS, México',
  contact_instagram: '@coraliastudiocsl',
};

function seedContent() {
  const insert = db.prepare(`
    INSERT INTO site_content (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO NOTHING
  `);

  let count = 0;
  for (const [key, value] of Object.entries(defaultContent)) {
    const result = insert.run(key, value);
    if (result.changes > 0) count++;
  }

  console.log(`✅ Contenido inicial cargado: ${count} campos nuevos`);
}

module.exports = { seedContent, defaultContent };
