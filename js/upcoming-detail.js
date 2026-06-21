// =============================
// Upcoming Detail Page
// =============================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTripName = document.getElementById('modalTripName');
let currentTrip = null;

const urlParams = new URLSearchParams(window.location.search);
const tripId = parseInt(urlParams.get('id'), 10);

async function loadTripDetail() {
  try {
    const [settings, upcoming] = await Promise.all([
      fetch('data/settings.json').then(r => r.json()),
      fetch('data/upcoming.json').then(r => r.json())
    ]);

    renderSettings(settings);

    if (isNaN(tripId) || tripId < 0 || tripId >= upcoming.items.length) {
      document.getElementById('tourTitle').textContent = 'Viaje no encontrado';
      return;
    }

    currentTrip = upcoming.items[tripId];
    renderTrip(currentTrip, settings);
  } catch (err) {
    console.error('Error loading trip:', err);
    document.getElementById('tourTitle').textContent = 'Error cargando viaje';
  }
}

function renderSettings(data) {
  document.getElementById('footerSlogan').textContent = data.slogan;
  const locationIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} <strong>Dirección:</strong> ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} <strong>Teléfonos:</strong> ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <strong>Correo:</strong> ${data.email}`;
  document.getElementById('year').textContent = new Date().getFullYear();

  const socialContainer = document.getElementById('socialLinks');
  socialContainer.querySelectorAll('a').forEach(link => {
    const network = link.dataset.network;
    if (data[network]) link.href = data[network];
  });

  if (data.whatsapp) {
    const cleanPhone = data.whatsapp.replace(/\D/g, '');
    document.getElementById('whatsappBtn').href = `https://wa.me/${cleanPhone}?text=Hola, estoy interesado en un viaje con Yomilka Tours`;
  }
}

function getTripDatesLabel(trip) {
  if (Array.isArray(trip.dates) && trip.dates.length > 0) {
    return trip.dates.join(' | ');
  }
  if (trip.date && trip.date.trim()) {
    return trip.date;
  }
  return '0 Fechas';
}

function renderTrip(trip, settings) {
  const heroBg = document.getElementById('tourHeroBg');
  if (trip.image && trip.image.trim()) {
    heroBg.style.backgroundImage = `url('${trip.image}')`;
  } else {
    const colors = ['1DA1F2', 'F26522', '0d8bd9', 'd9541a'];
    const color = colors[trip.title.length % colors.length];
    heroBg.style.background = `linear-gradient(135deg, #${color}, #0a1628)`;
  }

  document.getElementById('tourTitle').textContent = trip.title;
  document.getElementById('tourDate').textContent = `📅 ${getTripDatesLabel(trip)}`;
  document.getElementById('tourDuration').textContent = `⏱ ${trip.duration || 'Consultar'}`;
  document.getElementById('tourLocation').textContent = `📍 ${trip.location}`;
  document.getElementById('tourPrice').textContent = `💰 ${trip.price || 'Consultar'}`;

  document.getElementById('tourSubtitle').textContent = trip.title;
  document.getElementById('tourDescription').textContent = trip.description;

  const highlightsEl = document.getElementById('tourHighlights');
  highlightsEl.innerHTML = (trip.highlights || []).map(h => `<li><span class="check-icon">✓</span>${escapeHtml(h)}</li>`).join('');

  const includedEl = document.getElementById('tourIncluded');
  includedEl.innerHTML = (trip.included || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');

  const notIncludedEl = document.getElementById('tourNotIncluded');
  notIncludedEl.innerHTML = (trip.not_included || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');

  const galleryEl = document.getElementById('tourGallery');
  const gallery = trip.gallery || [];
  galleryEl.innerHTML = gallery.map((img, i) => {
    if (img) {
      return `<img src="${img}" alt="${escapeHtml(trip.title)} ${i+1}" loading="lazy">`;
    }
    return `<div class="gallery-placeholder"><span>Imagen ${i+1}</span></div>`;
  }).join('');

  document.title = `${trip.title} - Yomilka Tours`;
}

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

function openQuote() {
  modalTripName.textContent = currentTrip ? `Estás cotizando: ${currentTrip.title}` : 'Complete el formulario para cotizar';
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

  const trip = currentTrip ? currentTrip.title : 'Viaje seleccionado';
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

window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
  }
});

loadTripDetail();
