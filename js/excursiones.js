// =============================
// Excursions Page
// =============================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTripName = document.getElementById('modalTripName');

async function loadExcursionsData() {
  try {
    const [settings, upcoming] = await Promise.all([
      fetch('data/settings.json').then(r => r.json()),
      fetch('data/upcoming.json').then(r => r.json())
    ]);

    renderSettings(settings);
    renderExcursions(upcoming);
  } catch (err) {
    console.error('Error loading excursions data:', err);
  }
}

function renderSettings(data) {
  const sloganLines = (data.slogan || '').split('\n');
  document.getElementById('footerSlogan').innerHTML = sloganLines.map(line => `<span>${escapeHtml(line)}</span>`).join('');
  document.getElementById('year').textContent = new Date().getFullYear();

  const locationIcon = getLocationFilledIcon(18);
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <span translate="no">${escapeHtml(data.email)}</span>`;

  const mobileMenuEmail = document.getElementById('mobileMenuEmail');
  if (mobileMenuEmail && data.email) {
    mobileMenuEmail.innerHTML = `<span translate="no">${escapeHtml(data.email)}</span>`;
  }

  const socialContainer = document.getElementById('socialLinks');
  socialContainer.querySelectorAll('a').forEach(link => {
    const network = link.dataset.network;
    if (data[network]) link.href = data[network];
  });
}

function renderExcursions(data) {
  const total = data.items.length;
  document.getElementById('excursionsCount').textContent =
    `${total} experiencia${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`;

  const grid = document.getElementById('excursionsGrid');
  grid.innerHTML = data.items.map((item, index) => buildTripCard(item, index, 'upcoming')).join('');
}

// =============================
// Trip Card Helpers (shared logic)
// =============================

function getTripImage(item) {
  if (item.image && item.image.trim()) return item.image;
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
    const year = match[3];
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
  const firstDate = escapeHtml(getFirstDate(item));
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
        <div class="trip-card-date">
          ${getCalendarIcon(14)}
          ${firstDate}
        </div>
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

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
  } else {
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
  }
});

loadExcursionsData();
