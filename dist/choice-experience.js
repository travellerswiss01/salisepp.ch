(() => {
  'use strict';

  const finder = document.querySelector('.package-finder');
  const planButtons = [...document.querySelectorAll('[data-find-package]')];
  const plans = [...document.querySelectorAll('[data-plan]')];
  const finderFeedback = document.querySelector('#package-finder-feedback');
  const recommendations = {
    basic: 'Web Basic passt: dein Angebot, Bilder und Kontakt – kompakt auf einer Seite.',
    business: 'Web Business passt: bis zu fünf Seiten, damit jede Leistung ihren Platz bekommt.',
    premium: 'Web Premium passt: bis zu acht Seiten und eine Zusatzfunktion, die wir gemeinsam festlegen.'
  };
  if (finder && plans.length && finderFeedback) {
    finder.hidden = false;
    planButtons.forEach(button => button.addEventListener('click', () => {
      const key = button.dataset.findPackage;
      if (!recommendations[key]) return;
      planButtons.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
      plans.forEach(plan => {
        const selected = plan.dataset.plan === key;
        plan.classList.toggle('is-matched', selected);
        const label = plan.querySelector('.package-match');
        if (label) label.hidden = !selected;
      });
      finderFeedback.textContent = recommendations[key];
    }));
  }

  const frame = content => `<svg class="choice-scene" viewBox="0 0 144 90" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><ellipse cx="72" cy="81" rx="51" ry="5" fill="currentColor" opacity=".06"/>${content}</svg>`;
  const windowShape = '<rect x="20" y="15" width="91" height="60" rx="6" fill="white" stroke="currentColor" stroke-width="1.5"/><path d="M20 29H111" stroke="currentColor" stroke-opacity=".2"/><circle cx="29" cy="22" r="1.8" fill="currentColor"/><circle cx="36" cy="22" r="1.8" fill="currentColor" opacity=".35"/>';
  const icons = {
    'Meine erste Website': frame(`<g class="scene-main">${windowShape}<rect x="31" y="39" width="32" height="4" rx="2" fill="currentColor"/><path d="M31 49H60M31 55H51" stroke="currentColor" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"/><rect x="73" y="39" width="26" height="25" rx="4" fill="currentColor" opacity=".12"/></g><g class="scene-accent"><rect x="95" y="54" width="30" height="28" rx="8" fill="currentColor"/><path d="M103 68h14m-7-7v14" stroke="white" stroke-width="2" stroke-linecap="round"/></g>`),
    'Meine Website erneuern': frame(`<g class="scene-main">${windowShape}<path d="M31 41H65M31 49H58M31 57H47" stroke="currentColor" stroke-opacity=".4" stroke-width="3" stroke-linecap="round"/><rect x="76" y="39" width="24" height="24" rx="5" fill="currentColor" opacity=".12"/></g><g class="scene-accent"><circle cx="109" cy="65" r="18" fill="currentColor"/><path d="M118 62a10 10 0 0 0-17-4l-2 2m0-6v6h6M100 68a10 10 0 0 0 17 4l2-2m0 6v-6h-6" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`),
    'Einen Onlineshop': frame('<g class="scene-main"><path d="M31 36H111V76H31V36Z" fill="white" stroke="currentColor" stroke-width="1.5"/><path d="m28 35 7-17h72l7 17" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M28 35c0 11 17 11 17 0 0 11 17 11 17 0 0 11 17 11 17 0 0 11 17 11 17 0 0 11 18 11 18 0" fill="white" stroke="currentColor" stroke-width="1.5"/><rect x="42" y="49" width="25" height="17" rx="3" fill="currentColor" opacity=".13"/><path d="M81 76V50H101V76" stroke="currentColor" stroke-width="1.5"/></g><g class="scene-accent"><path d="M101 60h24l3 23H98l3-23Z" fill="currentColor"/><path d="M107 61v-4a6 6 0 0 1 12 0v4" stroke="currentColor" stroke-width="1.5"/></g>'),
    'Ich brauche eine Empfehlung': frame('<g class="scene-main"><circle cx="66" cy="46" r="31" fill="white" stroke="currentColor" stroke-width="1.5"/><circle cx="66" cy="46" r="23" stroke="currentColor" stroke-opacity=".18"/><path d="M66 20v5M66 67v5M40 46h5M87 46h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m53 59 7-19 19-7-7 19-19 7Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="1.5"/><circle cx="66" cy="46" r="3" fill="currentColor"/></g><g class="scene-accent"><rect x="91" y="48" width="32" height="26" rx="8" fill="currentColor"/><path d="m98 73-3 7 13-7" fill="currentColor"/><circle cx="100" cy="61" r="1.8" fill="white"/><circle cx="107" cy="61" r="1.8" fill="white"/><circle cx="114" cy="61" r="1.8" fill="white"/></g>'),
    'Mehr Anfragen erhalten': frame('<g class="scene-main"><path d="M29 34h82v40H29V34Z" fill="white" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="m29 35 41 28 41-28" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="m29 74 25-24m57 24L86 50" stroke="currentColor" stroke-opacity=".3" stroke-width="1.5"/></g><g class="scene-accent"><rect x="76" y="11" width="45" height="30" rx="8" fill="currentColor"/><path d="m84 40-3 8 15-8" fill="currentColor"/><path d="M87 21h23M87 28h15" stroke="white" stroke-width="2" stroke-linecap="round"/></g>'),
    'Buchungen ermöglichen': frame('<g class="scene-main"><rect x="31" y="18" width="72" height="60" rx="7" fill="white" stroke="currentColor" stroke-width="1.5"/><path d="M31 35h72M47 12v14M87 12v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M45 47h4M65 47h4M85 47h4M45 61h4M65 61h4" stroke="currentColor" stroke-opacity=".3" stroke-width="5" stroke-linecap="round"/></g><g class="scene-accent"><circle cx="103" cy="66" r="18" fill="currentColor"/><path d="m95 65 6 6 11-13" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>'),
    'Produkte verkaufen': frame('<g class="scene-main"><path d="M39 31h58l6 46H33l6-46Z" fill="white" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M54 35V23a14 14 0 0 1 28 0v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m57 54 8 8 17-20" stroke="currentColor" stroke-opacity=".45" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><g class="scene-accent"><rect x="87" y="51" width="37" height="25" rx="5" fill="currentColor"/><path d="M87 59h37M94 69h8" stroke="white" stroke-width="2" stroke-linecap="round"/></g>'),
    'Mein Angebot überzeugend zeigen': frame(`<g class="scene-main">${windowShape}<rect x="30" y="39" width="21" height="24" rx="3" fill="currentColor" opacity=".1"/><rect x="57" y="39" width="21" height="24" rx="3" fill="currentColor" opacity=".18"/><rect x="84" y="39" width="16" height="24" rx="3" fill="currentColor" opacity=".3"/><path d="M30 68h17M57 68h17M84 68h14" stroke="currentColor" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/></g><g class="scene-accent"><path d="m111 48 5 12 13 2-10 9 3 13-11-7-11 7 3-13-10-9 13-2 5-12Z" fill="currentColor"/><path d="m106 66 4 4 7-8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></g>`)
  };
  const descriptions = {
    'Meine erste Website': 'Ein guter Start für deinen Betrieb',
    'Meine Website erneuern': 'Frischer Auftritt, einfach bedienbar',
    'Einen Onlineshop': 'Deine Produkte online anbieten',
    'Ich brauche eine Empfehlung': 'Wir finden gemeinsam deinen Weg',
    'Mehr Anfragen erhalten': 'Interessenten werden zu Kontakten',
    'Buchungen ermöglichen': 'Termine direkt online vereinbaren',
    'Produkte verkaufen': 'Vom Entdecken zum Bestellen',
    'Mein Angebot überzeugend zeigen': 'Deine Stärken sichtbar machen'
  };
  const requestForm = document.querySelector('#contact-form');
  [0, 1].forEach(stepIndex => {
    const step = document.querySelector(`.wizard-step[data-step="${stepIndex}"]`);
    if (!step || step.dataset.illustrated) return;
    step.dataset.illustrated = 'true';
    const inputs = [...step.querySelectorAll('.choice-card input')];
    inputs.forEach((input, index) => {
      const card = input.closest('.choice-card');
      const symbol = card.querySelector('.choice-symbol');
      if (!symbol || !icons[input.value]) return;
      card.classList.add('illustrated-choice');
      symbol.innerHTML = icons[input.value];
      const description = document.createElement('small');
      description.className = 'choice-explanation';
      description.id = `choice-explanation-${stepIndex}-${index}`;
      description.textContent = descriptions[input.value];
      card.append(description);
      input.setAttribute('aria-label', input.value);
      input.setAttribute('aria-describedby', description.id);
    });
    const feedback = document.createElement('p');
    feedback.className = 'choice-live-feedback';
    feedback.setAttribute('role', 'status');
    step.append(feedback);
    const showSelection = () => {
      const selected = inputs.filter(input => input.checked);
      feedback.textContent = selected.length
        ? stepIndex === 0 ? `Dein Vorhaben: ${selected[0].value}` : `${selected.length} ${selected.length === 1 ? 'Ziel gewählt' : 'Ziele gewählt'} · ${selected.map(input => input.value).join(' · ')}`
        : stepIndex === 0 ? 'Ein Klick auf die passende Karte genügt.' : 'Du kannst mehrere Ziele kombinieren.';
    };
    inputs.forEach(input => input.addEventListener('change', showSelection));
    requestForm?.addEventListener('reset', () => requestAnimationFrame(showSelection));
    showSelection();
  });
})();
