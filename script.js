/* ================================================================
   CONFIRM + SAVE ORDER + WHATSAPP CHECKOUT
   IMPORTANT:
   1. Order is saved to localStorage FIRST
   2. Then Supabase sync is attempted
   3. Then WhatsApp opens
   4. Admin panel can immediately read psm_orders
   ================================================================ */

function confirmAndSendWhatsAppOrder() {
  if (cart.length === 0) {
    showToast(currentLang === 'gu'
      ? 'કાર્ટ ખાલી છે!'
      : 'Your cart is empty!');
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

  /* ---------------- VALIDATION ---------------- */

  [nameInput, phoneInput, addressInput].forEach(function (inp) {
    if (inp) inp.classList.remove('error');
  });

  if (!name) {
    if (nameInput) {
      nameInput.classList.add('error');
      nameInput.focus();
    }

    showToast(currentLang === 'gu'
      ? 'કૃપા કરીને તમારું નામ લખો'
      : 'Please enter your name');

    return;
  }

  const cleanPhone = phone.replace(/\D/g, '');

  if (!cleanPhone || cleanPhone.length < 8) {
    if (phoneInput) {
      phoneInput.classList.add('error');
      phoneInput.focus();
    }

    showToast(currentLang === 'gu'
      ? 'કૃપા કરીને સાચો WhatsApp નંબર લખો'
      : 'Please enter a valid phone number');

    return;
  }

  if (!address) {
    if (addressInput) {
      addressInput.classList.add('error');
      addressInput.focus();
    }

    showToast(currentLang === 'gu'
      ? 'કૃપા કરીને ડિલિવરી સરનામું લખો'
      : 'Please enter delivery address');

    return;
  }

  /* ---------------- SAVE CUSTOMER INFO ---------------- */

  try {
    localStorage.setItem(
      'psm-cust',
      JSON.stringify({
        name: name,
        phone: phone,
        city: city,
        address: address
      })
    );
  } catch (e) {
    console.warn('Customer info save failed:', e);
  }

  /* ---------------- UNIQUE ORDER ID ---------------- */

  const orderId =
    'PSM-' +
    Date.now().toString().slice(-8) +
    '-' +
    Math.floor(100 + Math.random() * 900);

  const now = new Date();

  const dateStr = now.toLocaleString('gu-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  /* ---------------- CALCULATE TOTAL ---------------- */

  const totalAmount = cart.reduce(function (sum, item) {
    return sum + (item.qty * item.price);
  }, 0);

  const totalUnits = cart.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);

  /* ---------------- CREATE ORDER OBJECT ---------------- */

  const completedOrder = {
    id: orderId,

    date: now.toISOString(),

    customerName: name,
    phone: phone,
    city: city,
    address: address,
    notes: notes,

    status: 'new',

    totalAmount: totalAmount,

    totalItems: totalUnits,

    totalKg: cart.reduce(function (sum, item) {
      return sum + ((item.multiplier || 1) * item.qty);
    }, 0),

    items: cart.map(function (item) {
      return {
        productId: item.productId,

        nameGu: item.nameGu,
        nameEn: item.nameEn,

        weightLabel:
          item.weightLabelGu ||
          item.weightLabel ||
          '1kg',

        weightKg:
          item.multiplier ||
          1,

        unitPrice:
          Number(item.price) || 0,

        qty:
          Number(item.qty) || 1,

        subtotal:
          (Number(item.price) || 0) *
          (Number(item.qty) || 1)
      };
    }),

    source: 'website',
    whatsappSent: false,
    supabaseSynced: false
  };

  /* ================================================================
     IMPORTANT:
     SAVE ORDER TO LOCALSTORAGE BEFORE OPENING WHATSAPP
     ================================================================ */

  let savedSuccessfully = false;

  try {
    let existingOrders = [];

    const storedOrders =
      localStorage.getItem('psm_orders');

    if (storedOrders) {
      try {
        const parsedOrders = JSON.parse(storedOrders);

        if (Array.isArray(parsedOrders)) {
          existingOrders = parsedOrders;
        }
      } catch (parseError) {
        console.warn(
          'Old psm_orders data was invalid. Starting fresh.',
          parseError
        );
      }
    }

    /* Prevent accidental duplicate order IDs */

    existingOrders =
      existingOrders.filter(function (order) {
        return order && order.id !== orderId;
      });

    existingOrders.unshift(completedOrder);

    localStorage.setItem(
      'psm_orders',
      JSON.stringify(existingOrders)
    );

    /* Verify that browser actually saved it */

    const verifyOrders =
      JSON.parse(
        localStorage.getItem('psm_orders') || '[]'
      );

    const verifyOrder =
      verifyOrders.find(function (order) {
        return order.id === orderId;
      });

    if (verifyOrder) {
      savedSuccessfully = true;
    }

  } catch (error) {

    console.error(
      'ORDER LOCAL STORAGE SAVE ERROR:',
      error
    );

    showToast(
      currentLang === 'gu'
        ? '❌ ઓર્ડર સેવ કરવામાં સમસ્યા આવી.'
        : '❌ Failed to save order.'
    );

    return;
  }

  /* ---------------- UPDATE ADMIN COUNTER ---------------- */

  if (savedSuccessfully) {

    try {

      const allOrders =
        JSON.parse(
          localStorage.getItem('psm_orders') || '[]'
        );

      const counterChip =
        document.getElementById(
          'owner-orders-counter-chip'
        );

      if (counterChip) {
        counterChip.textContent =
          '(' + allOrders.length + ')';
      }

      /* If admin orders panel is currently open,
         refresh it immediately */

      if (
        typeof refreshSingleHubOrders === 'function'
      ) {
        refreshSingleHubOrders();
      }

    } catch (e) {
      console.warn(
        'Admin order counter update failed:',
        e
      );
    }
  }

  /* ================================================================
     CREATE WHATSAPP MESSAGE
     ================================================================ */

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
    '• *નામ:* ' + name
  );

  lines.push(
    '• *ફોન:* ' + phone
  );

  lines.push(
    '• *શહેર:* ' + city
  );

  lines.push(
    '• *સરનામું:* ' + address
  );

  if (notes) {
    lines.push(
      '• *ઓર્ડર નોંધ:* ' + notes
    );
  }

  lines.push('');

  lines.push(
    '*📦 ઓર્ડર કરેલી વસ્તુઓ:*'
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  completedOrder.items.forEach(
    function (item, index) {

      lines.push(
        (index + 1) +
        '. *' +
        item.nameGu +
        ' (' +
        item.nameEn +
        ')*'
      );

      lines.push(
        '   ▸ વજન: *' +
        item.weightLabel +
        '* | જથ્થો: *' +
        item.qty +
        ' પેક* (₹' +
        item.unitPrice.toLocaleString('en-IN') +
        '/પેક) = *₹' +
        item.subtotal.toLocaleString('en-IN') +
        '*'
      );
    }
  );

  lines.push(
    '━━━━━━━━━━━━━━━━━━━━━'
  );

  lines.push(
    '*કુલ પેક (Total Packs):* ' +
    totalUnits
  );

  lines.push(
    '*કુલ રકમ (Grand Total):* *₹' +
    totalAmount.toLocaleString('en-IN') +
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
    '_Please confirm this customized order and advise delivery time. Thank you!_'
  );

  const waUrl =
    'https://wa.me/919173565466?text=' +
    encodeURIComponent(
      lines.join('\n')
    );

  /* ---------------- BUTTON STATE ---------------- */

  const btn =
    document.getElementById(
      'btn-cart-checkout'
    );

  if (btn) {
    btn.disabled = true;
    btn.innerHTML =
      '&#9203; Sending to WhatsApp...';
  }

  /* ================================================================
     SUPABASE SAVE
     ================================================================ */

  saveOrderToSupabase(completedOrder)
    .then(function (success) {

      if (success) {

        try {

          const orders =
            JSON.parse(
              localStorage.getItem(
                'psm_orders'
              ) || '[]'
            );

          const index =
            orders.findIndex(
              function (order) {
                return order.id === orderId;
              }
            );

          if (index !== -1) {
            orders[index].supabaseSynced = true;

            localStorage.setItem(
              'psm_orders',
              JSON.stringify(orders)
            );
          }

        } catch (e) {
          console.warn(
            'Supabase sync flag update failed:',
            e
          );
        }

      }

    })
    .catch(function (error) {

      console.warn(
        'Supabase sync failed, but local order is safe:',
        error
      );

    })
    .finally(function () {

      /* ============================================================
         OPEN WHATSAPP ONLY AFTER LOCAL ORDER IS ALREADY SAVED
         ============================================================ */

      try {

        window.open(
          waUrl,
          '_blank',
          'noopener,noreferrer'
        );

      } catch (error) {

        console.warn(
          'WhatsApp open failed:',
          error
        );

      }

      /* ---------------- SUCCESS SCREEN ---------------- */

      const body =
        document.getElementById(
          'cart-body'
        );

      if (body) {

        body.innerHTML = `
          <div class="cart-empty" style="padding:30px 10px;">

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
                ઓર્ડર સફળતાપૂર્વક સેવ થયો!
              </span>

              <span
                class="en-text"
                style="display:none"
              >
                Order Saved Successfully!
              </span>

            </h4>

            <p class="cart-empty-desc">

              <span class="gu-text">
                ઓર્ડર ક્રમાંક #${orderId}
                website માં સેવ થઈ ગયો છે
                અને WhatsApp ખોલવામાં આવ્યું છે.
              </span>

              <span
                class="en-text"
                style="display:none"
              >
                Order #${orderId} has been saved
                to the website and WhatsApp has
                been opened.
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

      /* ---------------- CLEAR CART ---------------- */

      cart = [];

      saveCart();

      /* ---------------- RESET BUTTON ---------------- */

      if (btn) {

        btn.disabled = false;

        btn.innerHTML =
          currentLang === 'gu'
            ? '&#128172; WhatsApp પર મોકલો'
            : '&#128172; Send via WhatsApp';

      }

      /* ---------------- FINAL ADMIN REFRESH ---------------- */

      if (
        typeof refreshSingleHubOrders === 'function'
      ) {
        refreshSingleHubOrders();
      }

    });
}


/* ================================================================
   SUPABASE ORDER SAVE
   ================================================================ */

async function saveOrderToSupabase(orderData) {

  const url =
    localStorage.getItem(
      'psm_supabase_url'
    );

  const key =
    localStorage.getItem(
      'psm_supabase_key'
    );

  /* Supabase is optional.
     LocalStorage remains the main website order storage. */

  if (!url || !key) {
    console.log(
      'Supabase not configured. Order saved locally.'
    );

    return false;
  }

  try {

    /* ---------------- CREATE MAIN ORDER ---------------- */

    const orderResponse =
      await fetch(
        `${url}/rest/v1/orders`,
        {
          method: 'POST',

          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },

          body: JSON.stringify({
            order_number: orderData.id,

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
              Number(orderData.totalAmount) || 0,

            total_items:
              Number(orderData.totalItems) ||
              orderData.items.reduce(
                (sum, item) =>
                  sum + Number(item.qty || 0),
                0
              ),

            status: 'new'
          })
        }
      );

    if (!orderResponse.ok) {

      const errorText =
        await orderResponse.text();

      console.error(
        'Supabase orders INSERT failed:',
        orderResponse.status,
        errorText
      );

      return false;
    }

    const orderResult =
      await orderResponse.json();

    if (
      !Array.isArray(orderResult) ||
      !orderResult[0] ||
      !orderResult[0].id
    ) {

      console.warn(
        'Supabase returned no order ID.'
      );

      return false;
    }

    const orderDbId =
      orderResult[0].id;

    /* ---------------- CREATE ORDER ITEMS ---------------- */

    const itemsPayload =
      orderData.items.map(
        function (item) {

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
              Number(item.weightKg) || 1,

            unit_price:
              Number(item.unitPrice) || 0,

            quantity:
              Number(item.qty) || 1,

            subtotal:
              Number(item.subtotal) || 0

          };

        }
      );

    if (itemsPayload.length > 0) {

      const itemsResponse =
        await fetch(
          `${url}/rest/v1/order_items`,
          {
            method: 'POST',

            headers: {
              'apikey': key,
              'Authorization': `Bearer ${key}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },

            body:
              JSON.stringify(itemsPayload)
          }
        );

      if (!itemsResponse.ok) {

        const itemsError =
          await itemsResponse.text();

        console.error(
          'Supabase order_items INSERT failed:',
          itemsResponse.status,
          itemsError
        );

        /*
         * Main order was already created.
         * Do not mark complete sync.
         */

        return false;
      }
    }

    console.log(
      'Order successfully saved to Supabase:',
      orderData.id
    );

    return true;

  } catch (error) {

    console.error(
      'Supabase connection error:',
      error
    );

    return false;
  }
}
