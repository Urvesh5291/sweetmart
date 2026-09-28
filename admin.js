/* ================================================================
   PATEL SWEET MART — ADMIN & BUSINESS ANALYTICS JAVASCRIPT
   Updated Order Sync System
   LocalStorage + Supabase Hybrid
   ================================================================ */

'use strict';

/* ================================================================
   DEFAULT PRODUCT MASTER DATA
   ================================================================ */

const DEFAULT_PRODUCTS = {
  toprapak: {
    id: 'toprapak',
    nameGu: 'ટોપરાપાક',
    nameEn: 'Toprapak',
    basePrice: 500,
    img: 'images/product-toprapak.jpg',
    category: 'mithai',
    isAvailable: true
  },

  mohanthal: {
    id: 'mohanthal',
    nameGu: 'મોહનથાળ',
    nameEn: 'Mohanthal',
    basePrice: 480,
    img: 'images/product-mohanthal.jpg',
    category: 'mithai',
    isAvailable: true
  },

  penda: {
    id: 'penda',
    nameGu: 'માવા પેંડા',
    nameEn: 'Mava Penda',
    basePrice: 520,
    img: 'images/product-penda.jpg',
    category: 'mithai',
    isAvailable: true
  },

  ladva: {
    id: 'ladva',
    nameGu: 'સ્પેશિયલ લાડવા',
    nameEn: 'Special Ladva',
    basePrice: 400,
    img: 'images/product-ladva.jpg',
    category: 'mithai',
    isAvailable: true
  },

  jalebi: {
    id: 'jalebi',
    nameGu: 'ગરમ જલેબી',
    nameEn: 'Hot Jalebi',
    basePrice: 380,
    img: 'images/product-jalebi.jpg',
    category: 'mithai',
    isAvailable: true
  },

  feni: {
    id: 'feni',
    nameGu: 'સ્વાદિષ્ટ ફેણી',
    nameEn: 'Feni',
    basePrice: 450,
    img: 'images/product-feni.jpg',
    category: 'mithai',
    isAvailable: true
  },

  ganthiya: {
    id: 'ganthiya',
    nameGu: 'ચટાકેદાર ગાંઠિયા',
    nameEn: 'Ganthiya',
    basePrice: 340,
    img: 'images/product-ganthiya.jpg',
    category: 'namkeen',
    isAvailable: true
  },

  chorafari: {
    id: 'chorafari',
    nameGu: 'ચોરાફળી',
    nameEn: 'Chorafari',
    basePrice: 360,
    img: 'images/product-chorafari.jpg',
    category: 'namkeen',
    isAvailable: true
  },

  chavanu: {
    id: 'chavanu',
    nameGu: 'મિક્સ ચવાણું',
    nameEn: 'Mix Chavanu',
    basePrice: 350,
    img: 'images/product-chavanu.jpg',
    category: 'namkeen',
    isAvailable: true
  },

  farali: {
    id: 'farali',
    nameGu: 'ફરાળી નાસ્તો',
    nameEn: 'Farali Snacks',
    basePrice: 400,
    img: 'images/product-farali.jpg',
    category: 'namkeen',
    isAvailable: true
  }
};


/* ================================================================
   DEMO ORDERS
   ================================================================ */

const DEMO_ORDERS = [
  {
    id: 'PSM-1048',
    date: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customerName: 'હરેશભાઈ પટેલ (Haresh Patel)',
    phone: '98250 12345',
    city: 'ખેરવા (Kherwa)',
    address: '15, અંબિકા સોસાયટી, કોલેજ રોડ, ખેરવા',
    notes: 'દિવાળી પૂજા પ્રસાદ માટે - સવારે 10 વાગ્યા સુધી',
    status: 'new',
    items: [
      {
        productId: 'toprapak',
        nameGu: 'ટોપરાપાક',
        nameEn: 'Toprapak',
        weightLabel: '1.25 kg (સવા કિલો)',
        weightKg: 1.25,
        unitPrice: 625,
        qty: 2,
        subtotal: 1250
      },
      {
        productId: 'mohanthal',
        nameGu: 'મોહનથાળ',
        nameEn: 'Mohanthal',
        weightLabel: '500g (અડધો કિલો)',
        weightKg: 0.5,
        unitPrice: 240,
        qty: 1,
        subtotal: 240
      },
      {
        productId: 'ganthiya',
        nameGu: 'ચટાકેદાર ગાંઠિયા',
        nameEn: 'Ganthiya',
        weightLabel: '500g',
        weightKg: 0.5,
        unitPrice: 170,
        qty: 2,
        subtotal: 340
      }
    ],
    totalAmount: 1830,
    totalKg: 4.0
  },

  {
    id: 'PSM-1047',
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    customerName: 'દિલીપભાઈ શાહ (Dilip Shah)',
    phone: '98795 67890',
    city: 'અમદાવાદ (Ahmedabad)',
    address: 'B-402, રોયલ ઓર્કિડ, બોડકદેવ, અમદાવાદ',
    notes: 'ગિફ્ટિંગ બોક્સ - એક્સપ્રેસ કુરિયર',
    status: 'confirmed',
    items: [
      {
        productId: 'mohanthal',
        nameGu: 'મોહનથાળ',
        nameEn: 'Mohanthal',
        weightLabel: '1.25 kg (સવા કિલો)',
        weightKg: 1.25,
        unitPrice: 600,
        qty: 3,
        subtotal: 1800
      },
      {
        productId: 'penda',
        nameGu: 'માવા પેંડા',
        nameEn: 'Mava Penda',
        weightLabel: '1 kg',
        weightKg: 1,
        unitPrice: 520,
        qty: 2,
        subtotal: 1040
      }
    ],
    totalAmount: 2840,
    totalKg: 5.75
  },

  {
    id: 'PSM-1046',
    date: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    customerName: 'કિરીટભાઈ પ્રજાપતિ (Kirit Prajapati)',
    phone: '94280 54321',
    city: 'ખેરવા (Kherwa)',
    address: 'રામજી મંદિર સામે, મુખ્ય બજાર, ખેરવા',
    notes: 'દુકાનેથી પિકઅપ',
    status: 'packed',
    items: [
      {
        productId: 'jalebi',
        nameGu: 'ગરમ જલેબી',
        nameEn: 'Hot Jalebi',
        weightLabel: '500g',
        weightKg: 0.5,
        unitPrice: 190,
        qty: 1,
        subtotal: 190
      },
      {
        productId: 'ganthiya',
        nameGu: 'ચટાકેદાર ગાંઠિયા',
        nameEn: 'Ganthiya',
        weightLabel: '250g',
        weightKg: 0.25,
        unitPrice: 85,
        qty: 2,
        subtotal: 170
      }
    ],
    totalAmount: 360,
    totalKg: 1
  },

  {
    id: 'PSM-1045',
    date: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    customerName: 'ભાવેશભાઈ પટેલ (Bhavesh Patel)',
    phone: '99099 88776',
    city: 'અમદાવાદ (Ahmedabad)',
    address: '7, શિવ બંગલોઝ, થલતેજ, અમદાવાદ',
    notes: 'લગ્ન પ્રસંગ - તાજી બનાવટ',
    status: 'dispatched',
    items: [
      {
        productId: 'toprapak',
        nameGu: 'ટોપરાપાક',
        nameEn: 'Toprapak',
        weightLabel: '2 kg',
        weightKg: 2,
        unitPrice: 1000,
        qty: 2,
        subtotal: 2000
      },
      {
        productId: 'ladva',
        nameGu: 'સ્પેશિયલ લાડવા',
        nameEn: 'Special Ladva',
        weightLabel: '1.5 kg (દોઢ કિલો)',
        weightKg: 1.5,
        unitPrice: 600,
        qty: 2,
        subtotal: 1200
      },
      {
        productId: 'chorafari',
        nameGu: 'ચોરાફળી',
        nameEn: 'Chorafari',
        weightLabel: '500g',
        weightKg: 0.5,
        unitPrice: 180,
        qty: 2,
        subtotal: 360
      }
    ],
    totalAmount: 3560,
    totalKg: 8
  },

  {
    id: 'PSM-1044',
    date: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    customerName: 'મહેશભાઈ ચૌધરી (Mahesh Chaudhari)',
    phone: '97123 45678',
    city: 'ખેરવા (Kherwa)',
    address: 'સ્વામિનારાયણ સોસાયટી, ખેરવા',
    notes: '',
    status: 'delivered',
    items: [
      {
        productId: 'mohanthal',
        nameGu: 'મોહનથાળ',
        nameEn: 'Mohanthal',
        weightLabel: '1 kg',
        weightKg: 1,
        unitPrice: 480,
        qty: 1,
        subtotal: 480
      },
      {
        productId: 'chavanu',
        nameGu: 'મિક્સ ચવાણું',
        nameEn: 'Mix Chavanu',
        weightLabel: '500g',
        weightKg: 0.5,
        unitPrice: 175,
        qty: 1,
        subtotal: 175
      }
    ],
    totalAmount: 655,
    totalKg: 1.5
  }
];


/* ================================================================
   GLOBAL STATE
   ================================================================ */

let allOrders = [];
let allProducts = { ...DEFAULT_PRODUCTS };

let currentActiveTab = 'orders';
let currentStatusFilter = 'all';
let currentDateFilter = 'all';
let searchQuery = '';

let supabaseClient = null;
let orderSyncTimer = null;


/* ================================================================
   ORDER NORMALIZER
   ================================================================ */

function normalizeOrder(order) {
  if (!order || typeof order !== 'object') return null;

  const items = Array.isArray(order.items)
    ? order.items.map(item => ({
        productId: item.productId || item.product_id || '',
        nameGu: item.nameGu || item.product_name_gu || item.name || 'ઉત્પાદન',
        nameEn: item.nameEn || item.product_name_en || item.name || 'Product',
        weightLabel: item.weightLabel || item.weight_label || '1 kg',
        weightKg: Number(item.weightKg ?? item.weight_kg ?? 1),
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0),
        qty: Number(item.qty ?? item.quantity ?? 1),
        subtotal: Number(item.subtotal ?? 0)
      }))
    : [];

  const calculatedTotal = items.reduce(
    (sum, item) => sum + (Number(item.subtotal) || 0),
    0
  );

  const calculatedKg = items.reduce(
    (sum, item) =>
      sum + ((Number(item.weightKg) || 0) * (Number(item.qty) || 0)),
    0
  );

  return {
    id: String(
      order.id ||
      order.order_number ||
      ('PSM-' + Date.now())
    ),

    date:
      order.date ||
      order.created_at ||
      new Date().toISOString(),

    customerName:
      order.customerName ||
      order.customer_name ||
      'ગ્રાહક',

    phone:
      order.phone ||
      order.customer_phone ||
      '',

    city:
      order.city ||
      order.delivery_city ||
      '',

    address:
      order.address ||
      order.delivery_address ||
      '',

    notes:
      order.notes ||
      order.order_notes ||
      '',

    status:
      order.status ||
      'new',

    items,

    totalAmount:
      Number(
        order.totalAmount ??
        order.total_amount ??
        calculatedTotal
      ) || 0,

    totalKg:
      Number(
        order.totalKg ??
        order.total_kg ??
        calculatedKg
      ) || 0
  };
}


/* ================================================================
   READ LOCAL ORDERS SAFELY
   ================================================================ */

function readLocalOrders() {
  try {
    const raw = localStorage.getItem('psm_orders');

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeOrder)
      .filter(Boolean);

  } catch (error) {
    console.error('Local orders read error:', error);
    return [];
  }
}


/* ================================================================
   SAVE LOCAL ORDERS
   ================================================================ */

function saveLocalOrders(orders) {
  try {
    localStorage.setItem(
      'psm_orders',
      JSON.stringify(orders)
    );

    return true;
  } catch (error) {
    console.error('Local orders save error:', error);
    return false;
  }
}


/* ================================================================
   MERGE ORDERS
   ================================================================ */

function mergeOrders(localOrders, cloudOrders) {

  const map = new Map();

  /* Cloud first */
  cloudOrders.forEach(order => {
    const normalized = normalizeOrder(order);

    if (normalized) {
      map.set(normalized.id, normalized);
    }
  });

  /* Local orders overwrite same ID */
  localOrders.forEach(order => {
    const normalized = normalizeOrder(order);

    if (normalized) {
      map.set(normalized.id, normalized);
    }
  });

  const merged = Array.from(map.values());

  merged.sort((a, b) => {
    return new Date(b.date).getTime() -
           new Date(a.date).getTime();
  });

  return merged;
}


/* ================================================================
   LOAD DATA STORE
   ================================================================ */

function initDataStore() {

  /* ---------------- ORDERS ---------------- */

  let savedOrders = readLocalOrders();

  /*
     IMPORTANT:
     Demo orders are inserted only if there are NO orders.
     Real WhatsApp orders will never be replaced by demo data.
  */

  if (savedOrders.length === 0) {
    savedOrders = DEMO_ORDERS
      .map(normalizeOrder)
      .filter(Boolean);

    saveLocalOrders(savedOrders);
  }

  allOrders = savedOrders;


  /* ---------------- CUSTOM PRODUCTS ---------------- */

  try {

    const customCatalog =
      localStorage.getItem('psm_custom_catalog');

    if (customCatalog) {

      const parsedCustom =
        JSON.parse(customCatalog);

      allProducts = {
        ...DEFAULT_PRODUCTS,
        ...parsedCustom
      };

    } else {

      allProducts = {
        ...DEFAULT_PRODUCTS
      };
    }

  } catch (error) {

    allProducts = {
      ...DEFAULT_PRODUCTS
    };
  }


  /* ---------------- CUSTOM PRICES ---------------- */

  try {

    const savedPrices =
      localStorage.getItem('psm_product_prices');

    if (savedPrices) {

      const parsed =
        JSON.parse(savedPrices);

      Object.keys(parsed).forEach(id => {

        if (allProducts[id]) {
          allProducts[id].basePrice =
            Number(parsed[id]);
        }

      });
    }

  } catch (error) {
    console.warn('Price loading failed:', error);
  }


  /* ---------------- SUPABASE ---------------- */

  initSupabaseIfConfigured();

  /* ---------------- START AUTO SYNC ---------------- */

  startOrderAutoSync();
}


/* ================================================================
   SUPABASE INITIALIZATION
   ================================================================ */

function initSupabaseIfConfigured() {

  const url =
    localStorage.getItem('psm_supabase_url');

  const key =
    localStorage.getItem('psm_supabase_key');

  const syncLabel =
    document.getElementById('sync-label');


  if (
    url &&
    key &&
    window.supabase
  ) {

    try {

      supabaseClient =
        window.supabase.createClient(
          url,
          key
        );

      if (syncLabel) {
        syncLabel.textContent =
          '🟢 Supabase Cloud Connected';
      }

      fetchOrdersFromSupabase();

    } catch (error) {

      console.error(
        'Supabase initialization failed:',
        error
      );

      supabaseClient = null;

      if (syncLabel) {
        syncLabel.textContent =
          '🟡 Local Storage Mode';
      }
    }

  } else {

    supabaseClient = null;

    if (syncLabel) {
      syncLabel.textContent =
        '🟢 Local Store Ready';
    }
  }
}


/* ================================================================
   FETCH ORDERS FROM SUPABASE
   ================================================================ */

async function fetchOrdersFromSupabase() {

  if (!supabaseClient) {
    return;
  }

  try {

    const {
      data,
      error
    } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', {
        ascending: false
      });


    if (error) {

      console.warn(
        'Supabase order fetch error:',
        error.message
      );

      return;
    }


    const cloudOrders = Array.isArray(data)
      ? data.map(o => {

          const items =
            Array.isArray(o.order_items)
              ? o.order_items
              : [];

          return normalizeOrder({
            id: o.order_number,
            date: o.created_at,
            customerName: o.customer_name,
            phone: o.customer_phone,
            city: o.delivery_city,
            address: o.delivery_address,
            notes: o.order_notes,
            status: o.status,
            totalAmount: o.total_amount,

            items: items.map(item => ({
              productId: item.product_id,
              nameGu: item.product_name_gu,
              nameEn: item.product_name_en,
              weightLabel: item.weight_label,
              weightKg: item.weight_kg,
              unitPrice: item.unit_price,
              qty: item.quantity,
              subtotal: item.subtotal
            }))
          });

        })
      : [];


    /*
       IMPORTANT FIX:
       Do NOT replace local orders with cloud orders.

       Merge both sources.
    */

    const localOrders =
      readLocalOrders();

    allOrders =
      mergeOrders(
        localOrders,
        cloudOrders
      );


    /*
       Save merged result back to localStorage.
    */

    saveLocalOrders(allOrders);

    renderAllViews();


  } catch (error) {

    console.error(
      'Supabase fetch failed:',
      error
    );

  }
}


/* ================================================================
   LIVE LOCAL ORDER REFRESH
   ================================================================ */

function refreshOrdersFromLocalStorage() {

  const localOrders =
    readLocalOrders();

  if (!localOrders.length) {
    return;
  }


  const oldIds =
    new Set(
      allOrders.map(o => o.id)
    );

  const newIds =
    new Set(
      localOrders.map(o => o.id)
    );


  let changed =
    oldIds.size !== newIds.size;


  if (!changed) {

    for (const id of newIds) {

      if (!oldIds.has(id)) {
        changed = true;
        break;
      }
    }
  }


  if (changed) {

    allOrders = localOrders;

    renderAllViews();

    showNewOrderNotification();

  } else {

    /*
       Even if count is same,
       status/amount/customer details may have changed.
    */

    const oldJson =
      JSON.stringify(allOrders);

    const newJson =
      JSON.stringify(localOrders);

    if (oldJson !== newJson) {

      allOrders = localOrders;

      renderAllViews();
    }
  }
}


/* ================================================================
   AUTO ORDER SYNC
   ================================================================ */

function startOrderAutoSync() {

  if (orderSyncTimer) {
    clearInterval(orderSyncTimer);
  }

  orderSyncTimer =
    setInterval(() => {

      refreshOrdersFromLocalStorage();

    }, 5000);
}


/* ================================================================
   BROWSER STORAGE EVENT
   ================================================================ */

window.addEventListener(
  'storage',
  function(event) {

    if (event.key === 'psm_orders') {

      refreshOrdersFromLocalStorage();

    }

  }
);


/* ================================================================
   NEW ORDER NOTIFICATION
   ================================================================ */

let lastKnownOrderCount = null;

function showNewOrderNotification() {

  const count = allOrders.length;

  if (lastKnownOrderCount === null) {
    lastKnownOrderCount = count;
    return;
  }

  if (count > lastKnownOrderCount) {

    try {

      if (
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {

        new Notification(
          'Patel Sweet Mart',
          {
            body:
              'નવો ઓર્ડર આવ્યો છે. Admin panel માં તપાસો.',
            icon: 'logo.png'
          }
        );
      }

    } catch (error) {}

  }

  lastKnownOrderCount = count;
}


/* ================================================================
   AUTH GUARD
   ================================================================ */

function checkAuth() {

  const isAuth =
    sessionStorage.getItem(
      'psm_admin_auth'
    ) === 'authenticated' ||

    localStorage.getItem(
      'psm_owner_logged_in'
    ) === 'true';


  const modal =
    document.getElementById(
      'admin-login-modal'
    );


  if (isAuth) {

    if (modal) {
      modal.style.display = 'none';
    }

  } else {

    if (modal) {
      modal.style.display = 'flex';
    }
  }
}


function toggleAdminPasswordVisibility(
  fieldId,
  btn
) {

  const field =
    document.getElementById(fieldId);

  if (!field) return;

  if (field.type === 'password') {

    field.type = 'text';

    btn.innerHTML = '&#128064;';

  } else {

    field.type = 'password';

    btn.innerHTML = '&#128065;';
  }
}


function bypassDemoAccess() {

  sessionStorage.setItem(
    'psm_admin_auth',
    'authenticated'
  );

  localStorage.setItem(
    'psm_owner_logged_in',
    'true'
  );

  const modal =
    document.getElementById(
      'admin-login-modal'
    );

  if (modal) {
    modal.style.display = 'none';
  }

  renderAllViews();
}


function handleAdminLogin(event) {

  event.preventDefault();

  const email =
    document.getElementById(
      'login-email'
    )?.value.trim();

  const pass =
    document.getElementById(
      'login-password'
    )?.value.trim();

  const remember =
    document.getElementById(
      'login-remember'
    )?.checked;


  if (
    pass === 'patel1995' ||
    pass === 'admin123' ||
    pass?.toLowerCase() === 'patel' ||
    (email && pass)
  ) {

    sessionStorage.setItem(
      'psm_admin_auth',
      'authenticated'
    );

    if (remember) {

      localStorage.setItem(
        'psm_owner_logged_in',
        'true'
      );
    }

    const modal =
      document.getElementById(
        'admin-login-modal'
      );

    if (modal) {
      modal.style.display = 'none';
    }

    renderAllViews();

  } else {

    alert(
      '❌ અમાન્ય પાસવર્ડ!'
    );
  }
}


function adminLogout() {

  sessionStorage.removeItem(
    'psm_admin_auth'
  );

  localStorage.removeItem(
    'psm_owner_logged_in'
  );

  location.reload();
}


/* ================================================================
   TAB SWITCHING
   ================================================================ */

function switchAdminTab(tabName) {

  currentActiveTab =
    tabName;


  document
    .querySelectorAll('.admin-tab-btn')
    .forEach(btn => {

      btn.classList.toggle(
        'active',
        btn.getAttribute('data-tab') === tabName
      );

    });


  document
    .querySelectorAll('.admin-panel-view')
    .forEach(panel => {

      panel.classList.toggle(
        'active',
        panel.id === 'panel-' + tabName
      );

    });


  if (tabName === 'kitchen') {
    renderKitchenPlanner();
  }

  if (tabName === 'analytics') {
    renderAnalyticsView();
  }

  if (tabName === 'crm') {
    renderCrmView();
  }

  if (tabName === 'inventory') {
    renderInventoryGrid();
  }
}


/* ================================================================
   FILTERING
   ================================================================ */

function filterOrdersByStatus(status) {

  currentStatusFilter =
    status;

  document
    .querySelectorAll('.order-status-filter')
    .forEach(btn => {

      btn.classList.toggle(
        'active',
        btn.getAttribute('data-status') === status
      );

    });

  renderOrdersTable();
}


function filterByDateRange(range) {

  currentDateFilter =
    range;

  document
    .querySelectorAll('.date-pill-btn')
    .forEach(btn => {

      btn.classList.toggle(
        'active',
        btn.getAttribute('data-range') === range
      );

    });

  renderAllViews();
}


function handleOrderSearch(val) {

  searchQuery =
    String(val || '')
      .trim()
      .toLowerCase();

  renderOrdersTable();
}


/* ================================================================
   FILTERED ORDERS
   ================================================================ */

function getFilteredOrders() {

  let list =
    [...allOrders];


  if (
    currentStatusFilter !== 'all'
  ) {

    list =
      list.filter(
        o =>
          o.status ===
          currentStatusFilter
      );
  }


  const now =
    new Date();


  if (
    currentDateFilter === 'today'
  ) {

    list =
      list.filter(o => {

        const d =
          new Date(o.date);

        return (
          d.toDateString() ===
          now.toDateString()
        );

      });

  } else if (
    currentDateFilter === 'week'
  ) {

    const oneWeekAgo =
      new Date(
        now.getTime() -
        7 * 24 * 60 * 60 * 1000
      );

    list =
      list.filter(
        o =>
          new Date(o.date) >=
          oneWeekAgo
      );

  } else if (
    currentDateFilter === 'month'
  ) {

    const oneMonthAgo =
      new Date(
        now.getTime() -
        30 * 24 * 60 * 60 * 1000
      );

    list =
      list.filter(
        o =>
          new Date(o.date) >=
          oneMonthAgo
      );
  }


  if (searchQuery) {

    list =
      list.filter(o => {

        return (
          String(o.id)
            .toLowerCase()
            .includes(searchQuery) ||

          String(o.customerName)
            .toLowerCase()
            .includes(searchQuery) ||

          String(o.phone)
            .toLowerCase()
            .includes(searchQuery) ||

          String(o.city)
            .toLowerCase()
            .includes(searchQuery)
        );

      });
  }


  return list;
}


/* ================================================================
   KPI
   ================================================================ */

function renderKpis() {

  const filtered =
    getFilteredOrders();


  const totalRev =
    filtered.reduce(
      (sum, o) =>
        sum + Number(o.totalAmount || 0),
      0
    );


  const totalOrders =
    filtered.length;


  const totalKg =
    filtered.reduce(
      (sum, o) =>
        sum + Number(o.totalKg || 0),
      0
    );


  const aov =
    totalOrders > 0
      ? Math.round(
          totalRev / totalOrders
        )
      : 0;


  const revEl =
    document.getElementById(
      'kpi-revenue'
    );

  const ordEl =
    document.getElementById(
      'kpi-orders-count'
    );

  const kgEl =
    document.getElementById(
      'kpi-total-kg'
    );

  const aovEl =
    document.getElementById(
      'kpi-aov'
    );

  const badgeEl =
    document.getElementById(
      'tab-orders-badge'
    );


  if (revEl) {
    revEl.textContent =
      '₹' +
      totalRev.toLocaleString(
        'en-IN'
      );
  }

  if (ordEl) {
    ordEl.textContent =
      totalOrders;
  }

  if (kgEl) {
    kgEl.textContent =
      totalKg.toFixed(2) +
      ' kg';
  }

  if (aovEl) {
    aovEl.textContent =
      '₹' +
      aov.toLocaleString(
        'en-IN'
      );
  }

  if (badgeEl) {
    badgeEl.textContent =
      totalOrders;
  }
}


/* ================================================================
   ORDERS TABLE
   ================================================================ */

function renderOrdersTable() {

  const tbody =
    document.getElementById(
      'orders-tbody'
    );

  if (!tbody) return;


  const filtered =
    getFilteredOrders();


  if (
    filtered.length === 0
  ) {

    tbody.innerHTML = `
      <tr>
        <td colspan="8"
          style="
            text-align:center;
            padding:36px;
            color:#94A3B8;
          ">
          કોઈ ઓર્ડર મળ્યા નથી
          (No orders found)
        </td>
      </tr>
    `;

    return;
  }


  let html = '';


  filtered.forEach(o => {

    const d =
      new Date(o.date);


    const dateFormatted =
      isNaN(d.getTime())
        ? '-'
        :
          d.toLocaleDateString(
            'gu-IN',
            {
              day: '2-digit',
              month: 'short'
            }
          ) +
          ', ' +
          d.toLocaleTimeString(
            'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }
          );


    const items =
      Array.isArray(o.items)
        ? o.items
        : [];


    const itemsSummary =
      items.length
        ? items.map(it =>
            `${it.nameGu || it.nameEn}
             (${it.weightLabel || '-'})
             × ${it.qty || 1}`
          ).join('<br>')
        : '—';


    const city =
      String(o.city || '');


    const cityClass =
      city.toLowerCase().includes('kherwa')
        ? 'kherwa'
        : 'ahmedabad';


    const phone =
      String(o.phone || '')
        .replace(/[^0-9]/g, '');


    const customerName =
      String(
        o.customerName || 'ગ્રાહક'
      );


    html += `
      <tr>

        <td>
          <span class="order-id-badge">
            #${escapeHtml(o.id)}
          </span>
        </td>

        <td style="
          font-size:0.8rem;
          color:#64748B;
        ">
          ${dateFormatted}
        </td>

        <td>
          <div class="cust-name">
            ${escapeHtml(customerName)}
          </div>

          <div class="cust-phone">
            &#128222;
            ${escapeHtml(o.phone)}
          </div>
        </td>

        <td>
          <span class="city-badge ${cityClass}">
            ${escapeHtml(city)}
          </span>
        </td>

        <td>
          <div class="items-summary-text">
            ${itemsSummary}
          </div>
        </td>

        <td>
          <span class="table-price">
            ₹${Number(
              o.totalAmount || 0
            ).toLocaleString('en-IN')}
          </span>
        </td>

        <td>
          <span class="status-pill ${escapeHtml(o.status)}">
            ${getStatusLabelGu(o.status)}
          </span>
        </td>

        <td>

          <div class="table-actions">

            <button
              class="btn-table-icon"
              title="ઓર્ડર વિગત જુઓ"
              onclick="openOrderModal('${safeJs(o.id)}')">
              &#128065;
            </button>

            ${
              phone
              ? `
                <a
                  href="https://wa.me/91${phone}?text=${encodeURIComponent(
                    'નમસ્તે ' +
                    customerName +
                    ', પટેલ સ્વીટ માર્ટમાંથી આપના ઓર્ડર #' +
                    o.id +
                    ' સંદર્ભે.'
                  )}"
                  target="_blank"
                  rel="noopener"
                  class="btn-table-icon btn-wa-action"
                  title="WhatsApp ચેટ">
                  &#128172;
                </a>
              `
              : ''
            }

            <button
              class="btn-table-icon"
              title="પ્રિન્ટ સ્લિપ"
              onclick="printOrderSlip('${safeJs(o.id)}')">
              &#128438;
            </button>

          </div>

        </td>

      </tr>
    `;
  });


  tbody.innerHTML =
    html;
}


/* ================================================================
   STATUS LABEL
   ================================================================ */

function getStatusLabelGu(st) {

  switch (st) {

    case 'new':
      return 'નવો (New)';

    case 'confirmed':
      return 'કન્ફર્મ';

    case 'packed':
      return 'પેક થયેલ';

    case 'dispatched':
      return 'રવાના (Dispatched)';

    case 'delivered':
      return 'ડિલિવર (Delivered)';

    case 'cancelled':
      return 'રદ';

    default:
      return st || '-';
  }
}


/* ================================================================
   KITCHEN
   ================================================================ */

function renderKitchenPlanner() {

  const container =
    document.getElementById(
      'kitchen-grid'
    );

  if (!container) return;


  const orders =
    getFilteredOrders();


  const summary = {};


  orders.forEach(o => {

    const items =
      Array.isArray(o.items)
        ? o.items
        : [];


    items.forEach(it => {

      const key =
        it.productId ||
        String(
          it.nameEn || 'product'
        ).toLowerCase();


      if (!summary[key]) {

        summary[key] = {

          nameGu:
            it.nameGu || 'ઉત્પાદન',

          nameEn:
            it.nameEn || 'Product',

          totalKg: 0,

          packBreakdown: {}

        };
      }


      const itemWeight =
        (Number(it.weightKg) || 1) *
        (Number(it.qty) || 1);


      summary[key].totalKg +=
        itemWeight;


      const wLabel =
        it.weightLabel ||
        '1kg';


      summary[key]
        .packBreakdown[wLabel] =
          (
            summary[key]
              .packBreakdown[wLabel] ||
            0
          ) +
          (Number(it.qty) || 1);

    });
  });


  if (
    Object.keys(summary).length === 0
  ) {

    container.innerHTML = `
      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:40px;
        color:#94A3B8;
      ">
        આજે રસોડા માટે કોઈ ઓર્ડર નથી.
      </div>
    `;

    return;
  }


  let html = '';


  Object.keys(summary).forEach(k => {

    const s =
      summary[k];


    const packsText =
      Object.keys(
        s.packBreakdown
      )
      .map(w =>
        `• <strong>${escapeHtml(w)}</strong>:
         ${s.packBreakdown[w]} પેક`
      )
      .join('<br>');


    html += `
      <div class="kitchen-card">

        <div>

          <div class="kitchen-card-header">

            <div>
              <div class="kitchen-sweet-name">
                ${escapeHtml(s.nameGu)}
              </div>

              <div class="kitchen-sweet-en">
                ${escapeHtml(s.nameEn)}
              </div>
            </div>

            <div>

              <div class="kitchen-kg-total">
                ${s.totalKg.toFixed(2)} kg
              </div>

              <div class="kitchen-kg-label">
                કુલ તૈયારી વજન
              </div>

            </div>

          </div>

          <div class="kitchen-weight-breakdown">
            ${packsText}
          </div>

        </div>

      </div>
    `;
  });


  container.innerHTML =
    html;
}


/* ================================================================
   ANALYTICS
   ================================================================ */

function renderAnalyticsView() {

  renderWeightDistributionChart();
  renderZoneDistributionChart();
  renderTopProductsTable();
}


function renderWeightDistributionChart() {

  const chartEl =
    document.getElementById(
      'weight-distribution-chart'
    );

  if (!chartEl) return;


  const orders =
    getFilteredOrders();


  const counts = {

    '250g': 0,
    '500g': 0,
    '1 kg': 0,
    '1.25 kg (સવા)': 0,
    '1.5 kg (દોઢ)': 0,
    '2 kg+ (બલ્ક)': 0

  };


  let totalItemsCount =
    0;


  orders.forEach(o => {

    const items =
      Array.isArray(o.items)
        ? o.items
        : [];


    items.forEach(it => {

      const qty =
        Number(it.qty) || 1;

      totalItemsCount +=
        qty;


      const w =
        String(
          it.weightLabel || ''
        );


      if (w.includes('250g')) {

        counts['250g'] += qty;

      } else if (w.includes('500g')) {

        counts['500g'] += qty;

      } else if (
        w.includes('1.25') ||
        w.includes('સવા')
      ) {

        counts[
          '1.25 kg (સવા)'
        ] += qty;

      } else if (
        w.includes('1.5') ||
        w.includes('દોઢ')
      ) {

        counts[
          '1.5 kg (દોઢ)'
        ] += qty;

      } else if (
        w.includes('2') ||
        w.includes('5')
      ) {

        counts[
          '2 kg+ (બલ્ક)'
        ] += qty;

      } else {

        counts['1 kg'] += qty;
      }

    });
  });


  if (
    totalItemsCount === 0
  ) {
    totalItemsCount = 1;
  }


  let html = '';


  Object.keys(counts)
    .forEach(label => {

      const count =
        counts[label];

      const pct =
        Math.round(
          (count /
            totalItemsCount) *
          100
        );


      html += `
        <div class="bar-item">

          <div class="bar-item-header">
            <span>
              ${escapeHtml(label)}
              (${count} પેક)
            </span>

            <span>
              ${pct}%
            </span>
          </div>

          <div class="bar-track">

            <div
              class="bar-fill"
              style="width:${pct}%;">
            </div>

          </div>

        </div>
      `;
    });


  chartEl.innerHTML =
    html;
}


function renderZoneDistributionChart() {

  const chartEl =
    document.getElementById(
      'zone-distribution-chart'
    );

  if (!chartEl) return;


  const orders =
    getFilteredOrders();


  const zones = {

    'ખેરવા (Kherwa)': 0,

    'અમદાવાદ (Ahmedabad)': 0,

    'અન્ય ગુજરાત (Other)': 0

  };


  const total =
    orders.length || 1;


  orders.forEach(o => {

    const city =
      String(
        o.city || ''
      );


    if (
      city.includes('Kherwa')
    ) {

      zones[
        'ખેરવા (Kherwa)'
      ] += 1;

    } else if (
      city.includes('Ahmedabad')
    ) {

      zones[
        'અમદાવાદ (Ahmedabad)'
      ] += 1;

    } else {

      zones[
        'અન્ય ગુજરાત (Other)'
      ] += 1;
    }

  });


  let html = '';


  Object.keys(zones)
    .forEach(z => {

      const count =
        zones[z];


      const pct =
        Math.round(
          (count /
            total) *
          100
        );


      html += `
        <div class="bar-item">

          <div class="bar-item-header">
            <span>
              ${escapeHtml(z)}
              (${count} ઓર્ડર)
            </span>

            <span>
              ${pct}%
            </span>
          </div>

          <div class="bar-track">

            <div
              class="bar-fill"
              style="
                width:${pct}%;
                background:
                  ${
                    z.includes('Kherwa')
                      ? 'var(--gold)'
                      : 'var(--cobalt)'
                  };
              ">
            </div>

          </div>

        </div>
      `;
    });


  chartEl.innerHTML =
    html;
}


function renderTopProductsTable() {

  const tbody =
    document.getElementById(
      'analytics-products-tbody'
    );

  if (!tbody) return;


  const orders =
    getFilteredOrders();


  const stats = {};


  orders.forEach(o => {

    const items =
      Array.isArray(o.items)
        ? o.items
        : [];


    items.forEach(it => {

      const id =
        it.productId ||
        String(
          it.nameEn || 'product'
        ).toLowerCase();


      if (!stats[id]) {

        stats[id] = {

          nameGu:
            it.nameGu || 'ઉત્પાદન',

          nameEn:
            it.nameEn || 'Product',

          ordersCount: 0,

          totalKg: 0,

          totalRevenue: 0,

          weightsUsed: {}

        };
      }


      stats[id].ordersCount += 1;


      stats[id].totalKg +=
        (Number(it.weightKg) || 1) *
        (Number(it.qty) || 1);


      stats[id].totalRevenue +=
        Number(it.subtotal) || 0;


      const weight =
        it.weightLabel ||
        '1 kg';


      stats[id]
        .weightsUsed[weight] =
          (
            stats[id]
              .weightsUsed[weight] ||
            0
          ) +
          (Number(it.qty) || 1);

    });
  });


  const sorted =
    Object.values(stats)
      .sort(
        (a, b) =>
          b.totalRevenue -
          a.totalRevenue
      );


  if (sorted.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td
          colspan="5"
          style="
            text-align:center;
            padding:30px;
            color:#94A3B8;
          ">
          કોઈ ડેટા ઉપલબ્ધ નથી.
        </td>
      </tr>
    `;

    return;
  }


  let html = '';


  sorted.forEach(s => {

    const popularWeight =
      Object.keys(
        s.weightsUsed
      )
      .sort(
        (a, b) =>
          s.weightsUsed[b] -
          s.weightsUsed[a]
      )[0] || '1kg';


    html += `
      <tr>

        <td>
          <strong>
            ${escapeHtml(s.nameGu)}
          </strong>

          <span style="
            font-size:0.8rem;
            color:#64748B;">
            (${escapeHtml(s.nameEn)})
          </span>
        </td>

        <td>
          ${s.ordersCount}
        </td>

        <td>
          <strong>
            ${s.totalKg.toFixed(2)} kg
          </strong>
        </td>

        <td>
          <strong style="
            color:var(--cobalt)">
            ₹${s.totalRevenue.toLocaleString(
              'en-IN'
            )}
          </strong>
        </td>

        <td>
          <span class="city-badge">
            ${escapeHtml(popularWeight)}
          </span>
        </td>

      </tr>
    `;
  });


  tbody.innerHTML =
    html;
}


/* ================================================================
   CRM
   ================================================================ */

function renderCrmView() {

  const tbody =
    document.getElementById(
      'customers-tbody'
    );

  if (!tbody) return;


  const crm = {};


  allOrders.forEach(o => {

    const phone =
      String(o.phone || '')
        .replace(
          /[^0-9]/g,
          ''
        );


    if (!crm[phone]) {

      crm[phone] = {

        name:
          o.customerName,

        phone:
          o.phone,

        city:
          o.city,

        address:
          o.address,

        totalOrders: 0,

        totalSpend: 0,

        lastOrderDate:
          o.date

      };
    }


    crm[phone].totalOrders +=
      1;


    crm[phone].totalSpend +=
      Number(
        o.totalAmount || 0
      );


    if (
      new Date(o.date) >
      new Date(
        crm[phone].lastOrderDate
      )
    ) {

      crm[phone].lastOrderDate =
        o.date;

      crm[phone].address =
        o.address;
    }

  });


  const list =
    Object.values(crm)
      .sort(
        (a, b) =>
          b.totalSpend -
          a.totalSpend
      );


  let html = '';


  list.forEach(c => {

    const d =
      new Date(
        c.lastOrderDate
      ).toLocaleDateString(
        'gu-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );


    html += `
      <tr>

        <td>
          <strong>
            ${escapeHtml(c.name)}
          </strong>
        </td>

        <td>
          ${escapeHtml(c.phone)}
        </td>

        <td>
          <span class="city-badge">
            ${escapeHtml(c.city)}
          </span>
        </td>

        <td style="
          max-width:220px;
          font-size:0.82rem;
          color:#64748B;">
          ${escapeHtml(c.address)}
        </td>

        <td>
          <strong>
            ${c.totalOrders}
          </strong>
        </td>

        <td>
          <strong style="
            color:var(--cobalt)">
            ₹${c.totalSpend.toLocaleString(
              'en-IN'
            )}
          </strong>
        </td>

        <td style="
          font-size:0.8rem;">
          ${d}
        </td>

        <td>

          <a
            href="https://wa.me/91${String(c.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              'નમસ્તે ' +
              c.name +
              ', પટેલ સ્વીટ માર્ટ તરફથી શુભકામનાઓ!'
            )}"
            target="_blank"
            rel="noopener"
            class="btn-table-icon btn-wa-action"
            title="WhatsApp મેસેજ">
            &#128172;
          </a>

        </td>

      </tr>
    `;
  });


  tbody.innerHTML =
    html;
}


/* ================================================================
   INVENTORY
   ================================================================ */

function renderInventoryGrid() {

  const grid =
    document.getElementById(
      'inventory-grid'
    );

  if (!grid) return;


  updateBulkTargetCount();


  let html = '';


  Object.keys(allProducts)
    .forEach(id => {

      const p =
        allProducts[id];


      const isCustom =
        !DEFAULT_PRODUCTS[id];


      const catLabel =
        p.category === 'namkeen'
          ? 'નમકીન'
          : 'મીઠાઈ';


      html += `
        <div
          class="inventory-item-card"
          id="inv-card-${safeJs(p.id)}">

          <div class="inv-details">

            <img
              src="${escapeHtml(p.img)}"
              alt="${escapeHtml(p.nameEn)}"
              class="inv-img"
              onerror="
                this.src='images/product-toprapak.jpg'
              "
            />

            <div>

              <div style="
                display:flex;
                align-items:center;
                gap:6px;">

                <div class="inv-name">
                  ${escapeHtml(p.nameGu)}
                </div>

                <span class="inv-badge-tag">
                  ${catLabel}
                </span>

              </div>

              <div class="inv-en">
                ${escapeHtml(p.nameEn)}
              </div>

              ${
                isCustom
                  ? `
                    <div style="margin-top:4px;">
                      <button
                        type="button"
                        class="btn-delete-prod"
                        onclick="deleteCustomProduct('${safeJs(p.id)}')">
                        &#128465; હટાવો
                      </button>
                    </div>
                  `
                  : ''
              }

            </div>

          </div>

          <div class="inv-controls">

            <div class="inv-price-input-wrap">

              <span style="
                font-size:0.85rem;
                font-weight:700;">
                ₹
              </span>

              <input
                type="number"
                class="inv-price-input"
                id="inv-price-${safeJs(p.id)}"
                value="${Number(p.basePrice) || 0}"
                step="10"
                min="50"
                onchange="markInventoryDirty('${safeJs(p.id)}')"
              />

              <span style="
                font-size:0.75rem;
                color:#64748B;">
                / 1kg
              </span>

            </div>

            <label class="inv-switch">

              <input
                type="checkbox"
                id="inv-stock-${safeJs(p.id)}"
                ${
                  p.isAvailable !== false
                    ? 'checked'
                    : ''
                }
                onchange="
                  markInventoryDirty('${safeJs(p.id)}')
                "
              />

              <span>
                સ્ટોકમાં છે
              </span>

            </label>

          </div>

        </div>
      `;
    });


  grid.innerHTML =
    html;
}


function markInventoryDirty(id) {

  const card =
    document.getElementById(
      'inv-card-' + id
    );

  if (card) {
    card.style.borderColor =
      'var(--gold)';
  }
}


/* ================================================================
   SAVE INVENTORY
   ================================================================ */

function saveAllInventoryPrices() {

  const priceMap = {};

  let savedCount = 0;


  Object.keys(allProducts)
    .forEach(id => {

      const input =
        document.getElementById(
          'inv-price-' + id
        );

      const stock =
        document.getElementById(
          'inv-stock-' + id
        );


      if (input) {

        const val =
          parseFloat(
            input.value
          );


        if (
          !isNaN(val) &&
          val > 0
        ) {

          allProducts[id]
            .basePrice =
              Math.round(val);

          priceMap[id] =
            Math.round(val);

          savedCount++;
        }
      }


      if (stock) {

        allProducts[id]
          .isAvailable =
            stock.checked;
      }

    });


  try {

    localStorage.setItem(
      'psm_product_prices',
      JSON.stringify(priceMap)
    );

  } catch (error) {}


  try {

    const customCatalog =
      JSON.parse(
        localStorage.getItem(
          'psm_custom_catalog'
        ) || '{}'
      );


    let hasUpdates =
      false;


    Object.keys(customCatalog)
      .forEach(cid => {

        if (
          priceMap[cid] !== undefined
        ) {

          customCatalog[cid]
            .basePrice =
              priceMap[cid];

          hasUpdates = true;
        }


        const st =
          document.getElementById(
            'inv-stock-' + cid
          );


        if (st) {

          customCatalog[cid]
            .isAvailable =
              st.checked;

          hasUpdates = true;
        }

      });


    if (hasUpdates) {

      localStorage.setItem(
        'psm_custom_catalog',
        JSON.stringify(
          customCatalog
        )
      );
    }

  } catch (error) {}


  alert(
    `✓ ${savedCount} ઉત્પાદનોના ભાવ સેવ થઈ ગયા છે.`
  );


  renderInventoryGrid();
}


/* ================================================================
   BULK PRICING
   ================================================================ */

function updateBulkTargetCount() {

  const select =
    document.getElementById(
      'bulk-target-category'
    );

  const countLabel =
    document.getElementById(
      'bulk-affected-count'
    );


  if (!select || !countLabel) {
    return;
  }


  const cat =
    select.value;


  let count = 0;


  Object.keys(allProducts)
    .forEach(id => {

      const p =
        allProducts[id];


      if (
        cat === 'all' ||
        p.category === cat
      ) {
        count++;
      }

    });


  countLabel.textContent =
    `${count} ઉત્પાદનો સક્રિય`;
}


function applyQuickBulkPrice(
  amount,
  type
) {

  const select =
    document.getElementById(
      'bulk-target-category'
    );


  const cat =
    select
      ? select.value
      : 'all';


  const confirmed =
    confirm(
      'શું તમે ભાવમાં આ ફેરફાર લાગુ કરવા માંગો છો?'
    );


  if (!confirmed) return;


  let affected = 0;


  const priceMap =
    JSON.parse(
      localStorage.getItem(
        'psm_product_prices'
      ) || '{}'
    );


  Object.keys(allProducts)
    .forEach(id => {

      const p =
        allProducts[id];


      if (
        cat === 'all' ||
        p.category === cat
      ) {

        let currentPrice =
          Number(p.basePrice) || 0;


        let newPrice =
          currentPrice;


        if (type === 'flat') {

          newPrice =
            currentPrice +
            amount;

        } else {

          newPrice =
            Math.round(
              currentPrice *
              (
                1 +
                amount / 100
              )
            );
        }


        newPrice =
          Math.round(
            newPrice / 5
          ) * 5;


        if (
          newPrice < 50
        ) {
          newPrice = 50;
        }


        p.basePrice =
          newPrice;


        priceMap[id] =
          newPrice;


        affected++;
      }

    });


  localStorage.setItem(
    'psm_product_prices',
    JSON.stringify(
      priceMap
    )
  );


  renderInventoryGrid();


  alert(
    `✓ ${affected} ઉત્પાદનોના ભાવ અપડેટ થયા.`
  );
}


function applyCustomBulkAdjustment() {

  const dirSelect =
    document.getElementById(
      'bulk-custom-dir'
    );

  const amountInput =
    document.getElementById(
      'bulk-custom-amount'
    );

  const unitSelect =
    document.getElementById(
      'bulk-custom-unit'
    );


  if (!amountInput) return;


  const rawVal =
    parseFloat(
      amountInput.value
    );


  if (
    isNaN(rawVal) ||
    rawVal <= 0
  ) {

    alert(
      'કૃપા કરીને યોગ્ય રકમ દાખલ કરો.'
    );

    return;
  }


  const multiplier =
    dirSelect &&
    dirSelect.value === 'sub'
      ? -1
      : 1;


  const finalAmount =
    rawVal *
    multiplier;


  const unitType =
    unitSelect
      ? unitSelect.value
      : 'flat';


  applyQuickBulkPrice(
    finalAmount,
    unitType
  );


  amountInput.value =
    '';
}


/* ================================================================
   ADD PRODUCT
   ================================================================ */

function openAddProductModal() {

  const modal =
    document.getElementById(
      'add-product-modal'
    );

  if (modal) {

    modal.classList.add(
      'open'
    );

    updateNewProdPreview();
  }
}


function closeAddProductModal() {

  const modal =
    document.getElementById(
      'add-product-modal'
    );


  if (modal) {

    modal.classList.remove(
      'open'
    );


    const form =
      document.getElementById(
        'add-product-form'
      );


    if (form) {
      form.reset();
    }
  }
}


function onNewProdPresetChange() {

  const select =
    document.getElementById(
      'new-prod-preset-img'
    );


  const customGroup =
    document.getElementById(
      'new-prod-custom-url-group'
    );


  if (!select) return;


  if (
    select.value === 'custom'
  ) {

    if (customGroup) {
      customGroup.style.display =
        'block';
    }

  } else {

    if (customGroup) {
      customGroup.style.display =
        'none';
    }
  }


  updateNewProdPreview();
}


function updateNewProdPreview() {

  const nameGu =
    (
      document.getElementById(
        'new-prod-name-gu'
      )?.value ||
      'નવું ઉત્પાદન'
    ).trim();


  const nameEn =
    (
      document.getElementById(
        'new-prod-name-en'
      )?.value ||
      'New Product'
    ).trim();


  const category =
    document.getElementById(
      'new-prod-category'
    )?.value ||
    'mithai';


  const price =
    document.getElementById(
      'new-prod-price'
    )?.value ||
    '500';


  const presetSelect =
    document.getElementById(
      'new-prod-preset-img'
    );


  const customUrlInput =
    document.getElementById(
      'new-prod-img'
    );


  let imgSrc =
    'images/product-toprapak.jpg';


  if (
    presetSelect &&
    presetSelect.value !== 'custom'
  ) {

    imgSrc =
      presetSelect.value;

  } else if (
    customUrlInput &&
    customUrlInput.value.trim()
  ) {

    imgSrc =
      customUrlInput.value.trim();
  }


  const previewTitle =
    document.getElementById(
      'new-prod-preview-title'
    );

  const previewEn =
    document.getElementById(
      'new-prod-preview-en'
    );

  const previewTag =
    document.getElementById(
      'new-prod-preview-tag'
    );

  const previewPrice =
    document.getElementById(
      'new-prod-preview-price'
    );

  const previewImg =
    document.getElementById(
      'new-prod-preview-img'
    );


  if (previewTitle) {
    previewTitle.textContent =
      nameGu;
  }

  if (previewEn) {
    previewEn.textContent =
      nameEn;
  }

  if (previewTag) {
    previewTag.textContent =
      category === 'namkeen'
        ? 'નમકીન'
        : 'મીઠાઈ';
  }

  if (previewPrice) {
    previewPrice.textContent =
      '₹' + price;
  }

  if (previewImg) {
    previewImg.src =
      imgSrc;
  }
}


function handleAddNewProduct(event) {

  event.preventDefault();


  const nameGu =
    document.getElementById(
      'new-prod-name-gu'
    ).value.trim();


  const nameEn =
    document.getElementById(
      'new-prod-name-en'
    ).value.trim();


  const category =
    document.getElementById(
      'new-prod-category'
    ).value;


  const price =
    parseFloat(
      document.getElementById(
        'new-prod-price'
      ).value
    ) || 500;


  const descGu =
    document.getElementById(
      'new-prod-desc-gu'
    ).value.trim();


  const presetSelect =
    document.getElementById(
      'new-prod-preset-img'
    );


  const customUrl =
    document.getElementById(
      'new-prod-img'
    )?.value
      ?.trim();


  let imgSrc =
    (
      presetSelect &&
      presetSelect.value !== 'custom'
    )
      ? presetSelect.value
      : (
          customUrl ||
          'images/product-toprapak.jpg'
        );


  const slug =
    nameEn
      .toLowerCase()
      .replace(
        /[^a-z0-9]/g,
        '_'
      ) ||
    ('prod_' + Date.now());


  const uniqueId =
    allProducts[slug]
      ? `${slug}_${Date.now()}`
      : slug;


  const newProd = {

    id: uniqueId,

    nameGu,

    nameEn,

    basePrice: price,

    category,

    img: imgSrc,

    descGu:
      descGu ||
      'શુદ્ધ ઘી અને પરંપરાગત કારીગરી સાથે બનેલી ઉત્તમ બનાવટ',

    descEn:
      'Handcrafted fresh with pure desi ingredients and heritage recipes.',

    isAvailable: true,

    isCustom: true,

    createdAt:
      new Date().toISOString()

  };


  allProducts[uniqueId] =
    newProd;


  try {

    const existingCustom =
      JSON.parse(
        localStorage.getItem(
          'psm_custom_catalog'
        ) || '{}'
      );


    existingCustom[uniqueId] =
      newProd;


    localStorage.setItem(
      'psm_custom_catalog',
      JSON.stringify(
        existingCustom
      )
    );

  } catch (error) {}


  try {

    const priceMap =
      JSON.parse(
        localStorage.getItem(
          'psm_product_prices'
        ) || '{}'
      );


    priceMap[uniqueId] =
      price;


    localStorage.setItem(
      'psm_product_prices',
      JSON.stringify(
        priceMap
      )
    );

  } catch (error) {}


  closeAddProductModal();

  renderInventoryGrid();


  alert(
    `✓ "${nameGu}" સફળતાપૂર્વક ઉમેરાયું છે.`
  );
}


function deleteCustomProduct(id) {

  const p =
    allProducts[id];


  if (!p) return;


  const confirmed =
    confirm(
      `"${p.nameGu}" ઉત્પાદન હટાવવું છે?`
    );


  if (!confirmed) return;


  delete allProducts[id];


  try {

    const existingCustom =
      JSON.parse(
        localStorage.getItem(
          'psm_custom_catalog'
        ) || '{}'
      );


    delete existingCustom[id];


    localStorage.setItem(
      'psm_custom_catalog',
      JSON.stringify(
        existingCustom
      )
    );

  } catch (error) {}


  try {

    const priceMap =
      JSON.parse(
        localStorage.getItem(
          'psm_product_prices'
        ) || '{}'
      );


    delete priceMap[id];


    localStorage.setItem(
      'psm_product_prices',
      JSON.stringify(
        priceMap
      )
    );

  } catch (error) {}


  renderInventoryGrid();

  alert(
    '✓ ઉત્પાદન હટાવી દેવાયું છે.'
  );
}


/* ================================================================
   ORDER MODAL
   ================================================================ */

let currentModalOrderId =
  null;


function openOrderModal(orderId) {

  const o =
    allOrders.find(
      x =>
        String(x.id) ===
        String(orderId)
    );


  if (!o) return;


  currentModalOrderId =
    orderId;


  const title =
    document.getElementById(
      'modal-order-title'
    );


  if (title) {

    title.textContent =
      `ઓર્ડર વિગત #${o.id}`;
  }


  const items =
    Array.isArray(o.items)
      ? o.items
      : [];


  const itemsHtml =
    items.map(it => `

      <div style="
        display:flex;
        justify-content:space-between;
        padding:8px 0;
        border-bottom:1px solid #E2E8F0;
      ">

        <div>

          <strong>
            ${escapeHtml(it.nameGu)}
            (${escapeHtml(it.nameEn)})
          </strong>

          <br>

          <small style="
            color:#64748B;
          ">
            વજન:
            ${escapeHtml(it.weightLabel)}
            |
            જથ્થો:
            ${it.qty}
            પેક
            @ ₹${it.unitPrice}
          </small>

        </div>

        <div style="
          font-weight:800;
          color:var(--cobalt);
        ">
          ₹${Number(
            it.subtotal || 0
          ).toLocaleString('en-IN')}
        </div>

      </div>

    `).join('');


  const body =
    document.getElementById(
      'modal-order-body'
    );


  if (body) {

    body.innerHTML = `

      <div>

        <div style="
          font-size:0.8rem;
          color:#64748B;
          font-weight:700;
        ">
          ગ્રાહકની વિગત
        </div>

        <div style="
          font-size:1.1rem;
          font-weight:800;
          margin-top:2px;
        ">
          ${escapeHtml(o.customerName)}
        </div>

        <div style="
          color:#64748B;
        ">
          ફોન:
          ${escapeHtml(o.phone)}
          |
          શહેર:
          ${escapeHtml(o.city)}
        </div>

        <div style="
          margin-top:4px;
          padding:8px;
          background:#F8FAFC;
          border-radius:6px;
          font-size:0.88rem;
        ">
          સરનામું:
          ${escapeHtml(o.address)}
        </div>

        ${
          o.notes
            ? `
              <div style="
                margin-top:6px;
                color:#C2410C;
                font-size:0.85rem;
              ">
                <strong>
                  ઓર્ડર નોંધ:
                </strong>
                ${escapeHtml(o.notes)}
              </div>
            `
            : ''
        }

      </div>


      <div>

        <div style="
          font-size:0.8rem;
          color:#64748B;
          font-weight:700;
          margin-bottom:6px;
        ">
          ઓર્ડર કરેલી વસ્તુઓ
        </div>

        ${itemsHtml}

        <div style="
          display:flex;
          justify-content:space-between;
          padding-top:12px;
          font-size:1.15rem;
          font-weight:800;
        ">

          <span>
            કુલ રકમ:
          </span>

          <span style="
            color:var(--cobalt);
          ">
            ₹${Number(
              o.totalAmount || 0
            ).toLocaleString('en-IN')}
          </span>

        </div>

      </div>


      <div>

        <label style="
          font-size:0.8rem;
          color:#64748B;
          font-weight:700;
          display:block;
          margin-bottom:6px;
        ">
          ઓર્ડર સ્થિતિ બદલો
        </label>

        <select
          id="modal-status-select"
          class="admin-input"
          style="font-weight:700;">

          <option
            value="new"
            ${
              o.status === 'new'
                ? 'selected'
                : ''
            }>
            નવો
          </option>

          <option
            value="confirmed"
            ${
              o.status === 'confirmed'
                ? 'selected'
                : ''
            }>
            કન્ફર્મ
          </option>

          <option
            value="packed"
            ${
              o.status === 'packed'
                ? 'selected'
                : ''
            }>
            પેક થયેલ
          </option>

          <option
            value="dispatched"
            ${
              o.status === 'dispatched'
                ? 'selected'
                : ''
            }>
            રવાના
          </option>

          <option
            value="delivered"
            ${
              o.status === 'delivered'
                ? 'selected'
                : ''
            }>
            પૂર્ણ
          </option>

          <option
            value="cancelled"
            ${
              o.status === 'cancelled'
                ? 'selected'
                : ''
            }>
            રદ
          </option>

        </select>

      </div>
    `;
  }


  const footer =
    document.getElementById(
      'modal-order-footer'
    );


  if (footer) {

    footer.innerHTML = `

      <button
        type="button"
        class="btn-panel-action"
        style="background:#25D366;"
        onclick="sendWhatsAppStatusUpdate('${safeJs(o.id)}')">

        &#128172;
        ગ્રાહકને WhatsApp અપડેટ

      </button>

      <div style="
        display:flex;
        gap:8px;
      ">

        <button
          type="button"
          class="btn-logout"
          onclick="closeOrderModal()">
          બંધ કરો
        </button>

        <button
          type="button"
          class="btn-panel-action"
          onclick="saveOrderStatusFromModal()">
          સેવ સ્થિતિ
        </button>

      </div>
    `;
  }


  const modal =
    document.getElementById(
      'order-detail-modal'
    );


  if (modal) {
    modal.classList.add(
      'open'
    );
  }
}


function closeOrderModal() {

  const modal =
    document.getElementById(
      'order-detail-modal'
    );


  if (modal) {
    modal.classList.remove(
      'open'
    );
  }
}


/* ================================================================
   SAVE ORDER STATUS
   ================================================================ */

async function saveOrderStatusFromModal() {

  if (!currentModalOrderId) {
    return;
  }


  const select =
    document.getElementById(
      'modal-status-select'
    );


  if (!select) {
    return;
  }


  const newStatus =
    select.value;


  const idx =
    allOrders.findIndex(
      o =>
        String(o.id) ===
        String(currentModalOrderId)
    );


  if (idx === -1) {
    return;
  }


  allOrders[idx].status =
    newStatus;


  saveLocalOrders(
    allOrders
  );


  /* Supabase update */

  if (supabaseClient) {

    try {

      await supabaseClient
        .from('orders')
        .update({
          status: newStatus
        })
        .eq(
          'order_number',
          currentModalOrderId
        );

    } catch (error) {

      console.warn(
        'Status Supabase update failed:',
        error
      );
    }
  }


  renderAllViews();

  closeOrderModal();
}


/* ================================================================
   WHATSAPP STATUS UPDATE
   ================================================================ */

function sendWhatsAppStatusUpdate(
  orderId
) {

  const o =
    allOrders.find(
      x =>
        String(x.id) ===
        String(orderId)
    );


  if (!o) return;


  const cleanPhone =
    String(o.phone || '')
      .replace(
        /[^0-9]/g,
        ''
      );


  if (!cleanPhone) {

    alert(
      'ગ્રાહકનો ફોન નંબર ઉપલબ્ધ નથી.'
    );

    return;
  }


  const statusMsg =
    `નમસ્તે ${o.customerName}, ` +
    `પટેલ સ્વીટ માર્ટમાંથી આપના ` +
    `ઓર્ડર #${o.id} ની સ્થિતિ: ` +
    `*${getStatusLabelGu(o.status)}*. ` +
    `વિતરણ સ્થળ: ${o.city}. ` +
    `આભાર!`;


  const url =
    `https://wa.me/91${cleanPhone}` +
    `?text=${encodeURIComponent(
      statusMsg
    )}`;


  window.open(
    url,
    '_blank',
    'noopener,noreferrer'
  );
}


/* ================================================================
   PRINT ORDER
   ================================================================ */

function printOrderSlip(orderId) {

  const o =
    allOrders.find(
      x =>
        String(x.id) ===
        String(orderId)
    );


  if (!o) return;


  const slipArea =
    document.getElementById(
      'print-slip-area'
    );


  if (!slipArea) return;


  const items =
    Array.isArray(o.items)
      ? o.items
      : [];


  const itemsRows =
    items.map(
      (it, idx) => `

        <tr>

          <td style="
            padding:6px;
            border:1px solid #000;">
            ${idx + 1}
          </td>

          <td style="
            padding:6px;
            border:1px solid #000;">
            ${escapeHtml(it.nameGu)}
            (${escapeHtml(it.nameEn)})
          </td>

          <td style="
            padding:6px;
            border:1px solid #000;
            font-weight:bold;">
            ${escapeHtml(it.weightLabel)}
          </td>

          <td style="
            padding:6px;
            border:1px solid #000;">
            ${it.qty} પેક
          </td>

          <td style="
            padding:6px;
            border:1px solid #000;
            text-align:right;">
            ₹${Number(
              it.subtotal || 0
            )}
          </td>

        </tr>

      `
    ).join('');


  slipArea.innerHTML = `

    <div style="
      max-width:480px;
      margin:0 auto;
      font-family:sans-serif;
      padding:20px;
      border:2px solid #000;">

      <div style="
        text-align:center;
        border-bottom:2px solid #000;
        padding-bottom:12px;
        margin-bottom:14px;">

        <h2 style="
          margin:0;
          font-size:1.4rem;">
          પટેલ સ્વીટ માર્ટ
        </h2>

        <div style="
          font-size:0.85rem;">
          મુખ્ય બજાર, ખેરવા
        </div>

        <div style="
          font-size:0.95rem;
          font-weight:bold;
          margin-top:6px;">
          ડિલિવરી સ્લિપ / ORDER RECEIPT
        </div>

      </div>


      <div style="
        display:flex;
        justify-content:space-between;
        margin-bottom:10px;
        font-size:0.9rem;">

        <div>
          <strong>ઓર્ડર ID:</strong>
          #${escapeHtml(o.id)}
        </div>

        <div>
          <strong>તારીખ:</strong>
          ${new Date(o.date)
            .toLocaleDateString('gu-IN')}
        </div>

      </div>


      <div style="
        margin-bottom:12px;
        font-size:0.9rem;
        border-bottom:1px dashed #000;
        padding-bottom:10px;">

        <div>
          <strong>ગ્રાહક:</strong>
          ${escapeHtml(o.customerName)}
        </div>

        <div>
          <strong>ફોન:</strong>
          ${escapeHtml(o.phone)}
        </div>

        <div>
          <strong>શહેર:</strong>
          ${escapeHtml(o.city)}
        </div>

        <div>
          <strong>સરનામું:</strong>
          ${escapeHtml(o.address)}
        </div>

        ${
          o.notes
            ? `
              <div>
                <strong>નોંધ:</strong>
                ${escapeHtml(o.notes)}
              </div>
            `
            : ''
        }

      </div>


      <table style="
        width:100%;
        border-collapse:collapse;
        font-size:0.85rem;
        margin-bottom:14px;">

        <thead>

          <tr style="
            background:#eee;">

            <th style="
              padding:6px;
              border:1px solid #000;">
              #
            </th>

            <th style="
              padding:6px;
              border:1px solid #000;">
              આઇટમ
            </th>

            <th style="
              padding:6px;
              border:1px solid #000;">
              વજન
            </th>

            <th style="
              padding:6px;
              border:1px solid #000;">
              જથ્થો
            </th>

            <th style="
              padding:6px;
              border:1px solid #000;">
              રકમ
            </th>

          </tr>

        </thead>

        <tbody>
          ${itemsRows}
        </tbody>

      </table>


      <div style="
        display:flex;
        justify-content:space-between;
        font-size:1.1rem;
        font-weight:bold;
        border-top:2px solid #000;
        padding-top:8px;">

        <span>
          કુલ રકમ:
        </span>

        <span>
          ₹${Number(
            o.totalAmount || 0
          ).toLocaleString('en-IN')}
        </span>

      </div>


      <div style="
        text-align:center;
        margin-top:20px;
        font-size:0.8rem;">

        શુદ્ધતા અને પરંપરાનો ભરોસો — 1995થી<br>
        મુલાકાત બદલ આભાર!

      </div>

    </div>
  `;


  window.print();
}


/* ================================================================
   CSV EXPORT
   ================================================================ */

function exportOrdersToExcel() {

  const orders =
    getFilteredOrders();


  let csv =
    'Order ID,Date,Customer Name,Phone,City,Address,Total Amount,Status,Items\n';


  orders.forEach(o => {

    const items =
      Array.isArray(o.items)
        ? o.items
        : [];


    const itemsStr =
      items.map(
        it =>
          `${it.nameEn} (${it.weightLabel} x ${it.qty})`
      ).join('; ');


    csv +=
      `"${escapeCsv(o.id)}",` +
      `"${escapeCsv(o.date)}",` +
      `"${escapeCsv(o.customerName)}",` +
      `"${escapeCsv(o.phone)}",` +
      `"${escapeCsv(o.city)}",` +
      `"${escapeCsv(o.address)}",` +
      `"${o.totalAmount}",` +
      `"${escapeCsv(o.status)}",` +
      `"${escapeCsv(itemsStr)}"\n`;

  });


  downloadCsv(
    csv,
    `Patel_Sweet_Mart_Orders_${new Date().toISOString().slice(0, 10)}.csv`
  );
}


function exportCustomersToExcel() {

  const crm = {};


  allOrders.forEach(o => {

    const phone =
      String(o.phone || '')
        .replace(
          /[^0-9]/g,
          ''
        );


    if (!crm[phone]) {

      crm[phone] = {

        name:
          o.customerName,

        phone:
          o.phone,

        city:
          o.city,

        totalOrders: 0,

        totalSpend: 0,

        lastOrder:
          o.date

      };
    }


    crm[phone].totalOrders +=
      1;


    crm[phone].totalSpend +=
      Number(
        o.totalAmount || 0
      );


    if (
      new Date(o.date) >
      new Date(
        crm[phone].lastOrder
      )
    ) {

      crm[phone].lastOrder =
        o.date;
    }

  });


  let csv =
    'Customer Name,Phone,City,Total Orders,Lifetime Spend (INR),Last Order Date\n';


  Object.values(crm)
    .forEach(c => {

      csv +=
        `"${escapeCsv(c.name)}",` +
        `"${escapeCsv(c.phone)}",` +
        `"${escapeCsv(c.city)}",` +
        `"${c.totalOrders}",` +
        `"${c.totalSpend}",` +
        `"${escapeCsv(c.lastOrder)}"\n`;

    });


  downloadCsv(
    csv,
    `Patel_Sweet_Mart_Customers_CRM_${new Date().toISOString().slice(0, 10)}.csv`
  );
}


function downloadCsv(
  content,
  filename
) {

  const blob =
    new Blob(
      ['\uFEFF' + content],
      {
        type:
          'text/csv;charset=utf-8;'
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const a =
    document.createElement(
      'a'
    );


  a.href =
    url;

  a.download =
    filename;


  document.body.appendChild(
    a
  );


  a.click();


  document.body.removeChild(
    a
  );


  URL.revokeObjectURL(
    url
  );
}


/* ================================================================
   SUPABASE SETTINGS
   ================================================================ */

function saveSupabaseSettings(
  event
) {

  event.preventDefault();


  const url =
    document.getElementById(
      'cfg-supabase-url'
    )?.value.trim();


  const key =
    document.getElementById(
      'cfg-supabase-key'
    )?.value.trim();


  if (!url || !key) {

    alert(
      'કૃપા કરીને Project URL અને Key દાખલ કરો.'
    );

    return;
  }


  localStorage.setItem(
    'psm_supabase_url',
    url
  );


  localStorage.setItem(
    'psm_supabase_key',
    key
  );


  initSupabaseIfConfigured();

  testSupabaseConnection();
}


async function testSupabaseConnection() {

  const box =
    document.getElementById(
      'cfg-status-box'
    );


  if (!box) return;


  const url =
    localStorage.getItem(
      'psm_supabase_url'
    );


  const key =
    localStorage.getItem(
      'psm_supabase_key'
    );


  box.style.display =
    'block';


  box.innerHTML =
    '⏳ Supabase Cloud સાથે કનેક્ટ થઈ રહ્યું છે...';


  if (
    !url ||
    !key ||
    !window.supabase
  ) {

    box.innerHTML =
      '❌ Supabase configuration missing.';

    return;
  }


  try {

    const client =
      window.supabase.createClient(
        url,
        key
      );


    const {
      data,
      error
    } =
      await client
        .from('orders')
        .select('id')
        .limit(1);


    if (error) {

      box.innerHTML =
        `⚠️ Supabase error: ${escapeHtml(error.message)}`;

    } else {

      box.innerHTML =
        '✓ Supabase database connected successfully.';

      supabaseClient =
        client;

      fetchOrdersFromSupabase();
    }

  } catch (error) {

    box.innerHTML =
      `❌ Connection failed: ${escapeHtml(error.message)}`;
  }
}


/* ================================================================
   BACKUP
   ================================================================ */

function exportFullBackup() {

  try {

    const backupData = {

      storeName:
        'Patel Sweet Mart',

      version:
        '3.0',

      exportTimestamp:
        new Date().toISOString(),

      exportFormattedDate:
        new Date().toLocaleString('gu-IN'),

      ordersCount:
        allOrders.length,

      orders:
        allOrders,

      customCatalog:
        JSON.parse(
          localStorage.getItem(
            'psm_custom_catalog'
          ) || '{}'
        ),

      productPrices:
        JSON.parse(
          localStorage.getItem(
            'psm_product_prices'
          ) || '{}'
        )

    };


    const jsonStr =
      JSON.stringify(
        backupData,
        null,
        2
      );


    const dateSlug =
      new Date()
        .toISOString()
        .slice(0, 10);


    const filename =
      `Patel_Sweet_Mart_Backup_${dateSlug}.json`;


    const blob =
      new Blob(
        [jsonStr],
        {
          type:
            'application/json'
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const a =
      document.createElement(
        'a'
      );


    a.href =
      url;

    a.download =
      filename;


    document.body.appendChild(
      a
    );


    a.click();


    document.body.removeChild(
      a
    );


    URL.revokeObjectURL(
      url
    );


    alert(
      `✓ Backup તૈયાર છે. ${allOrders.length} orders save થયા.`
    );

  } catch (error) {

    alert(
      'Backup error: ' +
      error.message
    );
  }
}


function triggerRestoreBackup() {

  const input =
    document.getElementById(
      'backup-file-input'
    );


  if (input) {
    input.click();
  }
}


function handleRestoreBackupFile(
  event
) {

  const file =
    event.target.files &&
    event.target.files[0];


  if (!file) return;


  const reader =
    new FileReader();


  reader.onload =
    function(e) {

      try {

        const data =
          JSON.parse(
            e.target.result
          );


        if (
          !data ||
          !Array.isArray(
            data.orders
          )
        ) {

          alert(
            '❌ Invalid backup file.'
          );

          return;
        }


        const confirmed =
          confirm(
            `આ backup માં ${data.orders.length} orders છે. Restore કરવું છે?`
          );


        if (!confirmed) {
          return;
        }


        allOrders =
          data.orders
            .map(normalizeOrder)
            .filter(Boolean);


        saveLocalOrders(
          allOrders
        );


        if (data.customCatalog) {

          localStorage.setItem(
            'psm_custom_catalog',
            JSON.stringify(
              data.customCatalog
            )
          );
        }


        if (data.productPrices) {

          localStorage.setItem(
            'psm_product_prices',
            JSON.stringify(
              data.productPrices
            )
          );
        }


        initDataStore();

        renderAllViews();


        alert(
          `✓ ${allOrders.length} orders restore થયા.`
        );

      } catch (error) {

        alert(
          '❌ Backup read error: ' +
          error.message
        );
      }
    };


  reader.readAsText(
    file
  );


  event.target.value =
    '';
}


/* ================================================================
   MASTER REFRESH
   ================================================================ */

function renderAllViews() {

  /*
     Always read newest local orders
     before rendering.
  */

  const localOrders =
    readLocalOrders();


  if (localOrders.length > 0) {

    allOrders =
      mergeOrders(
        localOrders,
        []
      );
  }


  renderKpis();

  renderOrdersTable();


  if (
    currentActiveTab ===
    'kitchen'
  ) {

    renderKitchenPlanner();
  }


  if (
    currentActiveTab ===
    'analytics'
  ) {

    renderAnalyticsView();
  }


  if (
    currentActiveTab ===
    'crm'
  ) {

    renderCrmView();
  }


  if (
    currentActiveTab ===
    'inventory'
  ) {

    renderInventoryGrid();
  }
}


/* ================================================================
   LOAD EXISTING CONFIG
   ================================================================ */

function loadExistingConfigInputs() {

  const url =
    localStorage.getItem(
      'psm_supabase_url'
    );


  const key =
    localStorage.getItem(
      'psm_supabase_key'
    );


  const urlInput =
    document.getElementById(
      'cfg-supabase-url'
    );


  const keyInput =
    document.getElementById(
      'cfg-supabase-key'
    );


  if (
    url &&
    urlInput
  ) {

    urlInput.value =
      url;
  }


  if (
    key &&
    keyInput
  ) {

    keyInput.value =
      key;
  }
}


/* ================================================================
   HELPERS
   ================================================================ */

function escapeHtml(value) {

  return String(
    value ?? ''
  )
  .replace(
    /&/g,
    '&amp;'
  )
  .replace(
    /</g,
    '&lt;'
  )
  .replace(
    />/g,
    '&gt;'
  )
  .replace(
    /"/g,
    '&quot;'
  )
  .replace(
    /'/g,
    '&#039;'
  );
}


function escapeCsv(value) {

  return String(
    value ?? ''
  )
  .replace(
    /"/g,
    '""'
  );
}


function safeJs(value) {

  return String(
    value ?? ''
  )
  .replace(
    /\\/g,
    '\\\\'
  )
  .replace(
    /'/g,
    "\\'"
  );
}


/* ================================================================
   INITIALIZATION
   ================================================================ */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    initDataStore();

    checkAuth();

    loadExistingConfigInputs();

    renderAllViews();

    /*
       Ask notification permission only
       after user interaction/browser allows it.
    */

    try {

      if (
        'Notification' in window &&
        Notification.permission === 'default'
      ) {

        Notification.requestPermission()
          .catch(() => {});

      }

    } catch (error) {}

  }
);
