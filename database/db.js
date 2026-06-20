<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Coralia — Producción Audiovisual</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
--coral:#E8603A;--coral-light:#F5C4B3;--coral-dark:#993C1D;
--sand:#F7F4EF;--sand-2:#EDE9E1;--charcoal:#1A1A1A;--black:#0D0D0D;
--gray:#888780;--white:#FFFFFF;
--ff-display:'Playfair Display',serif;
--ff-body:'Inter',sans-serif;
--ff-mono:'DM Mono',monospace;
}
html{scroll-behavior:smooth}
body{font-family:var(--ff-body);background:var(--sand);color:var(--black);overflow-x:hidden}


/* LOGO SVG EN NAV */
.nav-logo-svg { display:flex; align-items:center; text-decoration:none; }
.nav-logo-svg svg { height:38px; width:auto; }
.footer-logo-svg svg { height:42px; width:auto; }
nav.scrolled .logo-dark  { display:none !important; }
nav.scrolled .logo-light { display:block !important; }
nav:not(.scrolled) .logo-dark  { display:block; }
nav:not(.scrolled) .logo-light { display:none; }

/* PROGRESS BAR */
#progress-bar{position:fixed;top:0;left:0;height:3px;background:var(--coral);width:0%;z-index:9999;transition:width 0.1s}

/* NAV */
nav{position:fixed;top:0;left:0;width:100%;z-index:1000;padding:1.5rem 4rem;display:flex;justify-content:space-between;align-items:center;transition:all 0.4s;background:transparent}
nav.scrolled{background:rgba(247,244,239,0.96);backdrop-filter:blur(12px);padding:1rem 4rem;box-shadow:0 1px 0 rgba(0,0,0,0.08)}
.nav-logo{font-family:var(--ff-display);font-size:1.6rem;font-weight:900;color:var(--black);text-decoration:none;letter-spacing:-0.02em}
.nav-logo span{color:var(--coral)}
.nav-links{display:flex;gap:2.5rem;align-items:center}
.nav-links a.nav-link{font-family:var(--ff-mono);font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;color:var(--black);opacity:0.7;transition:opacity 0.2s,color 0.3s}
.nav-links a.nav-link:hover{opacity:1}
/* Sobre el hero oscuro (antes de hacer scroll) el texto debe ser blanco para no perderse */
nav:not(.scrolled) .nav-links a.nav-link{color:var(--white)}
nav.scrolled .nav-links a.nav-link{color:var(--black)}
.lang-toggle{display:flex;align-items:center;gap:0.5rem;margin-left:1rem}
.lang-btn{font-family:var(--ff-mono);font-size:0.65rem;letter-spacing:0.1em;background:none;border:1px solid transparent;color:var(--gray);cursor:pointer;padding:0.2rem 0.5rem;border-radius:2px;transition:all 0.2s}
.lang-btn.active{border-color:var(--coral);color:var(--coral)}
nav:not(.scrolled) .lang-btn:not(.active){color:rgba(255,255,255,0.55)}
nav.scrolled .lang-btn:not(.active){color:var(--gray)}
.nav-client-link{font-family:var(--ff-mono);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;color:#fff;background:var(--coral);padding:0.55rem 1.2rem;border:1px solid var(--coral);transition:all 0.25s;margin-left:0.5rem}
.nav-client-link:hover{background:var(--coral-dark);border-color:var(--coral-dark)}
nav.scrolled .nav-client-link{color:#fff;background:var(--coral)}

/* HERO */
#hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;padding:0 4rem 5rem;background:var(--charcoal);position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#0D0D0D 0%,#1A1A1A 50%,#2a1a14 100%)}
.hero-bg.has-image{background-size:cover;background-position:center}
.hero-bg.has-image::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(13,13,13,0.78) 0%,rgba(26,26,26,0.7) 50%,rgba(42,26,20,0.75) 100%)}
.hero-grid{position:absolute;inset:0;opacity:0.04;background-image:linear-gradient(var(--white) 1px,transparent 1px),linear-gradient(90deg,var(--white) 1px,transparent 1px);background-size:60px 60px}
.hero-accent{position:absolute;top:15%;right:8%;width:350px;height:350px;border:1px solid rgba(232,96,58,0.2);border-radius:50%;animation:pulse 6s ease-in-out infinite}
.hero-accent-2{position:absolute;top:18%;right:10%;width:260px;height:260px;border:1px solid rgba(232,96,58,0.12);border-radius:50%;animation:pulse 6s ease-in-out infinite 1.5s}
@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.05);opacity:0.6}}
.hero-content{position:relative;z-index:2;max-width:900px}
.hero-label{font-family:var(--ff-mono);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--coral);margin-bottom:2rem;display:flex;align-items:center;gap:1rem}
.hero-label::before{content:'';display:inline-block;width:40px;height:1px;background:var(--coral)}
.hero-title{font-family:var(--ff-display);font-size:clamp(3.5rem,8vw,7rem);font-weight:900;line-height:0.95;letter-spacing:-0.03em;color:var(--white);margin-bottom:2rem}
.hero-title em{font-style:italic;color:var(--coral)}
.hero-sub{font-size:1.05rem;font-weight:300;color:rgba(255,255,255,0.55);max-width:500px;line-height:1.7;margin-bottom:3rem}
.hero-ctas{display:flex;gap:1.5rem;align-items:center}
.btn-primary{background:var(--coral);color:var(--white);border:none;padding:1rem 2.5rem;font-family:var(--ff-mono);font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block}
.btn-primary:hover{background:var(--coral-dark);transform:translateY(-2px)}
.btn-ghost{background:transparent;color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.2);padding:1rem 2.5rem;font-family:var(--ff-mono);font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:all 0.3s;text-decoration:none;display:inline-block}
.btn-ghost:hover{border-color:rgba(255,255,255,0.6);color:var(--white)}
.hero-scroll{position:absolute;bottom:2.5rem;right:4rem;display:flex;align-items:center;gap:0.75rem;font-family:var(--ff-mono);font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.35)}
.scroll-line{width:1px;height:60px;background:rgba(255,255,255,0.2);position:relative;overflow:hidden}
.scroll-line::after{content:'';position:absolute;top:-100%;left:0;width:100%;height:100%;background:var(--coral);animation:scrollLine 2s ease-in-out infinite}
@keyframes scrollLine{0%{top:-100%}100%{top:100%}}

/* SECTIONS */
section{padding:7rem 4rem}
.section-label{font-family:var(--ff-mono);font-size:0.68rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--coral);margin-bottom:1.5rem}
.section-title{font-family:var(--ff-display);font-size:clamp(2.2rem,4vw,3.5rem);font-weight:800;line-height:1.1;letter-spacing:-0.02em;margin-bottom:1.5rem}
.section-sub{font-size:1rem;color:var(--gray);max-width:520px;line-height:1.7}

/* PORTFOLIO */
#portfolio{background:var(--sand)}
.filter-bar{display:flex;gap:1rem;flex-wrap:wrap;margin:3rem 0 2.5rem}
.filter-btn{font-family:var(--ff-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;background:none;border:1px solid var(--sand-2);color:var(--gray);padding:0.5rem 1.2rem;cursor:pointer;transition:all 0.25s}
.filter-btn:hover,.filter-btn.active{border-color:var(--coral);color:var(--coral);background:rgba(232,96,58,0.05)}
.portfolio-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}

/* LIGHTBOX / SLIDER DEL PORTAFOLIO */
.lightbox-overlay{position:fixed;inset:0;background:rgba(13,13,13,0.96);z-index:2000;display:none;align-items:center;justify-content:center;padding:2rem}
.lightbox-overlay.show{display:flex}
.lightbox-stage{position:relative;width:100%;max-width:1100px;height:80vh;display:flex;align-items:center;justify-content:center}
.lightbox-img-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
.lightbox-img-wrap img{max-width:100%;max-height:100%;object-fit:contain;animation:lbFadeIn 0.25s ease}
@keyframes lbFadeIn{from{opacity:0;transform:scale(0.98)}to{opacity:1;transform:scale(1)}}
.lightbox-caption{position:absolute;bottom:-3rem;left:0;width:100%;text-align:center;font-family:var(--ff-mono);font-size:0.7rem;letter-spacing:0.08em;color:rgba(255,255,255,0.6);text-transform:uppercase}
.lightbox-caption .lb-cat{color:var(--coral);margin-right:0.6rem}
.lightbox-close{position:absolute;top:-3rem;right:0;background:none;border:none;color:rgba(255,255,255,0.5);font-size:1.6rem;cursor:pointer;line-height:1;transition:color 0.2s}
.lightbox-close:hover{color:#fff}
.lightbox-counter{position:absolute;top:-3rem;left:0;font-family:var(--ff-mono);font-size:0.7rem;letter-spacing:0.08em;color:rgba(255,255,255,0.4)}
.lightbox-nav{position:absolute;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#fff;width:46px;height:46px;border-radius:50%;cursor:pointer;font-size:1.3rem;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
.lightbox-nav:hover{background:var(--coral);border-color:var(--coral)}
.lightbox-nav.prev{left:-1.5rem}
.lightbox-nav.next{right:-1.5rem}
@media (max-width: 768px){
  .lightbox-nav.prev{left:0.3rem}
  .lightbox-nav.next{right:0.3rem}
  .lightbox-nav{width:38px;height:38px;font-size:1.1rem}
}
.nav-burger{display:none;flex-direction:column;justify-content:center;gap:5px;width:32px;height:32px;background:none;border:none;cursor:pointer;z-index:1100;padding:0}
.nav-burger span{display:block;width:100%;height:2px;background:var(--black);transition:all 0.3s}
nav:not(.scrolled) .nav-burger span{background:var(--white)}
.nav-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.nav-burger.open span:nth-child(2){opacity:0}
.nav-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.nav-burger.open span{background:var(--black) !important}
.portfolio-item{position:relative;overflow:hidden;cursor:pointer;aspect-ratio:4/3;background:var(--charcoal)}
.portfolio-item .thumb{width:100%;height:100%;object-fit:cover;transition:transform 0.5s ease;display:flex;align-items:center;justify-content:center}
.portfolio-item:hover .thumb{transform:scale(1.06)}
.portfolio-overlay{position:absolute;inset:0;background:rgba(13,13,13,0.7);opacity:0;transition:opacity 0.35s;display:flex;flex-direction:column;justify-content:flex-end;padding:1.5rem}
.portfolio-item:hover .portfolio-overlay{opacity:1}
.portfolio-cat{font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--coral);margin-bottom:0.4rem}
.portfolio-name{font-family:var(--ff-display);font-size:1.3rem;font-weight:700;color:var(--white)}
.portfolio-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--ff-mono);font-size:0.7rem;letter-spacing:0.1em;color:rgba(255,255,255,0.2);text-transform:uppercase;background:var(--charcoal);transition:transform 0.5s ease}
.portfolio-item:hover .portfolio-placeholder{transform:scale(1.06)}
.p1{background:linear-gradient(135deg,#1a0a05 0%,#3d1a0a 100%)}
.p2{background:linear-gradient(135deg,#05101a 0%,#0a2a3d 100%)}
.p3{background:linear-gradient(135deg,#0a1205 0%,#1a3d0a 100%)}
.p4{background:linear-gradient(135deg,#1a1005 0%,#3d2a0a 100%)}
.p5{background:linear-gradient(135deg,#10051a 0%,#2a0a3d 100%)}
.p6{background:linear-gradient(135deg,#1a0505 0%,#3d0a0a 100%)}

/* PROJECTS */
#projects{background:var(--charcoal)}
#projects .section-title{color:var(--white)}
#projects .section-sub{color:rgba(255,255,255,0.45)}
.projects-list{margin-top:4rem;display:flex;flex-direction:column;gap:0}
.project-row{display:grid;grid-template-columns:80px 1fr auto;align-items:center;gap:2rem;padding:2rem 0;border-top:1px solid rgba(255,255,255,0.07);cursor:pointer;transition:padding 0.3s}
.project-row:last-child{border-bottom:1px solid rgba(255,255,255,0.07)}
.project-row:hover{padding-left:1rem}
.project-num{font-family:var(--ff-mono);font-size:0.68rem;color:rgba(255,255,255,0.2);letter-spacing:0.1em}
.project-info .project-title{font-family:var(--ff-display);font-size:1.6rem;font-weight:700;color:var(--white);margin-bottom:0.3rem}
.project-info .project-desc{font-size:0.85rem;color:rgba(255,255,255,0.35);font-weight:300}
.project-tag{font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--coral);border:1px solid rgba(232,96,58,0.3);padding:0.3rem 0.8rem}
.project-arrow{color:rgba(255,255,255,0.2);font-size:1.2rem;transition:all 0.3s}
.project-row:hover .project-arrow{color:var(--coral);transform:translateX(4px)}

/* SOBRE NOSOTROS */
#about{background:var(--sand)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;margin-top:4rem}
.about-img-block{position:relative}
.about-img{width:100%;aspect-ratio:3/4;background:var(--charcoal);display:flex;align-items:center;justify-content:center;font-family:var(--ff-mono);font-size:0.7rem;color:rgba(255,255,255,0.15);letter-spacing:0.1em;overflow:hidden;background:linear-gradient(160deg,#1a1a1a 0%,#2a1208 100%)}
.about-badge{position:absolute;bottom:-1.5rem;left:-1.5rem;background:var(--coral);padding:1.5rem 2rem}
.about-badge .num{font-family:var(--ff-display);font-size:2.5rem;font-weight:900;color:var(--white);line-height:1}
.about-badge .txt{font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.75)}
.about-content p{color:var(--gray);line-height:1.8;margin-bottom:1.25rem;font-size:0.95rem}
.about-stats{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:2.5rem}
.stat-box{border-top:2px solid var(--coral);padding-top:1rem}
.stat-box .s-num{font-family:var(--ff-display);font-size:2rem;font-weight:900;color:var(--black);line-height:1}
.stat-box .s-txt{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gray);margin-top:0.3rem}

/* CLIENTES */
#clients{background:var(--charcoal);text-align:center}
#clients .section-title{color:var(--white)}
.clients-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:3rem 4rem;margin-top:4rem;align-items:center}
.client-logo{font-family:var(--ff-display);font-size:1.1rem;font-weight:700;color:rgba(255,255,255,0.15);letter-spacing:0.05em;text-transform:uppercase;transition:color 0.3s;cursor:default}
.client-logo:hover{color:rgba(255,255,255,0.55)}

/* REVIEWS */
#reviews{background:var(--sand)}
.reviews-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3.5rem}
.review-card{background:var(--white);padding:2rem;border:1px solid var(--sand-2)}
.review-stars{color:var(--coral);font-size:0.8rem;letter-spacing:0.1em;margin-bottom:1rem}
.review-text{font-family:var(--ff-display);font-style:italic;font-size:1.05rem;line-height:1.6;color:var(--black);margin-bottom:1.5rem}
.reviewer-name{font-family:var(--ff-mono);font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray)}
.reviewer-co{font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.08em;color:var(--coral)}

/* PAQUETES */
#packages{background:var(--black)}
#packages .section-title{color:var(--white)}
.packages-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:4rem}
.pkg-card{border:1px solid rgba(255,255,255,0.08);padding:2.5rem;transition:border-color 0.3s;position:relative}
.pkg-card:hover{border-color:rgba(232,96,58,0.4)}
.pkg-card.featured{border-color:var(--coral);background:rgba(232,96,58,0.04)}
.pkg-badge{position:absolute;top:-1px;left:50%;transform:translateX(-50%);background:var(--coral);font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--white);padding:0.3rem 1rem}
.pkg-name{font-family:var(--ff-mono);font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--coral);margin-bottom:1rem}
.pkg-price{font-family:var(--ff-display);font-size:2.8rem;font-weight:900;color:var(--white);line-height:1;margin-bottom:0.3rem}
.pkg-price span{font-size:1rem;font-weight:400;opacity:0.4}
.pkg-desc{font-size:0.82rem;color:rgba(255,255,255,0.35);margin-bottom:2rem;line-height:1.6}
.pkg-features{list-style:none;margin-bottom:2.5rem}
.pkg-features li{font-size:0.83rem;color:rgba(255,255,255,0.55);padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;gap:0.6rem}
.pkg-features li::before{content:'—';color:var(--coral);font-size:0.7rem;flex-shrink:0}
.pkg-cta{width:100%;background:transparent;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.6);font-family:var(--ff-mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.9rem;cursor:pointer;transition:all 0.3s}
.pkg-cta:hover{background:rgba(255,255,255,0.05);color:var(--white)}
.pkg-card.featured .pkg-cta{background:var(--coral);border-color:var(--coral);color:var(--white)}
.pkg-card.featured .pkg-cta:hover{background:var(--coral-dark)}

/* CONTACTO */
#contact{background:var(--sand)}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;margin-top:4rem}
.contact-info p{color:var(--gray);line-height:1.8;margin-bottom:2rem;font-size:0.95rem}
.contact-detail{display:flex;flex-direction:column;gap:1rem;margin-top:2rem}
.contact-item{display:flex;flex-direction:column}
.c-label{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--coral);margin-bottom:0.2rem}
.c-val{font-size:0.9rem;color:var(--black)}
.contact-form{display:flex;flex-direction:column;gap:1.2rem}
.form-group{display:flex;flex-direction:column;gap:0.4rem}
.form-group label{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray)}
.form-group input,.form-group textarea,.form-group select{background:var(--white);border:1px solid var(--sand-2);padding:0.85rem 1rem;font-family:var(--ff-body);font-size:0.9rem;color:var(--black);outline:none;transition:border-color 0.2s;width:100%}
.form-group input:focus,.form-group textarea:focus,.form-group select:focus{border-color:var(--coral)}
.form-group textarea{resize:vertical;min-height:120px}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}

/* FOOTER */
footer{background:var(--black);padding:4rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1.5rem}
.footer-logo{font-family:var(--ff-display);font-size:1.5rem;font-weight:900;color:var(--white);letter-spacing:-0.02em}
.footer-logo span{color:var(--coral)}
.footer-copy{font-family:var(--ff-mono);font-size:0.6rem;letter-spacing:0.1em;color:rgba(255,255,255,0.25);text-transform:uppercase}
.footer-right{display:flex;align-items:center;gap:2rem;flex-wrap:wrap}
.footer-social{display:flex;gap:1.5rem}
.footer-social a{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);text-decoration:none;transition:color 0.2s}
.footer-social a:hover{color:var(--coral)}
.footer-client-link{font-family:var(--ff-mono);font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--coral);text-decoration:none;border:1px solid rgba(232,96,58,0.3);padding:0.5rem 1.2rem;transition:all 0.2s}
.footer-client-link:hover{background:var(--coral);color:var(--white)}

/* ANIMATIONS */
.reveal{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease}
.reveal.visible{opacity:1;transform:translateY(0)}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE — TABLET (≤1024px)
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 1024px){
  nav{padding:1.2rem 2rem}
  nav.scrolled{padding:0.9rem 2rem}
  .about-grid,.contact-grid{grid-template-columns:1fr;gap:3rem}
  .portfolio-grid{grid-template-columns:repeat(2,1fr)}
  .reviews-grid,.packages-grid{grid-template-columns:repeat(2,1fr)}
  section{padding-left:2rem !important;padding-right:2rem !important}
}

/* ═══════════════════════════════════════════════════════════
   RESPONSIVE — MÓVIL (≤768px)
   ═══════════════════════════════════════════════════════════ */
@media (max-width: 768px){
  nav{padding:1rem 1.3rem}
  nav.scrolled{padding:0.8rem 1.3rem}

  /* Menú hamburguesa visible, menú de links se oculta y se convierte en panel */
  .nav-burger{display:flex}
  .nav-links{
    position:fixed;top:0;right:-100%;width:78%;max-width:320px;height:100vh;
    background:#0D0D0D;flex-direction:column;align-items:flex-start;
    justify-content:flex-start;gap:0;padding:6rem 2rem 2rem;
    transition:right 0.35s ease;z-index:1050;overflow-y:auto
  }
  .nav-links.open{right:0}
  .nav-links a.nav-link{
    color:#fff !important;opacity:0.85;width:100%;padding:1rem 0;
    border-bottom:1px solid rgba(255,255,255,0.08);font-size:0.85rem
  }
  .nav-links .lang-toggle{margin:1.5rem 0}
  .nav-links .nav-client-link{margin-left:0;margin-top:1rem;width:100%;text-align:center}
  .nav-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1040}
  .nav-overlay.show{display:block}

  /* Hero */
  .hero-title{font-size:clamp(2.4rem,11vw,3.2rem);margin-bottom:1.3rem}
  .hero-sub{font-size:0.9rem}
  #hero{padding-left:1.3rem !important;padding-right:1.3rem !important}

  /* Secciones generales */
  section{padding:4rem 1.3rem !important}
  .section-title{font-size:clamp(1.8rem,7vw,2.4rem) !important}

  /* Portafolio */
  .portfolio-grid{grid-template-columns:1fr;gap:1rem}
  .filter-bar{flex-wrap:wrap;gap:0.5rem !important;justify-content:flex-start !important}

  /* Sobre nosotros */
  .about-grid{grid-template-columns:1fr;gap:2.5rem}
  .about-stats{grid-template-columns:1fr 1fr;gap:1rem}

  /* Clientes (logos) */
  .clients-grid{grid-template-columns:repeat(2,1fr) !important;gap:1.5rem !important}

  /* Reviews y paquetes */
  .reviews-grid,.packages-grid{grid-template-columns:1fr;gap:1.2rem}

  /* Proyectos destacados */
  .project-row{grid-template-columns:40px 1fr;grid-template-areas:"num info" "tag tag" "arrow arrow";gap:0.6rem 1rem;padding:1.3rem 0}
  .project-row .project-num{grid-area:num}
  .project-row .project-info{grid-area:info}
  .project-row .project-tag{grid-area:tag;justify-self:start}
  .project-row .project-arrow{display:none}

  /* Contacto */
  .contact-grid{grid-template-columns:1fr;gap:2.5rem}
  .form-row{grid-template-columns:1fr;gap:1rem}

  /* Footer */
  footer{flex-direction:column;text-align:center;padding:3rem 1.3rem !important}
  .footer-right{flex-direction:column;gap:1rem}

  /* Lightbox del portafolio en móvil */
  .lightbox-stage{height:70vh}
  .lightbox-caption{bottom:-2.6rem;font-size:0.62rem}
  .lightbox-counter,.lightbox-close{top:-2.6rem}
}

@media (max-width: 420px){
  .about-stats{grid-template-columns:1fr}
  .clients-grid{grid-template-columns:1fr 1fr !important}
}
</style>
</head>
<body>

<div id="progress-bar"></div>

<nav id="navbar">
  <a href="#hero" class="nav-logo-svg" aria-label="Coralia — inicio">
    <span class="logo-dark"><svg xmlns="http://www.w3.org/2000/svg" width="180" height="44" viewBox="0 0 680 165">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&amp;display=swap');.ld{font-family:"Playfair Display",serif;}</style>
    <pattern id="nd" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="0.75" fill="rgba(232,96,58,0.22)"/></pattern>
    <pattern id="nhd" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="rgba(232,96,58,0.10)"/></pattern>
  </defs>
  <text x="390" y="130" text-anchor="middle" class="ld" font-size="94" font-weight="900" fill="#FFFFFF" letter-spacing="8">CORALIA</text>
  <rect x="52" y="24" width="88" height="110" fill="url(#nd)"/>
  <rect x="38" y="16" width="116" height="126" fill="url(#nhd)"/>
  <path d="M 104 126 C 104 118,103 108,102 96" fill="none" stroke="#E8603A" stroke-width="3.0" stroke-linecap="round"/>
  <path d="M 103 113 C 95 104,86 98,78 89" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 86 98 C 80 91,74 86,69 79" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 86 98 C 81 95,75 94,69 94" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 69 79 C 65 75,62 72,59 68" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 69 79 C 67 77,64 79,61 82" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 78 89 C 73 85,68 83,63 83" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 63 83 C 59 82,56 83,53 85" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M 103 106 C 110 98,117 92,122 84" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 117 92 C 121 85,124 80,126 73" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 117 92 C 121 90,124 92,127 95" fill="none" stroke="#E8603A" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M 126 73 C 128 69,130 66,131 63" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 126 73 C 128 75,129 78,130 81" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 122 84 C 125 80,127 77,128 74" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 100 C 99 92,97 86,95 79" fill="none" stroke="#E8603A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 95 79 C 93 74,91 71,89 67" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 95 79 C 97 75,99 73,100 69" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 96 C 101 88,100 81,99 73" fill="none" stroke="#E8603A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M 99 73 C 98 66,97 61,96 55" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 96 55 C 93 50,91 46,89 42" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 96 55 C 98 51,100 47,101 43" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 91 86 C 87 82,83 80,79 79" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 79 79 C 75 78,72 79,70 81" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <circle cx="59" cy="67" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="61" cy="82" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="53" cy="85" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="69" cy="94" r="1.5" fill="#E8603A" opacity="0.60"/>
  <circle cx="131" cy="62" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="130" cy="81" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="127" cy="95" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="128" cy="73" r="1.5" fill="#E8603A" opacity="0.62"/>
  <circle cx="89"  cy="41" r="2.2" fill="#E8603A" opacity="0.88"/>
  <circle cx="101" cy="42" r="2.2" fill="#E8603A" opacity="0.85"/>
  <circle cx="89"  cy="66" r="1.8" fill="#E8603A" opacity="0.72"/>
  <circle cx="100" cy="68" r="1.7" fill="#E8603A" opacity="0.70"/>
  <circle cx="70"  cy="81" r="1.4" fill="rgba(232,96,58,0.55)"/>
  <circle cx="115" cy="78" r="1.1" fill="rgba(232,96,58,0.22)"/>
  <circle cx="74"  cy="73" r="1.0" fill="rgba(232,96,58,0.20)"/>
  <circle cx="57"  cy="74" r="0.9" fill="rgba(232,96,58,0.18)"/>
  <circle cx="133" cy="88" r="0.9" fill="rgba(232,96,58,0.17)"/>
  <circle cx="82"  cy="108" r="0.8" fill="rgba(232,96,58,0.16)"/>
  <circle cx="44"  cy="90" r="0.7" fill="rgba(232,96,58,0.13)"/>
  <circle cx="97"  cy="53" r="0.7" fill="rgba(232,96,58,0.16)"/>
  <circle cx="83"  cy="51" r="0.6" fill="rgba(232,96,58,0.12)"/>
</svg></span>
    <span class="logo-light" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" width="180" height="44" viewBox="0 0 680 165">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&amp;display=swap');.ld{font-family:"Playfair Display",serif;}</style>
    <pattern id="nl" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="0.75" fill="rgba(232,96,58,0.16)"/></pattern>
    <pattern id="nhl" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="rgba(232,96,58,0.07)"/></pattern>
  </defs>
  <text x="390" y="130" text-anchor="middle" class="ld" font-size="94" font-weight="900" fill="#0D0D0D" letter-spacing="8">CORALIA</text>
  <rect x="52" y="24" width="88" height="110" fill="url(#nl)"/>
  <rect x="38" y="16" width="116" height="126" fill="url(#nhl)"/>
  <path d="M 104 126 C 104 118,103 108,102 96" fill="none" stroke="#E8603A" stroke-width="3.0" stroke-linecap="round"/>
  <path d="M 103 113 C 95 104,86 98,78 89" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 86 98 C 80 91,74 86,69 79" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 86 98 C 81 95,75 94,69 94" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 69 79 C 65 75,62 72,59 68" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 69 79 C 67 77,64 79,61 82" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 78 89 C 73 85,68 83,63 83" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 63 83 C 59 82,56 83,53 85" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M 103 106 C 110 98,117 92,122 84" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 117 92 C 121 85,124 80,126 73" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 117 92 C 121 90,124 92,127 95" fill="none" stroke="#E8603A" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M 126 73 C 128 69,130 66,131 63" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 126 73 C 128 75,129 78,130 81" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 122 84 C 125 80,127 77,128 74" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 100 C 99 92,97 86,95 79" fill="none" stroke="#E8603A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 95 79 C 93 74,91 71,89 67" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 95 79 C 97 75,99 73,100 69" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 96 C 101 88,100 81,99 73" fill="none" stroke="#E8603A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M 99 73 C 98 66,97 61,96 55" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 96 55 C 93 50,91 46,89 42" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 96 55 C 98 51,100 47,101 43" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 91 86 C 87 82,83 80,79 79" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 79 79 C 75 78,72 79,70 81" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <circle cx="59" cy="67" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="61" cy="82" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="53" cy="85" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="69" cy="94" r="1.5" fill="#E8603A" opacity="0.60"/>
  <circle cx="131" cy="62" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="130" cy="81" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="127" cy="95" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="128" cy="73" r="1.5" fill="#E8603A" opacity="0.62"/>
  <circle cx="89"  cy="41" r="2.2" fill="#E8603A" opacity="0.88"/>
  <circle cx="101" cy="42" r="2.2" fill="#E8603A" opacity="0.85"/>
  <circle cx="89"  cy="66" r="1.8" fill="#E8603A" opacity="0.72"/>
  <circle cx="100" cy="68" r="1.7" fill="#E8603A" opacity="0.70"/>
  <circle cx="70"  cy="81" r="1.4" fill="rgba(232,96,58,0.55)"/>
  <circle cx="115" cy="78" r="1.1" fill="rgba(232,96,58,0.22)"/>
  <circle cx="74"  cy="73" r="1.0" fill="rgba(232,96,58,0.20)"/>
  <circle cx="57"  cy="74" r="0.9" fill="rgba(232,96,58,0.18)"/>
  <circle cx="133" cy="88" r="0.9" fill="rgba(232,96,58,0.17)"/>
  <circle cx="82"  cy="108" r="0.8" fill="rgba(232,96,58,0.16)"/>
  <circle cx="44"  cy="90" r="0.7" fill="rgba(232,96,58,0.13)"/>
  <circle cx="97"  cy="53" r="0.7" fill="rgba(232,96,58,0.16)"/>
  <circle cx="83"  cy="51" r="0.6" fill="rgba(232,96,58,0.12)"/>
</svg></span>
  </a>
  <div class="nav-links" id="navLinks">
    <a href="#portfolio" class="nav-link" data-es="Portafolio" data-en="Portfolio">Portafolio</a>
    <a href="#projects" class="nav-link" data-es="Proyectos" data-en="Projects">Proyectos</a>
    <a href="#about" class="nav-link" data-es="Nosotros" data-en="About">Nosotros</a>
    <a href="#clients" class="nav-link" data-es="Clientes" data-en="Clients">Clientes</a>
    <a href="#packages" class="nav-link" data-es="Paquetes" data-en="Packages">Paquetes</a>
    <a href="#contact" class="nav-link" data-es="Contacto" data-en="Contact">Contacto</a>
    <div class="lang-toggle">
      <button class="lang-btn active" onclick="setLang('es')">ES</button>
      <button class="lang-btn" onclick="setLang('en')">EN</button>
    </div>
    <a href="/clientes/index.html" class="nav-client-link" data-es="Acceso Clientes" data-en="Client Access">Acceso Clientes</a>
  </div>
  <button class="nav-burger" id="navBurger" onclick="toggleMobileNav()" aria-label="Abrir menú">
    <span></span><span></span><span></span>
  </button>
</nav>
<div class="nav-overlay" id="navOverlay" onclick="closeMobileNav()"></div>

<!-- HERO -->
<section id="hero">
  <div class="hero-bg" id="heroBg"></div>
  <div class="hero-grid"></div>
  <div class="hero-accent"></div>
  <div class="hero-accent-2"></div>
  <div class="hero-content">
    <div class="hero-label" data-content-key="hero_label" data-es="Producción Audiovisual · Cabo San Lucas, BCS" data-en="Audiovisual Production · Cabo San Lucas, BCS">Producción Audiovisual · Cabo San Lucas, BCS</div>
    <h1 class="hero-title" data-content-key="hero_title">
      Cada imagen<br>cuenta <em>tu</em><br>historia.
    </h1>
    <p class="hero-sub" data-content-key="hero_sub" data-es="Producimos contenido visual que conecta marcas con personas. Comercial, editorial, gastronomía, eventos y más." data-en="We produce visual content that connects brands with people. Commercial, editorial, food, events and more.">
      Producimos contenido visual que conecta marcas con personas. Comercial, editorial, gastronomía, eventos y más.
    </p>
    <div class="hero-ctas">
      <a href="#portfolio" class="btn-primary" data-es="Ver Portafolio" data-en="View Portfolio">Ver Portafolio</a>
      <a href="#contact" class="btn-ghost" data-es="Hablemos" data-en="Let's Talk">Hablemos</a>
    </div>
  </div>
  <div class="hero-scroll">
    <div class="scroll-line"></div>
    <span data-es="Desplazar" data-en="Scroll">Desplazar</span>
  </div>
</section>

<!-- PORTAFOLIO -->
<section id="portfolio">
  <div class="reveal">
    <p class="section-label" data-es="Nuestro trabajo" data-en="Our work">Nuestro trabajo</p>
    <h2 class="section-title" data-es="Portafolio" data-en="Portfolio">Portafolio</h2>
    <p class="section-sub" data-es="Desde campañas comerciales hasta coberturas de eventos íntimos — capturamos la esencia de cada proyecto." data-en="From commercial campaigns to intimate event coverage — we capture the essence of every project.">Desde campañas comerciales hasta coberturas de eventos íntimos — capturamos la esencia de cada proyecto.</p>
  </div>
  <div class="filter-bar reveal" id="filterBar">
    <button class="filter-btn active" data-filter="all" data-es="Todo" data-en="All">Todo</button>
  </div>
  <div class="portfolio-grid reveal" id="portfolioGrid">
    <div class="album-loading-msg" style="grid-column:1/-1;text-align:center;padding:3rem;font-family:var(--ff-mono);font-size:0.7rem;letter-spacing:0.1em;color:rgba(255,255,255,0.2);text-transform:uppercase">Cargando portafolio...</div>
  </div>
  <!-- LIGHTBOX / SLIDER DEL PORTAFOLIO -->
  <div class="lightbox-overlay" id="portfolioLightbox">
    <div class="lightbox-stage">
      <button class="lightbox-close" onclick="closeLightbox()" aria-label="Cerrar">✕</button>
      <span class="lightbox-counter" id="lightboxCounter"></span>
      <button class="lightbox-nav prev" onclick="lightboxPrev()" aria-label="Anterior">‹</button>
      <div class="lightbox-img-wrap" id="lightboxImgWrap"></div>
      <button class="lightbox-nav next" onclick="lightboxNext()" aria-label="Siguiente">›</button>
      <div class="lightbox-caption" id="lightboxCaption"></div>
    </div>
  </div>
</section>

<!-- PROYECTOS -->
<section id="projects">
  <div class="reveal">
    <p class="section-label" data-es="Casos de estudio" data-en="Case studies">Casos de estudio</p>
    <h2 class="section-title" data-es="Proyectos Destacados" data-en="Featured Projects">Proyectos Destacados</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.4)" data-es="Una selección de trabajos que nos enorgullece compartir." data-en="A selection of work we are proud to share.">Una selección de trabajos que nos enorgullece compartir.</p>
  </div>
  <div class="projects-list reveal">
    <div class="project-row">
      <span class="project-num">01</span>
      <div class="project-info">
        <div class="project-title" data-es="Campaña Nacional — Baja Fresh" data-en="National Campaign — Baja Fresh">Campaña Nacional — Baja Fresh</div>
        <div class="project-desc" data-es="Video comercial + fotografía de producto para campaña digital y punto de venta." data-en="Commercial video + product photography for digital and point-of-sale campaign.">Video comercial + fotografía de producto para campaña digital y punto de venta.</div>
      </div>
      <span class="project-tag" data-es="Eventos" data-en="Events">Eventos</span>
      <span class="project-arrow">→</span>
    </div>
    <div class="project-row">
      <span class="project-num">02</span>
      <div class="project-info">
        <div class="project-title" data-es="Identidad Visual — Hoteles Marea" data-en="Visual Identity — Hoteles Marea">Identidad Visual — Hoteles Marea</div>
        <div class="project-desc" data-es="Sesión de fotografía arquitectónica, lifestyle y video institucional." data-en="Architectural, lifestyle photography session and institutional video.">Sesión de fotografía arquitectónica, lifestyle y video institucional.</div>
      </div>
      <span class="project-tag" data-es="Corporativo" data-en="Corporate">Corporativo</span>
      <span class="project-arrow">→</span>
    </div>
    <div class="project-row">
      <span class="project-num">03</span>
      <div class="project-info">
        <div class="project-title" data-es="Serie Gastronómica — Chef Lena" data-en="Gastronomic Series — Chef Lena">Serie Gastronómica — Chef Lena</div>
        <div class="project-desc" data-es="Contenido mensual para redes sociales: fotografía de platos, reels y BTS." data-en="Monthly social media content: dish photography, reels and BTS.">Contenido mensual para redes sociales: fotografía de platos, reels y BTS.</div>
      </div>
      <span class="project-tag" data-es="Gastronomía" data-en="Food">Gastronomía</span>
      <span class="project-arrow">→</span>
    </div>
    <div class="project-row">
      <span class="project-num">04</span>
      <div class="project-info">
        <div class="project-title" data-es="Festival Arte Cabo 2024" data-en="Arte Cabo Festival 2024">Festival Arte Cabo 2024</div>
        <div class="project-desc" data-es="Cobertura completa del evento: foto, video y transmisión en vivo." data-en="Full event coverage: photo, video and live streaming.">Cobertura completa del evento: foto, video y transmisión en vivo.</div>
      </div>
      <span class="project-tag" data-es="Eventos" data-en="Events">Eventos</span>
      <span class="project-arrow">→</span>
    </div>
  </div>
</section>

<!-- SOBRE NOSOTROS -->
<section id="about">
  <div class="about-grid">
    <div class="about-img-block reveal">
      <div class="about-img" style="background-image:url('assets/portfolio/about-equipo.jpg');background-size:cover;background-position:center;background-color:transparent"></div>
      <div class="about-badge">
        <div class="num" data-content-key="about_years" data-content-prefix="+">+8</div>
        <div class="txt" data-es="Años de experiencia" data-en="Years of experience">Años de experiencia</div>
      </div>
    </div>
    <div class="about-content reveal">
      <p class="section-label" data-es="Quiénes somos" data-en="Who we are">Quiénes somos</p>
      <h2 class="section-title" data-es="Creamos imágenes que viven en la memoria." data-en="We create images that live in memory.">Creamos imágenes que viven en la memoria.</h2>
      <p data-content-key="about_p1" data-es="Somos un estudio de profesionales dedicados a generar imagen y video de la más alta calidad, comprometidos con el servicio y el resultado, para traer a la realidad lo que hay en la imaginación." data-en="We are a studio of professionals dedicated to creating the highest quality image and video, committed to service and results — bringing imagination into reality.">Somos un estudio de profesionales dedicados a generar imagen y video de la más alta calidad, comprometidos con el servicio y el resultado, para traer a la realidad lo que hay en la imaginación.</p>
      <p data-content-key="about_p2" data-es="Con 8 años de experiencia y un equipo de dos creadores apasionados, llevamos cada proyecto con la misma dedicación: desde activaciones comerciales hasta imagen corporativa completa en Cabo San Lucas y Baja California Sur." data-en="With 8 years of experience and a team of two passionate creators, we approach every project with the same dedication — from commercial activations to full corporate identity in Cabo San Lucas and Baja California Sur.">Con 8 años de experiencia y un equipo de dos creadores apasionados, llevamos cada proyecto con la misma dedicación: desde activaciones comerciales hasta imagen corporativa completa en Cabo San Lucas y Baja California Sur.</p>
      <div class="about-stats">
        <div class="stat-box"><div class="s-num" data-content-key="about_stat_projects" data-content-prefix="+">+80</div><div class="s-txt" data-es="Proyectos completados" data-en="Completed projects">Proyectos completados</div></div>
        <div class="stat-box"><div class="s-num" data-content-key="about_stat_brands" data-content-prefix="+">+20</div><div class="s-txt" data-es="Marcas atendidas" data-en="Brands served">Marcas atendidas</div></div>
        <div class="stat-box"><div class="s-num" data-content-key="about_stat_categories">6</div><div class="s-txt" data-es="Categorías de producción" data-en="Production categories">Categorías de producción</div></div>
        <div class="stat-box"><div class="s-num" data-content-key="about_stat_satisfaction">100%</div><div class="s-txt" data-es="Satisfacción garantizada" data-en="Guaranteed satisfaction">Satisfacción garantizada</div></div>
      </div>
    </div>
  </div>
</section>

<!-- CLIENTES -->
<section id="clients">
  <div class="reveal">
    <p class="section-label" style="color:var(--coral)" data-es="Confían en nosotros" data-en="They trust us">Confían en nosotros</p>
    <h2 class="section-title" style="color:var(--white)" data-es="Nuestros Clientes" data-en="Our Clients">Nuestros Clientes</h2>
  </div>
  <div class="clients-grid reveal">
    <div class="client-logo" data-content-key="client_1">Maja</div>
    <div class="client-logo" data-content-key="client_2">Carfan</div>
    <div class="client-logo" data-content-key="client_3">DanMar</div>
    <div class="client-logo" data-content-key="client_4">Nhera</div>
    <div class="client-logo" data-content-key="client_5">Arturo Martínez</div>
    <div class="client-logo" data-content-key="client_6">Armando Ramírez</div>
  </div>
</section>

<!-- REVIEWS -->
<section id="reviews">
  <div class="reveal">
    <p class="section-label" data-es="Lo que dicen" data-en="What they say">Lo que dicen</p>
    <h2 class="section-title" data-es="Testimonios" data-en="Testimonials">Testimonios</h2>
  </div>
  <div class="reviews-grid reveal">
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text" data-es="&ldquo;Coralia capturó exactamente lo que queríamos transmitir. Las imágenes de nuestra campaña superaron todas las expectativas.&rdquo;" data-en="&ldquo;Coralia captured exactly what we wanted to convey. The images from our campaign exceeded all expectations.&rdquo;">&ldquo;Coralia capturó exactamente lo que queríamos transmitir. Las imágenes de nuestra campaña superaron todas las expectativas.&rdquo;</p>
      <div class="reviewer-name">Ana González</div>
      <div class="reviewer-co">Directora de Marketing · Baja Fresh</div>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text" data-es="&ldquo;El video institucional que produjeron para nosotros es de una calidad cinematográfica impresionante. Totalmente recomendados.&rdquo;" data-en="&ldquo;The institutional video they produced for us is of impressive cinematic quality. Highly recommended.&rdquo;">&ldquo;El video institucional que produjeron para nosotros es de una calidad cinematográfica impresionante. Totalmente recomendados.&rdquo;</p>
      <div class="reviewer-name">Carlos Mendez</div>
      <div class="reviewer-co">CEO · Grupo Desierto</div>
    </div>
    <div class="review-card">
      <div class="review-stars">★★★★★</div>
      <p class="review-text" data-es="&ldquo;Las fotos de mis platillos cobran vida con Coralia. El contenido mensual que generan ha duplicado mi engagement.&rdquo;" data-en="&ldquo;My dishes come to life with Coralia. The monthly content they generate has doubled my engagement.&rdquo;">&ldquo;Las fotos de mis platillos cobran vida con Coralia. El contenido mensual que generan ha duplicado mi engagement.&rdquo;</p>
      <div class="reviewer-name">Lena Vargas</div>
      <div class="reviewer-co">Chef & Empresaria</div>
    </div>
  </div>
</section>

<!-- PAQUETES -->
<section id="packages">
  <div class="reveal">
    <p class="section-label" data-es="Invierte en tu imagen" data-en="Invest in your image">Invierte en tu imagen</p>
    <h2 class="section-title" data-es="Paquetes y Servicios" data-en="Packages & Services">Paquetes y Servicios</h2>
  </div>
  <div class="packages-grid reveal">
    <div class="pkg-card">
      <div class="pkg-name" data-content-key="pkg_basic_name" data-es="Esencial" data-en="Essential">Esencial</div>
      <div class="pkg-price"><span data-content-key="pkg_basic_price" data-content-prefix="$">$150</span> <span>USD</span></div>
      <p class="pkg-desc" data-content-key="pkg_basic_desc" data-es="Ideal para negocios que dan sus primeros pasos en el contenido visual profesional." data-en="Ideal for businesses taking their first steps in professional visual content.">Ideal para negocios que dan sus primeros pasos en el contenido visual profesional.</p>
      <ul class="pkg-features">
        <li data-es="Sesión fotográfica (2h)" data-en="Photo session (2h)">Sesión fotográfica (2h)</li>
        <li data-es="15 fotos editadas" data-en="15 edited photos">15 fotos editadas</li>
        <li data-es="1 reel / video corto" data-en="1 reel / short video">1 reel / video corto</li>
        <li data-es="Entrega en 5 días hábiles" data-en="Delivery in 5 business days">Entrega en 5 días hábiles</li>
      </ul>
      <button class="pkg-cta" data-es="Solicitar" data-en="Request">Solicitar</button>
    </div>
    <div class="pkg-card featured">
      <div class="pkg-badge" data-es="Más popular" data-en="Most popular">Más popular</div>
      <div class="pkg-name" data-content-key="pkg_pro_name" data-es="Profesional" data-en="Professional">Profesional</div>
      <div class="pkg-price"><span data-content-key="pkg_pro_price" data-content-prefix="$">$450</span> <span>USD</span></div>
      <p class="pkg-desc" data-content-key="pkg_pro_desc" data-es="Para marcas que necesitan presencia visual sólida y contenido de alto impacto." data-en="For brands that need solid visual presence and high-impact content.">Para marcas que necesitan presencia visual sólida y contenido de alto impacto.</p>
      <ul class="pkg-features">
        <li data-es="Sesión fotográfica (5h)" data-en="Photo session (5h)">Sesión fotográfica (5h)</li>
        <li data-es="40 fotos editadas" data-en="40 edited photos">40 fotos editadas</li>
        <li data-es="Video comercial (60s)" data-en="Commercial video (60s)">Video comercial (60s)</li>
        <li data-es="3 reels para redes" data-en="3 reels for social media">3 reels para redes</li>
        <li data-es="Dirección creativa incluida" data-en="Creative direction included">Dirección creativa incluida</li>
        <li data-es="Entrega en 7 días hábiles" data-en="Delivery in 7 business days">Entrega en 7 días hábiles</li>
      </ul>
      <button class="pkg-cta" data-es="Solicitar" data-en="Request">Solicitar</button>
    </div>
    <div class="pkg-card">
      <div class="pkg-name" data-content-key="pkg_full_name" data-es="Producción Completa" data-en="Full Production">Producción Completa</div>
      <div class="pkg-price" style="font-size:1.8rem">A medida</div>
      <p class="pkg-desc" data-content-key="pkg_full_desc" data-es="Campañas completas, producciones cinematográficas y proyectos de gran escala." data-en="Full campaigns, cinematic productions and large-scale projects.">Campañas completas, producciones cinematográficas y proyectos de gran escala.</p>
      <ul class="pkg-features">
        <li data-es="Producción personalizada" data-en="Custom production">Producción personalizada</li>
        <li data-es="Equipo completo in-house" data-en="Full in-house team">Equipo completo in-house</li>
        <li data-es="Dirección + guión + edición" data-en="Direction + script + editing">Dirección + guión + edición</li>
        <li data-es="Locaciones múltiples" data-en="Multiple locations">Locaciones múltiples</li>
        <li data-es="Entrega según alcance" data-en="Delivery per scope">Entrega según alcance</li>
      </ul>
      <button class="pkg-cta" data-es="Cotizar Proyecto" data-en="Get a Quote">Cotizar Proyecto</button>
    </div>
  </div>
</section>

<!-- CONTACTO -->
<section id="contact">
  <div class="contact-grid">
    <div class="reveal">
      <p class="section-label" data-es="Hablemos" data-en="Let's talk">Hablemos</p>
      <h2 class="section-title" data-es="¿Tienes un proyecto en mente?" data-en="Have a project in mind?">¿Tienes un proyecto en mente?</h2>
      <p data-es="Cuéntanos de tu idea. Nos encanta trabajar con marcas que quieren comunicar algo real y memorable." data-en="Tell us about your idea. We love working with brands that want to communicate something real and memorable.">Cuéntanos de tu idea. Nos encanta trabajar con marcas que quieren comunicar algo real y memorable.</p>
      <div class="contact-detail">
        <div class="contact-item">
          <span class="c-label" data-es="Correo" data-en="Email">Correo</span>
          <span class="c-val" data-content-key="contact_email">coraliaoq97@gmail.com</span>
        </div>
        <div class="contact-item">
          <span class="c-label" data-es="WhatsApp" data-en="WhatsApp">WhatsApp</span>
          <span class="c-val" data-content-key="contact_whatsapp">+52 556 440 0736</span>
        </div>
        <div class="contact-item">
          <span class="c-label" data-es="Ubicación" data-en="Location">Ubicación</span>
          <span class="c-val" data-content-key="contact_location">Cabo San Lucas, BCS, México</span>
        </div>
      </div>
    </div>
    <div class="contact-form reveal">
      <div class="form-row">
        <div class="form-group">
          <label data-es="Nombre" data-en="Name">Nombre</label>
          <input type="text" placeholder="Tu nombre">
        </div>
        <div class="form-group">
          <label data-es="Empresa" data-en="Company">Empresa</label>
          <input type="text" placeholder="Tu empresa">
        </div>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="tu@email.com">
      </div>
      <div class="form-group">
        <label data-es="Tipo de proyecto" data-en="Project type">Tipo de proyecto</label>
        <select>
          <option data-es="— Selecciona —" data-en="— Select —">— Selecciona —</option>
          <option data-es="Fotografía Comercial" data-en="Commercial Photography">Fotografía Comercial</option>
          <option data-es="Video Corporativo" data-en="Corporate Video">Video Corporativo</option>
          <option data-es="Gastronomía" data-en="Food">Gastronomía</option>
          <option data-es="Eventos" data-en="Events">Eventos</option>
          <option data-es="Contenido para Redes" data-en="Social Media Content">Contenido para Redes</option>
          <option data-es="Otro" data-en="Other">Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label data-es="Mensaje" data-en="Message">Mensaje</label>
        <textarea placeholder="Cuéntanos de tu proyecto..."></textarea>
      </div>
      <button class="btn-primary" style="width:100%;text-align:center;border:none" data-es="Enviar Mensaje" data-en="Send Message">Enviar Mensaje</button>
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo-svg"><svg xmlns="http://www.w3.org/2000/svg" width="180" height="44" viewBox="0 0 680 165">
  <defs>
    <style>@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&amp;display=swap');.ld{font-family:"Playfair Display",serif;}</style>
    <pattern id="nd" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1.2" cy="1.2" r="0.75" fill="rgba(232,96,58,0.22)"/></pattern>
    <pattern id="nhd" x="0" y="0" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.5" fill="rgba(232,96,58,0.10)"/></pattern>
  </defs>
  <text x="390" y="130" text-anchor="middle" class="ld" font-size="94" font-weight="900" fill="#FFFFFF" letter-spacing="8">CORALIA</text>
  <rect x="52" y="24" width="88" height="110" fill="url(#nd)"/>
  <rect x="38" y="16" width="116" height="126" fill="url(#nhd)"/>
  <path d="M 104 126 C 104 118,103 108,102 96" fill="none" stroke="#E8603A" stroke-width="3.0" stroke-linecap="round"/>
  <path d="M 103 113 C 95 104,86 98,78 89" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 86 98 C 80 91,74 86,69 79" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 86 98 C 81 95,75 94,69 94" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 69 79 C 65 75,62 72,59 68" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 69 79 C 67 77,64 79,61 82" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 78 89 C 73 85,68 83,63 83" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 63 83 C 59 82,56 83,53 85" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <path d="M 103 106 C 110 98,117 92,122 84" fill="none" stroke="#E8603A" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M 117 92 C 121 85,124 80,126 73" fill="none" stroke="#E8603A" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M 117 92 C 121 90,124 92,127 95" fill="none" stroke="#E8603A" stroke-width="1.3" stroke-linecap="round"/>
  <path d="M 126 73 C 128 69,130 66,131 63" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 126 73 C 128 75,129 78,130 81" fill="none" stroke="#E8603A" stroke-width="1.0" stroke-linecap="round"/>
  <path d="M 122 84 C 125 80,127 77,128 74" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 100 C 99 92,97 86,95 79" fill="none" stroke="#E8603A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M 95 79 C 93 74,91 71,89 67" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 95 79 C 97 75,99 73,100 69" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 102 96 C 101 88,100 81,99 73" fill="none" stroke="#E8603A" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M 99 73 C 98 66,97 61,96 55" fill="none" stroke="#E8603A" stroke-width="1.4" stroke-linecap="round"/>
  <path d="M 96 55 C 93 50,91 46,89 42" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 96 55 C 98 51,100 47,101 43" fill="none" stroke="#E8603A" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M 91 86 C 87 82,83 80,79 79" fill="none" stroke="#E8603A" stroke-width="1.1" stroke-linecap="round"/>
  <path d="M 79 79 C 75 78,72 79,70 81" fill="none" stroke="#E8603A" stroke-width="0.9" stroke-linecap="round"/>
  <circle cx="59" cy="67" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="61" cy="82" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="53" cy="85" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="69" cy="94" r="1.5" fill="#E8603A" opacity="0.60"/>
  <circle cx="131" cy="62" r="2.4" fill="#E8603A" opacity="0.90"/>
  <circle cx="130" cy="81" r="1.9" fill="#E8603A" opacity="0.75"/>
  <circle cx="127" cy="95" r="1.6" fill="#E8603A" opacity="0.65"/>
  <circle cx="128" cy="73" r="1.5" fill="#E8603A" opacity="0.62"/>
  <circle cx="89"  cy="41" r="2.2" fill="#E8603A" opacity="0.88"/>
  <circle cx="101" cy="42" r="2.2" fill="#E8603A" opacity="0.85"/>
  <circle cx="89"  cy="66" r="1.8" fill="#E8603A" opacity="0.72"/>
  <circle cx="100" cy="68" r="1.7" fill="#E8603A" opacity="0.70"/>
  <circle cx="70"  cy="81" r="1.4" fill="rgba(232,96,58,0.55)"/>
  <circle cx="115" cy="78" r="1.1" fill="rgba(232,96,58,0.22)"/>
  <circle cx="74"  cy="73" r="1.0" fill="rgba(232,96,58,0.20)"/>
  <circle cx="57"  cy="74" r="0.9" fill="rgba(232,96,58,0.18)"/>
  <circle cx="133" cy="88" r="0.9" fill="rgba(232,96,58,0.17)"/>
  <circle cx="82"  cy="108" r="0.8" fill="rgba(232,96,58,0.16)"/>
  <circle cx="44"  cy="90" r="0.7" fill="rgba(232,96,58,0.13)"/>
  <circle cx="97"  cy="53" r="0.7" fill="rgba(232,96,58,0.16)"/>
  <circle cx="83"  cy="51" r="0.6" fill="rgba(232,96,58,0.12)"/>
</svg></div>
  <div class="footer-right">
    <div class="footer-copy" data-es="© 2024 Coralia. Todos los derechos reservados." data-en="© 2024 Coralia. All rights reserved.">© 2024 Coralia. Todos los derechos reservados.</div>
    <a href="/clientes/index.html" class="footer-client-link" data-es="Acceso Clientes" data-en="Client Access">Acceso Clientes</a>
    <div class="footer-social">
      <a href="https://instagram.com/coraliastudiocsl" target="_blank">Instagram</a>
      <a href="#">Behance</a>
      <a href="#">Vimeo</a>
    </div>
  </div>
</footer>

<script>
// ─────────────────────────────────────────────────────────────
//  CONTENIDO DINÁMICO — carga textos, precios y clientes desde el backend
//  para que sean editables desde /admin sin tocar este archivo.
//  Si el backend no responde (ej. estás probando localmente sin servidor),
//  el sitio sigue funcionando con los textos por defecto ya escritos en el HTML.
// ─────────────────────────────────────────────────────────────
const API_URL = 'https://coraliaweb-production.up.railway.app';
let siteContent = {};

async function loadSiteContent() {
  try {
    const res = await fetch(`${API_URL}/api/content`);
    if (!res.ok) return;
    const data = await res.json();
    siteContent = data.content || {};
    applyContent(currentLang);
  } catch (e) {
    // Backend no disponible: el sitio sigue mostrando los textos por defecto del HTML
    console.log('Contenido dinámico no disponible, usando textos por defecto.');
  }
}

function applyContent(lang) {
  document.querySelectorAll('[data-content-key]').forEach(el => {
    const key = el.getAttribute('data-content-key');
    const prefix = el.getAttribute('data-content-prefix') || '';
    // Para campos bilingües, la clave real en la BD es "key_es" o "key_en"
    const bilingualKey = `${key}_${lang}`;
    let value = siteContent[bilingualKey] ?? siteContent[key];
    if (value !== undefined) {
      el.innerHTML = prefix + value;
    }
  });

  // Imagen de fondo del hero — si hay una guardada en el contenido, la usamos;
  // si no, el hero mantiene su degradado de color por defecto (definido en CSS).
  const heroBg = document.getElementById('heroBg');
  if (heroBg && siteContent.hero_bg_image) {
    heroBg.style.backgroundImage = `url('${siteContent.hero_bg_image}')`;
    heroBg.classList.add('has-image');
  }
}

let currentLang = 'es';

function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent === lang.toUpperCase()));
  document.querySelectorAll('[data-es]').forEach(el => {
    const txt = el.getAttribute('data-' + lang);
    if (txt) el.innerHTML = txt;
  });
  applyContent(lang);
}

loadSiteContent();

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (scrollTop / docHeight) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
  document.getElementById('navbar').classList.toggle('scrolled', scrollTop > 60);
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
});

// ── MENÚ MÓVIL (hamburguesa) ──────────────────────────────────
function toggleMobileNav(){
  const links   = document.getElementById('navLinks');
  const burger  = document.getElementById('navBurger');
  const overlay = document.getElementById('navOverlay');
  const isOpen  = links.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  overlay.classList.toggle('show', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobileNav(){
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navBurger').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('show');
  document.body.style.overflow = '';
}
// Cerrar el menú automáticamente al hacer clic en cualquier link de navegación
document.querySelectorAll('.nav-links a.nav-link, .nav-links .nav-client-link').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});

// Delegación de eventos: los botones de filtro ahora se generan dinámicamente
// según los álbumes existentes, así que no podemos enlazarlos uno por uno al cargar.
document.getElementById('filterBar').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.getAttribute('data-filter');
  document.querySelectorAll('.portfolio-item').forEach(item => {
    const show = filter === 'all' || item.getAttribute('data-cat') === filter;
    item.style.display = show ? 'block' : 'none';
  });
});

// ─────────────────────────────────────────────────────────────
//  CARGA DINÁMICA DEL PORTAFOLIO
//  Tanto los álbumes (botones de filtro) como las fotos ahora viven
//  en la base de datos y se administran desde el panel admin
//  (pestaña "Portafolio"). Aquí los traemos y construimos el mismo
//  HTML que antes tenía datos fijos, para que el lightbox y los
//  filtros sigan funcionando igual sin tocar esa lógica.
// ─────────────────────────────────────────────────────────────
async function loadPublicPortfolio(){
  const grid = document.getElementById('portfolioGrid');
  const filterBar = document.getElementById('filterBar');

  try {
    // 1) Traer la lista real de álbumes (nombre + orden) para pintar los filtros
    const albumsRes = await fetch(`${API_URL}/api/portfolio/albums`);
    const albumsData = await albumsRes.json();
    const albumsList = albumsData.albums || []; // ya viene ordenada por sort_order

    // Reconstruir los botones de filtro: "Todo" + uno por cada álbum existente
    let filterHtml = `<button class="filter-btn active" data-filter="all" data-es="Todo" data-en="All">Todo</button>`;
    const labelBySlug = {};
    albumsList.forEach(a => {
      labelBySlug[a.slug] = { es: a.name_es, en: a.name_en };
      filterHtml += `<button class="filter-btn" data-filter="${a.slug}" data-es="${escapeAttr(a.name_es)}" data-en="${escapeAttr(a.name_en)}">${escapeAttr(a.name_es)}</button>`;
    });
    filterBar.innerHTML = filterHtml;

    // 2) Traer las fotos agrupadas por álbum
    const photosRes = await fetch(`${API_URL}/api/portfolio`);
    const photosData = await photosRes.json();
    const albumsPhotos = photosData.albums || {};

    let html = '';
    let totalPhotos = 0;

    // Recorremos los álbumes en su orden real (no uno fijo)
    albumsList.forEach(a => {
      const photos = albumsPhotos[a.slug] || [];
      const label = labelBySlug[a.slug];
      photos.forEach(photo => {
        totalPhotos++;
        html += `
    <div class="portfolio-item" data-cat="${a.slug}">
      <div class="thumb" style="background-image:url('${photo.url}');background-size:cover;background-position:center"></div>
      <div class="portfolio-overlay">
        <div class="portfolio-cat" data-es="${escapeAttr(label.es)}" data-en="${escapeAttr(label.en)}">${escapeAttr(label.es)}</div>
        <div class="portfolio-name" data-es="${escapeAttr(photo.caption_es || label.es)}" data-en="${escapeAttr(photo.caption_en || label.en)}">${escapeAttr(photo.caption_es || label.es)}</div>
      </div>
    </div>`;
      });
    });

    if (totalPhotos === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;font-family:var(--ff-mono);font-size:0.75rem;color:rgba(255,255,255,0.25)">Próximamente nuevas fotos del portafolio.</div>`;
      return;
    }

    grid.innerHTML = html;

    // Reaplicar el idioma actualmente activo a las fotos y filtros recién insertados
    // (currentLang y setLang ya existen globalmente en este archivo)
    setLang(currentLang);

  } catch (e) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;font-family:var(--ff-mono);font-size:0.75rem;color:rgba(255,255,255,0.25)">No se pudo cargar el portafolio. Intenta recargar la página.</div>`;
  }
}

// Escapa comillas dobles para que los nombres de álbum no rompan los atributos HTML
// (por ejemplo si alguien nombra un álbum con comillas dentro)
function escapeAttr(str){
  return String(str).replace(/"/g, '&quot;');
}

loadPublicPortfolio();

// ─────────────────────────────────────────────────────────────
//  LIGHTBOX / SLIDER DEL PORTAFOLIO
//  Al hacer clic en cualquier foto del grid, se abre un visor flotante
//  que permite navegar (‹ ›) solo entre las fotos de la categoría
//  actualmente filtrada — si el filtro es "Todo", navega entre todas.
// ─────────────────────────────────────────────────────────────
let lightboxItems = [];
let lightboxIndex = 0;

function getVisiblePortfolioItems(){
  return Array.from(document.querySelectorAll('.portfolio-item'))
    .filter(item => item.style.display !== 'none');
}

function extractItemData(item){
  const thumb = item.querySelector('.thumb');
  const bg = thumb ? thumb.style.backgroundImage : '';
  // El valor de backgroundImage viene como: url("ruta/foto.jpg")
  const match = bg.match(/url\(["']?(.*?)["']?\)/);
  const imgUrl = match ? match[1] : '';
  const catEl  = item.querySelector('.portfolio-cat');
  const nameEl = item.querySelector('.portfolio-name');
  return {
    img:  imgUrl,
    cat:  catEl  ? catEl.innerHTML  : '',
    name: nameEl ? nameEl.innerHTML : ''
  };
}

function openLightbox(clickedItem){
  lightboxItems = getVisiblePortfolioItems();
  lightboxIndex  = lightboxItems.indexOf(clickedItem);
  if (lightboxIndex === -1) lightboxIndex = 0;
  renderLightbox();
  document.getElementById('portfolioLightbox').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  document.getElementById('portfolioLightbox').classList.remove('show');
  document.body.style.overflow = '';
}

function renderLightbox(){
  const item = lightboxItems[lightboxIndex];
  if (!item) return;
  const data = extractItemData(item);

  document.getElementById('lightboxImgWrap').innerHTML =
    `<img src="${data.img}" alt="${data.name.replace(/"/g, '')}">`;
  document.getElementById('lightboxCaption').innerHTML =
    `<span class="lb-cat">${data.cat}</span>${data.name}`;
  document.getElementById('lightboxCounter').textContent =
    `${lightboxIndex + 1} / ${lightboxItems.length}`;
}

function lightboxPrev(){
  lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  renderLightbox();
}

function lightboxNext(){
  lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
  renderLightbox();
}

// Clic en cualquier foto del grid abre el lightbox en esa posición.
// Usamos delegación de eventos sobre el contenedor padre porque las fotos
// se cargan dinámicamente desde la API después de que la página ya cargó.
document.getElementById('portfolioGrid').addEventListener('click', (e) => {
  const item = e.target.closest('.portfolio-item');
  if (item) openLightbox(item);
});

// Navegación con teclado: flechas y Escape
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('portfolioLightbox');
  if (!overlay.classList.contains('show')) return;
  if (e.key === 'ArrowLeft')  lightboxPrev();
  if (e.key === 'ArrowRight') lightboxNext();
  if (e.key === 'Escape')     closeLightbox();
});

// Clic fuera de la imagen (en el fondo oscuro) también cierra
document.getElementById('portfolioLightbox').addEventListener('click', (e) => {
  if (e.target.id === 'portfolioLightbox') closeLightbox();
});

setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) el.classList.add('visible');
  });
}, 100);
</script>
</body>
</html>
