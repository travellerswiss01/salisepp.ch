(() => {
  'use strict';

  // Keep both projects readable when JavaScript is unavailable.
  const tablist = document.querySelector('#project-tabs');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    if (tabs.length && panels.every(Boolean)) {
      const selectTab = (index, focus = false) => {
        tabs.forEach((tab, position) => {
          const selected = position === index;
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
          panels[position].hidden = !selected;
        });
        if (focus) tabs[index].focus();
      };
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => selectTab(index));
        tab.addEventListener('keydown', event => {
          let destination;
          if (event.key === 'ArrowRight') destination = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft') destination = (index + tabs.length - 1) % tabs.length;
          if (event.key === 'Home') destination = 0;
          if (event.key === 'End') destination = tabs.length - 1;
          if (destination === undefined) return;
          event.preventDefault();
          selectTab(destination, true);
        });
      });
      const initial = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      selectTab(initial < 0 ? 0 : initial);
      tablist.hidden = false;
    }
  }

  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;
  const showAll = () => {
    observer?.disconnect();
    revealElements.forEach(element => {
      element.classList.remove('reveal-ready');
      element.classList.add('is-visible');
    });
  };
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    try {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });
      revealElements.forEach(element => {
        observer.observe(element);
        element.classList.add('reveal-ready');
        element.addEventListener('focusin', () => {
          element.classList.add('is-visible');
          observer.unobserve(element);
        }, { once: true });
      });
    } catch {
      showAll();
    }
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) showAll();
  });

  const progress = document.querySelector('#reading-progress');
  if (progress) {
    let scheduled = false;
    const updateProgress = () => {
      const root = document.documentElement;
      const distance = root.scrollHeight - root.clientHeight;
      const fraction = distance > 0 ? root.scrollTop / distance : 0;
      progress.style.transform = `scaleX(${Math.max(0, Math.min(1, fraction))})`;
      scheduled = false;
    };
    const scheduleProgress = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateProgress);
    };
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    document.addEventListener('toggle', scheduleProgress, true);
    updateProgress();
  }
})();
