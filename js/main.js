// =============================
// Yomilka Tours - Main JavaScript
// =============================

// Global state
let currentSlide = 0;
let slideInterval;
let heroSlides = [];

// DOM Elements
const sliderEl = document.getElementById('heroSlider');
const dotsEl = document.getElementById('sliderDots');
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTripName = document.getElementById('modalTripName');

// =============================
// Data Loading
// =============================

async function loadData() {
  try {
    const [settings, hero, upcoming, services, instagram, partners] = await Promise.all([
      fetch('data/settings.json').then(r => r.json()),
      fetch('data/hero.json').then(r => r.json()),
      fetch('data/upcoming.json').then(r => r.json()),
      fetch('data/services.json').then(r => r.json()),
      fetch('data/instagram.json').then(r => r.json()),
      fetch('data/partners.json').then(r => r.json())
    ]);

    renderSettings(settings);
    renderHero(hero.slides);
    renderUpcoming(upcoming);
    renderServices(services);
    renderInstagram(instagram);
    renderPartners(partners);
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// =============================
// Render Functions
// =============================

function renderSettings(data) {
  const sloganLines = (data.slogan || '').split('\n');
  document.getElementById('footerSlogan').innerHTML = sloganLines.map(line => `<span>${escapeHtml(line)}</span>`).join('');
  const locationIcon = getLocationFilledIcon(18);
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <span translate="no">${escapeHtml(data.email)}</span>`;
  document.getElementById('year').textContent = new Date().getFullYear();

  const mobileMenuEmail = document.getElementById('mobileMenuEmail');
  if (mobileMenuEmail && data.email) {
    mobileMenuEmail.innerHTML = `<span translate="no">${escapeHtml(data.email)}</span>`;
  }

  // Update social links
  const socialContainer = document.getElementById('socialLinks');
  socialContainer.querySelectorAll('a').forEach(link => {
    const network = link.dataset.network;
    if (data[network]) {
      link.href = data[network];
    }
  });

  // Update Instagram subtitle
  if (data.instagram) {
    const username = data.instagram.replace(/.*instagram\.com\//, '').replace(/\/$/, '');
    document.getElementById('instagramSubtitle').textContent = '@' + username;
  }
}

function renderHero(slides) {
  heroSlides = slides;
  if (!slides.length) return;

  sliderEl.innerHTML = slides.map((slide, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" style="background-image: url('${slide.image}')">
      <div class="slide-content">
        <h1>${slide.title}</h1>
        <p>${slide.subtitle}</p>
      </div>
    </div>
  `).join('');

  dotsEl.innerHTML = slides.map((_, i) => `
    <button class="dot ${i === 0 ? 'active' : ''}" onclick="goToSlide(${i})" aria-label="Slide ${i + 1}"></button>
  `).join('');

  startSlider();
}

// =============================
// Trip Card Helpers
// =============================

function getTripImage(item) {
  if (item.image && item.image.trim()) return item.image;
  // Fallback: brand-colored placeholder with first letter
  const colors = ['1DA1F2', 'F26522', '0d8bd9', 'd9541a'];
  const color = colors[item.title.length % colors.length];
  const letter = encodeURIComponent(item.title.charAt(0).toUpperCase());
  return `https://placehold.co/600x400/${color}/ffffff?text=${letter}`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d{1,2})\s*(?:[-–]\s*\d{1,2})?\s+(?:de\s+)?([a-zA-Záéíóúñ]+)(?:,?\s+(?:de(?:l)?\s+)?)?(\d{4})/i);
  if (match) {
    const day = match[1].padStart(2, '0');
    const month = match[2].substring(0, 3).toUpperCase();
    const year = match[3].slice(-2);
    return `${day}-${month}-${year}`;
  }
  return dateStr;
}

function getFirstDate(item) {
  let raw = '';
  if (Array.isArray(item.dates) && item.dates.length > 0) {
    const first = item.dates[0];
    raw = (typeof first === 'object' && first !== null)
      ? (first.departure || '')
      : first;
  } else if (item.date && item.date.trim()) {
    raw = item.date;
  }
  if (!raw) return 'Fechas a coordinar';
  return formatShortDate(raw);
}

function getTripDatesHTML(item) {
  const dates = Array.isArray(item.dates) ? item.dates : [];
  if (dates.length > 0) {
    const items = dates.map(d => {
      const raw = (typeof d === 'object' && d !== null) ? (d.departure || '') : d;
      const formatted = formatShortDate(raw);
      if (!formatted) return '';
      return `<span class="trip-card-date">${getCalendarIcon(14)} ${escapeHtml(formatted)}</span>`;
    }).filter(Boolean);
    if (items.length > 0) {
      return `<div class="trip-card-dates">${items.join('')}</div>`;
    }
  }
  if (item.date && item.date.trim()) {
    return `<div class="trip-card-dates"><span class="trip-card-date">${getCalendarIcon(14)} ${escapeHtml(formatShortDate(item.date))}</span></div>`;
  }
  return `<div class="trip-card-dates"><span class="trip-card-date">${getCalendarIcon(14)} Fechas a coordinar</span></div>`;
}

function formatPrice(item) {
  if (item.price && item.price.trim()) return item.price;
  return 'Consultar';
}

function buildTripCard(item, index, type) {
  const detailUrl = type === 'upcoming' ? 'upcoming-detail.html' : 'tour-detail.html';
  const image = getTripImage(item);
  const title = escapeHtml(item.title || '');
  const location = escapeHtml(item.location || '');
  const category = escapeHtml(item.category || 'Excursión');
  const duration = escapeHtml(item.duration || '');
  const price = escapeHtml(formatPrice(item));

  const guide = item.guide;
  const guideBadge = guide && guide.image && guide.badge_text ? `
    <div class="trip-card-guide">
      <img src="${guide.image}" alt="${escapeHtml(guide.name || '')}" class="trip-card-guide-img" loading="lazy">
      <span class="trip-card-guide-text">${escapeHtml(guide.badge_text)}</span>
    </div>
  ` : '';

  return `
    <a href="${detailUrl}?id=${index}" class="trip-card" aria-label="${title}">
      <div class="trip-card-image-wrap">
        <img src="${image}" alt="${title}" class="trip-card-image" loading="lazy">
        ${guideBadge}
        <span class="trip-card-duration">
          ${getClockIcon(14)}
          ${duration}
        </span>
      </div>
      <div class="trip-card-body">
        <div class="trip-card-meta">
          <span class="trip-card-locations">
            ${getLocationIcon(14)}
            ${location}
          </span>
          <span class="trip-card-category">${category}</span>
        </div>
        <h3 class="trip-card-title">${title}</h3>
        ${getTripDatesHTML(item)}
        <div class="trip-card-footer">
          <div class="trip-card-price">
            <small>DESDE</small>
            <span>${price}</span>
          </div>
          <span class="trip-card-btn">Ver detalles</span>
        </div>
      </div>
    </a>
  `;
}

function renderUpcoming(data) {
  document.getElementById('upcomingTitle').textContent = data.title;
  document.getElementById('upcomingSubtitle').textContent = data.subtitle;

  const grid = document.getElementById('upcomingGrid');
  const itemsToShow = data.items.slice(0, 6);
  grid.innerHTML = itemsToShow.map((item, index) => buildTripCard(item, index, 'upcoming')).join('');

  // Add "View all" button if there are more than 6 items
  const section = document.getElementById('excursiones');
  let viewAllBtn = section.querySelector('.view-all-trips');
  if (!viewAllBtn) {
    viewAllBtn = document.createElement('div');
    viewAllBtn.className = 'view-all-trips';
    section.querySelector('.container').appendChild(viewAllBtn);
  }
  viewAllBtn.innerHTML = `
    <a href="excursiones.html" class="btn-view-all">Ver todas las excursiones disponibles</a>
  `;
}

function renderServices(data) {
  document.getElementById('servicesTitle').textContent = data.title;
  document.getElementById('servicesSubtitle').textContent = data.subtitle;

  const iconPaths = {
    visa: 'Iconos%20servicios/Visados.svg',
    hotel: 'Iconos%20servicios/Hoteles.svg',
    tour: 'Iconos%20servicios/Tours.svg',
    excursion: 'Iconos%20servicios/Excursiones.svg'
  };

  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = data.items.map(item => `
    <div class="service-item">
      <div class="service-icon">
        <img src="${iconPaths[item.icon] || iconPaths.tour}" alt="${escapeHtml(item.title)}" loading="lazy">
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>
  `).join('');
}

function renderInstagram(data) {
  document.getElementById('instagramTitle').textContent = data.title;

  const grid = document.getElementById('instagramGrid');
  const validItems = data.items.filter(item => item.embed_url && item.embed_url.trim() !== '');

  if (validItems.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);grid-column:1/-1;">Próximamente publicaciones de Instagram</p>';
    return;
  }

  grid.innerHTML = validItems.map(item => `
    <div class="instagram-embed">
      <blockquote class="instagram-media" data-instgrm-permalink="${item.embed_url}" data-instgrm-version="14"></blockquote>
    </div>
  `).join('');

  // Load Instagram embed script if not already loaded
  if (!document.getElementById('instagramEmbedScript')) {
    const script = document.createElement('script');
    script.id = 'instagramEmbedScript';
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    document.body.appendChild(script);
  } else if (window.instgrm) {
    window.instgrm.Embeds.process();
  }
}

function renderPartners(data) {
  document.getElementById('partnersTitle').textContent = data.title;

  const grid = document.getElementById('partnersGrid');
  grid.innerHTML = data.items.map(item => `
    <img src="${item.logo}" alt="${escapeHtml(item.name)}" class="partner-logo" loading="lazy">
  `).join('');
}

// =============================
// Slider Logic
// =============================

function startSlider() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
  goToSlide((currentSlide + 1) % heroSlides.length);
}

function prevSlide() {
  goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  
  currentSlide = index;
  
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  
  // Reset interval
  startSlider();
}

document.getElementById('sliderPrev').addEventListener('click', prevSlide);
document.getElementById('sliderNext').addEventListener('click', nextSlide);

// =============================
// Mobile Menu
// =============================

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

// Close menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// =============================
// Quote Modal
// =============================

function openQuote(tripName = '') {
  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) {
    modalTitle.textContent = tripName ? 'Cotizar Viaje' : 'Cotizar Viaje';
  }
  modalTripName.textContent = tripName 
    ? `Estás cotizando: ${tripName}` 
    : 'Complete el formulario para cotizar';
  quoteModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuote() {
  quoteModal.classList.remove('open');
  document.body.style.overflow = '';
}

function submitQuote(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  // Build WhatsApp message
  const trip = modalTripName.textContent.replace('Estás cotizando: ', '');
  const adults = formData.get('adults');
  const children = formData.get('children');
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const checkIn = formData.get('checkIn');
  const checkOut = formData.get('checkOut');
  const notes = formData.get('notes');

  const message = `*Nueva Cotización - Yomilka Tours*%0A%0A` +
    `*Viaje:* ${trip}%0A` +
    `*Nombre:* ${firstName} ${lastName}%0A` +
    `*Correo:* ${email}%0A` +
    `*Celular:* ${phone}%0A` +
    `*Adultos:* ${adults}%0A` +
    `*Niños (2-12):* ${children}%0A` +
    `*Entrada:* ${checkIn}%0A` +
    `*Salida:* ${checkOut}%0A` +
    (notes ? `*Notas:* ${notes}%0A` : '');

  // Get WhatsApp number from settings (we'll use a default approach)
  fetch('data/settings.json')
    .then(r => r.json())
    .then(settings => {
      const phone = settings.whatsapp || settings.phone;
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      form.reset();
      closeQuote();
    })
    .catch(() => {
      alert('Formulario enviado. Nos pondremos en contacto contigo pronto.');
      form.reset();
      closeQuote();
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuote();
});

// =============================
// Utilities
// =============================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
  }
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 150;
  
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + section.id) {
          link.classList.add('active');
        }
      });
    }
  });
});

// Initialize
loadData();
