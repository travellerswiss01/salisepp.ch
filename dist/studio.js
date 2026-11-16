const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});

const contactForm = document.querySelector('#contact-form');
const packageField = document.querySelector('#selected-package');
const selection = document.querySelector('#selection-summary');
const requestDetails = document.querySelector('#request-details');
const steps = [...document.querySelectorAll('.wizard-step')];
const next = document.querySelector('#wizard-next');
const back = document.querySelector('#wizard-back');
const send = contactForm.querySelector('[type="submit"]');
const error = document.querySelector('#wizard-error');
const status = document.querySelector('#status');
const success = document.querySelector('#request-success');
const fallback = document.querySelector('#request-fallback');
const questionNames = ['need', 'goals', 'style'];
let current = 0;

function renderSummary() {
  const data = new FormData(contactForm);
  const answers = [data.get('need'), data.getAll('goals').join(' · '), data.get('style')];
  if (packageField.value !== 'Noch nicht gewählt') answers.push(packageField.value);
  document.querySelector('#wizard-summary-text').textContent = answers.filter(Boolean).join(' — ');
}
function updateSelection() {
  selection.hidden = packageField.value === 'Noch nicht gewählt';
  document.querySelector('#selection-text').textContent = packageField.value;
  renderSummary();
}
function showStep(index, focus = false) {
  current = Math.max(0, Math.min(index, steps.length - 1));
  steps.forEach((step, index) => { step.hidden = index !== current; });
  document.querySelector('#wizard-count').textContent = `Schritt ${current + 1} von ${steps.length}`;
  document.querySelectorAll('.wizard-progress i').forEach((bar, index) => bar.classList.toggle('done', index <= current));
  back.hidden = current === 0;
  next.hidden = current === steps.length - 1;
  send.hidden = current !== steps.length - 1;
  error.textContent = '';
  renderSummary();
  if (focus) steps[current].querySelector('legend').focus();
}
function validateStep() {
  error.textContent = '';
  if (current < questionNames.length) {
    if (!contactForm.querySelector(`input[name="${questionNames[current]}"]:checked`)) {
      error.textContent = current === 1 ? 'Wähle mindestens ein Ziel aus.' : 'Bitte wähle eine Möglichkeit aus.';
      return false;
    }
    return true;
  }
  return contactForm.reportValidity();
}
function resetRequest() {
  contactForm.reset();
  packageField.value = 'Noch nicht gewählt';
  contactForm.classList.remove('is-sent');
  success.hidden = true;
  fallback.hidden = true;
  status.textContent = '';
  send.disabled = false;
  send.textContent = 'Kostenlosen Entwurf anfragen ↗';
  updateSelection();
  showStep(0);
}

next.addEventListener('click', () => { if (validateStep()) showStep(current + 1, true); });
back.addEventListener('click', () => showStep(current - 1, true));
document.querySelector('#wizard-edit').addEventListener('click', () => showStep(0, true));
document.querySelector('#request-another').addEventListener('click', () => {
  resetRequest();
  showStep(0, true);
});
contactForm.addEventListener('keydown', event => {
  if (event.key === 'Enter' && current < steps.length - 1 && event.target instanceof HTMLInputElement) {
    event.preventDefault();
    next.click();
  }
});
contactForm.addEventListener('change', () => {
  error.textContent = '';
  renderSummary();
});
document.querySelectorAll('.draft-request').forEach(link => link.addEventListener('click', () => {
  if (contactForm.classList.contains('is-sent')) resetRequest();
  requestDetails.open = true;
  if (link.dataset.package) {
    packageField.value = link.dataset.package;
    updateSelection();
  }
}));
document.querySelector('#clear-selection').addEventListener('click', () => {
  packageField.value = 'Noch nicht gewählt';
  updateSelection();
});

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (send.disabled || current !== steps.length - 1 || !validateStep()) return;
  const missing = questionNames.findIndex(name => !contactForm.querySelector(`input[name="${name}"]:checked`));
  if (missing !== -1) { showStep(missing, true); validateStep(); return; }
  const values = new FormData(contactForm);
  if (String(values.get('_honey') || '').trim()) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  send.disabled = true;
  send.textContent = 'Wird gesendet …';
  contactForm.setAttribute('aria-busy', 'true');
  fallback.hidden = true;
  status.textContent = 'Deine Anfrage wird übermittelt …';
  try {
    const response = await fetch('https://formsubmit.co/ajax/sepp@salisepp.ch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        name: values.get('name'), email: values.get('email'),
        Vorhaben: values.get('need'), Ziele: values.getAll('goals').join(', '),
        Stil: values.get('style'), Firma: values.get('company'),
        Branche: values.get('industry') || 'Keine angegeben', Paket: values.get('package'),
        Website: values.get('website') || 'Keine angegeben', Nachricht: values.get('message'),
        _subject: 'Anfrage: kostenloser Startseiten-Entwurf', _template: 'table', _honey: ''
      })
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Versand nicht bestätigt');
    status.textContent = 'Danke! Deine Anfrage wurde übermittelt. Ich melde mich bei dir.';
    success.hidden = false;
    contactForm.classList.add('is-sent');
    status.focus();
  } catch (error) {
    status.textContent = 'Der Versand konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es später erneut oder schreibe mir direkt per E-Mail.';
    fallback.hidden = false;
    send.disabled = false;
    send.textContent = 'Erneut senden ↗';
    status.focus();
  } finally {
    clearTimeout(timer);
    contactForm.removeAttribute('aria-busy');
  }
});
updateSelection();
showStep(0);

// Load the existing booking provider only after the visitor requests it.
document.querySelectorAll('a[href="#kennenlernen"]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.booking-details').open = true;
}));
const calendarButton = document.querySelector('#load-calendar');
const calendarHost = document.querySelector('#calendly-embed');
const bookingStatus = document.querySelector('#booking-status');
calendarButton.addEventListener('click', () => {
  calendarButton.disabled = true;
  bookingStatus.textContent = 'Kalender wird geladen …';
  const showCalendar = () => {
    document.querySelector('#booking-start').hidden = true;
    calendarHost.hidden = false;
    calendarButton.setAttribute('aria-expanded', 'true');
    window.Calendly.initInlineWidget({ url: 'https://calendly.com/sepp-salisepp/30min?hide_event_type_details=1', parentElement: calendarHost, resize: true });
    const frame = calendarHost.querySelector('iframe');
    if (frame) frame.title = 'Kostenloses Kennenlerngespräch mit Sepp buchen';
    bookingStatus.textContent = 'Falls der Kalender nicht erscheint, öffne ihn über den Link unten.';
  };
  if (window.Calendly) { showCalendar(); return; }
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  script.onload = showCalendar;
  script.onerror = () => {
    bookingStatus.textContent = 'Der Kalender konnte hier nicht geladen werden. Bitte nutze den direkten Buchungslink unten.';
    calendarButton.disabled = false;
    script.remove();
  };
  document.head.appendChild(script);
});
document.querySelectorAll('a[href="#umfang"]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#umfang').open = true;
}));
