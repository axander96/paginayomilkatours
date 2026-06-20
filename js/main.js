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
    const [settings, hero, upcoming, services, tours, instagram, partners] = await Promise.all([
      fetch('data/settings.json').then(r => r.json()),
      fetch('data/hero.json').then(r => r.json()),
      fetch('data/upcoming.json').then(r => r.json()),
      fetch('data/services.json').then(r => r.json()),
      fetch('data/tours.json').then(r => r.json()),
      fetch('data/instagram.json').then(r => r.json()),
      fetch('data/partners.json').then(r => r.json())
    ]);

    renderSettings(settings);
    renderHero(hero.slides);
    renderUpcoming(upcoming);
    renderServices(services);
    renderTours(tours);
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
  document.getElementById('footerSlogan').textContent = data.slogan;
  const locationIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} <strong>Dirección:</strong> ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} <strong>Teléfonos:</strong> ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <strong>Correo:</strong> ${data.email}`;
  document.getElementById('year').textContent = new Date().getFullYear();

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

function renderUpcoming(data) {
  document.getElementById('upcomingTitle').textContent = data.title;
  document.getElementById('upcomingSubtitle').textContent = data.subtitle;

  const grid = document.getElementById('upcomingGrid');
  grid.innerHTML = data.items.map((item, index) => `
    <a href="upcoming-detail.html?id=${index}" class="card" style="text-decoration:none;color:inherit">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" class="card-image" loading="lazy">
      <div class="card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="date">📅 ${escapeHtml(item.date)}</div>
        <div class="price">${escapeHtml(item.price)}</div>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </a>
  `).join('');
}

function renderServices(data) {
  document.getElementById('servicesTitle').textContent = data.title;
  document.getElementById('servicesSubtitle').textContent = data.subtitle;

  const icons = {
    visa: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M7 15h.01M12 15h.01"/></svg>`,
    hotel: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-6h2v6M13 21v-6h2v6"/></svg>`,
    tour: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    excursion: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.657 16.657L13.414 12.414a2 2 0 0 0-2.828 0L6.343 16.657"/><path d="M2 21h20M5 21v-8l7-7 7 7v8"/></svg>`
  };

  const grid = document.getElementById('servicesGrid');
  grid.innerHTML = data.items.map(item => `
    <div class="service-item">
      <div class="service-icon">${icons[item.icon] || icons.tour}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>
  `).join('');
}

function renderTours(data) {
  document.getElementById('toursTitle').textContent = data.title;
  document.getElementById('toursSubtitle').textContent = data.subtitle;

  const grid = document.getElementById('toursGrid');
  grid.innerHTML = data.items.map((item, index) => `
    <a href="tour-detail.html?id=${index}" class="card" style="text-decoration:none;color:inherit">
      <img src="${item.image}" alt="${escapeHtml(item.title)}" class="card-image" loading="lazy">
      <div class="card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="location">📍 ${escapeHtml(item.location)}</div>
        <p>${escapeHtml(item.description)}</p>
      </div>
    </a>
  `).join('');
}

function renderInstagram(data) {
  document.getElementById('instagramTitle').textContent = data.title;

  const grid = document.getElementById('instagramGrid');
  grid.innerHTML = data.items.map(item => `
    <a href="${item.embed_url}" target="_blank" class="insta-card">
      <img src="${item.image}" alt="Instagram" loading="lazy">
      <div class="insta-overlay">
        <div>
          <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          <p>${escapeHtml(item.caption)}</p>
        </div>
      </div>
    </a>
  `).join('');
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
