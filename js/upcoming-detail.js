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
  document.getElementById('footerAddress').innerHTML = `<strong>Dirección:</strong> ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `<strong>Teléfonos:</strong> ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `<strong>Correo:</strong> ${data.email}`;
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

function renderTrip(trip, settings) {
  const heroBg = document.getElementById('tourHeroBg');
  if (trip.image) {
    heroBg.style.backgroundImage = `url('${trip.image}')`;
  }

  document.getElementById('tourTitle').textContent = trip.title;
  document.getElementById('tourDate').textContent = `📅 ${trip.date || 'Consultar'}`;
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
  const checkIn = formData.get('checkIn');
  const checkOut = formData.get('checkOut');
  const notes = formData.get('notes');

  const message = `*Nueva Cotización - Yomilka Tours*%0A%0A` +
    `*Viaje:* ${trip}%0A` +
    `*Nombre:* ${firstName} ${lastName}%0A` +
    `*Correo:* ${email}%0A` +
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
