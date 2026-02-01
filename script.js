let websiteData = null;

async function loadData(){
  try{
    const res = await fetch('data.json');
    websiteData = await res.json();
    populateSite();
  }catch(err){
    console.error('Error loading data.json', err);
  }
}

function populateSite(){
  if(!websiteData) return;
  const { startup, sections, footer } = websiteData;

  /*HERO */
  document.getElementById('logo').src = startup.logo || document.getElementById('logo').src;
  document.getElementById('hero-image').src = startup.heroImage || document.getElementById('hero-image').src;
  document.getElementById('hero-title').textContent = startup.heroTitle || '';
  document.getElementById('hero-description').textContent = startup.heroDescription || '';

  document.getElementById('startup-name').textContent = startup.name || 'BUMI';
  document.getElementById('startup-tagline').textContent = startup.tagline || '';
  document.getElementById('about-image').src = startup.aboutImage;
  document.getElementById('about-short').textContent = startup.shortDescription || '';
  document.getElementById('about-long').textContent = startup.longDescription || '';

  /* DEF*/
  const def = sections.definition;
  if(def){
    document.getElementById('definition-text').textContent = def.content;
    document.getElementById('definition-image').src = def.image;
  }

  /* --------------------------
            STAT CARDS
  ---------------------------*/
  const statsGrid = document.getElementById('stats-grid');
  statsGrid.innerHTML = '';

  (def.stats || []).slice(0,6).forEach((s) => {
    const d = document.createElement('div');
    d.className = 'stat-card';
    d.innerHTML = `
      <div class="stat-number">${s.number}</div>
      <div class="stat-label">${s.label}</div>
      <div class="stat-full" style="display:none; margin-top:.75rem; color:#40503d">
        ${s.detail || 'Tidak ada detail.'}
      </div>
    `;
    statsGrid.appendChild(d);
  });

  /* --------------------------
            CAUSES
  ---------------------------*/
  const causesGrid = document.getElementById('causes-grid');
  causesGrid.innerHTML = '';

  (sections.causes.causes || []).forEach((c) => {
    const card = document.createElement('div');
    card.className = 'cause-card-small';

    card.innerHTML = `
      <img src="${c.image}" alt="${c.title}" onerror="this.src='https://placehold.co/600x400?text=Cause'">
      <div class="title">${c.title}</div>
      <div class="short">${c.description}</div>

      <!-- Hidden text for expand -->
      <div class="extra">
        <p>${c.detail || ''}</p>
      </div>
    `;

    causesGrid.appendChild(card);
  });

  /* --------------------------
            PENCEGAHAN
  ---------------------------*/
  const importanceGrid = document.getElementById('importance-grid');
  importanceGrid.innerHTML = '';

  (sections.prevention.importance || []).slice(0,6).forEach(it => {
    const el = document.createElement('div');
    el.className = 'importance-card';

    el.innerHTML = `
      <img src="${it.image}" alt="${it.title}" onerror="this.src='https://placehold.co/500x350?text=Prevention'">
      <h4>${it.title}</h4>
      <p>${it.description}</p>

      <!-- Hidden expand text -->
      <div class="extra">
        <p>${it.detail || it.description}</p>
      </div>
    `;

    importanceGrid.appendChild(el);
  });

  /* --------------------------
        WHY 
---------------------------*/
const whyGrid = document.getElementById('why-grid');
whyGrid.innerHTML = `
  <div class="why-box">
    <p>
      Pemanasan global membawa dampak jangka panjang yang serius bagi kehidupan manusia dan ekosistem bumi.
      Tanpa tindakan nyata, risiko bencana alam, krisis pangan, serta gangguan kesehatan akan terus meningkat.
      Pencegahan bukan hanya tentang lingkungan, tetapi juga tentang keberlangsungan hidup generasi mendatang.
      Investasi pada solusi hijau hari ini adalah langkah strategis untuk masa depan yang lebih stabil dan adil.
    </p>
  </div>
`;


  /* --------------------------
            FOOTER
  ---------------------------*/
  document.getElementById('footer-about').textContent = footer.about;
  document.getElementById('footer-contact').innerHTML = `📧 ${footer.contact.email}<br>📱 ${footer.contact.phone}`;
  
  const social = document.getElementById('social-links');
  social.innerHTML = `
    <a href="${footer.social.instagram}" target="_blank">Instagram</a>
    <a href="${footer.social.twitter}" target="_blank">Twitter</a>
    <a href="${footer.social.tiktok}" target="_blank">TikTok</a>
  `;

  initInteractions();
}

/* =======================================================
                INTERACTIONS (EXPAND LOGIC)
=======================================================*/
function initInteractions(){

  /* ---------- STAT CARDS ---------- */
  document.querySelectorAll('.stat-card').forEach(card => {
    const full = card.querySelector('.stat-full');

    card.addEventListener('mouseenter', ()=>{
      card.classList.add('expanded');
      full.style.display = 'block';
    });

    card.addEventListener('mouseleave', ()=>{
      card.classList.remove('expanded');
      full.style.display = 'none';
    });

    card.addEventListener('click', ()=>{
      const exp = card.classList.toggle('expanded');
      full.style.display = exp ? 'block' : 'none';
    });
  });

  /* ---------- CAUSES (expand downward) ---------- */
  document.querySelectorAll('.cause-card-small').forEach(card=>{
    card.addEventListener('mouseenter', ()=> card.classList.add('expanded'));
    card.addEventListener('mouseleave', ()=> card.classList.remove('expanded'));

    card.addEventListener('click', ()=>{
      card.classList.toggle('expanded');
    });
  });

  /* ---------- PENCEGAHAN (scale expand) ---------- */
  document.querySelectorAll('.importance-card').forEach(card=>{
    card.addEventListener('mouseenter', ()=> card.classList.add('expanded'));
    card.addEventListener('mouseleave', ()=> card.classList.remove('expanded'));

    card.addEventListener('click', ()=>{
      card.classList.toggle('expanded');
    });
  });

  /* ---------- RESET on scroll ---------- */
  window.addEventListener('scroll', ()=>{
    document.querySelectorAll('.expanded').forEach(card=>{
      card.classList.remove('expanded');

      const statFull = card.querySelector('.stat-full');
      if(statFull) statFull.style.display = 'none';
    });
  });
}

/* =======================================================
                NAVBAR & SMOOTH SCROLL
=======================================================*/
function initNav(){
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  hamburger.addEventListener('click', ()=>{
    console.log("hamburger bisa diklik")
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href');
      if(!id || id === '#') return;
      const el = document.querySelector(id);
      if(el){
        e.preventDefault();
        const offset = navbar.offsetHeight;
        const top = el.offsetTop - offset - 10;
        window.scrollTo({top, behavior:'smooth'});
      }
    });
  });
}

/* =======================================================
                    INIT
=======================================================*/
document.addEventListener('DOMContentLoaded', ()=>{
  loadData();
  initNav();
});
