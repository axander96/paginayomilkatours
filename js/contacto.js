// =============================
// Contact Page
// =============================

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const quoteModal = document.getElementById('quoteModal');
const modalTripName = document.getElementById('modalTripName');

async function loadContactData() {
  try {
    const settings = await fetch('data/settings.json').then(r => r.json());
    renderSettings(settings);
  } catch (err) {
    console.error('Error loading contact data:', err);
  }
}

function renderSettings(data) {
  const sloganLines = (data.slogan || '').split('\n');
  document.getElementById('footerSlogan').innerHTML = sloganLines.map(line => `<span>${escapeHtml(line)}</span>`).join('<br>');
  document.getElementById('year').textContent = new Date().getFullYear();

  const locationIcon = getLocationFilledIcon(18);
  const phoneIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>`;
  const emailIcon = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>`;

  document.getElementById('footerAddress').innerHTML = `${locationIcon} <strong>Dirección:</strong> ${data.address}`;
  document.getElementById('footerPhone').innerHTML = `${phoneIcon} <strong>Teléfonos:</strong> ${data.phone}${data.phone2 ? ' / ' + data.phone2 : ''}`;
  document.getElementById('footerEmail').innerHTML = `${emailIcon} <strong>Correo:</strong> ${data.email}`;

  const mobileMenuEmail = document.getElementById('mobileMenuEmail');
  if (mobileMenuEmail && data.email) {
    mobileMenuEmail.textContent = data.email;
  }

  // Update contact page info
  const contactAddress = document.getElementById('contactAddress');
  const contactInfoPhone = document.getElementById('contactInfoPhone');
  const contactInfoEmail = document.getElementById('contactInfoEmail');
  const contactHours = document.getElementById('contactHours');
  const contactRnc = document.getElementById('contactRnc');
  const contactMap = document.getElementById('contactMap');

  if (contactAddress) contactAddress.textContent = data.address;
  if (contactInfoPhone) contactInfoPhone.textContent = data.phone + (data.phone2 ? ' / ' + data.phone2 : '');
  if (contactInfoEmail) contactInfoEmail.textContent = data.email;
  if (contactHours) contactHours.innerHTML = data.hours ? data.hours.replace(/\n/g, '<br>') : '';
  if (contactRnc) contactRnc.textContent = data.rnc || '';
  if (contactMap && data.map_url) {
    // Si el usuario pegó el código <iframe ...> completo, extraer solo el src
    let mapUrl = data.map_url.trim();
    if (mapUrl.includes('<iframe')) {
      const srcMatch = mapUrl.match(/src=["']([^"']+)["']/);
      if (srcMatch && srcMatch[1]) {
        mapUrl = srcMatch[1];
      }
    }

    // Validar que sea una URL de embed de Google Maps
    const isEmbed = mapUrl.includes('google.com/maps/embed');

    if (isEmbed) {
      contactMap.src = mapUrl;
      contactMap.style.display = 'block';
      document.getElementById('contactMapLink').style.display = 'none';
    } else {
      contactMap.style.display = 'none';
      const mapLink = document.getElementById('contactMapLink');
      mapLink.href = mapUrl;
      mapLink.style.display = 'inline-flex';
    }
  }

  // Update social links
  const socialContainer = document.getElementById('socialLinks');
  socialContainer.querySelectorAll('a').forEach(link => {
    const network = link.dataset.network;
    if (data[network]) link.href = data[network];
  });

  const contactSocial = document.getElementById('contactSocial');
  if (contactSocial) {
    contactSocial.querySelectorAll('a').forEach(link => {
      const network = link.dataset.network;
      if (data[network]) link.href = data[network];
    });
  }
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
  modalTripName.textContent = 'Complete el formulario para cotizar';
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

  const trip = 'Cotización general';
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

function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);

  const name = formData.get('contactName');
  const email = formData.get('contactEmail');
  const phone = formData.get('contactPhone');
  const subject = formData.get('contactSubject');
  const message = formData.get('contactMessage');

  const whatsappMessage = `*Nuevo Mensaje de Contacto - Yomilka Tours*%0A%0A` +
    `*Nombre:* ${name}%0A` +
    `*Correo:* ${email}%0A` +
    `*Celular:* ${phone}%0A` +
    `*Asunto:* ${subject}%0A` +
    `*Mensaje:* ${message}%0A`;

  fetch('data/settings.json')
    .then(r => r.json())
    .then(settings => {
      const phone = settings.whatsapp || settings.phone;
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${whatsappMessage}`, '_blank');
      form.reset();
      alert('Mensaje enviado. Nos pondremos en contacto contigo pronto.');
    })
    .catch(() => {
      alert('Mensaje enviado. Nos pondremos en contacto contigo pronto.');
      form.reset();
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

loadContactData();
