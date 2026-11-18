(() => {
  'use strict';
  const section = document.querySelector('#cms-monitor-demo');
  if (!section) return;
  const title = section.querySelector('#bio-demo-title');
  const description = section.querySelector('#bio-demo-description');
  const image = section.querySelector('#bio-demo-hero-image');
  const titleInput = section.querySelector('#cms-monitor-title-input');
  const descriptionInput = section.querySelector('#cms-monitor-description-input');
  const feedback = section.querySelector('#cms-monitor-feedback');
  const photoInput = section.querySelector('#cms-monitor-file');
  const photoButtons = [...section.querySelectorAll('[data-bio-image]')];
  const tabs = [...section.querySelectorAll('.cms-monitor-editor-tabs [role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const initial = {
    title: title.textContent,
    description: description.textContent,
    image: image.getAttribute('src'),
    alt: image.alt
  };
  let objectUrl = null;
  let uploadRevision = 0;
  let announcementTimer = null;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function announce(message, error = false) {
    feedback.textContent = message;
    feedback.classList.toggle('is-error', error);
  }
  function releaseImage() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
  }
  function selectTab(index, focus = false) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectTab(next, true);
    });
  });
  function updateText() {
    title.textContent = titleInput.value;
    description.textContent = descriptionInput.value;
    clearTimeout(announcementTimer);
    announcementTimer = setTimeout(() => announce('Dein Text ist direkt in der Vorschau zu sehen.'), 500);
  }
  titleInput.addEventListener('input', updateText);
  descriptionInput.addEventListener('input', updateText);
  section.querySelectorAll('[data-bio-example]').forEach(button => {
    button.addEventListener('click', () => {
      titleInput.value = button.dataset.bioExample;
      updateText();
    });
  });
  section.querySelectorAll('[data-bio-edit]').forEach(button => {
    button.addEventListener('click', () => {
      const kind = button.dataset.bioEdit;
      selectTab(kind === 'image' ? 1 : 0);
      const target = kind === 'image' ? photoButtons[0] : kind === 'description' ? descriptionInput : titleInput;
      target.focus({ preventScroll: true });
      if (kind !== 'image') target.select();
      const rect = target.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  });
  photoButtons.forEach(button => {
    button.addEventListener('click', () => {
      uploadRevision++;
      releaseImage();
      image.src = button.dataset.bioImage;
      image.alt = button.dataset.bioAlt;
      photoInput.value = '';
      photoButtons.forEach(photo => photo.setAttribute('aria-pressed', String(photo === button)));
      announce('Das Bild in der Vorschau wurde ausgetauscht.');
    });
  });
  photoInput.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const accepted = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
    if (!accepted.has(file.type)) {
      announce('Bitte wähle ein Foto als JPG, PNG, WebP oder AVIF.', true);
      photoInput.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      announce('Dieses Bild ist zu gross. Bitte wähle ein Foto unter 8 MB.', true);
      photoInput.value = '';
      return;
    }
    const revision = ++uploadRevision;
    const nextUrl = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      if (revision !== uploadRevision) { URL.revokeObjectURL(nextUrl); return; }
      releaseImage();
      objectUrl = nextUrl;
      image.src = nextUrl;
      image.alt = 'Dein eigenes Foto in der Website-Vorschau';
      photoButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
      announce('Dein Foto ist in der Vorschau. Es wurde nicht hochgeladen.');
    };
    probe.onerror = () => {
      URL.revokeObjectURL(nextUrl);
      if (revision !== uploadRevision) return;
      photoInput.value = '';
      announce('Dieses Bild lässt sich nicht öffnen. Bitte wähle ein anderes Foto.', true);
    };
    probe.src = nextUrl;
  });
  section.querySelector('#cms-monitor-reset').addEventListener('click', () => {
    uploadRevision++;
    clearTimeout(announcementTimer);
    releaseImage();
    titleInput.value = initial.title;
    descriptionInput.value = initial.description;
    title.textContent = initial.title;
    description.textContent = initial.description;
    image.src = initial.image;
    image.alt = initial.alt;
    photoInput.value = '';
    photoButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.bioImage === initial.image)));
    selectTab(0);
    announce('Alles wieder wie am Anfang. Probier etwas Neues aus.');
  });
  window.addEventListener('pagehide', () => {
    clearTimeout(announcementTimer);
    releaseImage();
  });
  selectTab(0);
})();
