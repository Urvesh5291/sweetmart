```javascript
/* ================================================================
   PATEL SWEET MART — FIXED CART + ORDER SYSTEM
   ------------------------------------------------
   FIXES:
   1. Supports both psm-cart and psm_cart
   2. Compatible with old/new addToCart() calls
   3. Cart immediately updates on website
   4. Cart persists after refresh
   5. Orders save to localStorage BEFORE WhatsApp opens
   6. Admin/order page gets update event
   7. Supabase order sync supported
   ================================================================ */

'use strict';

/* ================================================================
   CART STORAGE CONFIG
   ================================================================ */

const CART_STORAGE_KEY = 'psm-cart';
const OLD_CART_STORAGE_KEY = 'psm_cart';
const ORDERS_STORAGE_KEY = 'psm_orders';

/* ================================================================
   SAFE JSON HELPERS
   ================================================================ */

function safeGetJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    if (!value) return fallback;

    const parsed = JSON.parse(value);

    return parsed;
  } catch (error) {
    console.warn('Storage read error:', key, error);
    return fallback;
  }
}

function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage save error:', key, error);
    return false;
  }
}

/* ================================================================
   LOAD CART
   ================================================================ */

function loadCartFromStorage() {

  let saved = null;

  /* First try current key */
  saved = safeGetJSON(CART_STORAGE_KEY, null);

  /* If current key is empty, try old key */
  if (!Array.isArray(saved) || saved.length === 0) {
    const oldCart = safeGetJSON(OLD_CART_STORAGE_KEY, null);

    if (Array.isArray(oldCart)) {
      saved = oldCart;
    }
  }

  if (!Array.isArray(saved)) {
    saved = [];
  }

  /* Clean invalid cart items */
  return saved.filter(function(item) {

    return item &&
      typeof item === 'object' &&
      item.productId &&
      Number(item.qty) > 0;

  }).map(function(item) {

    return {
      id: item.id || (
        String(item.productId) + '_' +
        String(item.weightKey || '1kg')
      ),

      productId: item.productId,

      nameGu: item.nameGu || '',
      nameEn: item.nameEn || '',

      weightKey: item.weightKey || '1kg',

      weightLabel:
        item.weightLabel ||
        item.weightLabelGu ||
        item.weightLabelEn ||
        '1kg',

      weightLabelGu:
        item.weightLabelGu ||
        item.weightLabel ||
        '1kg',

      weightLabelEn:
        item.weightLabelEn ||
        item.weightLabel ||
        '1kg',

      multiplier:
        Number(item.multiplier) > 0
          ? Number(item.multiplier)
          : 1,

      basePrice:
        Number(item.basePrice) >= 0
          ? Number(item.basePrice)
          : Number(item.price) || 0,

      price:
        Number(item.price) >= 0
          ? Number(item.price)
          : Number(item.basePrice) || 0,

      img: item.img || '',

      qty:
        Number(item.qty) > 0
          ? Number(item.qty)
          : 1
    };

  });
}

/* Global cart */
let cart = loadCartFromStorage();

/* ================================================================
   SAVE CART
   ================================================================ */

function saveCart() {

  /* Save using NEW key */
  safeSetJSON(CART_STORAGE_KEY, cart);

  /* Also save using OLD key for compatibility */
  safeSetJSON(OLD_CART_STORAGE_KEY, cart);

  updateCartBadges();
  renderCartBody();

  /* Notify other code / tabs */
  try {
    window.dispatchEvent(
      new CustomEvent('psm-cart-updated', {
        detail: {
          cart: cart
        }
      })
    );
  } catch (e) {}

  /* Browser storage event compatibility */
  try {
    localStorage.setItem(
      'psm-cart-updated-at',
      String(Date.now())
    );
  } catch (e) {}
}

/* ================================================================
   RELOAD CART
   ================================================================ */

function reloadCartFromStorage() {

  cart = loadCartFromStorage();

  updateCartBadges();
  renderCartBody();
}

/* ================================================================
   CART BADGES
   ================================================================ */

function updateCartBadges() {

  if (!Array.isArray(cart)) {
    cart = [];
  }

  const totalItems = cart.reduce(function(sum, item) {

    return sum + (
      Number(item.qty) > 0
        ? Number(item.qty)
        : 0
    );

  }, 0);

  const totalPrice = cart.reduce(function(sum, item) {

    const qty = Number(item.qty) || 0;
    const price = Number(item.price) || 0;

    return sum + (qty * price);

  }, 0);

  /* Header badge */
  const badge = document.getElementById('cart-badge');

  if (badge) {

    badge.textContent = totalItems;

    badge.classList.remove('bump');

    void badge.offsetWidth;

    if (totalItems > 0) {
      badge.classList.add('bump');
    }
  }

  /* Mobile badge */
  const mobileBadge =
    document.getElementById('mobile-cart-badge');

  if (mobileBadge) {

    mobileBadge.textContent =
      totalItems === 1
        ? '1 item'
        : totalItems + ' items';
  }

  /* Floating cart */
  const floatingBar =
    document.getElementById('cart-floating-bar');

  const floatingCount =
    document.getElementById('cart-floating-count');

  const floatingTotal =
    document.getElementById('cart-floating-total');

  if (
    floatingBar &&
    floatingCount &&
    floatingTotal
  ) {

    floatingCount.textContent = totalItems;

    floatingTotal.textContent =
      '₹' + totalPrice.toLocaleString('en-IN');

    floatingBar.classList.toggle(
      'visible',
      totalItems > 0
    );
  }

  /* Cart header */
  const cartCounter =
    document.getElementById('cart-items-counter');

  if (cartCounter) {

    cartCounter.textContent =
      currentLang === 'gu'
        ? totalItems + ' વસ્તુઓ'
        : totalItems +
          (totalItems === 1 ? ' item' : ' items');
  }

  /* Subtotal */
  const subtotalVal =
    document.getElementById('cart-subtotal-val');

  if (subtotalVal) {

    subtotalVal.textContent =
      '₹' + totalPrice.toLocaleString('en-IN');
  }

  /* Checkout button */
  const checkoutBtn =
    document.getElementById('btn-cart-checkout');

  if (checkoutBtn) {

    checkoutBtn.disabled =
      totalItems === 0;
  }
}

/* ================================================================
   PRODUCT ADD — MAIN FUNCTION
   ================================================================ */

function addCurrentProductToCart(productId) {

  try {

    const prod = PRODUCTS[productId];

    if (!prod) {

      console.error(
        'Product not found:',
        productId
      );

      showToast(
        currentLang === 'gu'
          ? 'ઉત્પાદન મળ્યું નથી!'
          : 'Product not found!'
      );

      return false;
    }

    const sel =
      selectedWeights[productId] || {
        weightKey: '1kg',
        multiplier: 1,
        label: '1kg',
        labelGu: '1kg',
        labelEn: '1kg',
        price: Number(prod.basePrice) || 0
      };

    const price =
      Number(sel.price) ||
      Math.round(
        Number(prod.basePrice || 0) *
        Number(sel.multiplier || 1)
      );

    const cartItemId =
      String(productId) +
      '_' +
      String(sel.weightKey || '1kg');

    const existingIndex =
      cart.findIndex(function(item) {

        return item.id === cartItemId;

      });

    if (existingIndex !== -1) {

      cart[existingIndex].qty =
        Number(cart[existingIndex].qty || 0) + 1;

    } else {

      cart.push({

        id: cartItemId,

        productId: productId,

        nameGu: prod.nameGu || '',
        nameEn: prod.nameEn || '',

        weightKey:
          sel.weightKey || '1kg',

        weightLabel:
          sel.label ||
          sel.labelGu ||
          sel.labelEn ||
          '1kg',

        weightLabelGu:
          sel.labelGu ||
          sel.label ||
          '1kg',

        weightLabelEn:
          sel.labelEn ||
          sel.label ||
          '1kg',

        multiplier:
          Number(sel.multiplier) || 1,

        basePrice:
          Number(prod.basePrice) || 0,

        price: price,

        img: prod.img || '',

        qty: 1

      });
    }

    /* SAVE */
    saveCart();

    /* Button animation */
    const btn =
      document.getElementById(
        'btn-add-' + productId
      );

    if (btn) {

      const originalHTML =
        btn.innerHTML;

      btn.classList.add('added');

      btn.innerHTML =
        '<span>✓</span> ' +
        '<span class="btn-cart-text">' +
        (
          currentLang === 'gu'
            ? 'ઉમેરાયું'
            : 'Added'
        ) +
        '</span>';

      setTimeout(function() {

        btn.innerHTML = originalHTML;

        btn.classList.remove('added');

      }, 1200);
    }

    /* Toast */
    const displayName =
      currentLang === 'gu'
        ? prod.nameGu
        : prod.nameEn;

    const selectedLabel =
      currentLang === 'gu'
        ? (
            sel.labelGu ||
            sel.label ||
            '1kg'
          )
        : (
            sel.labelEn ||
            sel.label ||
            '1kg'
          );

    const msg =
      currentLang === 'gu'
        ? (
          '&#128722; <strong>' +
          displayName +
          ' (' +
          selectedLabel +
          ')</strong> કાર્ટમાં ઉમેરાયું! ' +
          '<button class="cart-toast-btn" onclick="openCart()">' +
          'કાર્ટ જુઓ &rarr;' +
          '</button>'
        )
        : (
          '&#128722; <strong>' +
          displayName +
          ' (' +
          selectedLabel +
          ')</strong> added to cart! ' +
          '<button class="cart-toast-btn" onclick="openCart()">' +
          'View Cart &rarr;' +
          '</button>'
        );

    showToast(msg);

    return true;

  } catch (error) {

    console.error(
      'Add to cart error:',
      error
    );

    showToast(
      currentLang === 'gu'
        ? 'કાર્ટમાં ઉમેરવામાં ભૂલ આવી!'
        : 'Unable to add item to cart!'
    );

    return false;
  }
}

/* ================================================================
   BACKWARD COMPATIBLE addToCart()
   ------------------------------------------------
   Supports:
   addToCart(productId)
   addToCart(productId, weightKg, qty)
   addToCart(id, nameGu, nameEn, price, img, unit)
   ================================================================ */

function addToCart(
  id,
  arg2,
  arg3,
  arg4,
  arg5,
  arg6
) {

  try {

    /* ---------------------------------------------
       NEW / SHORT CALL
       addToCart('toprapak', 1, 1)
       --------------------------------------------- */

    if (
      typeof arg2 === 'number' ||
      (
        typeof arg2 === 'string' &&
        (
          !arg3 ||
          typeof arg3 === 'number'
        )
      )
    ) {

      const product =
        PRODUCTS[id];

      if (!product) {

        console.error(
          'Product not found:',
          id
        );

        return false;
      }

      const weightKg =
        Number(arg2) > 0
          ? Number(arg2)
          : 1;

      const qty =
        Number(arg3) > 0
          ? Number(arg3)
          : 1;

      const fmt =
        formatWeightLabel(weightKg);

      const calculatedPrice =
        Math.round(
          Number(product.basePrice || 0) *
          weightKg
        );

      const weightKey =
        fmt.key ||
        String(weightKg) + 'kg';

      const cartItemId =
        String(id) +
        '_' +
        String(weightKey);

      const existing =
        cart.find(function(item) {

          return item.id === cartItemId;

        });

      if (existing) {

        existing.qty =
          Number(existing.qty || 0) +
          qty;

      } else {

        cart.push({

          id: cartItemId,

          productId: id,

          nameGu:
            product.nameGu || '',

          nameEn:
            product.nameEn || '',

          weightKey:
            weightKey,

          weightLabel:
            currentLang === 'gu'
              ? fmt.gu
              : fmt.en,

          weightLabelGu:
            fmt.gu,

          weightLabelEn:
            fmt.en,

          multiplier:
            weightKg,

          basePrice:
            Number(product.basePrice || 0),

          price:
            calculatedPrice,

          img:
            product.img || '',

          qty:
            qty
        });
      }

      saveCart();

      showToast(
        currentLang === 'gu'
          ? '🛒 વસ્તુ કાર્ટમાં ઉમેરાઈ!'
          : '🛒 Item added to cart!'
      );

      return true;
    }

    /* ---------------------------------------------
       OLD CALL
       addToCart(
         id,
         nameGu,
         nameEn,
         price,
         img,
         unit
       )
       --------------------------------------------- */

    const nameGu =
      arg2 || PRODUCTS[id]?.nameGu || id;

    const nameEn =
      arg3 || PRODUCTS[id]?.nameEn || id;

    const price =
      Number(arg4) || 0;

    const img =
      arg5 ||
      PRODUCTS[id]?.img ||
      '';

    const unit =
      arg6 ||
      '1kg';

    const sel =
      selectedWeights[id] || {
        weightKey: '1kg',
        multiplier: 1,
        label: unit,
        labelGu: unit,
        labelEn: unit,
        price: price
      };

    const cartItemId =
      String(id) +
      '_' +
      String(
        sel.weightKey || '1kg'
      );

    const existing =
      cart.find(function(item) {

        return item.id === cartItemId;

      });

    if (existing) {

      existing.qty =
        Number(existing.qty || 0) + 1;

    } else {

      cart.push({

        id: cartItemId,

        productId: id,

        nameGu: nameGu,
        nameEn: nameEn,

        weightKey:
          sel.weightKey || '1kg',

        weightLabel:
          sel.label || unit,

        weightLabelGu:
          sel.labelGu ||
          sel.label ||
          unit,

        weightLabelEn:
          sel.labelEn ||
          sel.label ||
          unit,

        multiplier:
          Number(sel.multiplier) || 1,

        basePrice:
          price,

        price:
          Number(sel.price) || price,

        img:
          img,

        qty: 1
      });
    }

    saveCart();

    showToast(
      currentLang === 'gu'
        ? '🛒 <strong>' +
          nameGu +
          '</strong> કાર્ટમાં ઉમેરાયું!'
        : '🛒 <strong>' +
          nameEn +
          '</strong> added!'
    );

    return true;

  } catch (error) {

    console.error(
      'addToCart error:',
      error
    );

    showToast(
      currentLang === 'gu'
        ? 'કાર્ટમાં ઉમેરવામાં ભૂલ!'
        : 'Cart error!'
    );

    return false;
  }
}

/* ================================================================
   UPDATE CART QUANTITY
   ================================================================ */

function updateCartQty(id, delta) {

  const index =
    cart.findIndex(function(item) {

      return item.id === id;

    });

  if (index === -1) return;

  const newQty =
    Number(cart[index].qty || 0) +
    Number(delta || 0);

  if (newQty <= 0) {

    cart.splice(index, 1);

  } else {

    cart[index].qty = newQty;
  }

  saveCart();
}

/* ================================================================
   REMOVE CART ITEM
   ================================================================ */

function removeFromCart(id) {

  cart =
    cart.filter(function(item) {

      return item.id !== id;

    });

  saveCart();

  showToast(
    currentLang === 'gu'
      ? 'વસ્તુ કાર્ટમાંથી હટાવી'
      : 'Item removed from cart'
  );
}

/* ================================================================
   OPEN CART
   ================================================================ */

function openCart() {

  /* Always get latest cart */
  cart =
    loadCartFromStorage();

  const drawer =
    document.getElementById('cart-drawer');

  const backdrop =
    document.getElementById('cart-backdrop');

  if (
    drawer &&
    backdrop
  ) {

    drawer.classList.add('open');

    drawer.setAttribute(
      'aria-hidden',
      'false'
    );

    backdrop.classList.add('open');

    backdrop.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.style.overflow =
      'hidden';

    updateCartBadges();

    renderCartBody();

    restoreCustomerInfo();
  }
}

/* ================================================================
   CLOSE CART
   ================================================================ */

function closeCart() {

  const drawer =
    document.getElementById('cart-drawer');

  const backdrop =
    document.getElementById('cart-backdrop');

  if (
    drawer &&
    backdrop
  ) {

    drawer.classList.remove('open');

    drawer.setAttribute(
      'aria-hidden',
      'true'
    );

    backdrop.classList.remove('open');

    backdrop.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.style.overflow =
      '';
  }
}

/* ================================================================
   TOGGLE CART
   ================================================================ */

function toggleCart() {

  const drawer =
    document.getElementById('cart-drawer');

  if (
    drawer &&
    drawer.classList.contains('open')
  ) {

    closeCart();

  } else {

    openCart();
  }
}

/* ================================================================
   RENDER CART
   ================================================================ */

function renderCartBody() {

  const container =
    document.getElementById('cart-body');

  if (!container) return;

  /* Make sure latest data is used */
  if (!Array.isArray(cart)) {
    cart = [];
  }

  if (cart.length === 0) {

    container.innerHTML = `
      <div class="cart-empty">

        <div class="cart-empty-icon">
          &#128722;
        </div>

        <h4 class="cart-empty-title">

          <span class="gu-text">
            તમારું કાર્ટ ખાલી છે
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Your cart is empty
          </span>

        </h4>

        <p class="cart-empty-desc">

          <span class="gu-text">
            શુદ્ધ ઘીની તાજી મીઠાઈ અને
            સ્વાદિષ્ટ નમકીન કાર્ટમાં ઉમેરો.
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Add pure desi ghee sweets and
            crispy namkeen to get started.
          </span>

        </p>

        <button
          class="btn-browse-sweets"
          onclick="
            closeCart();
            window.location.hash='mithai';
          "
        >

          <span class="gu-text">
            મીઠાઈ જુઓ &rarr;
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Browse Mithai &rarr;
          </span>

        </button>

      </div>
    `;

    applyLang(currentLang);

    updateCartBadges();

    return;
  }

  let html =
    '<div class="cart-items-list">';

  cart.forEach(function(item) {

    const qty =
      Number(item.qty) || 0;

    const price =
      Number(item.price) || 0;

    const itemTotal =
      qty * price;

    html += `

      <div
        class="cart-item"
        data-id="${escapeHtml(item.id)}"
      >

        <img
          src="${escapeHtml(item.img || '')}"
          alt="${escapeHtml(item.nameEn || '')}"
          class="cart-item-img"
          onerror="
            this.src='images/product-toprapak.webp'
          "
        />

        <div class="cart-item-details">

          <div class="cart-item-name">

            <span class="gu-text">
              ${escapeHtml(item.nameGu || '')}
            </span>

            <span
              class="en-text"
              style="display:none"
            >
              ${escapeHtml(item.nameEn || '')}
            </span>

          </div>

          <div class="cart-item-weight-badge">

            &#128230;

            <strong>

              <span class="gu-text">
                ${escapeHtml(
                  item.weightLabelGu ||
                  item.weightLabel ||
                  '1kg'
                )}
              </span>

              <span
                class="en-text"
                style="display:none"
              >
                ${escapeHtml(
                  item.weightLabelEn ||
                  item.weightLabel ||
                  '1kg'
                )}
              </span>

            </strong>

            <span class="cart-item-rate">
              (₹${price.toLocaleString('en-IN')})
            </span>

          </div>

          <div class="cart-item-qty-row">

            <button
              class="cart-qty-btn"
              onclick="
                updateCartQty(
                  '${escapeJs(item.id)}',
                  -1
                )
              "
              aria-label="Decrease quantity"
            >
              &#8722;
            </button>

            <span class="cart-item-qty">
              ${qty}
            </span>

            <button
              class="cart-qty-btn"
              onclick="
                updateCartQty(
                  '${escapeJs(item.id)}',
                  1
                )
              "
              aria-label="Increase quantity"
            >
              &#43;
            </button>

          </div>

        </div>

        <div class="cart-item-right">

          <span class="cart-item-price">
            ₹${itemTotal.toLocaleString('en-IN')}
          </span>

          <button
            class="cart-item-remove"
            onclick="
              removeFromCart(
                '${escapeJs(item.id)}'
              )
            "
            aria-label="Remove item"
            title="Remove"
          >
            &#128465;
          </button>

        </div>

      </div>
    `;
  });

  html += '</div>';

  container.innerHTML = html;

  applyLang(currentLang);

  updateCartBadges();
}

/* ================================================================
   HTML SAFETY
   ================================================================ */

function escapeHtml(value) {

  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(value) {

  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

/* ================================================================
   RESTORE CUSTOMER
   ================================================================ */

function restoreCustomerInfo() {

  try {

    const saved =
      localStorage.getItem('psm-cust');

    if (!saved) return;

    const data =
      JSON.parse(saved);

    const name =
      document.getElementById(
        'cart-cust-name'
      );

    const phone =
      document.getElementById(
        'cart-cust-phone'
      );

    const city =
      document.getElementById(
        'cart-cust-city'
      );

    const address =
      document.getElementById(
        'cart-cust-address'
      );

    if (name && data.name)
      name.value = data.name;

    if (phone && data.phone)
      phone.value = data.phone;

    if (city && data.city)
      city.value = data.city;

    if (address && data.address)
      address.value = data.address;

  } catch (error) {

    console.warn(
      'Customer restore error:',
      error
    );
  }
}

/* ================================================================
   TOAST
   ================================================================ */

let toastTimeout = null;

function showToast(
  html,
  duration = 3500
) {

  const toast =
    document.getElementById(
      'cart-toast'
    );

  if (!toast) return;

  toast.innerHTML = html;

  toast.classList.add('show');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout =
    setTimeout(function() {

      toast.classList.remove(
        'show'
      );

    }, duration);
}

/* ================================================================
   SAVE ORDER LOCALLY
   ================================================================ */

function saveCompletedOrder(orderData) {

  try {

    let orders =
      safeGetJSON(
        ORDERS_STORAGE_KEY,
        []
      );

    if (!Array.isArray(orders)) {
      orders = [];
    }

    /* Prevent duplicate order */
    const alreadyExists =
      orders.some(function(order) {

        return order.id === orderData.id;

      });

    if (!alreadyExists) {

      orders.unshift(orderData);

    }

    /* Keep latest 500 orders */
    if (orders.length > 500) {
      orders = orders.slice(0, 500);
    }

    const saved =
      safeSetJSON(
        ORDERS_STORAGE_KEY,
        orders
      );

    /* Also keep compatibility key if used */
    safeSetJSON(
      'psm-orders',
      orders
    );

    /* Notify admin/order page */
    try {

      window.dispatchEvent(
        new CustomEvent(
          'psm-order-created',
          {
            detail: {
              order: orderData
            }
          }
        )
      );

    } catch (e) {}

    try {

      localStorage.setItem(
        'psm-orders-updated-at',
        String(Date.now())
      );

    } catch (e) {}

    console.log(
      'Order saved successfully:',
      orderData.id
    );

    return saved;

  } catch (error) {

    console.error(
      'Order save error:',
      error
    );

    return false;
  }
}

/* ================================================================
   CONFIRM + SEND WHATSAPP ORDER
   ================================================================ */

function confirmAndSendWhatsAppOrder() {

  /* Always reload latest cart */
  cart =
    loadCartFromStorage();

  if (
    !Array.isArray(cart) ||
    cart.length === 0
  ) {

    showToast(
      currentLang === 'gu'
        ? 'કાર્ટ ખાલી છે!'
        : 'Your cart is empty!'
    );

    updateCartBadges();

    return;
  }

  const nameInput =
    document.getElementById(
      'cart-cust-name'
    );

  const phoneInput =
    document.getElementById(
      'cart-cust-phone'
    );

  const citySelect =
    document.getElementById(
      'cart-cust-city'
    );

  const addressInput =
    document.getElementById(
      'cart-cust-address'
    );

  const notesInput =
    document.getElementById(
      'cart-cust-notes'
    );

  const name =
    nameInput
      ? nameInput.value.trim()
      : '';

  const phone =
    phoneInput
      ? phoneInput.value.trim()
      : '';

  const city =
    citySelect
      ? citySelect.value
      : 'Kherwa';

  const address =
    addressInput
      ? addressInput.value.trim()
      : '';

  const notes =
    notesInput
      ? notesInput.value.trim()
      : '';

  /* Remove previous errors */
  [
    nameInput,
    phoneInput,
    addressInput
  ].forEach(function(input) {

    if (input) {
      input.classList.remove(
        'error'
      );
    }

  });

  /* Name validation */
  if (!name) {

    if (nameInput) {

      nameInput.classList.add(
        'error'
      );

      nameInput.focus();
    }

    showToast(
      currentLang === 'gu'
        ? 'કૃપા કરીને તમારું નામ લખો'
        : 'Please enter your name'
    );

    return;
  }

  /* Phone validation */
  const cleanPhone =
    phone.replace(/\D/g, '');

  if (
    !phone ||
    cleanPhone.length < 8
  ) {

    if (phoneInput) {

      phoneInput.classList.add(
        'error'
      );

      phoneInput.focus();
    }

    showToast(
      currentLang === 'gu'
        ? 'કૃપા કરીને સાચો WhatsApp નંબર લખો'
        : 'Please enter a valid phone number'
    );

    return;
  }

  /* Address validation */
  if (!address) {

    if (addressInput) {

      addressInput.classList.add(
        'error'
      );

      addressInput.focus();
    }

    showToast(
      currentLang === 'gu'
        ? 'કૃપા કરીને ડિલિવરી સરનામું લખો'
        : 'Please enter delivery address'
    );

    return;
  }

  /* Save customer */
  safeSetJSON(
    'psm-cust',
    {
      name: name,
      phone: phone,
      city: city,
      address: address
    }
  );

  /* ============================================================
     ORDER ID
     ============================================================ */

  const orderId =
    'PSM-' +
    Date.now().toString().slice(-8);

  const now =
    new Date();

  const dateStr =
    now.toLocaleString(
      'gu-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  /* ============================================================
     TOTAL
     ============================================================ */

  const totalAmount =
    cart.reduce(
      function(sum, item) {

        return sum +
          (
            (Number(item.qty) || 0) *
            (Number(item.price) || 0)
          );

      },
      0
    );

  const totalUnits =
    cart.reduce(
      function(sum, item) {

        return sum +
          (Number(item.qty) || 0);

      },
      0
    );

  /* ============================================================
     ORDER OBJECT
     ============================================================ */

  const completedOrder = {

    id: orderId,

    date:
      now.toISOString(),

    customerName:
      name,

    phone:
      phone,

    city:
      city,

    address:
      address,

    notes:
      notes,

    status:
      'new',

    totalAmount:
      totalAmount,

    totalKg:
      cart.reduce(
        function(sum, item) {

          return sum +
            (
              (Number(item.multiplier) || 1) *
              (Number(item.qty) || 0)
            );

        },
        0
      ),

    items:
      cart.map(
        function(item) {

          return {

            productId:
              item.productId,

            nameGu:
              item.nameGu,

            nameEn:
              item.nameEn,

            weightLabel:
              item.weightLabelGu ||
              item.weightLabel ||
              '1kg',

            weightKg:
              Number(item.multiplier) || 1,

            unitPrice:
              Number(item.price) || 0,

            qty:
              Number(item.qty) || 0,

            subtotal:
              (
                Number(item.price) || 0
              ) *
              (
                Number(item.qty) || 0
              )
          };

        }
      )
  };

  /* ============================================================
     IMPORTANT:
     SAVE WEBSITE ORDER FIRST
     THEN OPEN WHATSAPP
     ============================================================ */

  const orderSaved =
    saveCompletedOrder(
      completedOrder
    );

  if (!orderSaved) {

    const retry =
      confirm(
        'Order website માં save થઈ શક્યો નથી. ' +
        'તમે WhatsApp પર મોકલવા માંગો છો?'
      );

    if (!retry) {
      return;
    }
  }

  /* ============================================================
     WHATSAPP MESSAGE
     ============================================================ */

  const lines = [];

  lines.push(
    '*🛍️ પટેલ સ્વીટ માર્ટ — નવો ઓર્ડર / NEW ORDER*'
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  lines.push(
    '*ઓર્ડર ક્રમાંક (Order ID):* #' +
    orderId
  );

  lines.push(
    '*તારીખ (Date):* ' +
    dateStr
  );

  lines.push('');

  lines.push(
    '*👤 ગ્રાહકની વિગત / Customer Details:*'
  );

  lines.push(
    '• *નામ:* ' +
    name
  );

  lines.push(
    '• *ફોન:* ' +
    phone
  );

  lines.push(
    '• *શહેર:* ' +
    city
  );

  lines.push(
    '• *સરનામું:* ' +
    address
  );

  if (notes) {

    lines.push(
      '• *ઓર્ડર નોંધ:* ' +
      notes
    );
  }

  lines.push('');

  lines.push(
    '*📦 ઓર્ડર કરેલી વસ્તુઓ:*'
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  cart.forEach(
    function(item, index) {

      const itemTotal =
        (
          Number(item.qty) || 0
        ) *
        (
          Number(item.price) || 0
        );

      lines.push(
        (
          index + 1
        ) +
        '. *' +
        (
          item.nameGu || ''
        ) +
        ' (' +
        (
          item.nameEn || ''
        ) +
        ')*'
      );

      lines.push(
        '   ▸ વજન: *' +
        (
          item.weightLabel ||
          item.weightLabelGu ||
          '1kg'
        ) +
        '* | જથ્થો: *' +
        item.qty +
        ' પેક* = *₹' +
        itemTotal.toLocaleString(
          'en-IN'
        ) +
        '*'
      );
    }
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  lines.push(
    '*કુલ પેક:* ' +
    totalUnits
  );

  lines.push(
    '*કુલ રકમ:* *₹' +
    totalAmount.toLocaleString(
      'en-IN'
    ) +
    '*'
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  lines.push(
    '📍 *ડિલિવરી:* ખેરવા / અમદાવાદ'
  );

  lines.push('');

  lines.push(
    'કૃપા કરીને આ ઓર્ડર કન્ફર્મ કરો અને ડિલિવરી સમય જણાવો. આભાર!'
  );

  lines.push(
    '_Please confirm this order and advise delivery time. Thank you!_'
  );

  const waUrl =
    'https://wa.me/919173565466?text=' +
    encodeURIComponent(
      lines.join('\n')
    );

  /* ============================================================
     BUTTON
     ============================================================ */

  const btn =
    document.getElementById(
      'btn-cart-checkout'
    );

  if (btn) {

    btn.disabled = true;

    btn.innerHTML =
      '&#9203; Sending to WhatsApp...';
  }

  /* ============================================================
     OPEN WHATSAPP
     ============================================================ */

  try {

    window.open(
      waUrl,
      '_blank',
      'noopener,noreferrer'
    );

  } catch (error) {

    console.error(
      'WhatsApp open error:',
      error
    );
  }

  /* ============================================================
     CLEAR CART ONLY AFTER ORDER IS SAVED
     ============================================================ */

  cart = [];

  saveCart();

  /* ============================================================
     ADMIN / WEBSITE SUCCESS SCREEN
     ============================================================ */

  const body =
    document.getElementById(
      'cart-body'
    );

  if (body) {

    body.innerHTML = `

      <div
        class="cart-empty"
        style="padding:30px 10px;"
      >

        <div
          class="cart-empty-icon"
          style="
            background:rgba(37,211,102,0.1);
            color:#25D366;
          "
        >
          &#10003;
        </div>

        <h4 class="cart-empty-title">

          <span class="gu-text">
            ઓર્ડર મોકલાઈ ગયો!
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Order Placed via WhatsApp!
          </span>

        </h4>

        <p class="cart-empty-desc">

          <span class="gu-text">
            ઓર્ડર ક્રમાંક #${orderId}
            સફળતાપૂર્વક સેવ થયો છે.
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Order #${orderId}
            has been saved successfully.
          </span>

        </p>

        <button
          class="btn-browse-sweets"
          onclick="closeCart()"
        >

          <span class="gu-text">
            પૂર્ણ / Done
          </span>

          <span
            class="en-text"
            style="display:none"
          >
            Done
          </span>

        </button>

      </div>
    `;

    applyLang(currentLang);
  }

  /* ============================================================
     SEND TO SUPABASE
     ============================================================ */

  saveOrderToSupabase(
    completedOrder
  );

  /* Update badges */
  updateCartBadges();
}

/* ================================================================
   SUPABASE ORDER SAVE
   ================================================================ */

function saveOrderToSupabase(
  orderData
) {

  const url =
    localStorage.getItem(
      'psm_supabase_url'
    );

  const key =
    localStorage.getItem(
      'psm_supabase_key'
    );

  if (!url || !key) {

    console.log(
      'Supabase not configured. Local order saved.'
    );

    return;
  }

  fetch(
    url.replace(/\/+$/, '') +
    '/rest/v1/orders',
    {
      method: 'POST',

      headers: {

        'apikey':
          key,

        'Authorization':
          'Bearer ' + key,

        'Content-Type':
          'application/json',

        'Prefer':
          'return=representation'
      },

      body:
        JSON.stringify({

          order_number:
            orderData.id,

          customer_name:
            orderData.customerName,

          customer_phone:
            orderData.phone,

          delivery_city:
            orderData.city,

          delivery_address:
            orderData.address,

          order_notes:
            orderData.notes || '',

          total_amount:
            orderData.totalAmount,

          total_items:
            orderData.items.reduce(
              function(sum, item) {

                return sum +
                  (
                    Number(item.qty) || 0
                  );

              },
              0
            ),

          status:
            'new'
        })
    }
  )
  .then(
    async function(response) {

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          'Supabase order error: ' +
          response.status +
          ' ' +
          errorText
        );
      }

      return response.json();
    }
  )
  .then(
    function(data) {

      console.log(
        'Supabase order saved:',
        data
      );

      if (
        !Array.isArray(data) ||
        !data[0] ||
        !data[0].id
      ) {

        return;
      }

      const orderDbId =
        data[0].id;

      const itemsPayload =
        orderData.items.map(
          function(item) {

            return {

              order_id:
                orderDbId,

              product_id:
                item.productId,

              product_name_gu:
                item.nameGu,

              product_name_en:
                item.nameEn,

              weight_label:
                item.weightLabel,

              weight_kg:
                item.weightKg,

              unit_price:
                item.unitPrice,

              quantity:
                item.qty,

              subtotal:
                item.subtotal
            };
          }
        );

      return fetch(
        url.replace(/\/+$/, '') +
        '/rest/v1/order_items',
        {
          method: 'POST',

          headers: {

            'apikey':
              key,

            'Authorization':
              'Bearer ' + key,

            'Content-Type':
              'application/json',

            'Prefer':
              'return=minimal'
          },

          body:
            JSON.stringify(
              itemsPayload
            )
        }
      );
    }
  )
  .then(
    function(response) {

      if (
        response &&
        !response.ok
      ) {

        console.warn(
          'Supabase order_items save failed:',
          response.status
        );

      } else if (response) {

        console.log(
          'Order items saved successfully.'
        );
      }
    }
  )
  .catch(
    function(error) {

      console.warn(
        'Supabase sync failed:',
        error
      );

      /*
       IMPORTANT:
       Website local order is already saved.
       Therefore WhatsApp order is NOT lost.
      */
    }
  );
}

/* ================================================================
   CROSS TAB / ADMIN PAGE SYNC
   ================================================================ */

window.addEventListener(
  'storage',
  function(event) {

    if (
      event.key === CART_STORAGE_KEY ||
      event.key === OLD_CART_STORAGE_KEY ||
      event.key === 'psm-cart-updated-at'
    ) {

      reloadCartFromStorage();
    }

    if (
      event.key === ORDERS_STORAGE_KEY ||
      event.key === 'psm-orders-updated-at'
    ) {

      if (
        typeof checkOwnerAuthState ===
        'function'
      ) {

        checkOwnerAuthState();
      }

      if (
        typeof refreshSingleHubOrders ===
        'function'
      ) {

        refreshSingleHubOrders();
      }
    }

  }
);

/* Custom cart event */
window.addEventListener(
  'psm-cart-updated',
  function() {

    updateCartBadges();

  }
);

/* Custom order event */
window.addEventListener(
  'psm-order-created',
  function() {

    if (
      typeof checkOwnerAuthState ===
      'function'
    ) {

      checkOwnerAuthState();
    }

    if (
      typeof refreshSingleHubOrders ===
      'function'
    ) {

      refreshSingleHubOrders();
    }

  }
);

/* ================================================================
   ESCAPE CLOSE
   ================================================================ */

document.addEventListener(
  'keydown',
  function(event) {

    if (event.key === 'Escape') {

      closeCart();
    }

  }
);

/* ================================================================
   CART INITIALIZATION
   ================================================================ */

function initFixedCartSystem() {

  cart =
    loadCartFromStorage();

  updateCartBadges();

  renderCartBody();

  console.log(
    'Patel Sweet Mart Cart:',
    cart
  );
}

/* Run */
if (
  document.readyState ===
  'loading'
) {

  document.addEventListener(
    'DOMContentLoaded',
    initFixedCartSystem
  );

} else {

  initFixedCartSystem();
}
```
