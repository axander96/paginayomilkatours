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
  const locationIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = locationIcon;
  const primaryPhone = (data.phone || '').replace(/\D/g, '');
  document.getElementById('footerPhone').href = primaryPhone ? `tel:${primaryPhone}` : '#';
  document.getElementById('footerPhone').innerHTML = phoneIcon;
  document.getElementById('footerEmail').href = data.email ? `mailto:${data.email}` : '#';
  document.getElementById('footerEmail').innerHTML = emailIcon;
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

function getTourDatesLabel(tour) {
  if (Array.isArray(tour.dates) && tour.dates.length > 0) {
    return tour.dates.join(' | ');
  }
  if (tour.date && tour.date.trim()) {
    return tour.date;
  }
  return null;
}

function renderTour(tour, settings) {
  const heroBg = document.getElementById('tourHeroBg');
  if (tour.image && tour.image.trim()) {
    heroBg.style.backgroundImage = `url('${tour.image}')`;
  } else {
    const colors = ['1DA1F2', 'F26522', '0d8bd9', 'd9541a'];
    const color = colors[tour.title.length % colors.length];
    heroBg.style.background = `linear-gradient(135deg, #${color}, #ffffff)`;
  }

  document.getElementById('tourTitle').textContent = tour.title;
  document.getElementById('tourDuration').textContent = `⏱ ${tour.duration || 'Consultar'}`;
  document.getElementById('tourLocation').textContent = `📍 ${tour.location}`;

  const datesLabel = getTourDatesLabel(tour);
  document.getElementById('tourDate').textContent = datesLabel ? `📅 ${datesLabel}` : '📅 Fechas a coordinar con la agencia';

  document.getElementById('tourSubtitle').textContent = tour.title;
  document.getElementById('tourDescription').textContent = tour.description;

  // Itinerary
  const itinerary = tour.itinerary || [];
  const itinerarySection = document.getElementById('itinerarySection');
  const itineraryEl = document.getElementById('tourItinerary');
  if (itinerary.length > 0) {
    itinerarySection.style.display = 'block';
    itineraryEl.innerHTML = itinerary.map(day => {
      const dayRaw = day.day != null ? String(day.day) : '';
      const dayNumber = dayRaw.match(/\d+/) ? dayRaw.match(/\d+/)[0] : dayRaw;
      const dayLabel = dayNumber ? `Día ${dayNumber}` : 'Día';
      return `
        <div class="itinerary-item">
          <div class="itinerary-marker">
            <span>${dayNumber || dayRaw}</span>
          </div>
          <div class="itinerary-content">
            <h4>${dayLabel} · ${escapeHtml(day.title)}</h4>
            <p>${escapeHtml(day.description)}</p>
          </div>
        </div>
      `;
    }).join('');
  } else {
    itinerarySection.style.display = 'none';
  }

  // Included / Not included
  const includedEl = document.getElementById('tourIncluded');
  includedEl.innerHTML = (tour.included || []).map(i => `
    <li>
      <span class="include-icon include-yes-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </span>
      ${escapeHtml(i)}
    </li>
  `).join('');

  const notIncludedEl = document.getElementById('tourNotIncluded');
  notIncludedEl.innerHTML = (tour.not_included || []).map(i => `
    <li>
      <span class="include-icon include-no-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
      ${escapeHtml(i)}
    </li>
  `).join('');

  // Highlights
  const highlightsEl = document.getElementById('tourHighlights');
  highlightsEl.innerHTML = (tour.highlights || []).map(h => `
    <li>
      <span class="highlight-icon">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
      </span>
      ${escapeHtml(h)}
    </li>
  `).join('');

  // Gallery
  const galleryEl = document.getElementById('tourGallery');
  const gallery = tour.gallery || [];
  galleryEl.innerHTML = gallery.map((img, i) => {
    if (img) {
      return `<img src="${img}" alt="${escapeHtml(tour.title)} ${i+1}" loading="lazy">`;
    }
    return `<div class="gallery-placeholder"><span>Imagen ${i+1}</span></div>`;
  }).join('');

  // Sidebar
  const sidebarPrice = document.getElementById('sidebarPrice');
  sidebarPrice.textContent = tour.price ? tour.price.replace('$', 'US$') : 'Consultar';

  const sidebarDates = document.getElementById('sidebarDates');
  if (datesLabel) {
    sidebarDates.innerHTML = `<span class="dates-label">📅 Fechas disponibles</span><span class="dates-value">${escapeHtml(datesLabel)}</span>`;
  } else {
    sidebarDates.innerHTML = `<span class="dates-label">📅 Fechas</span><span class="dates-value">Fechas a coordinar con la agencia</span>`;
  }

  // WhatsApp button
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (settings.whatsapp) {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const message = `Hola, estoy interesado en la excursión *${tour.title}* de Yomilka Tours. Me gustaría recibir más información.`;
    whatsappBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

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
