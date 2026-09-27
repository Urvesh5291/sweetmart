/* ================================================================
   PATEL SWEET MART — script.js
   Language switcher, mobile menu, scroll effects, enquiry form
   ================================================================ */

'use strict';

/* ---- LANGUAGE SWITCHER ---- */
let currentLang = localStorage.getItem('psm-lang') || 'gu';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.lang = lang === 'gu' ? 'gu-IN' : 'en-IN';
  localStorage.setItem('psm-lang', lang);

  // Update footer lang buttons
  const btnGu = document.getElementById('btn-gu');
  const btnEn = document.getElementById('btn-en');
  if (btnGu && btnEn) {
    btnGu.classList.toggle('active-lang', lang === 'gu');
    btnEn.classList.toggle('active-lang', lang === 'en');
  }

  // Update cart badges and open drawer items if defined
  if (typeof updateCartBadges === 'function') {
    updateCartBadges();
  }
}

function toggleLang() {
  applyLang(currentLang === 'gu' ? 'en' : 'gu');
}

function setLang(lang) {
  applyLang(lang);
}

// Language is applied by initApp after cart state has initialized.

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  if (hamburger) {
    hamburger.setAttribute('aria-expanded', menuOpen);
    hamburger.classList.toggle('open', menuOpen);
  }
  if (mobileMenu) {
    mobileMenu.setAttribute('aria-hidden', !menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
  }
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  if (hamburger) { hamburger.setAttribute('aria-expanded', false); hamburger.classList.remove('open'); }
  if (mobileMenu) { mobileMenu.setAttribute('aria-hidden', true); mobileMenu.classList.remove('open'); }
  document.body.style.overflow = '';
}

// Close menu on outside click
document.addEventListener('click', function(e) {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

/* ---- STICKY HEADER SHADOW ---- */
const header = document.getElementById('site-header');
window.addEventListener('scroll', function() {
  if (!header) return;
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 4px 24px rgba(23,63,138,0.14)';
  } else {
    header.style.boxShadow = '0 2px 20px rgba(23,63,138,0.06)';
  }
}, { passive: true });

/* ---- FAB VISIBILITY ---- */
const fab = document.getElementById('fab-wa');
window.addEventListener('scroll', function() {
  if (!fab) return;
  if (window.scrollY > 300) {
    fab.style.opacity = '1';
    fab.style.transform = 'scale(1)';
  } else {
    fab.style.opacity = '0.5';
    fab.style.transform = 'scale(0.92)';
  }
}, { passive: true });

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const revealEls = document.querySelectorAll(
    '.product-card, .cat-card, .store-card, .milestone, .heritage-img-wrap, .gifting-img-col, .trust-item'
  );
  revealEls.forEach(function(el) {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function(el) {
    observer.observe(el);
  });
}

/* ---- ENQUIRY FORM — WhatsApp Submit ---- */
function submitEnquiry(event) {
  event.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const occasion = document.getElementById('f-occasion').value;
  const message = document.getElementById('f-message').value.trim();
  const btn = document.getElementById('submit-btn');

  if (!name) {
    document.getElementById('f-name').focus();
    return;
  }
  if (!phone) {
    document.getElementById('f-phone').focus();
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '&#9203; Sending...';

  const lines = [
    'Namaste, Patel Sweet Mart,',
    '',
    '*Name:* ' + name,
    '*Phone:* ' + phone,
    occasion ? '*Occasion:* ' + occasion : '',
    message ? '*Message:* ' + message : '',
    '',
    'Please confirm my enquiry. Thank you!'
  ].filter(function(l, i) { return l !== '' || i === 1 || i === 7; }).join('\n');

  const encoded = encodeURIComponent(lines);
  const waUrl = 'https://wa.me/919173565466?text=' + encoded;

  {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    btn.disabled = false;
    btn.innerHTML = currentLang === 'gu'
      ? '&#128172; WhatsApp \u0AAA\u0AB0 \u0AAE\u0ACB\u0A95\u0AB2\u0ACB'
      : '&#128172; Send via WhatsApp';
    // Keep the entered details available if the user returns from WhatsApp.
  }
}

/* ================================================================
   SHOPPING CART & WEIGHT CUSTOMIZATION SYSTEM
   Bilingual, LocalStorage Persisted, Dynamic Pricing, WhatsApp Checkout
   ================================================================ */

const PRODUCTS = {
  toprapak: { id: 'toprapak', nameGu: 'ટોપરાપાક', nameEn: 'Toprapak', basePrice: 500, img: 'images/product-toprapak.webp' },
  mohanthal: { id: 'mohanthal', nameGu: 'મોહનથાળ', nameEn: 'Mohanthal', basePrice: 480, img: 'images/product-mohanthal.webp' },
  penda: { id: 'penda', nameGu: 'માવા પેંડા', nameEn: 'Mava Penda', basePrice: 520, img: 'images/product-penda.webp' },
  ladva: { id: 'ladva', nameGu: 'સ્પેશિયલ લાડવા', nameEn: 'Special Ladva', basePrice: 400, img: 'images/product-ladva.webp' },
  jalebi: { id: 'jalebi', nameGu: 'ગરમ જલેબી', nameEn: 'Hot Jalebi', basePrice: 380, img: 'images/product-jalebi.webp' },
  feni: { id: 'feni', nameGu: 'સ્વાદિષ્ટ ફેણી', nameEn: 'Feni', basePrice: 450, img: 'images/product-feni.webp' },
  ganthiya: { id: 'ganthiya', nameGu: 'ચટાકેદાર ગાંઠિયા', nameEn: 'Ganthiya', basePrice: 340, img: 'images/product-ganthiya.webp' },
  chorafari: { id: 'chorafari', nameGu: 'ચોરાફળી', nameEn: 'Chorafari', basePrice: 360, img: 'images/product-chorafari.webp' },
  chavanu: { id: 'chavanu', nameGu: 'મિક્સ ચવાણું', nameEn: 'Mix Chavanu', basePrice: 350, img: 'images/product-chavanu.webp' },
  farali: { id: 'farali', nameGu: 'ફરાળી નાસ્તો', nameEn: 'Farali Snacks', basePrice: 400, img: 'images/product-farali.webp' },
  hamper: { id: 'hamper', nameGu: 'પ્રીમિયમ ગિફ્ટ બોક્સ', nameEn: 'Royal Gift Box', basePrice: 850, img: 'images/category-gifting.webp', isHamper: true }
};

// Load custom products added via Admin Panel
try {
  const customCatalog = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
  Object.keys(customCatalog).forEach(id => {
    PRODUCTS[id] = customCatalog[id];
  });
} catch (e) {}

// Apply any updated rates configured in Admin Panel or Bulk Pricing
try {
  const customPrices = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');
  Object.keys(customPrices).forEach(id => {
    if (PRODUCTS[id] && customPrices[id]) {
      PRODUCTS[id].basePrice = customPrices[id];
    }
  });
} catch (e) {}

// Track current weight selection per product
const selectedWeights = {};
Object.keys(PRODUCTS).forEach(id => {
  if (id === 'hamper') {
    selectedWeights[id] = { weightKey: '1kg', multiplier: 1, label: '1kg Royal Box', price: PRODUCTS[id].basePrice || 850 };
  } else {
    selectedWeights[id] = { weightKey: '1kg', multiplier: 1, label: '1kg', price: PRODUCTS[id].basePrice };
  }
});

let cart = [];
try {
  const savedCart = localStorage.getItem('psm-cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
} catch (e) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem('psm-cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
  updateCartBadges();
  renderCartBody();
}

function updateCartBadges() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

  // Header Badge
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.classList.remove('bump');
    void badge.offsetWidth; // Trigger reflow
    if (totalItems > 0) badge.classList.add('bump');
  }

  // Mobile Menu Badge
  const mobileBadge = document.getElementById('mobile-cart-badge');
  if (mobileBadge) {
    mobileBadge.textContent = totalItems === 1 ? '1 item' : totalItems + ' items';
  }

  // Floating Bar
  const floatingBar = document.getElementById('cart-floating-bar');
  const floatingCount = document.getElementById('cart-floating-count');
  const floatingTotal = document.getElementById('cart-floating-total');
  if (floatingBar && floatingCount && floatingTotal) {
    floatingCount.textContent = totalItems;
    floatingTotal.textContent = '₹' + totalPrice.toLocaleString('en-IN');
    floatingBar.classList.toggle('visible', totalItems > 0);
  }

  // Cart Header Counter
  const cartCounter = document.getElementById('cart-items-counter');
  if (cartCounter) {
    cartCounter.textContent = currentLang === 'gu'
      ? totalItems + ' વસ્તુઓ'
      : totalItems + (totalItems === 1 ? ' item' : ' items');
  }

  // Subtotal in drawer
  const subtotalVal = document.getElementById('cart-subtotal-val');
  if (subtotalVal) {
    subtotalVal.textContent = '₹' + totalPrice.toLocaleString('en-IN');
  }

  // Enable/Disable checkout button
  const checkoutBtn = document.getElementById('btn-cart-checkout');
  if (checkoutBtn) {
    checkoutBtn.disabled = totalItems === 0;
  }
}

/* ---- WEIGHT FORMATTING & SELECTION LOGIC ---- */
function formatWeightLabel(valKg) {
  const rounded = Math.round(valKg * 1000) / 1000;
  if (rounded === 1.25) {
    return { gu: '1.25kg (સવા કિલો)', en: '1.25kg (Sawa Kilo)', key: '1.25kg' };
  }
  if (rounded === 1.5) {
    return { gu: '1.5kg (દોઢ કિલો)', en: '1.5kg (Dodh Kilo)', key: '1.5kg' };
  }
  if (rounded === 1.75) {
    return { gu: '1.75kg (પોણા બે કિલો)', en: '1.75kg', key: '1.75kg' };
  }
  if (rounded === 2.25) {
    return { gu: '2.25kg (સવા બે કિલો)', en: '2.25kg', key: '2.25kg' };
  }
  if (rounded === 2.5) {
    return { gu: '2.5kg (અઢી કિલો)', en: '2.5kg (Adhi Kilo)', key: '2.5kg' };
  }
  if (rounded === 0.75) {
    return { gu: '750g (પોણો કિલો)', en: '750g', key: '750g' };
  }
  if (rounded === 0.25) {
    return { gu: '250g (પા કિલો)', en: '250g', key: '250g' };
  }
  if (rounded === 0.5) {
    return { gu: '500g (અડધો કિલો)', en: '500g', key: '500g' };
  }
  if (rounded < 1) {
    const g = Math.round(rounded * 1000);
    return { gu: `${g}g`, en: `${g}g`, key: `${g}g` };
  }
  return { gu: `${rounded}kg`, en: `${rounded}kg`, key: `${rounded}kg` };
}

function selectProductWeight(productId, weightKey, multiplier, label) {
  const prod = PRODUCTS[productId];
  if (!prod) return;

  const calculatedPrice = Math.round(prod.basePrice * multiplier);
  const fmt = formatWeightLabel(multiplier);
  selectedWeights[productId] = {
    weightKey: weightKey,
    multiplier: multiplier,
    label: label || (currentLang === 'gu' ? fmt.gu : fmt.en),
    labelGu: fmt.gu,
    labelEn: fmt.en,
    price: calculatedPrice
  };

  // Update pills UI
  const container = document.getElementById('weight-ctrl-' + productId);
  if (container) {
    const pills = container.querySelectorAll('.weight-pill');
    pills.forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-weight') === weightKey);
    });
    // Hide custom input row if open
    const customRow = document.getElementById('custom-row-' + productId);
    if (customRow && weightKey !== 'custom') {
      customRow.style.display = 'none';
    }
  }

  // Update card price display
  const priceEl = document.getElementById('price-' + productId);
  const unitEl = document.getElementById('unit-' + productId);
  if (priceEl) {
    priceEl.textContent = '₹' + calculatedPrice.toLocaleString('en-IN');
  }
  if (unitEl) {
    unitEl.textContent = '/ ' + (label || weightKey);
  }
}

function toggleCustomWeight(productId) {
  const customRow = document.getElementById('custom-row-' + productId);
  const container = document.getElementById('weight-ctrl-' + productId);
  if (!customRow || !container) return;

  const isVisible = customRow.style.display !== 'none';
  if (isVisible) {
    customRow.style.display = 'none';
    const customPill = container.querySelector('.weight-pill-custom');
    if (customPill) customPill.classList.remove('active');
  } else {
    customRow.style.display = 'flex';
    // Highlight custom pill
    const pills = container.querySelectorAll('.weight-pill');
    pills.forEach(p => p.classList.remove('active'));
    const customPill = container.querySelector('.weight-pill-custom');
    if (customPill) customPill.classList.add('active');

    const input = document.getElementById('custom-val-' + productId);
    let currentVal = 1.00;
    if (input) {
      const parsed = parseFloat(input.value);
      if (!isNaN(parsed) && parsed > 0) {
        currentVal = parsed;
      } else {
        input.value = '1.00';
      }
    }
    applyCustomWeight(productId, currentVal);
  }
}

function stepCustomWeight(productId, delta) {
  const input = document.getElementById('custom-val-' + productId);
  let currentVal = 1.00;
  if (input) {
    const parsed = parseFloat(input.value);
    if (!isNaN(parsed) && parsed > 0) {
      currentVal = parsed;
    }
  }
  let newVal = Math.round((currentVal + delta) * 100) / 100;
  if (newVal < 0.25) newVal = 0.25; // minimum 250g
  if (newVal > 50.00) newVal = 50.00;

  if (input) {
    input.value = (newVal % 1 === 0) ? newVal.toFixed(1) : newVal.toFixed(2);
  }
  applyCustomWeight(productId, newVal);
}

function onCustomInput(productId) {
  applyCustomWeight(productId);
}

function setQuickCustom(productId, val) {
  const input = document.getElementById('custom-val-' + productId);
  if (input) {
    input.value = val;
  }
  applyCustomWeight(productId, val);
}

function applyCustomWeight(productId, directVal) {
  const prod = PRODUCTS[productId];
  if (!prod) return;

  let val = directVal;
  const input = document.getElementById('custom-val-' + productId);

  if (val === undefined || val === null) {
    if (!input) return;
    let rawStr = String(input.value).trim().toLowerCase();
    if (!rawStr) return;

    let isGrams = false;
    if (rawStr.endsWith('kg') || rawStr.endsWith('kgs') || rawStr.endsWith('kilo')) {
      rawStr = rawStr.replace(/[^0-9.]/g, '');
    } else if (rawStr.endsWith('gm') || rawStr.endsWith('gms') || rawStr.endsWith('g') || rawStr.endsWith('gram')) {
      isGrams = true;
      rawStr = rawStr.replace(/[^0-9.]/g, '');
    }
    val = parseFloat(rawStr);
    if (isNaN(val) || val <= 0) return;

    // If entered in grams or number >= 50, convert to kg (e.g. 1250g -> 1.25kg)
    if (isGrams || val >= 50) {
      val = val / 1000;
    }
  }

  val = Math.round(val * 1000) / 1000;

  const fmt = formatWeightLabel(val);
  const displayLabel = currentLang === 'gu' ? fmt.gu : fmt.en;
  const calculatedPrice = Math.round(prod.basePrice * val);

  selectedWeights[productId] = {
    weightKey: 'custom_' + val,
    multiplier: val,
    label: displayLabel,
    labelGu: fmt.gu,
    labelEn: fmt.en,
    price: calculatedPrice
  };

  const priceEl = document.getElementById('price-' + productId);
  const unitEl = document.getElementById('unit-' + productId);
  if (priceEl) priceEl.textContent = '₹' + calculatedPrice.toLocaleString('en-IN');
  if (unitEl) unitEl.textContent = '/ ' + displayLabel;

  // Update stepper badge feedback
  const badge = document.getElementById('custom-badge-' + productId);
  if (badge) {
    badge.textContent = displayLabel;
  }

  // Highlight custom pill
  const container = document.getElementById('weight-ctrl-' + productId);
  if (container) {
    const pills = container.querySelectorAll('.weight-pill');
    pills.forEach(p => {
      const isCustomPill = p.getAttribute('data-weight') === 'custom';
      p.classList.toggle('active', isCustomPill);
    });
  }
}

function applyCustomWeightAndAdd(productId) {
  applyCustomWeight(productId);
  addCurrentProductToCart(productId);
}

function selectHamperBox(weightKey, price, boxTitle) {
  selectedWeights['hamper'] = {
    weightKey: weightKey,
    multiplier: 1,
    label: boxTitle,
    price: price
  };

  const pills = document.querySelectorAll('#weights-hamper .weight-pill');
  pills.forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-weight') === weightKey);
  });

  const btnTextGu = document.getElementById('btn-text-hamper');
  const btnTextEn = document.getElementById('btn-text-hamper-en');
  if (btnTextGu) btnTextGu.textContent = `+ ગિફ્ટ બોક્સ કાર્ટ (₹${price})`;
  if (btnTextEn) btnTextEn.textContent = `+ Add Gift Box (₹${price})`;
}

/* ---- ADD TO CART (WITH WEIGHT) ---- */
function addCurrentProductToCart(productId) {
  const prod = PRODUCTS[productId];
  if (!prod) return;

  const sel = selectedWeights[productId] || { weightKey: '1kg', multiplier: 1, label: '1kg', price: prod.basePrice };
  const cartItemId = `${productId}_${sel.weightKey}`;

  const existing = cart.find(item => item.id === cartItemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: cartItemId,
      productId: productId,
      nameGu: prod.nameGu,
      nameEn: prod.nameEn,
      weightKey: sel.weightKey,
      weightLabel: sel.label,
      weightLabelGu: sel.labelGu || sel.label,
      weightLabelEn: sel.labelEn || sel.label,
      multiplier: sel.multiplier,
      basePrice: prod.basePrice,
      price: sel.price,
      img: prod.img,
      qty: 1
    });
  }

  saveCart();

  // Button animation
  const btn = document.getElementById('btn-add-' + productId);
  if (btn) {
    btn.classList.add('added');
    const origHtml = btn.innerHTML;
    btn.innerHTML = '<span>&#10003;</span> <span class="btn-cart-text">' + (currentLang === 'gu' ? 'ઉમેરાયું' : 'Added') + '</span>';
    setTimeout(() => {
      btn.innerHTML = origHtml;
      btn.classList.remove('added');
    }, 1200);
  }

  // Toast
  const displayName = currentLang === 'gu' ? prod.nameGu : prod.nameEn;
  const msg = currentLang === 'gu'
    ? `&#128722; <strong>${displayName} (${sel.label})</strong> કાર્ટમાં ઉમેરાયું! <button class="cart-toast-btn" onclick="openCart()">કાર્ટ જુઓ &rarr;</button>`
    : `&#128722; <strong>${displayName} (${sel.label})</strong> added to cart! <button class="cart-toast-btn" onclick="openCart()">View Cart &rarr;</button>`;
  showToast(msg);
}

// Fallback for direct addToCart calls
function addToCart(id, nameGu, nameEn, price, img, unit) {
  const sel = selectedWeights[id] || { weightKey: '1kg', multiplier: 1, label: unit || '1kg', price: price };
  const cartItemId = `${id}_${sel.weightKey}`;
  const existing = cart.find(item => item.id === cartItemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: cartItemId,
      productId: id,
      nameGu: nameGu,
      nameEn: nameEn,
      weightKey: sel.weightKey,
      weightLabel: sel.label || unit || '1kg',
      price: sel.price || price,
      basePrice: price,
      img: img,
      qty: 1
    });
  }
  saveCart();
  const displayName = currentLang === 'gu' ? nameGu : nameEn;
  showToast(`&#128722; <strong>${displayName}</strong> added! <button class="cart-toast-btn" onclick="openCart()">View &rarr;</button>`);
}

function updateCartQty(id, delta) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  showToast(currentLang === 'gu' ? 'વસ્તુ કાર્ટમાંથી હટાવી' : 'Item removed from cart');
}

function openCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderCartBody();
    restoreCustomerInfo();
  }
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

function renderCartBody() {
  const container = document.getElementById('cart-body');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">&#128722;</div>
        <h4 class="cart-empty-title">
          <span class="gu-text">તમારું કાર્ટ ખાલી છે</span>
          <span class="en-text" style="display:none">Your cart is empty</span>
        </h4>
        <p class="cart-empty-desc">
          <span class="gu-text">શુદ્ધ ઘીની તાજી મીઠાઈ અને સ્વાદિષ્ટ નમકીન કાર્ટમાં ઉમેરો.</span>
          <span class="en-text" style="display:none">Add pure desi ghee sweets and crispy namkeen to get started.</span>
        </p>
        <button class="btn-browse-sweets" onclick="closeCart();window.location.hash='mithai'">
          <span class="gu-text">મીઠાઈ જુઓ &rarr;</span>
          <span class="en-text" style="display:none">Browse Mithai &rarr;</span>
        </button>
      </div>
    `;
    applyLang(currentLang);
    return;
  }

  let itemsHtml = '<div class="cart-items-list">';
  cart.forEach(item => {
    const itemTotal = item.qty * item.price;
    itemsHtml += `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.nameEn}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-name">
            <span class="gu-text">${item.nameGu}</span>
            <span class="en-text" style="display:none">${item.nameEn}</span>
          </div>
          <div class="cart-item-weight-badge">
            &#128230; <strong><span class="gu-text">${item.weightLabelGu || item.weightLabel}</span><span class="en-text" style="display:none">${item.weightLabelEn || item.weightLabel}</span></strong>
            <span class="cart-item-rate">(₹${item.price.toLocaleString('en-IN')})</span>
          </div>
          <div class="cart-item-qty-row">
            <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">&#8722;</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button class="cart-qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase quantity">&#43;</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</span>
          <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item" title="Remove">&#128465;</button>
        </div>
      </div>
    `;
  });
  itemsHtml += '</div>';

  container.innerHTML = itemsHtml;
  applyLang(currentLang);
}

function restoreCustomerInfo() {
  try {
    const saved = localStorage.getItem('psm-cust');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name && document.getElementById('cart-cust-name')) {
        document.getElementById('cart-cust-name').value = data.name;
      }
      if (data.phone && document.getElementById('cart-cust-phone')) {
        document.getElementById('cart-cust-phone').value = data.phone;
      }
      if (data.city && document.getElementById('cart-cust-city')) {
        document.getElementById('cart-cust-city').value = data.city;
      }
      if (data.address && document.getElementById('cart-cust-address')) {
        document.getElementById('cart-cust-address').value = data.address;
      }
    }
  } catch (e) {}
}

let toastTimeout = null;
function showToast(html, duration = 3500) {
  const toast = document.getElementById('cart-toast');
  if (!toast) return;

  toast.innerHTML = html;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* Close cart on Escape key */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeCart();
  }
});

/* ---- CONFIRM AND SEND WHATSAPP ORDER ---- */
function confirmAndSendWhatsAppOrder() {
  if (cart.length === 0) {
    showToast(currentLang === 'gu' ? 'કાર્ટ ખાલી છે!' : 'Your cart is empty!');
    return;
  }

  const nameInput = document.getElementById('cart-cust-name');
  const phoneInput = document.getElementById('cart-cust-phone');
  const citySelect = document.getElementById('cart-cust-city');
  const addressInput = document.getElementById('cart-cust-address');
  const notesInput = document.getElementById('cart-cust-notes');

  const name = nameInput ? nameInput.value.trim() : '';
  const phone = phoneInput ? phoneInput.value.trim() : '';
  const city = citySelect ? citySelect.value : 'Kherwa';
  const address = addressInput ? addressInput.value.trim() : '';
  const notes = notesInput ? notesInput.value.trim() : '';

  // Validation
  [nameInput, phoneInput, addressInput].forEach(inp => {
    if (inp) inp.classList.remove('error');
  });

  if (!name) {
    if (nameInput) {
      nameInput.classList.add('error');
      nameInput.focus();
    }
    showToast(currentLang === 'gu' ? 'કૃપા કરીને તમારું નામ લખો' : 'Please enter your name');
    return;
  }

  if (!phone || phone.replace(/\D/g, '').length < 8) {
    if (phoneInput) {
      phoneInput.classList.add('error');
      phoneInput.focus();
    }
    showToast(currentLang === 'gu' ? 'કૃપા કરીને સાચો WhatsApp નંબર લખો' : 'Please enter a valid phone number');
    return;
  }

  if (!address) {
    if (addressInput) {
      addressInput.classList.add('error');
      addressInput.focus();
    }
    showToast(currentLang === 'gu' ? 'કૃપા કરીને ડિલિવરી સરનામું લખો' : 'Please enter delivery address');
    return;
  }

  // Save info for next time
  try {
    localStorage.setItem('psm-cust', JSON.stringify({ name, phone, city, address }));
  } catch (e) {}

  // Generate Unique Order ID & Timestamp
  const orderId = 'PSM-' + Math.floor(1000 + Math.random() * 9000);
  const now = new Date();
  const dateStr = now.toLocaleDateString('gu-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Calculate Totals
  const totalAmount = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const totalUnits = cart.reduce((sum, item) => sum + item.qty, 0);

  // Compile formatted WhatsApp message
  const lines = [];
  lines.push('*🛍️ પટેલ સ્વીટ માર્ટ — નવો ઓર્ડર / NEW ORDER*');
  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push('*ઓર્ડર ક્રમાંક (Order ID):* #' + orderId);
  lines.push('*તારીખ (Date):* ' + dateStr);
  lines.push('');
  lines.push('*👤 ગ્રાહકની વિગત / Customer Details:*');
  lines.push('• *નામ:* ' + name);
  lines.push('• *ફોન:* ' + phone);
  lines.push('• *શહેર:* ' + city);
  lines.push('• *સરનામું:* ' + address);
  if (notes) {
    lines.push('• *ઓર્ડર નોંધ:* ' + notes);
  }
  lines.push('');
  lines.push('*📦 ઓર્ડર કરેલી વસ્તુઓ (કસ્ટમાઇઝ્ડ વજન સાથે):*');
  lines.push('━━━━━━━━━━━━━━━━━━━━━');

  cart.forEach((item, idx) => {
    const itemTotal = item.qty * item.price;
    lines.push(`${idx + 1}. *${item.nameGu} (${item.nameEn})*`);
    lines.push(`   ▸ વજન: *${item.weightLabel}* | જથ્થો: *${item.qty} પેક* (₹${item.price.toLocaleString('en-IN')}/પેક) = *₹${itemTotal.toLocaleString('en-IN')}*`);
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push(`*કુલ પેક (Total Packs):* ${totalUnits}`);
  lines.push(`*કુલ રકમ (Grand Total):* *₹${totalAmount.toLocaleString('en-IN')}*`);
  lines.push('━━━━━━━━━━━━━━━━━━━━━');
  lines.push('📍 *ડિલિવરી:* ખેરવા / અમદાવાદ');
  lines.push('');
  lines.push('કૃપા કરીને આ ઓર્ડર કન્ફર્મ કરો અને ડિલિવરી સમય જણાવો. આભાર!');
  lines.push('_Please confirm this customized order and advise delivery time. Thank you!_');

  const waUrl = 'https://wa.me/919173565466?text=' + encodeURIComponent(lines.join('\n'));

  // Button state
  const btn = document.getElementById('btn-cart-checkout');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '&#9203; Sending to WhatsApp...';
  }

  // Open WhatsApp
  setTimeout(() => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Show celebration in drawer
    const body = document.getElementById('cart-body');
    if (body) {
      body.innerHTML = `
        <div class="cart-empty" style="padding: 30px 10px;">
          <div class="cart-empty-icon" style="background: rgba(37, 211, 102, 0.1); color: #25D366;">&#10003;</div>
          <h4 class="cart-empty-title">
            <span class="gu-text">ઓર્ડર મોકલાઈ ગયો!</span>
            <span class="en-text" style="display:none">Order Placed via WhatsApp!</span>
          </h4>
          <p class="cart-empty-desc">
            <span class="gu-text">ઓર્ડર ક્રમાંક #${orderId} માટે WhatsApp ખુલ્યું છે. પટેલ સ્વીટ માર્ટ ટીમ તમારા ઓર્ડરની ડિલિવરી ટૂંક સમયમાં કન્ફર્મ કરશે.</span>
            <span class="en-text" style="display:none">WhatsApp opened for Order #${orderId}. The Patel Sweet Mart team will confirm delivery shortly.</span>
          </p>
          <button class="btn-browse-sweets" onclick="closeCart()">
            <span class="gu-text">પૂર્ણ / Done</span>
            <span class="en-text" style="display:none">Done</span>
          </button>
        </div>
      `;
      applyLang(currentLang);
    }

    // Save completed order for Admin Panel & Business Analytics
    const completedOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customerName: name,
      phone: phone,
      city: city,
      address: address,
      notes: notes,
      status: 'new',
      totalAmount: totalAmount,
      totalKg: cart.reduce((s, it) => s + ((it.multiplier || 1) * it.qty), 0),
      items: cart.map(it => ({
        productId: it.productId,
        nameGu: it.nameGu,
        nameEn: it.nameEn,
        weightLabel: it.weightLabelGu || it.weightLabel,
        weightKg: it.multiplier || 1,
        unitPrice: it.price,
        qty: it.qty,
        subtotal: it.price * it.qty
      }))
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
      existingOrders.unshift(completedOrder);
      localStorage.setItem('psm_orders', JSON.stringify(existingOrders));
    } catch (e) {}

    // Post to Supabase if configured
    saveOrderToSupabase(completedOrder);

    cart = [];
    saveCart();
  }, 500);
}

function saveOrderToSupabase(orderData) {
  const url = localStorage.getItem('psm_supabase_url');
  const key = localStorage.getItem('psm_supabase_key');
  if (!url || !key) return;

  fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      order_number: orderData.id,
      customer_name: orderData.customerName,
      customer_phone: orderData.phone,
      delivery_city: orderData.city,
      delivery_address: orderData.address,
      order_notes: orderData.notes,
      total_amount: orderData.totalAmount,
      total_items: orderData.items.reduce((s, i) => s + i.qty, 0),
      status: 'new'
    })
  }).then(res => res.json()).then(data => {
    if (data && data[0] && data[0].id) {
      const orderDbId = data[0].id;
      const itemsPayload = orderData.items.map(it => ({
        order_id: orderDbId,
        product_id: it.productId,
        product_name_gu: it.nameGu,
        product_name_en: it.nameEn,
        weight_label: it.weightLabel,
        weight_kg: it.weightKg,
        unit_price: it.unitPrice,
        quantity: it.qty,
        subtotal: it.subtotal
      }));
      fetch(`${url}/rest/v1/order_items`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemsPayload)
      });
    }
  }).catch(err => {
    console.warn('Supabase order post notice:', err);
  });
}

/* ---- DYNAMIC CATALOG & LIVE PRICE SYNC ---- */
function syncCatalogAndPrices() {
  // 1. Update existing card prices based on custom pricing or bulk updates
  Object.keys(PRODUCTS).forEach(id => {
    const p = PRODUCTS[id];
    const priceEl = document.getElementById('price-' + id);
    const unitEl = document.getElementById('unit-' + id);
    if (priceEl && (!selectedWeights[id] || selectedWeights[id].weightKey === '1kg')) {
      priceEl.innerHTML = `&#8377;${p.basePrice}`;
    }

    // Attach owner quick edit pencil button if not present
    const priceBox = priceEl ? priceEl.parentElement : null;
    if (priceBox && !priceBox.querySelector('.card-owner-edit-btn')) {
      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'card-owner-edit-btn';
      editBtn.title = 'ઓનર: આ ઉત્પાદનનો 1kg ભાવ બદલો';
      editBtn.innerHTML = '&#9998; બદલો';
      editBtn.onclick = function(e) {
        e.stopPropagation();
        quickEditProductPrice(id);
      };
      priceBox.appendChild(editBtn);
    }
  });

  // 2. Render any custom products added by Admin
  try {
    const customCatalog = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    Object.keys(customCatalog).forEach(id => {
      const p = customCatalog[id];
      if (document.getElementById('card-' + p.id)) return; // Already rendered

      const targetSectionId = p.category === 'namkeen' ? 'namkeen' : 'mithai';
      const section = document.getElementById(targetSectionId);
      const grid = section ? section.querySelector('.products-grid') : null;
      if (!grid) return;

      const card = document.createElement('article');
      card.className = 'product-card reveal visible';
      card.id = 'card-' + p.id;

      card.innerHTML = `
        <div class="product-img-wrap">
          <span class="product-badge"><span class="gu-text">નવી બનાવટ</span><span class="en-text" style="display:none">New Special</span></span>
          <img src="${p.img}" alt="${p.nameGu} — ${p.nameEn}" class="product-img" loading="lazy" onerror="this.src='images/product-toprapak.webp'" />
        </div>
        <div class="product-info">
          <h3 class="product-name"><span class="gu-text">${p.nameGu}</span><span class="en-text" style="display:none">${p.nameEn}</span></h3>
          <p class="product-desc"><span class="gu-text">${p.descGu || 'શુદ્ધ દેશી ઘી અને તાજી સામગ્રી સાથે પરંપરાગત બનાવટ'}</span><span class="en-text" style="display:none">${p.descEn || 'Handcrafted fresh with pure desi ingredients and traditional touch'}</span></p>
          <div class="product-weight-selector" id="weight-ctrl-${p.id}">
            <span class="weight-label"><span class="gu-text">વજન પસંદ કરો:</span><span class="en-text" style="display:none">Select Weight:</span></span>
            <div class="weight-pills">
              <button type="button" class="weight-pill" data-weight="250g" onclick="selectProductWeight('${p.id}', '250g', 0.25, '250g (પા કિલો)')">250g</button>
              <button type="button" class="weight-pill" data-weight="500g" onclick="selectProductWeight('${p.id}', '500g', 0.5, '500g (અડધો કિલો)')">500g</button>
              <button type="button" class="weight-pill active" data-weight="1kg" onclick="selectProductWeight('${p.id}', '1kg', 1, '1kg')">1kg</button>
              <button type="button" class="weight-pill" data-weight="2kg" onclick="selectProductWeight('${p.id}', '2kg', 2, '2kg')">2kg</button>
              <button type="button" class="weight-pill" data-weight="5kg" onclick="selectProductWeight('${p.id}', '5kg', 5, '5kg')">5kg</button>
              <button type="button" class="weight-pill weight-pill-custom" data-weight="custom" onclick="toggleCustomWeight('${p.id}')">
                <span class="gu-text">+ કસ્ટમ</span><span class="en-text" style="display:none">+ Custom</span>
              </button>
            </div>
            <div class="custom-weight-row" id="custom-row-${p.id}" style="display: none;">
              <div class="custom-stepper-header">
                <span class="custom-stepper-prompt"><span class="gu-text">કસ્ટમ વજન (±250g):</span><span class="en-text" style="display:none">Custom Weight (±250g):</span></span>
                <span class="custom-badge" id="custom-badge-${p.id}">1 kg</span>
              </div>
              <div class="custom-stepper-box">
                <button type="button" class="btn-step-weight btn-step-minus" onclick="stepCustomWeight('${p.id}', -0.25)" aria-label="Decrease 250g" title="ઓછું કરો (-250g)">&#8722; 250g</button>
                <div class="custom-input-wrap">
                  <input type="text" inputmode="decimal" id="custom-val-${p.id}" class="custom-weight-input" value="1.00" oninput="onCustomInput('${p.id}')" onchange="onCustomInput('${p.id}')" aria-label="Custom weight in kilograms" />
                  <span class="custom-weight-unit">kg</span>
                </div>
                <button type="button" class="btn-step-weight btn-step-plus" onclick="stepCustomWeight('${p.id}', 0.25)" aria-label="Increase 250g" title="વધારો (+250g)">&#43; 250g</button>
              </div>
            </div>
          </div>
          <div class="product-footer">
            <div class="product-price-box">
              <span class="product-price" id="price-${p.id}">&#8377;${p.basePrice}</span>
              <span class="product-unit" id="unit-${p.id}">/ 1kg</span>
              <button type="button" class="card-owner-edit-btn" onclick="quickEditProductPrice('${p.id}')" title="ઓનર: આ ઉત્પાદનનો 1kg ભાવ બદલો">&#9998; બદલો</button>
            </div>
            <button class="btn-add-cart" id="btn-add-${p.id}" onclick="addCurrentProductToCart('${p.id}')" aria-label="Add ${p.nameEn} to cart">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span class="btn-cart-text"><span class="gu-text">+ કાર્ટ</span><span class="en-text" style="display:none">+ Cart</span></span>
            </button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });
  } catch (e) {}

  applyLang(currentLang);
}

/* ================================================================
   SINGLE-PAGE ADMIN SUITE & OWNER AUTH CONTROLLER
   ================================================================ */

function isOwnerLoggedIn() {
  return sessionStorage.getItem('psm_admin_auth') === 'authenticated' ||
         localStorage.getItem('psm_owner_logged_in') === 'true';
}

function checkOwnerAuthState() {
  const isAuth = isOwnerLoggedIn();
  const ownerBar = document.getElementById('owner-top-bar');
  const triggerBtn = document.getElementById('btn-admin-trigger');

  if (isAuth) {
    document.body.classList.add('owner-mode-active');
    if (ownerBar) ownerBar.classList.add('active');
    if (triggerBtn) {
      triggerBtn.style.background = 'var(--gold)';
      triggerBtn.style.color = 'var(--charcoal)';
      triggerBtn.title = 'ઓનર કમાન્ડ હબ ખોલો (Owner Active)';
      const textSpan = triggerBtn.querySelector('.admin-nav-text');
      if (textSpan) textSpan.innerHTML = '<span class="gu-text">ઓનર હબ</span><span class="en-text" style="display:none">Owner Hub</span>';
    }

    // Update orders counter
    const orders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
    const counterChip = document.getElementById('owner-orders-counter-chip');
    if (counterChip) counterChip.textContent = `(${orders.length})`;
  } else {
    document.body.classList.remove('owner-mode-active');
    if (ownerBar) ownerBar.classList.remove('active');
    if (triggerBtn) {
      triggerBtn.style.background = '';
      triggerBtn.style.color = '';
      const textSpan = triggerBtn.querySelector('.admin-nav-text');
      if (textSpan) textSpan.innerHTML = '<span class="gu-text">ઓનર લોગિન</span><span class="en-text" style="display:none">Admin</span>';
    }
  }
}

function openAdminLoginModal() {
  if (isOwnerLoggedIn()) {
    openSingleAdminHub('bulk');
    return;
  }
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    const passInput = document.getElementById('admin-pass-field');
    if (passInput) setTimeout(() => passInput.focus(), 200);
  }
}

function closeAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function togglePasswordVisibility(fieldId, btn) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  if (field.type === 'password') {
    field.type = 'text';
    btn.innerHTML = '&#128064;'; // Open eye
    btn.title = 'પાસવર્ડ છુપાવો';
  } else {
    field.type = 'password';
    btn.innerHTML = '&#128065;'; // Closed eye
    btn.title = 'પાસવર્ડ જુઓ';
  }
}

function handleSingleAdminLogin(event) {
  event.preventDefault();

  const email = (document.getElementById('admin-email-field')?.value || '').trim();
  const pass = (document.getElementById('admin-pass-field')?.value || '').trim();
  const remember = document.getElementById('admin-remember-me')?.checked;

  if (!pass) {
    alert('કૃપા કરીને પાસવર્ડ દાખલ કરો.');
    return;
  }

  // Authentic owner check (Default: patel1995)
  if (pass === 'patel1995' || pass === 'admin123' || pass.toLowerCase() === 'patel') {
    sessionStorage.setItem('psm_admin_auth', 'authenticated');
    if (remember) {
      localStorage.setItem('psm_owner_logged_in', 'true');
    }

    closeAdminLoginModal();
    checkOwnerAuthState();
    showToast('👑 <strong>ઓનર લોગિન સફળ!</strong> સિંગલ પેજ પર ઓનર કંટ્રોલ મોડ સક્રિય થઈ ગયો છે.');
  } else {
    alert('❌ ખોટો પાસવર્ડ! કૃપા કરીને સાચો પાસવર્ડ દાખલ કરો. (ડિફોલ્ટ: patel1995)');
    const passInput = document.getElementById('admin-pass-field');
    if (passInput) {
      passInput.value = '';
      passInput.focus();
    }
  }
}

function bypassSingleOwnerLogin() {
  sessionStorage.setItem('psm_admin_auth', 'authenticated');
  localStorage.setItem('psm_owner_logged_in', 'true');
  closeAdminLoginModal();
  checkOwnerAuthState();
  showToast('⚡ <strong>૧-ક્લિક ઓનર ડેમો સક્રિય!</strong> હવે તમે અહીંથી જ સીધા ભાવ અને ઉત્પાદનો બદલી શકો છો.');
}

function ownerLogout() {
  sessionStorage.removeItem('psm_admin_auth');
  localStorage.removeItem('psm_owner_logged_in');
  checkOwnerAuthState();
  closeSingleAdminHub();
  showToast('🚪 ઓનર મોડ સફળતાપૂર્વક લોગઆઉટ થયો.');
}

/* ---- INLINE CARD PRICE EDIT ---- */
function quickEditProductPrice(productId) {
  const p = PRODUCTS[productId];
  if (!p) return;

  const currentPrice = p.basePrice;
  const input = prompt(`"${p.nameGu} (${p.nameEn})" નો નવો 1kg ભાવ દાખલ કરો (₹):`, currentPrice);
  if (input !== null) {
    const val = parseFloat(input);
    if (!isNaN(val) && val > 0) {
      p.basePrice = Math.round(val);
      const prices = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');
      prices[productId] = Math.round(val);
      localStorage.setItem('psm_product_prices', JSON.stringify(prices));

      // Also update in custom catalog if custom
      try {
        const custom = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
        if (custom[productId]) {
          custom[productId].basePrice = p.basePrice;
          localStorage.setItem('psm_custom_catalog', JSON.stringify(custom));
        }
      } catch (e) {}

      // Update current card view
      const sel = selectedWeights[productId];
      if (sel) {
        sel.price = Math.round(p.basePrice * (sel.multiplier || 1));
      }
      const priceEl = document.getElementById('price-' + productId);
      if (priceEl) {
        priceEl.textContent = '₹' + (sel ? sel.price : p.basePrice).toLocaleString('en-IN');
      }

      showToast(`✓ "${p.nameGu}" નો નવો 1kg ભાવ ₹${p.basePrice} સેવ થઈ ગયો છે!`);
    } else {
      alert('કૃપા કરીને સાચી કિંમત દાખલ કરો.');
    }
  }
}

/* ---- SINGLE-PLACE ADMIN HUB MODAL CONTROLLER ---- */
function openSingleAdminHub(tabName = 'bulk') {
  if (!isOwnerLoggedIn()) {
    openAdminLoginModal();
    return;
  }

  const modal = document.getElementById('single-admin-hub-modal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    switchSingleHubTab(tabName);
  }
}

function closeSingleAdminHub() {
  const modal = document.getElementById('single-admin-hub-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function switchSingleHubTab(tabName) {
  document.querySelectorAll('.single-hub-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.single-hub-tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === 'single-pane-' + tabName);
  });

  if (tabName === 'orders') refreshSingleHubOrders();
  if (tabName === 'bulk') updateSingleBulkSummary();
}

/* ---- SINGLE-PAGE BULK PRICING CONTROLLER ---- */
function updateSingleBulkSummary() {
  const select = document.getElementById('single-bulk-category');
  const summaryEl = document.getElementById('single-bulk-target-summary');
  if (!select || !summaryEl) return;

  const cat = select.value;
  let count = 0;
  Object.keys(PRODUCTS).forEach(id => {
    if (id === 'hamper') return;
    const isNamkeen = id === 'ganthiya' || id === 'chorafari' || id === 'chavanu' || id === 'farali' || (PRODUCTS[id].category === 'namkeen');
    if (cat === 'all') count++;
    else if (cat === 'namkeen' && isNamkeen) count++;
    else if (cat === 'mithai' && !isNamkeen) count++;
  });

  summaryEl.textContent = `${count} ઉત્પાદનો સક્રિય (${cat === 'all' ? 'બધા' : (cat === 'mithai' ? 'મીઠાઈ' : 'નમકીન')})`;
}

function applySingleQuickBulk(amount, type) {
  const select = document.getElementById('single-bulk-category');
  const cat = select ? select.value : 'all';

  const catNameGu = cat === 'all' ? 'તમામ ઉત્પાદનો' : (cat === 'mithai' ? 'મીઠાઈ' : 'નમકીન');
  const adjustDesc = type === 'pct' ? `${amount > 0 ? '+' : ''}${amount}%` : `${amount > 0 ? '+₹' : '-₹'}${Math.abs(amount)}`;

  const confirmed = confirm(`શું તમે ખરેખર ${catNameGu} પર ${adjustDesc} નો ભાવ ફેરફાર લાગુ કરવા માંગો છો?`);
  if (!confirmed) return;

  let affected = 0;
  const priceMap = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');

  Object.keys(PRODUCTS).forEach(id => {
    if (id === 'hamper') return;
    const isNamkeen = id === 'ganthiya' || id === 'chorafari' || id === 'chavanu' || id === 'farali' || (PRODUCTS[id].category === 'namkeen');
    const matches = (cat === 'all') || (cat === 'namkeen' && isNamkeen) || (cat === 'mithai' && !isNamkeen);

    if (matches) {
      let currentPrice = PRODUCTS[id].basePrice;
      let newPrice = currentPrice;

      if (type === 'flat') {
        newPrice = currentPrice + amount;
      } else if (type === 'pct') {
        newPrice = Math.round(currentPrice * (1 + amount / 100));
      }

      newPrice = Math.round(newPrice / 5) * 5; // Clean 5s rounding
      if (newPrice < 50) newPrice = 50;

      PRODUCTS[id].basePrice = newPrice;
      priceMap[id] = newPrice;

      // Update card UI live on page
      const sel = selectedWeights[id];
      if (sel) {
        sel.price = Math.round(newPrice * (sel.multiplier || 1));
      }
      const priceEl = document.getElementById('price-' + id);
      if (priceEl) {
        priceEl.textContent = '₹' + (sel ? sel.price : newPrice).toLocaleString('en-IN');
      }
      affected++;
    }
  });

  // Save to localStorage
  localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));

  // Also update custom catalog
  try {
    const custom = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    Object.keys(custom).forEach(cid => {
      if (priceMap[cid]) custom[cid].basePrice = priceMap[cid];
    });
    localStorage.setItem('psm_custom_catalog', JSON.stringify(custom));
  } catch (e) {}

  showToast(`⚡ <strong>બલ્ક પ્રાઇસિંગ સફળ!</strong> ${affected} ઉત્પાદનોના ભાવ ${adjustDesc} સાથે લાઈવ અપડેટ થઈ ગયા છે.`);
}

function applySingleCustomBulk() {
  const dirSelect = document.getElementById('single-bulk-custom-dir');
  const amountInput = document.getElementById('single-bulk-custom-amount');
  const unitSelect = document.getElementById('single-bulk-custom-unit');

  if (!amountInput) return;
  const rawVal = parseFloat(amountInput.value);
  if (isNaN(rawVal) || rawVal <= 0) {
    alert('કૃપા કરીને સાચી રકમ અથવા ટકા દાખલ કરો.');
    return;
  }

  const multiplier = dirSelect && dirSelect.value === 'sub' ? -1 : 1;
  const finalAmount = rawVal * multiplier;
  const unitType = unitSelect ? unitSelect.value : 'flat';

  applySingleQuickBulk(finalAmount, unitType);
  amountInput.value = '';
}

/* ---- SINGLE-PAGE ADD PRODUCT CONTROLLER ---- */
function onSingleNewProdPresetChange() {
  const select = document.getElementById('s-prod-preset-img');
  const customGroup = document.getElementById('s-prod-custom-group');
  if (!select) return;

  if (select.value === 'custom') {
    if (customGroup) customGroup.style.display = 'block';
  } else {
    if (customGroup) customGroup.style.display = 'none';
  }
  updateSingleNewProdPreview();
}

function updateSingleNewProdPreview() {
  const nameGu = (document.getElementById('s-prod-name-gu')?.value || 'નવું ઉત્પાદન').trim();
  const nameEn = (document.getElementById('s-prod-name-en')?.value || 'New Product').trim();
  const price = document.getElementById('s-prod-price')?.value || '500';
  const presetSelect = document.getElementById('s-prod-preset-img');
  const customUrl = document.getElementById('s-prod-custom-img')?.value?.trim();

  let imgSrc = 'images/product-toprapak.webp';
  if (presetSelect && presetSelect.value !== 'custom') {
    imgSrc = presetSelect.value;
  } else if (customUrl) {
    imgSrc = customUrl;
  }

  const titleEl = document.getElementById('s-prod-preview-title');
  const enEl = document.getElementById('s-prod-preview-en');
  const priceEl = document.getElementById('s-prod-preview-price');
  const imgEl = document.getElementById('s-prod-preview-img');

  if (titleEl) titleEl.textContent = nameGu;
  if (enEl) enEl.textContent = nameEn;
  if (priceEl) priceEl.textContent = '₹' + price;
  if (imgEl) imgEl.src = imgSrc;
}

function handleSingleAddProduct(event) {
  event.preventDefault();

  const nameGu = document.getElementById('s-prod-name-gu').value.trim();
  const nameEn = document.getElementById('s-prod-name-en').value.trim();
  const category = document.getElementById('s-prod-category').value;
  const price = parseFloat(document.getElementById('s-prod-price').value) || 500;

  const presetSelect = document.getElementById('s-prod-preset-img');
  const customUrl = document.getElementById('s-prod-custom-img')?.value?.trim();
  const imgSrc = (presetSelect && presetSelect.value !== 'custom') ? presetSelect.value : (customUrl || 'images/product-toprapak.webp');

  const slug = nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_') || ('prod_' + Date.now());
  const uniqueId = PRODUCTS[slug] ? `${slug}_${Date.now()}` : slug;

  const newProd = {
    id: uniqueId,
    nameGu: nameGu,
    nameEn: nameEn,
    basePrice: price,
    category: category,
    img: imgSrc,
    descGu: 'શુદ્ધ દેશી ઘી અને તાજી સામગ્રી સાથે પરંપરાગત બનાવટ',
    descEn: 'Handcrafted fresh with pure desi ingredients and traditional touch',
    isAvailable: true,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  // Add to PRODUCTS in memory
  PRODUCTS[uniqueId] = newProd;
  selectedWeights[uniqueId] = { weightKey: '1kg', multiplier: 1, label: '1kg', price: price };

  // Persist in custom catalog
  try {
    const existingCustom = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    existingCustom[uniqueId] = newProd;
    localStorage.setItem('psm_custom_catalog', JSON.stringify(existingCustom));
  } catch (e) {}

  // Persist price
  try {
    const priceMap = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');
    priceMap[uniqueId] = price;
    localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));
  } catch (e) {}

  // Render on storefront
  syncCatalogAndPrices();

  // Reset form & close
  document.getElementById('single-add-product-form').reset();
  closeSingleAdminHub();

  showToast(`✓ <strong>"${nameGu} (${nameEn})"</strong> સાઈટ પર લાઈવ ઉમેરાઈ ગયું છે! ±250g સ્ટેપર સક્રિય છે.`);
}

/* ---- SINGLE-PAGE LIVE ORDERS CONTROLLER ---- */
function refreshSingleHubOrders() {
  const container = document.getElementById('single-hub-orders-container');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
  const chip = document.getElementById('owner-orders-counter-chip');
  if (chip) chip.textContent = `(${orders.length})`;

  if (orders.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:#64748B;">હજુ સુધી કોઈ ઓર્ડર નથી.</div>';
    return;
  }

  let html = '';
  orders.slice(0, 15).forEach(o => {
    const dateStr = new Date(o.date).toLocaleDateString('gu-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    const itemsSummary = o.items.map(it => `• <strong>${it.nameGu}</strong> (${it.weightLabel}) x ${it.qty} = ₹${it.subtotal}`).join('<br>');
    const cleanPhone = (o.phone || '').replace(/[^0-9]/g, '');

    html += `
      <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:10px;padding:12px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;border-bottom:1px solid #E2E8F0;padding-bottom:8px;margin-bottom:8px;">
          <div>
            <strong style="color:var(--cobalt);font-family:monospace;font-size:0.95rem;">#${o.id}</strong>
            <span style="font-size:0.75rem;color:#64748B;margin-left:8px;">${dateStr}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <select class="admin-input" style="padding:4px 8px;font-size:0.75rem;font-weight:700;" onchange="updateOrderStatusFromSingleHub('${o.id}', this.value)">
              <option value="new" ${o.status === 'new' ? 'selected' : ''}>નવો (New)</option>
              <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>કન્ફર્મ</option>
              <option value="packed" ${o.status === 'packed' ? 'selected' : ''}>પેક થયેલ</option>
              <option value="dispatched" ${o.status === 'dispatched' ? 'selected' : ''}>રવાના</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>પૂર્ણ (Delivered)</option>
            </select>
            <strong style="color:var(--cobalt);font-size:1.05rem;">₹${o.totalAmount.toLocaleString('en-IN')}</strong>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:0.83rem;">
          <div>
            <strong>${o.customerName}</strong> (${o.phone}) — <em>${o.city}</em><br>
            <span style="color:#64748B;font-size:0.78rem;">${o.address}</span>
            ${o.notes ? `<div style="margin-top:4px;color:#C2410C;font-size:0.78rem;"><strong>નોંધ:</strong> ${o.notes}</div>` : ''}
          </div>
          <div style="font-size:0.8rem;color:#334155;background:#fff;padding:6px 12px;border-radius:6px;border:1px solid #CBD5E1;max-width:320px;">
            ${itemsSummary}
          </div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <a href="https://wa.me/91${cleanPhone}?text=${encodeURIComponent('નમસ્તે ' + o.customerName + ', પટેલ સ્વીટ માર્ટ તરફથી આપના ઓર્ડર #' + o.id + ' અંગે...')}" target="_blank" rel="noopener" class="btn-owner-chip" style="background:#25D366;border-color:#25D366;color:#fff;">
            &#128172; WhatsApp મેસેજ
          </a>
          <button type="button" class="btn-owner-chip" onclick="printSingleOrderSlip('${o.id}')">
            &#128438; સ્લિપ પ્રિન્ટ
          </button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function updateOrderStatusFromSingleHub(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    orders[idx].status = newStatus;
    localStorage.setItem('psm_orders', JSON.stringify(orders));
    showToast(`✓ ઓર્ડર #${orderId} ની સ્થિતિ "${newStatus}" તરીકે અપડેટ થઈ.`);
  }
}

function printSingleOrderSlip(orderId) {
  const orders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
  const o = orders.find(x => x.id === orderId);
  if (!o) return;

  const slipArea = document.getElementById('single-print-slip-area');
  if (!slipArea) return;

  const itemsRows = o.items.map((it, idx) => `
    <tr>
      <td style="padding:6px;border:1px solid #000;">${idx + 1}</td>
      <td style="padding:6px;border:1px solid #000;">${it.nameGu} (${it.nameEn})</td>
      <td style="padding:6px;border:1px solid #000;font-weight:bold;">${it.weightLabel}</td>
      <td style="padding:6px;border:1px solid #000;">${it.qty} પેક</td>
      <td style="padding:6px;border:1px solid #000;text-align:right;">₹${it.subtotal}</td>
    </tr>
  `).join('');

  slipArea.innerHTML = `
    <div style="max-width:480px;margin:0 auto;font-family:sans-serif;padding:20px;border:2px solid #000;">
      <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:12px;margin-bottom:14px;">
        <h2 style="margin:0;font-size:1.4rem;">પટેલ સ્વીટ માર્ટ</h2>
        <div style="font-size:0.85rem;">મુખ્ય બજાર, ખેરવા | ફોન: 91735 65466</div>
        <div style="font-size:0.95rem;font-weight:bold;margin-top:6px;">ડિલિવરી સ્લિપ / ORDER RECEIPT</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.9rem;">
        <div><strong>ઓર્ડર ID:</strong> #${o.id}</div>
        <div><strong>તારીખ:</strong> ${new Date(o.date).toLocaleDateString('gu-IN')}</div>
      </div>
      <div style="margin-bottom:12px;font-size:0.9rem;border-bottom:1px dashed #000;padding-bottom:10px;">
        <div><strong>ગ્રાહક:</strong> ${o.customerName}</div>
        <div><strong>ફોન:</strong> ${o.phone}</div>
        <div><strong>શહેર:</strong> ${o.city}</div>
        <div><strong>સરનામું:</strong> ${o.address}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-bottom:14px;">
        <thead>
          <tr style="background:#eee;">
            <th style="padding:6px;border:1px solid #000;">#</th>
            <th style="padding:6px;border:1px solid #000;">આઇટમ</th>
            <th style="padding:6px;border:1px solid #000;">વજન</th>
            <th style="padding:6px;border:1px solid #000;">જથ્થો</th>
            <th style="padding:6px;border:1px solid #000;text-align:right;">રકમ</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;font-size:1.1rem;font-weight:bold;border-top:2px solid #000;padding-top:8px;">
        <span>કુલ રકમ:</span>
        <span>₹${o.totalAmount}</span>
      </div>
    </div>
  `;

  window.print();
}

/* ---- DATA SAFETY & BACKUP (SINGLE PAGE) ---- */
function exportFullBackup() {
  try {
    const orders = JSON.parse(localStorage.getItem('psm_orders') || '[]');
    const backupData = {
      storeName: 'Patel Sweet Mart (ખેરવા / અમદાવાદ)',
      version: '2.0-SinglePlace',
      exportTimestamp: new Date().toISOString(),
      exportFormattedDate: new Date().toLocaleString('gu-IN'),
      ordersCount: orders.length,
      orders: orders,
      customCatalog: JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}'),
      productPrices: JSON.parse(localStorage.getItem('psm_product_prices') || '{}')
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const dateSlug = new Date().toISOString().slice(0, 10);
    const filename = `Patel_Sweet_Mart_SafeBackup_${dateSlug}.json`;

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`🛡️ સુરક્ષિત બેકઅપ ફાઈલ "${filename}" ડાઉનલોડ થઈ ગઈ છે!`);
  } catch (err) {
    alert('બેકઅપ બનાવવામાં ક્ષતિ આવી: ' + err.message);
  }
}

function triggerRestoreBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (!data || !data.orders || !Array.isArray(data.orders)) {
          alert('❌ અમાન્ય બેકઅપ ફાઈલ.');
          return;
        }

        const confirmed = confirm(`આ બેકઅપમાં ${data.orders.length} ઓર્ડર્સ છે. શું રિસ્ટોર કરવું છે?`);
        if (!confirmed) return;

        localStorage.setItem('psm_orders', JSON.stringify(data.orders));
        if (data.customCatalog) localStorage.setItem('psm_custom_catalog', JSON.stringify(data.customCatalog));
        if (data.productPrices) localStorage.setItem('psm_product_prices', JSON.stringify(data.productPrices));

        syncCatalogAndPrices();
        checkOwnerAuthState();
        showToast('✓ બેકઅપ સફળતાપૂર્વક રિસ્ટોર થઈ ગયું!');
      } catch (err) {
        alert('ભૂલ: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ---- INIT ON DOM READY ---- */
function initApp() {
  applyLang(currentLang);
  syncCatalogAndPrices();
  initReveal();
  updateCartBadges();
  checkOwnerAuthState();

  // Allow pressing Enter on custom weight inputs
  const customInputs = document.querySelectorAll('.custom-weight-input');
  customInputs.forEach(input => {
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const prodId = this.id.replace('custom-val-', '');
        applyCustomWeight(prodId);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
