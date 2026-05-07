/* ==============================================
   MAIN.JS — Portfolio NEJ DEV
   Modules :
     1. Canvas Particules (fond animé)
     2. Reveal on Scroll
     3. Barres de compétences (IntersectionObserver)
     4. Navigation burger (mobile)
     5. Génération CV PDF (jsPDF)
   ============================================== */


/* -----------------------------------------------
   1. CANVAS PARTICULES
----------------------------------------------- */
(function initParticles() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  const particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 100; i++) {
    particles.push({
      x:     Math.random() * 1920,
      y:     Math.random() * 1080,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      r:     Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.45 + 0.15,
      color: Math.random() > 0.6 ? '#f5a623' : '#0a84ff'
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Grille de fond
    ctx.strokeStyle = 'rgba(10,132,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Lignes entre particules proches
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(10,132,255,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth = 0.4;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Points
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* -----------------------------------------------
   2. REVEAL ON SCROLL
----------------------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();


/* -----------------------------------------------
   3. BARRES DE COMPÉTENCES
----------------------------------------------- */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
      }
    });
  }, { threshold: 0.25 });

  bars.forEach(b => obs.observe(b));
})();


/* -----------------------------------------------
   4. NAVIGATION BURGER (MOBILE)
----------------------------------------------- */
(function initBurger() {
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('mobile-menu');
  const links  = document.querySelectorAll('.mobile-link');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  // Ferme le menu au clic sur un lien
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
})();


/* -----------------------------------------------
   5. GÉNÉRATION CV PDF (jsPDF — chargé à la demande)
----------------------------------------------- */
(function initCVGenerator() {
  const btn = document.getElementById('generate-cv');
  if (!btn) return;

  btn.addEventListener('click', function () {
    btn.textContent = '⏳ Génération...';
    btn.disabled = true;

    // Chargement dynamique de jsPDF
    const script    = document.createElement('script');
    script.src      = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload   = buildPDF;
    script.onerror  = () => {
      btn.textContent = '❌ Erreur réseau';
      btn.disabled = false;
    };
    document.head.appendChild(script);
  });

  function buildPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const BLUE  = [10, 132, 255];
    const GOLD  = [245, 166, 35];
    const DARK  = [2, 10, 24];
    const WHITE = [255, 255, 255];
    const GRAY  = [120, 150, 180];

    // ── Fond ──────────────────────────────────────
    doc.setFillColor(...DARK);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(5, 20, 50);
    doc.rect(0, 0, 65, 297, 'F');
    doc.setFillColor(...BLUE);
    doc.rect(0, 0, 65, 5, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(65, 0, 145, 5, 'F');

    // ── Sidebar — Nom ─────────────────────────────
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('KOMBILA',    32, 28, { align: 'center' });
    doc.text('NZIENGUI',  32, 36, { align: 'center' });
    doc.setTextColor(...GOLD);
    doc.text('Enock Japhet', 32, 44, { align: 'center' });
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.3);
    doc.line(8, 50, 57, 50);

    // ── Sidebar — Infos personnelles ──────────────
    const infos = [
      ['ÂGE',          '26 ans'],
      ['NATIONALITÉ',   'Gabonais'],
      ['LOCALISATION',  'Akanda, Libreville\nGabon'],
      ['EMAIL',         'nzienguijaphet\n@gmail.com'],
      ['TÉL',           '+241 74 52 14 16\n+241 66 92 11 28']
    ];

    let sy = 58;
    infos.forEach(([label, val]) => {
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...GOLD);
      doc.text(label, 8, sy);
      sy += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...WHITE);
      val.split('\n').forEach(line => { doc.text(line, 8, sy); sy += 4.5; });
      sy += 3;
    });

    // ── Sidebar — Compétences ─────────────────────
    sy += 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('COMPÉTENCES', 8, sy);
    sy += 3;
    doc.setDrawColor(...BLUE);
    doc.line(8, sy, 57, sy);
    sy += 5;

    const skills = [
      ['HTML / CSS',          75],
      ['JavaScript',          60],
      ['Figma',               65],
      ['Cybersécurité',       80],
      ['Cybercriminalité',    75],
      ['Comptabilité',        85],
      ['Gestion financière',  75],
      ['Suite Adobe',         70],
      ['Pack Office',         80],
      ['Réparation Élect.',   80],
    ];

    skills.forEach(([name, pct]) => {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WHITE);
      doc.text(name, 8, sy);
      sy += 4;
      doc.setFillColor(20, 40, 80);
      doc.roundedRect(8, sy, 49, 2.5, 1, 1, 'F');
      doc.setFillColor(...BLUE);
      doc.roundedRect(8, sy, 49 * pct / 100, 2.5, 1, 1, 'F');
      sy += 6;
    });

    // ── Sidebar — Langues ─────────────────────────
    sy += 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('LANGUES', 8, sy);
    sy += 3;
    doc.line(8, sy, 57, sy);
    sy += 5;

    [['Français', 95], ['Anglais', 40]].forEach(([lang, pct]) => {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...WHITE);
      doc.text(lang, 8, sy);
      sy += 4;
      doc.setFillColor(20, 40, 80);
      doc.roundedRect(8, sy, 49, 2.5, 1, 1, 'F');
      doc.setFillColor(...GOLD);
      doc.roundedRect(8, sy, 49 * pct / 100, 2.5, 1, 1, 'F');
      sy += 7;
    });

    // ── Sports de combat ──────────────────────────
    sy += 2;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GOLD);
    doc.text('SPORTS DE COMBAT', 8, sy);
    sy += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...WHITE);
    ['🥊 Boxe', '🛡 Self-Défense', '⚡ Full Contact'].forEach(s => {
      doc.text(s, 8, sy);
      sy += 5;
    });

    // ── Colonne droite ────────────────────────────
    const RX = 72;
    const RW = 128;
    let ry   = 16;

    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...WHITE);
    doc.text('DÉVELOPPEUR WEB', RX, ry);
    ry += 7;
    doc.setFontSize(9.5);
    doc.setTextColor(...GOLD);
    doc.text('Cybersécurité · Comptabilité-Gestion · Figma', RX, ry);
    ry += 3;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(RX, ry, RX + 105, ry);
    ry += 9;

    // Profil
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('PROFIL', RX, ry);
    ry += 5;
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY);
    const profil = doc.splitTextToSize(
      "Jeune professionnel gabonais de 26 ans combinant comptabilité-gestion, cybersécurité et développement web. Autodidacte passionné, j'ai aussi géré une agence au PMUG Gabon et suis technicien en réparation électronique. Actuellement en formation web via le programme D-Clic de l'OIF.",
      RW
    );
    doc.text(profil, RX, ry);
    ry += profil.length * 4.5 + 6;

    // Expérience
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('EXPÉRIENCE', RX, ry);
    ry += 2;
    doc.setDrawColor(...BLUE);
    doc.line(RX, ry, RX + RW, ry);
    ry += 6;

    const experiences = [
      {
        t: 'Chef d\'Agence — PMUG Gabon',
        d: 'Expérience terrain',
        desc: 'Responsable complet d\'une agence en lieu de campagne : prise de jeux, gestion comptable, coordination et régulation des activités.'
      },
      {
        t: 'Technicien Électronique Autodidacte',
        d: 'En continu',
        desc: 'Réparation, déblocage et réinitialisation de téléphones, ordinateurs et tablettes. Diagnostics matériels et logiciels.'
      }
    ];

    experiences.forEach(exp => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(exp.t, RX, ry);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text(exp.d, RX + RW, ry, { align: 'right' });
      ry += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const dl = doc.splitTextToSize(exp.desc, RW);
      doc.text(dl, RX, ry);
      ry += dl.length * 4 + 7;
    });

    // Projets
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('PROJETS RÉALISÉS', RX, ry);
    ry += 2;
    doc.line(RX, ry, RX + RW, ry);
    ry += 6;

    const projects = [
      {
        t: 'Portfolio Professionnel — NEJ DEV',
        d: '2025 — En cours',
        desc: "Portfolio futuriste avec animations CSS/JS, design responsive et présentation des compétences.",
        tags: 'HTML · CSS · JavaScript · Figma'
      },
      {
        t: 'ER-Boutiques — Boutique en ligne',
        d: '2025',
        desc: 'Boutique e-commerce complète déployée sur Vercel. Interface moderne, catalogue produits optimisé.',
        tags: 'Web · E-Commerce · Vercel · er-boutiques.vercel.app'
      }
    ];

    projects.forEach(p => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(p.t, RX, ry);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text(p.d, RX + RW, ry, { align: 'right' });
      ry += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const dl = doc.splitTextToSize(p.desc, RW);
      doc.text(dl, RX, ry);
      ry += dl.length * 4 + 1;
      doc.setTextColor(...BLUE);
      doc.text(p.tags, RX, ry);
      ry += 9;
    });

    // Formation
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('FORMATION', RX, ry);
    ry += 2;
    doc.line(RX, ry, RX + RW, ry);
    ry += 6;

    const formations = [
      {
        t: "Développement Web — D-Clic · OIF · École241",
        d: "2025/2026 (en cours)",
        desc: "Formation financée par l'Organisation Internationale de la Francophonie."
      },
      {
        t: "Baccalauréat Professionnel — Comptabilité & Gestion",
        d: "2023",
        desc: "Diplôme d'État Gabon, option Comptabilité et Gestion des organisations."
      },
      {
        t: "BEPT — Comptabilité-Gestion",
        d: "Session Juin 2021",
        desc: "Brevet d'Études Professionnelles du Tertiaire, option Comptabilité-Gestion. Centre de Ntoum — Gabon."
      }
    ];

    formations.forEach(f => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      doc.text(f.t, RX, ry);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD);
      doc.text(f.d, RX + RW, ry, { align: 'right' });
      ry += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...GRAY);
      const fl = doc.splitTextToSize(f.desc, RW);
      doc.text(fl, RX, ry);
      ry += fl.length * 4 + 7;
    });

    // Certifications
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLUE);
    doc.text('CERTIFICATIONS', RX, ry);
    ry += 2;
    doc.line(RX, ry, RX + RW, ry);
    ry += 6;

    const certs = [
      ['Cybercriminalité — UNODC / SPARK',                                  '26 Oct. 2025'],
      ['Intro. Cybersécurité — Cisco Networking Academy / Cybastion Gabon',  '02 Mai 2026'],
      ['Certificate of Course Completion — Cisco Networking Academy',         '02 Mai 2026'],
      ['Formation Web D-Clic — OIF · École241',                              'En cours']
    ];

    certs.forEach(([name, date]) => {
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...WHITE);
      const cl = doc.splitTextToSize('• ' + name, RW - 24);
      doc.text(cl, RX, ry);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...GOLD);
      doc.text(date, RX + RW, ry, { align: 'right' });
      ry += cl.length * 4 + 3;
    });

    // ── Pied de page ──────────────────────────────
    doc.setFillColor(...BLUE);
    doc.rect(65, 292, 145, 2, 'F');
    doc.setFillColor(...GOLD);
    doc.rect(0, 292, 65, 2, 'F');
    doc.setFontSize(7);
    doc.setTextColor(...GRAY);
    doc.text(
      'KOMBILA NZIENGUI Enock Japhet  ·  nzienguijaphet@gmail.com  ·  +241 74 52 14 16',
      137, 296, { align: 'center' }
    );

    doc.save('CV_KOMBILA_NZIENGUI_Enock_Japhet.pdf');

    btn.textContent = '✅ CV téléchargé !';
    btn.disabled    = false;
    setTimeout(() => { btn.textContent = '⬇ Télécharger mon CV (PDF)'; }, 3000);
  }
})();
