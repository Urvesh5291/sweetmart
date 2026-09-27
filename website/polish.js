/* Progressive interaction refinements; no additional runtime dependencies. */
(() => {
  'use strict';
  const drawer = document.getElementById('cart-drawer');
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  const floatingCart = document.getElementById('cart-floating-bar');
  const focusable = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
  let activePanel = null;
  let returnFocus = null;
  const background = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('header'), document.getElementById('fab-wa'), floatingCart].filter(Boolean);
  const available = panel => [...panel.querySelectorAll(focusable)].filter(el => el.getClientRects().length && !el.closest('[inert]'));
  function syncPanels() {
    const next = drawer.classList.contains('open') ? drawer : menu.classList.contains('open') ? menu : null;
    if (next === activePanel) return;
    document.body.classList.toggle('cart-open', next === drawer);
    document.body.classList.toggle('mobile-menu-open', next === menu);
    background.forEach(el => { el.inert = false; });
    if (next) {
      if (!activePanel) returnFocus = document.activeElement;
      activePanel = next;
      if (next === drawer) background.forEach(el => { el.inert = true; });
      drawer.inert = next !== drawer;
      // Chromium may defer inert-tree updates until the next rendering cycle.
      const focusPanel = (attempt = 0) => {
        if (activePanel !== next || next.contains(document.activeElement)) return;
        available(next)[0]?.focus({ preventScroll: true });
        if (!next.contains(document.activeElement) && attempt < 8) {
          setTimeout(() => focusPanel(attempt + 1), 50);
        }
      };
      requestAnimationFrame(() => focusPanel());
    } else {
      activePanel = null;
      drawer.inert = true;
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    }
  }
  // Use the visible viewport: mobile browser chrome and keyboards change its height.
  const viewport = window.visualViewport;
  let viewportFrame = 0;
  function updateViewport() {
    viewportFrame = 0;
    const visibleHeight = viewport?.height || window.innerHeight;
    const visibleTop = viewport?.offsetTop || 0;
    const headerBottom = document.getElementById('site-header').getBoundingClientRect().bottom;
    document.documentElement.style.setProperty('--visual-height', visibleHeight + 'px');
    document.documentElement.style.setProperty('--visual-top', visibleTop + 'px');
    document.documentElement.style.setProperty('--mobile-menu-height', Math.max(0, visibleHeight + visibleTop - headerBottom) + 'px');
  }
  function scheduleViewport() {
    if (!viewportFrame) viewportFrame = requestAnimationFrame(updateViewport);
  }
  window.addEventListener('resize', scheduleViewport, { passive:true });
  window.addEventListener('scroll', scheduleViewport, { passive:true });
  viewport?.addEventListener('resize', scheduleViewport, { passive:true });
  viewport?.addEventListener('scroll', scheduleViewport, { passive:true });
  new ResizeObserver(scheduleViewport).observe(document.getElementById('site-header'));
  const announcement = document.getElementById('announce-bar');
  if (announcement) new ResizeObserver(scheduleViewport).observe(announcement);
  updateViewport();
  drawer.inert = !drawer.classList.contains('open');
  const panelObserver = new MutationObserver(syncPanels);
  [drawer, menu].forEach(el => panelObserver.observe(el, { attributes:true, attributeFilter:['class'] }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    if (event.key !== 'Tab' || !activePanel) return;
    const items = available(activePanel);
    if (activePanel === menu) items.unshift(hamburger);
    const first = items[0], last = items.at(-1);
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  const desktopQuery = matchMedia('(min-width:1025px)');
  desktopQuery.addEventListener('change', e => { if (e.matches) closeMenu(); });
  floatingCart.setAttribute('role', 'button');
  floatingCart.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCart(); }
  });
  function syncCartVisibility() {
    const count = Number(document.getElementById('cart-badge').textContent) || 0;
    document.body.classList.toggle('has-cart', count > 0);
    floatingCart.tabIndex = count > 0 ? 0 : -1;
    floatingCart.setAttribute('aria-hidden', String(count === 0));
  }
  new MutationObserver(syncCartVisibility).observe(document.getElementById('cart-badge'), { childList:true });
  syncCartVisibility();
  const toast = document.getElementById('cart-toast');
  toast?.setAttribute('role', 'status');
  toast?.setAttribute('aria-live', 'polite');
  function syncLanguage() {
    const gu = document.documentElement.dataset.lang === 'gu';
    document.getElementById('lang-toggle').setAttribute('aria-label', gu ? 'Switch to English' : 'ગુજરાતીમાં જુઓ');
    document.getElementById('f-message').placeholder = gu ? 'તમારો ઓર્ડર કે પ્રશ્ન...' : 'Your order or question...';
    const fields = {
      'cart-cust-name': gu ? 'તમારું પૂરું નામ *' : 'Full name *',
      'cart-cust-phone': gu ? 'મોબાઇલ / WhatsApp નંબર *' : 'Mobile / WhatsApp number *',
      'cart-cust-address': gu ? 'પૂરું ડિલિવરી સરનામું *' : 'Full delivery address *',
      'cart-cust-notes': gu ? 'ઓર્ડર નોંધ (વૈકલ્પિક)' : 'Order notes (optional)'
    };
    Object.entries(fields).forEach(([id, label]) => {
      const field = document.getElementById(id);
      field.placeholder = label;
      field.setAttribute('aria-label', label);
    });
    document.getElementById('cart-cust-city').setAttribute('aria-label', gu ? 'ડિલિવરી શહેર' : 'Delivery city');
    const select = document.getElementById('f-occasion');
    const labels = gu ? ['પ્રસંગ પસંદ કરો', 'દિવાળી', 'લગ્ન', 'કોર્પોરેટ', 'સામાન્ય ઓર્ડર'] : ['Select an occasion', 'Diwali', 'Wedding', 'Corporate', 'General Order'];
    [...select.options].forEach((option, i) => { option.textContent = labels[i]; });

  }
  new MutationObserver(syncLanguage).observe(document.documentElement, { attributes:true, attributeFilter:['data-lang'] });
  syncLanguage();
  // Active navigation follows native scrolling; scrolling itself is never intercepted.
  const navLinks = [...document.querySelectorAll('.main-nav .nav-link')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin:'-15% 0px -60% 0px', threshold:0 });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
  }
})();


