// =============================
// Tour Detail Page
// =============================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTripName = document.getElementById('modalTripName');
let currentTour = null;

// Get tour ID from URL
const urlParams = new URLSearchParams(window.location.search);
const tourId = parseInt(urlParams.get('id'), 10);

async function loadTourDetail() {
  try {
    const [settings, tours] = await Promise.all([
      fetch('data/settings.json').then(r => r.json()),
      fetch('data/tours.json').then(r => r.json())
    ]);

    renderSettings(settings);

    if (isNaN(tourId) || tourId < 0 || tourId >= tours.items.length) {
      document.getElementById('tourTitle').textContent = 'Tour no encontrado';
      return;
    }

    currentTour = tours.items[tourId];
    renderTour(currentTour, settings);
  } catch (err) {
    console.error('Error loading tour:', err);
    document.getElementById('tourTitle').textContent = 'Error cargando tour';
  }
}

function renderSettings(data) {
  document.getElementById('footerSlogan').textContent = data.slogan;
  document.getElementById('footerAddress').innerHTML = `<strong>Dirección:</strong> ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `<strong>Teléfonos:</strong> ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `<strong>Correo:</strong> ${data.email}`;
  document.getElementById('year').textContent = new Date().getFullYear();

  const socialContainer = document.getElementById('socialLinks');
  socialContainer.querySelectorAll('a').forEach(link => {
    const network = link.dataset.network;
    if (data[network]) link.href = data[network];
  });

  // Update WhatsApp button
  if (data.whatsapp) {
    const cleanPhone = data.whatsapp.replace(/\D/g, '');
    document.getElementById('whatsappBtn').href = `https://wa.me/${cleanPhone}?text=Hola, estoy interesado en cotizar un tour con Yomilka Tours`;
  }
}

function renderTour(tour, settings) {
  // Hero
  const heroBg = document.getElementById('tourHeroBg');
  if (tour.image) {
    heroBg.style.backgroundImage = `url('${tour.image}')`;
  }

  document.getElementById('tourTitle').textContent = tour.title;
  document.getElementById('tourDuration').textContent = `⏱ ${tour.duration || 'Consultar'}`;
  document.getElementById('tourLocation').textContent = `📍 ${tour.location}`;

  // Description
  document.getElementById('tourSubtitle').textContent = tour.title;
  document.getElementById('tourDescription').textContent = tour.description;

  // Highlights
  const highlightsEl = document.getElementById('tourHighlights');
  highlightsEl.innerHTML = (tour.highlights || []).map(h => `<li><span class="check-icon">✓</span>${escapeHtml(h)}</li>`).join('');

  // Included
  const includedEl = document.getElementById('tourIncluded');
  includedEl.innerHTML = (tour.included || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');

  // Not included
  const notIncludedEl = document.getElementById('tourNotIncluded');
  notIncludedEl.innerHTML = (tour.not_included || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');

  // Gallery
  const galleryEl = document.getElementById('tourGallery');
  const gallery = tour.gallery || [];
  galleryEl.innerHTML = gallery.map((img, i) => {
    if (img) {
      return `<img src="${img}" alt="${escapeHtml(tour.title)} ${i+1}" loading="lazy">`;
    }
    return `<div class="gallery-placeholder"><span>Imagen ${i+1}</span></div>`;
  }).join('');

  // Page title
  document.title = `${tour.title} - Yomilka Tours`;
}

// =============================
// Mobile Menu
// =============================
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

// =============================
// Quote Modal
// =============================
function openQuote() {
  modalTripName.textContent = currentTour ? `Estás cotizando: ${currentTour.title}` : 'Complete el formulario para cotizar';
  quoteModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openQuoteFromDetail() {
  openQuote();
}

function closeQuote() {
  quoteModal.classList.remove('open');
  document.body.style.overflow = '';
}

function submitQuote(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const trip = currentTour ? currentTour.title : 'Tour seleccionado';
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeQuote();
});

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

// Initialize
loadTourDetail();
