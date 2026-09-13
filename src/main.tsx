import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './mobile-menu-fix.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

function installMobileMenuFallback() {
  const button = document.querySelector<HTMLElement>('.menu-button');
  if (!button || document.getElementById('mv-mobile-menu-fallback')) return false;

  const menu = document.createElement('nav');
  menu.id = 'mv-mobile-menu-fallback';
  menu.setAttribute('aria-label', 'Mobile Navigation');
  menu.innerHTML = `
    <a href="/">Startseite</a>
    <a href="/meisterbetriebe">Meisterbetriebe</a>
    <a href="/branchen">Branchen</a>
    <a href="/news">News</a>
    <a href="/ueber-uns">Über uns</a>
    <a href="/fuer-betriebe">Für Betriebe</a>
    <a href="/faq">FAQ</a>
    <a href="/kontakt">Kontakt</a>
    <div class="mv-menu-auth">
      <a href="/anmelden">Anmelden</a>
      <a href="/registrieren">Registrieren</a>
    </div>
  `;
  document.body.appendChild(menu);

  const updateTop = () => {
    const header = button.closest('header') || button.parentElement;
    const rect = (header as HTMLElement | null)?.getBoundingClientRect();
    const top = Math.max(0, Math.round(rect?.bottom ?? 140));
    document.documentElement.style.setProperty('--mv-menu-top', `${top}px`);
  };

  const closeMenu = () => {
    menu.classList.remove('is-open');
    document.documentElement.classList.remove('mv-menu-lock');
    button.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = (event: Event) => {
    if (window.innerWidth > 760) return;
    event.preventDefault();
    event.stopPropagation();
    updateTop();
    const opening = !menu.classList.contains('is-open');
    menu.classList.toggle('is-open', opening);
    document.documentElement.classList.toggle('mv-menu-lock', opening);
    button.setAttribute('aria-expanded', opening ? 'true' : 'false');
  };

  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'mv-mobile-menu-fallback');
  button.addEventListener('click', toggleMenu, true);

  menu.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!menu.classList.contains('is-open')) return;
    const target = event.target as Node;
    if (!menu.contains(target) && !button.contains(target)) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) closeMenu();
    else if (menu.classList.contains('is-open')) updateTop();
  });

  document.querySelectorAll<HTMLElement>('.brand, .auth-logo').forEach((el) => {
    el.addEventListener('click', closeMenu);
  });

  return true;
}

let attempts = 0;
const menuInstaller = window.setInterval(() => {
  attempts += 1;
  if (installMobileMenuFallback() || attempts > 40) window.clearInterval(menuInstaller);
}, 100);
