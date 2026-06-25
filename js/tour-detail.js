// =============================
// Tour Detail Page
// =============================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTitle = document.getElementById('modalTitle');
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
  const sloganLines = (data.slogan || '').split('\n');
  document.getElementById('footerSlogan').innerHTML = sloganLines.map(line => `<span>${escapeHtml(line)}</span>`).join('');
  const locationIcon = getLocationFilledIcon(18);
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <span class="notranslate">${data.email}</span>`;

  const mobileMenuEmail = document.getElementById('mobileMenuEmail');
  if (mobileMenuEmail && data.email) {
    mobileMenuEmail.textContent = data.email;
  }
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

function formatLongDate(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/(\d{1,2})\s*(?:[-–]\s*\d{1,2})?\s+(?:de\s+)?([a-zA-Záéíóúñ]+)(?:,?\s+(?:de(?:l)?\s+)?)?(\d{4})/i);
  if (match) {
    const day = match[1];
    const month = match[2].charAt(0).toUpperCase() + match[2].slice(1, 3).toLowerCase();
    const year = match[3];
    return `${day} ${month} del ${year}`;
  }
  return dateStr;
}

function normalizeDates(tour) {
  const rawDates = Array.isArray(tour.dates) ? tour.dates : [];
  if (rawDates.length === 0) return [];

  return rawDates.map(d => {
    if (typeof d === 'string') {
      return {
        departure: d,
        return: '',
        price: tour.price || ''
      };
    }
    return {
      departure: d.departure || '',
      return: d.return || '',
      price: d.price || tour.price || ''
    };
  }).filter(d => d.departure || d.return || d.price);
}

function getTourDatesLabel(tour) {
  const dates = normalizeDates(tour);
  if (dates.length > 0) {
    return dates.map(d => formatShortDate(d.departure || d.return)).filter(Boolean).join(' | ');
  }
  if (tour.date && tour.date.trim()) {
    return formatShortDate(tour.date);
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
  document.getElementById('tourDuration').innerHTML = `<span class="tour-meta-item">${getClockIcon(16)} ${escapeHtml(tour.duration || 'Consultar')}</span>`;
  document.getElementById('tourLocation').innerHTML = `<span class="tour-meta-item">${getLocationIcon(16)} ${escapeHtml(tour.location)}</span>`;

  const datesLabel = getTourDatesLabel(tour) || 'Fechas a coordinar con la agencia';
  document.getElementById('tourDate').innerHTML = `<span class="tour-meta-item">${getCalendarIcon(16)} ${escapeHtml(datesLabel)}</span>`;

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

  // Departure dates section
  const dates = normalizeDates(tour);
  const departureDatesSection = document.getElementById('departureDatesSection');
  const departureDatesGrid = document.getElementById('departureDatesGrid');
  if (dates.length > 0) {
    departureDatesSection.style.display = 'block';
    departureDatesGrid.innerHTML = dates.map(d => `
      <div class="departure-date-card">
        <div class="departure-date-info">
          <span class="departure-date-label">Salida</span>
          <span class="departure-date-value">${escapeHtml(formatLongDate(d.departure || d.return)) || '-'}</span>
        </div>
        <div class="departure-date-price">
          <span class="departure-date-from">Desde</span>
          <span class="departure-date-amount">${escapeHtml(d.price) || 'Consultar'}</span>
          <span class="departure-date-badge">Disponible</span>
        </div>
      </div>
    `).join('');
  } else {
    departureDatesSection.style.display = 'none';
  }

  // Highlights
  const highlightsEl = document.getElementById('tourHighlights');
  highlightsEl.innerHTML = (tour.highlights || []).map(h => `
    <li>
      <span class="highlight-icon">
        ${getLocationIcon(16)}
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
  const sidebarNote = document.getElementById('sidebarNote');
  if (dates.length > 0) {
    sidebarDates.innerHTML = dates.map(d => `
      <div class="sidebar-date-card">
        <div class="sidebar-date-row">
          <span class="sidebar-date-label">Salida</span>
          <span class="sidebar-date-value">${escapeHtml(formatShortDate(d.departure || d.return)) || '-'}</span>
        </div>
        <div class="sidebar-date-row sidebar-date-price">
          <span class="sidebar-date-label">Precio</span>
          <span class="sidebar-date-value">${escapeHtml(d.price) || 'Consultar'}</span>
        </div>
      </div>
    `).join('');
    if (sidebarNote) sidebarNote.style.display = 'none';
  } else {
    sidebarDates.innerHTML = `<span class="dates-label">${getCalendarIcon(14)} Fechas</span><span class="dates-value">Fechas a coordinar con el equipo al contactarnos.</span>`;
    if (sidebarNote) sidebarNote.style.display = 'block';
  }

  // WhatsApp button
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (settings.whatsapp) {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const message = `Hola, estoy interesado en la excursión *${tour.title}* de Yomilka Tours. Me gustaría recibir más información.`;
    whatsappBtn.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  document.title = `${tour.title} - Yomilka Tours`;
  initMobileDetailNav();
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
  const title = currentTour ? `Solicitar información: ${currentTour.title}` : 'Solicitar información';
  modalTitle.textContent = title;
  modalTripName.textContent = currentTour ? currentTour.title : 'Complete el formulario para solicitar información';

  const dates = currentTour ? normalizeDates(currentTour) : [];
  const preferredDateGroup = document.getElementById('preferredDateGroup');
  const manualDatesGroup = document.getElementById('manualDatesGroup');
  const preferredDateSelect = document.getElementById('preferredDate');
  const checkIn = document.getElementById('checkIn');
  const checkOut = document.getElementById('checkOut');

  if (dates.length > 0) {
    preferredDateGroup.style.display = 'block';
    manualDatesGroup.style.display = 'none';
    checkIn.required = false;
    checkOut.required = false;
    preferredDateSelect.innerHTML = dates.map((d, i) => {
      const label = d.return && d.departure !== d.return
        ? `${d.departure} - ${d.return} (${d.price || 'Consultar'})`
        : `${d.departure} (${d.price || 'Consultar'})`;
      return `<option value="${i}">${escapeHtml(label)}</option>`;
    }).join('');
  } else {
    preferredDateGroup.style.display = 'none';
    manualDatesGroup.style.display = 'flex';
    checkIn.required = true;
    checkOut.required = true;
  }

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
  const fullName = formData.get('fullName');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const notes = formData.get('notes');

  const dates = currentTour ? normalizeDates(currentTour) : [];
  let dateInfo = '';
  if (dates.length > 0) {
    const selectedIndex = parseInt(formData.get('preferredDate') || '0', 10);
    const selected = dates[selectedIndex] || dates[0];
    dateInfo = selected
      ? `Salida: ${selected.departure}${selected.return ? ` - Regreso: ${selected.return}` : ''}${selected.price ? ` | Precio: ${selected.price}` : ''}`
      : '';
  } else {
    const checkIn = formData.get('checkIn');
    const checkOut = formData.get('checkOut');
    dateInfo = `Fecha de entrada: ${checkIn || 'No indicada'} | Fecha de salida: ${checkOut || 'No indicada'}`;
  }

  const message = `*Nueva Solicitud - Yomilka Tours*%0A%0A` +
    `*Viaje:* ${trip}%0A` +
    `*Nombre:* ${fullName}%0A` +
    `*Correo:* ${email}%0A` +
    `*Teléfono:* ${phone}%0A` +
    `*${dateInfo}*%0A` +
    (notes ? `*Mensaje:* ${notes}%0A` : '');

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

function shareTrip() {
  const url = window.location.href;
  const title = document.getElementById('tourTitle').textContent.trim();
  const shareText = `${title} ${url}`;
  if (navigator.share) {
    navigator.share({ title, text: shareText, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(() => {});
  } else {
    alert('No se pudo compartir el enlace. Copia la URL de la barra del navegador.');
  }
}

function initMobileDetailNav() {
  const nav = document.querySelector('.mobile-detail-nav');
  if (!nav) return;

  const items = nav.querySelectorAll('.mobile-detail-nav-item');
  const panes = document.querySelectorAll('.tab-pane');

  // Hide tabs whose section has no visible content
  items.forEach(item => {
    const tab = item.dataset.tab;
    const pane = document.querySelector(`.tab-pane[data-tab="${tab}"]`);
    if (!pane) {
      item.style.display = 'none';
      return;
    }
    const innerSection = pane.querySelector('#itinerarySection, #departureDatesSection');
    if (innerSection && innerSection.style.display === 'none') {
      item.style.display = 'none';
    }
  });

  // If active tab was hidden, activate first visible tab and pane
  const visibleItems = Array.from(items).filter(i => i.style.display !== 'none');
  if (visibleItems.length && !visibleItems.some(i => i.classList.contains('active'))) {
    items.forEach(i => i.classList.remove('active'));
    visibleItems[0].classList.add('active');
    const tab = visibleItems[0].dataset.tab;
    panes.forEach(p => p.classList.toggle('active', p.dataset.tab === tab));
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.dataset.tab;
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      panes.forEach(p => {
        p.classList.toggle('active', p.dataset.tab === tab);
      });
    });
  });
}

// Initialize
loadTourDetail();
