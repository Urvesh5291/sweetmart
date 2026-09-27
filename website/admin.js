/* ================================================================
   PATEL SWEET MART — ADMIN & BUSINESS ANALYTICS JAVASCRIPT
   Bilingual, Real-time Hybrid Sync (Supabase + LocalStorage Store)
   ================================================================ */

'use strict';

// Default Product Master Data
const DEFAULT_PRODUCTS = {
  toprapak: { id: 'toprapak', nameGu: 'ટોપરાપાક', nameEn: 'Toprapak', basePrice: 500, img: 'images/product-toprapak.jpg', category: 'mithai', isAvailable: true },
  mohanthal: { id: 'mohanthal', nameGu: 'મોહનથાળ', nameEn: 'Mohanthal', basePrice: 480, img: 'images/product-mohanthal.jpg', category: 'mithai', isAvailable: true },
  penda: { id: 'penda', nameGu: 'માવા પેંડા', nameEn: 'Mava Penda', basePrice: 520, img: 'images/product-penda.jpg', category: 'mithai', isAvailable: true },
  ladva: { id: 'ladva', nameGu: 'સ્પેશિયલ લાડવા', nameEn: 'Special Ladva', basePrice: 400, img: 'images/product-ladva.jpg', category: 'mithai', isAvailable: true },
  jalebi: { id: 'jalebi', nameGu: 'ગરમ જલેબી', nameEn: 'Hot Jalebi', basePrice: 380, img: 'images/product-jalebi.jpg', category: 'mithai', isAvailable: true },
  feni: { id: 'feni', nameGu: 'સ્વાદિષ્ટ ફેણી', nameEn: 'Feni', basePrice: 450, img: 'images/product-feni.jpg', category: 'mithai', isAvailable: true },
  ganthiya: { id: 'ganthiya', nameGu: 'ચટાકેદાર ગાંઠિયા', nameEn: 'Ganthiya', basePrice: 340, img: 'images/product-ganthiya.jpg', category: 'namkeen', isAvailable: true },
  chorafari: { id: 'chorafari', nameGu: 'ચોરાફળી', nameEn: 'Chorafari', basePrice: 360, img: 'images/product-chorafari.jpg', category: 'namkeen', isAvailable: true },
  chavanu: { id: 'chavanu', nameGu: 'મિક્સ ચવાણું', nameEn: 'Mix Chavanu', basePrice: 350, img: 'images/product-chavanu.jpg', category: 'namkeen', isAvailable: true },
  farali: { id: 'farali', nameGu: 'ફરાળી નાસ્તો', nameEn: 'Farali Snacks', basePrice: 400, img: 'images/product-farali.jpg', category: 'namkeen', isAvailable: true }
};

// Seed realistic demo orders if none exist
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
      { productId: 'toprapak', nameGu: 'ટોપરાપાક', nameEn: 'Toprapak', weightLabel: '1.25 kg (સવા કિલો)', weightKg: 1.25, unitPrice: 625, qty: 2, subtotal: 1250 },
      { productId: 'mohanthal', nameGu: 'મોહનથાળ', nameEn: 'Mohanthal', weightLabel: '500g (અડધો કિલો)', weightKg: 0.5, unitPrice: 240, qty: 1, subtotal: 240 },
      { productId: 'ganthiya', nameGu: 'ચટાકેદાર ગાંઠિયા', nameEn: 'Ganthiya', weightLabel: '500g', weightKg: 0.5, unitPrice: 170, qty: 2, subtotal: 340 }
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
      { productId: 'mohanthal', nameGu: 'મોહનથાળ', nameEn: 'Mohanthal', weightLabel: '1.25 kg (સવા કિલો)', weightKg: 1.25, unitPrice: 600, qty: 3, subtotal: 1800 },
      { productId: 'penda', nameGu: 'માવા પેંડા', nameEn: 'Mava Penda', weightLabel: '1 kg', weightKg: 1.0, unitPrice: 520, qty: 2, subtotal: 1040 }
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
      { productId: 'jalebi', nameGu: 'ગરમ જલેબી', nameEn: 'Hot Jalebi', weightLabel: '500g', weightKg: 0.5, unitPrice: 190, qty: 1, subtotal: 190 },
      { productId: 'ganthiya', nameGu: 'ચટાકેદાર ગાંઠિયા', nameEn: 'Ganthiya', weightLabel: '250g', weightKg: 0.25, unitPrice: 85, qty: 2, subtotal: 170 }
    ],
    totalAmount: 360,
    totalKg: 1.0
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
      { productId: 'toprapak', nameGu: 'ટોપરાપાક', nameEn: 'Toprapak', weightLabel: '2 kg', weightKg: 2.0, unitPrice: 1000, qty: 2, subtotal: 2000 },
      { productId: 'ladva', nameGu: 'સ્પેશિયલ લાડવા', nameEn: 'Special Ladva', weightLabel: '1.5 kg (દોઢ કિલો)', weightKg: 1.5, unitPrice: 600, qty: 2, subtotal: 1200 },
      { productId: 'chorafari', nameGu: 'ચોરાફળી', nameEn: 'Chorafari', weightLabel: '500g', weightKg: 0.5, unitPrice: 180, qty: 2, subtotal: 360 }
    ],
    totalAmount: 3560,
    totalKg: 8.0
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
      { productId: 'mohanthal', nameGu: 'મોહનથાળ', nameEn: 'Mohanthal', weightLabel: '1 kg', weightKg: 1.0, unitPrice: 480, qty: 1, subtotal: 480 },
      { productId: 'chavanu', nameGu: 'મિક્સ ચવાણું', nameEn: 'Mix Chavanu', weightLabel: '500g', weightKg: 0.5, unitPrice: 175, qty: 1, subtotal: 175 }
    ],
    totalAmount: 655,
    totalKg: 1.5
  }
];

// Initialize State
let allOrders = [];
let allProducts = { ...DEFAULT_PRODUCTS };
let currentActiveTab = 'orders';
let currentStatusFilter = 'all';
let currentDateFilter = 'all';
let searchQuery = '';
let supabaseClient = null;

// Load stored orders or seed demo data
function initDataStore() {
  try {
    const savedOrders = localStorage.getItem('psm_orders');
    if (savedOrders) {
      allOrders = JSON.parse(savedOrders);
    } else {
      allOrders = [...DEMO_ORDERS];
      localStorage.setItem('psm_orders', JSON.stringify(allOrders));
    }
  } catch (e) {
    allOrders = [...DEMO_ORDERS];
  }

  // Load custom products added by admin
  try {
    const customCatalog = localStorage.getItem('psm_custom_catalog');
    if (customCatalog) {
      const parsedCustom = JSON.parse(customCatalog);
      allProducts = { ...DEFAULT_PRODUCTS, ...parsedCustom };
    } else {
      allProducts = { ...DEFAULT_PRODUCTS };
    }
  } catch (e) {
    allProducts = { ...DEFAULT_PRODUCTS };
  }

  // Load stored custom prices if any
  try {
    const savedPrices = localStorage.getItem('psm_product_prices');
    if (savedPrices) {
      const parsed = JSON.parse(savedPrices);
      Object.keys(parsed).forEach(id => {
        if (allProducts[id]) {
          allProducts[id].basePrice = parsed[id];
        }
      });
    }
  } catch (e) {}

  // Check Supabase Configuration
  initSupabaseIfConfigured();
}

function initSupabaseIfConfigured() {
  const url = localStorage.getItem('psm_supabase_url');
  const key = localStorage.getItem('psm_supabase_key');
  const syncLabel = document.getElementById('sync-label');

  if (url && key && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      if (syncLabel) syncLabel.textContent = '🟢 Supabase Cloud Live Connected';
      fetchOrdersFromSupabase();
    } catch (e) {
      if (syncLabel) syncLabel.textContent = '🟡 Local Storage Store (Supabase Pending)';
    }
  } else {
    if (syncLabel) syncLabel.textContent = '🟢 Local Store Ready (Paste Supabase keys in Settings)';
  }
}

async function fetchOrdersFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      // Merge with local orders
      const mapped = data.map(o => ({
        id: o.order_number,
        date: o.created_at,
        customerName: o.customer_name,
        phone: o.customer_phone,
        city: o.delivery_city,
        address: o.delivery_address,
        notes: o.order_notes || '',
        status: o.status || 'new',
        totalAmount: Number(o.total_amount),
        totalKg: o.order_items ? o.order_items.reduce((s, i) => s + (Number(i.weight_kg) * i.quantity), 0) : 0,
        items: o.order_items ? o.order_items.map(it => ({
          productId: it.product_id,
          nameGu: it.product_name_gu,
          nameEn: it.product_name_en,
          weightLabel: it.weight_label,
          weightKg: Number(it.weight_kg),
          unitPrice: Number(it.unit_price),
          qty: it.quantity,
          subtotal: Number(it.subtotal)
        })) : []
      }));
      allOrders = mapped;
      localStorage.setItem('psm_orders', JSON.stringify(allOrders));
      renderAllViews();
    }
  } catch (err) {
    console.warn('Supabase fetch failed, continuing with local store', err);
  }
}

/* ---- AUTH GUARD ---- */
function checkAuth() {
  const isAuth = sessionStorage.getItem('psm_admin_auth') === 'authenticated' ||
                 localStorage.getItem('psm_owner_logged_in') === 'true';
  const modal = document.getElementById('admin-login-modal');
  if (isAuth) {
    if (modal) modal.style.display = 'none';
  } else {
    if (modal) modal.style.display = 'flex';
  }
}

function toggleAdminPasswordVisibility(fieldId, btn) {
  const field = document.getElementById(fieldId);
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
  sessionStorage.setItem('psm_admin_auth', 'authenticated');
  localStorage.setItem('psm_owner_logged_in', 'true');
  const modal = document.getElementById('admin-login-modal');
  if (modal) modal.style.display = 'none';
  renderAllViews();
}

function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value.trim();
  const remember = document.getElementById('login-remember')?.checked;

  if (pass === 'patel1995' || pass === 'admin123' || pass.toLowerCase() === 'patel' || (email && pass)) {
    sessionStorage.setItem('psm_admin_auth', 'authenticated');
    if (remember) {
      localStorage.setItem('psm_owner_logged_in', 'true');
    }
    const modal = document.getElementById('admin-login-modal');
    if (modal) modal.style.display = 'none';
    renderAllViews();
  } else {
    alert('❌ અમાન્ય પાસવર્ડ! કૃપા કરીને સાચો પાસવર્ડ દાખલ કરો. (ડિફોલ્ટ: patel1995)');
  }
}

function adminLogout() {
  sessionStorage.removeItem('psm_admin_auth');
  localStorage.removeItem('psm_owner_logged_in');
  location.reload();
}

/* ---- TAB SWITCHING ---- */
function switchAdminTab(tabName) {
  currentActiveTab = tabName;
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.admin-panel-view').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'panel-' + tabName);
  });

  if (tabName === 'kitchen') renderKitchenPlanner();
  if (tabName === 'analytics') renderAnalyticsView();
  if (tabName === 'crm') renderCrmView();
  if (tabName === 'inventory') renderInventoryGrid();
}

/* ---- FILTERING ---- */
function filterOrdersByStatus(status) {
  currentStatusFilter = status;
  document.querySelectorAll('.order-status-filter').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-status') === status);
  });
  renderOrdersTable();
}

function filterByDateRange(range) {
  currentDateFilter = range;
  document.querySelectorAll('.date-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-range') === range);
  });
  renderAllViews();
}

function handleOrderSearch(val) {
  searchQuery = val.trim().toLowerCase();
  renderOrdersTable();
}

function getFilteredOrders() {
  let list = [...allOrders];

  // Status Filter
  if (currentStatusFilter !== 'all') {
    list = list.filter(o => o.status === currentStatusFilter);
  }

  // Date Filter
  const now = new Date();
  if (currentDateFilter === 'today') {
    list = list.filter(o => {
      const d = new Date(o.date);
      return d.toDateString() === now.toDateString();
    });
  } else if (currentDateFilter === 'week') {
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    list = list.filter(o => new Date(o.date) >= oneWeekAgo);
  } else if (currentDateFilter === 'month') {
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    list = list.filter(o => new Date(o.date) >= oneMonthAgo);
  }

  // Search Query
  if (searchQuery) {
    list = list.filter(o =>
      o.id.toLowerCase().includes(searchQuery) ||
      o.customerName.toLowerCase().includes(searchQuery) ||
      o.phone.toLowerCase().includes(searchQuery) ||
      o.city.toLowerCase().includes(searchQuery)
    );
  }

  return list;
}

/* ---- RENDER KPI CARDS ---- */
function renderKpis() {
  const filtered = getFilteredOrders();
  const totalRev = filtered.reduce((s, o) => s + o.totalAmount, 0);
  const totalOrders = filtered.length;
  const totalKg = filtered.reduce((s, o) => s + (o.totalKg || 0), 0);
  const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;

  const revEl = document.getElementById('kpi-revenue');
  const ordEl = document.getElementById('kpi-orders-count');
  const kgEl = document.getElementById('kpi-total-kg');
  const aovEl = document.getElementById('kpi-aov');
  const badgeEl = document.getElementById('tab-orders-badge');

  if (revEl) revEl.textContent = '₹' + totalRev.toLocaleString('en-IN');
  if (ordEl) ordEl.textContent = totalOrders;
  if (kgEl) kgEl.textContent = totalKg.toFixed(2) + ' kg';
  if (aovEl) aovEl.textContent = '₹' + aov.toLocaleString('en-IN');
  if (badgeEl) badgeEl.textContent = totalOrders;
}

/* ---- RENDER ORDERS TABLE ---- */
function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const filtered = getFilteredOrders();
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:36px;color:#94A3B8;">કોઈ ઓર્ડર મળ્યા નથી (No orders found)</td></tr>`;
    return;
  }

  let html = '';
  filtered.forEach(o => {
    const d = new Date(o.date);
    const dateFormatted = d.toLocaleDateString('gu-IN', { day: '2-digit', month: 'short' }) + ', ' +
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const itemsSummary = o.items.map(it => `${it.nameGu} (${it.weightLabel}) × ${it.qty}`).join('<br>');
    const cityClass = o.city.includes('Kherwa') ? 'kherwa' : 'ahmedabad';

    html += `
      <tr>
        <td><span class="order-id-badge">#${o.id}</span></td>
        <td style="font-size:0.8rem;color:#64748B;">${dateFormatted}</td>
        <td>
          <div class="cust-name">${o.customerName}</div>
          <div class="cust-phone">&#128222; ${o.phone}</div>
        </td>
        <td><span class="city-badge ${cityClass}">${o.city}</span></td>
        <td><div class="items-summary-text">${itemsSummary}</div></td>
        <td><span class="table-price">₹${o.totalAmount.toLocaleString('en-IN')}</span></td>
        <td><span class="status-pill ${o.status}">${getStatusLabelGu(o.status)}</span></td>
        <td>
          <div class="table-actions">
            <button class="btn-table-icon" title="ઓર્ડર વિગત જુઓ" onclick="openOrderModal('${o.id}')">&#128065;</button>
            <a href="https://wa.me/91${o.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('નમસ્તે ' + o.customerName + ', પટેલ સ્વીટ માર્ટમાંથી આપના ઓર્ડર #' + o.id + ' સંદર્ભે.')}" target="_blank" rel="noopener" class="btn-table-icon btn-wa-action" title="WhatsApp ચેટ">&#128172;</a>
            <button class="btn-table-icon" title="પ્રિન્ટ સ્લિપ" onclick="printOrderSlip('${o.id}')">&#128438;</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function getStatusLabelGu(st) {
  switch (st) {
    case 'new': return 'નવો (New)';
    case 'confirmed': return 'કન્ફર્મ';
    case 'packed': return 'પેક થયેલ';
    case 'dispatched': return 'રવાના (Dispatched)';
    case 'delivered': return 'ડિલિવર (Delivered)';
    case 'cancelled': return 'રદ';
    default: return st;
  }
}

/* ---- KITCHEN BATCH PLANNER ---- */
function renderKitchenPlanner() {
  const container = document.getElementById('kitchen-grid');
  if (!container) return;

  const orders = getFilteredOrders();
  const summary = {};

  orders.forEach(o => {
    o.items.forEach(it => {
      const key = it.productId || it.nameEn.toLowerCase();
      if (!summary[key]) {
        summary[key] = {
          nameGu: it.nameGu,
          nameEn: it.nameEn,
          totalKg: 0,
          packBreakdown: {}
        };
      }
      const itemWeight = (it.weightKg || 1) * it.qty;
      summary[key].totalKg += itemWeight;

      const wLabel = it.weightLabel || '1kg';
      summary[key].packBreakdown[wLabel] = (summary[key].packBreakdown[wLabel] || 0) + it.qty;
    });
  });

  if (Object.keys(summary).length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#94A3B8;">આજે રસોડા માટે કોઈ ઓર્ડર નથી.</div>`;
    return;
  }

  let html = '';
  Object.keys(summary).forEach(k => {
    const s = summary[k];
    const packsText = Object.keys(s.packBreakdown).map(w => `• <strong>${w}</strong>: ${s.packBreakdown[w]} પેક`).join('<br>');
    html += `
      <div class="kitchen-card">
        <div>
          <div class="kitchen-card-header">
            <div>
              <div class="kitchen-sweet-name">${s.nameGu}</div>
              <div class="kitchen-sweet-en">${s.nameEn}</div>
            </div>
            <div>
              <div class="kitchen-kg-total">${s.totalKg.toFixed(2)} kg</div>
              <div class="kitchen-kg-label">કુલ તૈયારી વજન</div>
            </div>
          </div>
          <div class="kitchen-weight-breakdown">
            ${packsText}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ---- BUSINESS ANALYTICS & INSIGHTS ---- */
function renderAnalyticsView() {
  renderWeightDistributionChart();
  renderZoneDistributionChart();
  renderTopProductsTable();
}

function renderWeightDistributionChart() {
  const chartEl = document.getElementById('weight-distribution-chart');
  if (!chartEl) return;

  const orders = getFilteredOrders();
  const counts = {
    '250g': 0,
    '500g': 0,
    '1 kg': 0,
    '1.25 kg (સવા)': 0,
    '1.5 kg (દોઢ)': 0,
    '2 kg+ (બલ્ક)': 0
  };

  let totalItemsCount = 0;
  orders.forEach(o => {
    o.items.forEach(it => {
      totalItemsCount += it.qty;
      const w = it.weightLabel || '';
      if (w.includes('250g')) counts['250g'] += it.qty;
      else if (w.includes('500g')) counts['500g'] += it.qty;
      else if (w.includes('1.25') || w.includes('સવા')) counts['1.25 kg (સવા)'] += it.qty;
      else if (w.includes('1.5') || w.includes('દોઢ')) counts['1.5 kg (દોઢ)'] += it.qty;
      else if (w.includes('2') || w.includes('5')) counts['2 kg+ (બલ્ક)'] += it.qty;
      else counts['1 kg'] += it.qty;
    });
  });

  if (totalItemsCount === 0) totalItemsCount = 1;

  let html = '';
  Object.keys(counts).forEach(label => {
    const count = counts[label];
    const pct = Math.round((count / totalItemsCount) * 100);
    html += `
      <div class="bar-item">
        <div class="bar-item-header">
          <span>${label} (${count} પેક)</span>
          <span>${pct}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  });

  chartEl.innerHTML = html;
}

function renderZoneDistributionChart() {
  const chartEl = document.getElementById('zone-distribution-chart');
  if (!chartEl) return;

  const orders = getFilteredOrders();
  const zones = {
    'ખેરવા (Kherwa)': 0,
    'અમદાવાદ (Ahmedabad)': 0,
    'અન્ય ગુજરાત (Other)': 0
  };

  let total = orders.length || 1;
  orders.forEach(o => {
    if (o.city.includes('Kherwa')) zones['ખેરવા (Kherwa)'] += 1;
    else if (o.city.includes('Ahmedabad')) zones['અમદાવાદ (Ahmedabad)'] += 1;
    else zones['અન્ય ગુજરાત (Other)'] += 1;
  });

  let html = '';
  Object.keys(zones).forEach(z => {
    const count = zones[z];
    const pct = Math.round((count / total) * 100);
    html += `
      <div class="bar-item">
        <div class="bar-item-header">
          <span>${z} (${count} ઓર્ડર)</span>
          <span>${pct}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${pct}%; background: ${z.includes('Kherwa') ? 'var(--gold)' : 'var(--cobalt)'};"></div>
        </div>
      </div>
    `;
  });

  chartEl.innerHTML = html;
}

function renderTopProductsTable() {
  const tbody = document.getElementById('analytics-products-tbody');
  if (!tbody) return;

  const orders = getFilteredOrders();
  const stats = {};

  orders.forEach(o => {
    o.items.forEach(it => {
      const id = it.productId || it.nameEn.toLowerCase();
      if (!stats[id]) {
        stats[id] = {
          nameGu: it.nameGu,
          nameEn: it.nameEn,
          ordersCount: 0,
          totalKg: 0,
          totalRevenue: 0,
          weightsUsed: {}
        };
      }
      stats[id].ordersCount += 1;
      stats[id].totalKg += (it.weightKg || 1) * it.qty;
      stats[id].totalRevenue += it.subtotal || 0;
      stats[id].weightsUsed[it.weightLabel] = (stats[id].weightsUsed[it.weightLabel] || 0) + it.qty;
    });
  });

  const sorted = Object.values(stats).sort((a, b) => b.totalRevenue - a.totalRevenue);

  let html = '';
  sorted.forEach(s => {
    const popularWeight = Object.keys(s.weightsUsed).sort((a, b) => s.weightsUsed[b] - s.weightsUsed[a])[0] || '1kg';
    html += `
      <tr>
        <td><strong>${s.nameGu}</strong> <span style="font-size:0.8rem;color:#64748B;">(${s.nameEn})</span></td>
        <td>${s.ordersCount}</td>
        <td><strong>${s.totalKg.toFixed(2)} kg</strong></td>
        <td><strong style="color:var(--cobalt)">₹${s.totalRevenue.toLocaleString('en-IN')}</strong></td>
        <td><span class="city-badge">${popularWeight}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/* ---- CUSTOMER CRM ---- */
function renderCrmView() {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;

  const crm = {};
  allOrders.forEach(o => {
    const phone = o.phone.replace(/[^0-9]/g, '');
    if (!crm[phone]) {
      crm[phone] = {
        name: o.customerName,
        phone: o.phone,
        city: o.city,
        address: o.address,
        totalOrders: 0,
        totalSpend: 0,
        lastOrderDate: o.date
      };
    }
    crm[phone].totalOrders += 1;
    crm[phone].totalSpend += o.totalAmount;
    if (new Date(o.date) > new Date(crm[phone].lastOrderDate)) {
      crm[phone].lastOrderDate = o.date;
      crm[phone].address = o.address;
    }
  });

  const list = Object.values(crm).sort((a, b) => b.totalSpend - a.totalSpend);

  let html = '';
  list.forEach(c => {
    const d = new Date(c.lastOrderDate).toLocaleDateString('gu-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    html += `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td>${c.phone}</td>
        <td><span class="city-badge">${c.city}</span></td>
        <td style="max-width:220px;font-size:0.82rem;color:#64748B;">${c.address}</td>
        <td><strong>${c.totalOrders}</strong></td>
        <td><strong style="color:var(--cobalt)">₹${c.totalSpend.toLocaleString('en-IN')}</strong></td>
        <td style="font-size:0.8rem;">${d}</td>
        <td>
          <a href="https://wa.me/91${c.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('નમસ્તે ' + c.name + ', પટેલ સ્વીટ માર્ટ તરફથી શુભકામનાઓ!')}" target="_blank" rel="noopener" class="btn-table-icon btn-wa-action" title="WhatsApp મેસેજ">&#128172;</a>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/* ---- PRICE, CATALOG & INVENTORY CONTROLLER ---- */
function renderInventoryGrid() {
  const grid = document.getElementById('inventory-grid');
  if (!grid) return;

  updateBulkTargetCount();

  let html = '';
  Object.keys(allProducts).forEach(id => {
    const p = allProducts[id];
    const isCustom = !DEFAULT_PRODUCTS[id];
    const catLabel = p.category === 'namkeen' ? 'નમકીન' : 'મીઠાઈ';

    html += `
      <div class="inventory-item-card" id="inv-card-${p.id}">
        <div class="inv-details">
          <img src="${p.img}" alt="${p.nameEn}" class="inv-img" onerror="this.src='images/product-toprapak.jpg'" />
          <div>
            <div style="display:flex;align-items:center;gap:6px;">
              <div class="inv-name">${p.nameGu}</div>
              <span class="inv-badge-tag">${catLabel}</span>
            </div>
            <div class="inv-en">${p.nameEn}</div>
            ${isCustom ? `
              <div style="margin-top:4px;">
                <button type="button" class="btn-delete-prod" onclick="deleteCustomProduct('${p.id}')" title="ઉત્પાદન હટાવો">&#128465; હટાવો (Delete)</button>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="inv-controls">
          <div class="inv-price-input-wrap">
            <span style="font-size:0.85rem;font-weight:700;">₹</span>
            <input type="number" class="inv-price-input" id="inv-price-${p.id}" value="${p.basePrice}" step="10" min="50" onchange="markInventoryDirty('${p.id}')" />
            <span style="font-size:0.75rem;color:#64748B;">/ 1kg</span>
          </div>
          <label class="inv-switch">
            <input type="checkbox" id="inv-stock-${p.id}" ${p.isAvailable !== false ? 'checked' : ''} onchange="markInventoryDirty('${p.id}')" />
            <span>સ્ટોકમાં છે (In Stock)</span>
          </label>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function markInventoryDirty(id) {
  const card = document.getElementById('inv-card-' + id);
  if (card) {
    card.style.borderColor = 'var(--gold)';
  }
}

function saveAllInventoryPrices() {
  const priceMap = {};
  let savedCount = 0;

  Object.keys(allProducts).forEach(id => {
    const input = document.getElementById('inv-price-' + id);
    const stock = document.getElementById('inv-stock-' + id);
    if (input) {
      const val = parseFloat(input.value);
      if (!isNaN(val) && val > 0) {
        allProducts[id].basePrice = Math.round(val);
        priceMap[id] = Math.round(val);
        savedCount++;
      }
    }
    if (stock) {
      allProducts[id].isAvailable = stock.checked;
    }
  });

  // Save prices
  try {
    localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));
  } catch (e) {}

  // Also update custom catalog base prices if custom products exist
  try {
    const customCatalog = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    let hasCustomUpdates = false;
    Object.keys(customCatalog).forEach(cid => {
      if (priceMap[cid]) {
        customCatalog[cid].basePrice = priceMap[cid];
        hasCustomUpdates = true;
      }
      const st = document.getElementById('inv-stock-' + cid);
      if (st) {
        customCatalog[cid].isAvailable = st.checked;
        hasCustomUpdates = true;
      }
    });
    if (hasCustomUpdates) {
      localStorage.setItem('psm_custom_catalog', JSON.stringify(customCatalog));
    }
  } catch (e) {}

  alert(`✓ તમામ ${savedCount} ઉત્પાદનોના નવા ભાવ સાઈટ પર લાઈવ અપડેટ થઈ ગયા છે! (Prices Saved Successfully)`);
  renderInventoryGrid();
}

/* ---- BULK PRICING CONTROLLER ---- */
function updateBulkTargetCount() {
  const select = document.getElementById('bulk-target-category');
  const countLabel = document.getElementById('bulk-affected-count');
  if (!select || !countLabel) return;

  const cat = select.value;
  let count = 0;
  Object.keys(allProducts).forEach(id => {
    const p = allProducts[id];
    if (cat === 'all' || p.category === cat) {
      count++;
    }
  });

  countLabel.textContent = `${count} ઉત્પાદનો સક્રિય (${cat === 'all' ? 'બધા' : (cat === 'mithai' ? 'મીઠાઈ' : 'નમકીન')})`;
}

function applyQuickBulkPrice(amount, type) {
  const select = document.getElementById('bulk-target-category');
  const cat = select ? select.value : 'all';

  const catNameGu = cat === 'all' ? 'તમામ ઉત્પાદનો' : (cat === 'mithai' ? 'મીઠાઈ' : 'નમકીન');
  const adjustDesc = type === 'pct' ? `${amount > 0 ? '+' : ''}${amount}%` : `${amount > 0 ? '+₹' : '-₹'}${Math.abs(amount)}`;

  const confirmed = confirm(`શું તમે ખરેખર ${catNameGu} પર ${adjustDesc} નો ભાવ ફેરફાર લાગુ કરવા માંગો છો?`);
  if (!confirmed) return;

  let affected = 0;
  const priceMap = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');

  Object.keys(allProducts).forEach(id => {
    const p = allProducts[id];
    if (cat === 'all' || p.category === cat) {
      let currentPrice = p.basePrice;
      let newPrice = currentPrice;

      if (type === 'flat') {
        newPrice = currentPrice + amount;
      } else if (type === 'pct') {
        newPrice = Math.round(currentPrice * (1 + amount / 100));
      }

      // Round to nearest 5 for realistic pricing (e.g. 482 -> 480 or 485)
      newPrice = Math.round(newPrice / 5) * 5;
      if (newPrice < 50) newPrice = 50;

      p.basePrice = newPrice;
      priceMap[id] = newPrice;

      const input = document.getElementById('inv-price-' + id);
      if (input) {
        input.value = newPrice;
      }
      affected++;
    }
  });

  // Persist updated prices
  try {
    localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));
  } catch (e) {}

  // Update in custom catalog as well
  try {
    const customCatalog = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    Object.keys(customCatalog).forEach(cid => {
      if (priceMap[cid]) {
        customCatalog[cid].basePrice = priceMap[cid];
      }
    });
    localStorage.setItem('psm_custom_catalog', JSON.stringify(customCatalog));
  } catch (e) {}

  alert(`⚡ બલ્ક પ્રાઇસિંગ સફળ! ${affected} ઉત્પાદનોના ભાવ ${adjustDesc} સાથે અપડેટ થઈ ગયા છે.`);
  renderInventoryGrid();
}

function applyCustomBulkAdjustment() {
  const dirSelect = document.getElementById('bulk-custom-dir');
  const amountInput = document.getElementById('bulk-custom-amount');
  const unitSelect = document.getElementById('bulk-custom-unit');

  if (!amountInput) return;
  const rawVal = parseFloat(amountInput.value);
  if (isNaN(rawVal) || rawVal <= 0) {
    alert('કૃપા કરીને યોગ્ય રકમ અથવા ટકા દાખલ કરો.');
    amountInput.focus();
    return;
  }

  const multiplier = dirSelect && dirSelect.value === 'sub' ? -1 : 1;
  const finalAmount = rawVal * multiplier;
  const unitType = unitSelect ? unitSelect.value : 'flat';

  applyQuickBulkPrice(finalAmount, unitType);
  amountInput.value = '';
}

/* ---- ADD NEW PRODUCT MODAL & CONTROLLER ---- */
function openAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) {
    modal.classList.add('open');
    updateNewProdPreview();
  }
}

function closeAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (modal) {
    modal.classList.remove('open');
    const form = document.getElementById('add-product-form');
    if (form) form.reset();
  }
}

function onNewProdPresetChange() {
  const select = document.getElementById('new-prod-preset-img');
  const customGroup = document.getElementById('new-prod-custom-url-group');
  if (!select) return;

  if (select.value === 'custom') {
    if (customGroup) customGroup.style.display = 'block';
  } else {
    if (customGroup) customGroup.style.display = 'none';
  }
  updateNewProdPreview();
}

function updateNewProdPreview() {
  const nameGu = (document.getElementById('new-prod-name-gu')?.value || 'નવું ઉત્પાદન').trim();
  const nameEn = (document.getElementById('new-prod-name-en')?.value || 'New Product').trim();
  const category = document.getElementById('new-prod-category')?.value || 'mithai';
  const price = document.getElementById('new-prod-price')?.value || '500';
  const presetSelect = document.getElementById('new-prod-preset-img');
  const customUrlInput = document.getElementById('new-prod-img');

  let imgSrc = 'images/product-toprapak.jpg';
  if (presetSelect && presetSelect.value !== 'custom') {
    imgSrc = presetSelect.value;
  } else if (customUrlInput && customUrlInput.value.trim()) {
    imgSrc = customUrlInput.value.trim();
  }

  const previewTitle = document.getElementById('new-prod-preview-title');
  const previewEn = document.getElementById('new-prod-preview-en');
  const previewTag = document.getElementById('new-prod-preview-tag');
  const previewPrice = document.getElementById('new-prod-preview-price');
  const previewImg = document.getElementById('new-prod-preview-img');

  if (previewTitle) previewTitle.textContent = nameGu;
  if (previewEn) previewEn.textContent = nameEn;
  if (previewTag) previewTag.textContent = category === 'namkeen' ? 'નમકીન' : 'મીઠાઈ';
  if (previewPrice) previewPrice.textContent = '₹' + price;
  if (previewImg) previewImg.src = imgSrc;
}

function handleAddNewProduct(event) {
  event.preventDefault();

  const nameGu = document.getElementById('new-prod-name-gu').value.trim();
  const nameEn = document.getElementById('new-prod-name-en').value.trim();
  const category = document.getElementById('new-prod-category').value;
  const price = parseFloat(document.getElementById('new-prod-price').value) || 500;
  const descGu = document.getElementById('new-prod-desc-gu').value.trim();

  const presetSelect = document.getElementById('new-prod-preset-img');
  const customUrl = document.getElementById('new-prod-img')?.value?.trim();
  let imgSrc = (presetSelect && presetSelect.value !== 'custom') ? presetSelect.value : (customUrl || 'images/product-toprapak.jpg');

  // Generate safe slug id
  const slug = nameEn.toLowerCase().replace(/[^a-z0-9]/g, '_') || ('prod_' + Date.now());
  const uniqueId = allProducts[slug] ? `${slug}_${Date.now()}` : slug;

  const newProd = {
    id: uniqueId,
    nameGu: nameGu,
    nameEn: nameEn,
    basePrice: price,
    category: category,
    img: imgSrc,
    descGu: descGu || 'શુદ્ધ ઘી અને પરંપરાગત કારીગરી સાથે બનેલી ઉત્તમ બનાવટ',
    descEn: 'Handcrafted fresh with pure desi ingredients and heritage recipes.',
    isAvailable: true,
    isCustom: true,
    createdAt: new Date().toISOString()
  };

  // 1. Add to in-memory catalog
  allProducts[uniqueId] = newProd;

  // 2. Persist in psm_custom_catalog
  try {
    const existingCustom = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    existingCustom[uniqueId] = newProd;
    localStorage.setItem('psm_custom_catalog', JSON.stringify(existingCustom));
  } catch (e) {}

  // 3. Persist in price map
  try {
    const priceMap = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');
    priceMap[uniqueId] = price;
    localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));
  } catch (e) {}

  // Close modal and refresh UI
  closeAddProductModal();
  renderInventoryGrid();

  alert(`✓ અભિનંદન! "${nameGu} (${nameEn})" સફળતાપૂર્વક ઉમેરાઈ ગયું છે અને ગ્રાહક વેબસાઈટ પર લાઈવ થઈ ગયું છે!`);
}

function deleteCustomProduct(id) {
  const p = allProducts[id];
  if (!p) return;

  const confirmed = confirm(`શું તમે ખરેખર "${p.nameGu} (${p.nameEn})" ઉત્પાદન હટાવવા માંગો છો?`);
  if (!confirmed) return;

  // Remove from state
  delete allProducts[id];

  // Remove from custom catalog
  try {
    const existingCustom = JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}');
    delete existingCustom[id];
    localStorage.setItem('psm_custom_catalog', JSON.stringify(existingCustom));
  } catch (e) {}

  // Remove from price map
  try {
    const priceMap = JSON.parse(localStorage.getItem('psm_product_prices') || '{}');
    delete priceMap[id];
    localStorage.setItem('psm_product_prices', JSON.stringify(priceMap));
  } catch (e) {}

  renderInventoryGrid();
  alert(`✓ ઉત્પાદન સફળતાપૂર્વક હટાવી દેવાયું છે.`);
}

/* ---- DATA SAFETY & BACKUP VAULT ---- */
function exportFullBackup() {
  try {
    const backupData = {
      storeName: 'Patel Sweet Mart (ખેરવા / અમદાવાદ)',
      version: '2.0-FutureReady',
      exportTimestamp: new Date().toISOString(),
      exportFormattedDate: new Date().toLocaleString('gu-IN'),
      ordersCount: allOrders.length,
      orders: allOrders,
      customCatalog: JSON.parse(localStorage.getItem('psm_custom_catalog') || '{}'),
      productPrices: JSON.parse(localStorage.getItem('psm_product_prices') || '{}'),
      supabaseConfig: {
        url: localStorage.getItem('psm_supabase_url') || '',
        hasKey: !!localStorage.getItem('psm_supabase_key')
      }
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

    const safetyText = document.getElementById('safety-last-backup-text');
    if (safetyText) {
      safetyText.textContent = `છેલ્લું સફળ બેકઅપ: ${new Date().toLocaleDateString('gu-IN')} ${new Date().toLocaleTimeString('gu-IN')} (${allOrders.length} ઓર્ડર સુરક્ષિત)`;
    }

    alert(`🛡️ સુરક્ષિત બેકઅપ ફાઈલ "${filename}" ડાઉનલોડ થઈ ગઈ છે! તમારા બધા ઓર્ડર, ગ્રાહકો અને ભાવ 100% સુરક્ષિત છે.`);
  } catch (err) {
    alert('બેકઅપ બનાવવામાં ક્ષતિ આવી: ' + err.message);
  }
}

function triggerRestoreBackup() {
  const input = document.getElementById('backup-file-input');
  if (input) input.click();
}

function handleRestoreBackupFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || !data.orders || !Array.isArray(data.orders)) {
        alert('❌ અમાન્ય બેકઅપ ફાઈલ: યોગ્ય પટેલ સ્વીટ માર્ટ JSON બેકઅપ પસંદ કરો.');
        return;
      }

      const confirmed = confirm(`આ બેકઅપમાં:\n• ${data.orders.length} ઓર્ડર્સ\n• ${Object.keys(data.customCatalog || {}).length} કસ્ટમ પ્રોડક્ટ્સ\nતારીખ: ${data.exportFormattedDate || data.exportTimestamp}\n\nશું તમે ખરેખર આ ડેટા રિસ્ટોર કરવા માંગો છો?`);
      if (!confirmed) return;

      // Restore orders
      localStorage.setItem('psm_orders', JSON.stringify(data.orders));
      allOrders = data.orders;

      // Restore custom catalog
      if (data.customCatalog) {
        localStorage.setItem('psm_custom_catalog', JSON.stringify(data.customCatalog));
      }

      // Restore prices
      if (data.productPrices) {
        localStorage.setItem('psm_product_prices', JSON.stringify(data.productPrices));
      }

      // Re-initialize state
      initDataStore();
      renderAllViews();

      alert(`✓ અભિનંદન! બેકઅપ સફળતાપૂર્વક રિસ્ટોર થઈ ગયું છે. (${data.orders.length} ઓર્ડર્સ લોડ થયા)`);
    } catch (err) {
      alert('❌ બેકઅપ ફાઈલ વાંચવામાં ભૂલ થઈ: ' + err.message);
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input
}

function confirmResetDefaults() {
  const confirmed = confirm('⚠️ શું તમે ખરેખર તમામ પ્રાઈસિંગ અને ડેમો ઓર્ડર્સ ડિફોલ્ટ સેટ કરવા માંગો છો? (કસ્ટમ પ્રોડક્ટ્સ હટાવવામાં આવશે નહીં)');
  if (!confirmed) return;

  localStorage.removeItem('psm_product_prices');
  localStorage.setItem('psm_orders', JSON.stringify(DEMO_ORDERS));
  allOrders = [...DEMO_ORDERS];
  initDataStore();
  renderAllViews();
  alert('✓ ડિફોલ્ટ સેટિંગ્સ રિસ્ટોર થઈ ગઈ છે.');
}

/* ---- ORDER DETAILS MODAL & STATUS UPDATER ---- */
let currentModalOrderId = null;
function openOrderModal(orderId) {
  const o = allOrders.find(x => x.id === orderId);
  if (!o) return;
  currentModalOrderId = orderId;

  document.getElementById('modal-order-title').textContent = `ઓર્ડર વિગત #${o.id}`;

  const itemsHtml = o.items.map(it => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E2E8F0;">
      <div>
        <strong>${it.nameGu} (${it.nameEn})</strong><br>
        <small style="color:#64748B;">વજન: ${it.weightLabel} | જથ્થો: ${it.qty} પેક @ ₹${it.unitPrice}</small>
      </div>
      <div style="font-weight:800;color:var(--cobalt)">₹${it.subtotal}</div>
    </div>
  `).join('');

  document.getElementById('modal-order-body').innerHTML = `
    <div>
      <div style="font-size:0.8rem;text-transform:uppercase;color:#64748B;font-weight:700;">ગ્રાહકની વિગત</div>
      <div style="font-size:1.1rem;font-weight:800;color:#1E2229;margin-top:2px;">${o.customerName}</div>
      <div style="color:#64748B;">ફોન: ${o.phone} | શહેર: ${o.city}</div>
      <div style="margin-top:4px;padding:8px;background:#F8FAFC;border-radius:6px;font-size:0.88rem;">સરનામું: ${o.address}</div>
      ${o.notes ? `<div style="margin-top:6px;color:#C2410C;font-size:0.85rem;"><strong>ઓર્ડર નોંધ:</strong> ${o.notes}</div>` : ''}
    </div>

    <div>
      <div style="font-size:0.8rem;text-transform:uppercase;color:#64748B;font-weight:700;margin-bottom:6px;">ઓર્ડર કરેલી વસ્તુઓ</div>
      ${itemsHtml}
      <div style="display:flex;justify-content:space-between;padding-top:12px;font-size:1.15rem;font-weight:800;">
        <span>કુલ રકમ (Total):</span>
        <span style="color:var(--cobalt)">₹${o.totalAmount.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <div>
      <label style="font-size:0.8rem;text-transform:uppercase;color:#64748B;font-weight:700;display:block;margin-bottom:6px;">ઓર્ડર સ્થિતિ બદલો (Update Status)</label>
      <select id="modal-status-select" class="admin-input" style="font-weight:700;">
        <option value="new" ${o.status === 'new' ? 'selected' : ''}>નવો (New)</option>
        <option value="confirmed" ${o.status === 'confirmed' ? 'selected' : ''}>કન્ફર્મ (Confirmed)</option>
        <option value="packed" ${o.status === 'packed' ? 'selected' : ''}>પેક થયેલ (Packed)</option>
        <option value="dispatched" ${o.status === 'dispatched' ? 'selected' : ''}>રવાના (Dispatched)</option>
        <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>પૂર્ણ (Delivered)</option>
      </select>
    </div>
  `;

  document.getElementById('modal-order-footer').innerHTML = `
    <button type="button" class="btn-panel-action" style="background:#25D366;" onclick="sendWhatsAppStatusUpdate('${o.id}')">
      &#128172; ગ્રાહકને WhatsApp અપડેટ
    </button>
    <div style="display:flex;gap:8px;">
      <button type="button" class="btn-logout" onclick="closeOrderModal()">બંધ કરો</button>
      <button type="button" class="btn-panel-action" onclick="saveOrderStatusFromModal()">સેવ સ્થિતિ</button>
    </div>
  `;

  const modal = document.getElementById('order-detail-modal');
  if (modal) modal.classList.add('open');
}

function closeOrderModal() {
  const modal = document.getElementById('order-detail-modal');
  if (modal) modal.classList.remove('open');
}

function saveOrderStatusFromModal() {
  if (!currentModalOrderId) return;
  const select = document.getElementById('modal-status-select');
  if (!select) return;

  const newStatus = select.value;
  const idx = allOrders.findIndex(o => o.id === currentModalOrderId);
  if (idx > -1) {
    allOrders[idx].status = newStatus;
    localStorage.setItem('psm_orders', JSON.stringify(allOrders));

    // Also update Supabase if configured
    if (supabaseClient) {
      supabaseClient
        .from('orders')
        .update({ status: newStatus })
        .eq('order_number', currentModalOrderId)
        .then(() => {});
    }

    renderAllViews();
    closeOrderModal();
  }
}

function sendWhatsAppStatusUpdate(orderId) {
  const o = allOrders.find(x => x.id === orderId);
  if (!o) return;
  const cleanPhone = o.phone.replace(/[^0-9]/g, '');
  const statusMsg = `નમસ્તે ${o.customerName}, પટેલ સ્વીટ માર્ટમાંથી આપના ઓર્ડર #${o.id} ની સ્થિતિ: *${getStatusLabelGu(o.status)}*. વિતરણ સ્થળ: ${o.city}. આભાર!`;
  const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(statusMsg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/* ---- PRINT SLIP FOR KITCHEN & COURIER ---- */
function printOrderSlip(orderId) {
  const o = allOrders.find(x => x.id === orderId);
  if (!o) return;

  const slipArea = document.getElementById('print-slip-area');
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
        ${o.notes ? `<div><strong>નોંધ:</strong> ${o.notes}</div>` : ''}
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
        <span>કુલ રકમ (Total):</span>
        <span>₹${o.totalAmount}</span>
      </div>

      <div style="text-align:center;margin-top:20px;font-size:0.8rem;">
        શુદ્ધતા અને પરંપરાનો ભરોસો — 1995થી<br>
        મુલાકાત બદલ આભાર!
      </div>
    </div>
  `;

  window.print();
}

/* ---- EXCEL / CSV EXPORTERS ---- */
function exportOrdersToExcel() {
  const orders = getFilteredOrders();
  let csv = 'Order ID,Date,Customer Name,Phone,City,Address,Total Amount,Status,Items\n';

  orders.forEach(o => {
    const itemsStr = o.items.map(it => `${it.nameEn} (${it.weightLabel} x ${it.qty})`).join('; ');
    csv += `"${o.id}","${o.date}","${o.customerName}","${o.phone}","${o.city}","${o.address.replace(/"/g, '""')}","${o.totalAmount}","${o.status}","${itemsStr}"\n`;
  });

  downloadCsv(csv, `Patel_Sweet_Mart_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
}

function exportCustomersToExcel() {
  const crm = {};
  allOrders.forEach(o => {
    const phone = o.phone.replace(/[^0-9]/g, '');
    if (!crm[phone]) {
      crm[phone] = { name: o.customerName, phone: o.phone, city: o.city, totalOrders: 0, totalSpend: 0, lastOrder: o.date };
    }
    crm[phone].totalOrders += 1;
    crm[phone].totalSpend += o.totalAmount;
    if (new Date(o.date) > new Date(crm[phone].lastOrder)) crm[phone].lastOrder = o.date;
  });

  let csv = 'Customer Name,Phone,City,Total Orders,Lifetime Spend (INR),Last Order Date\n';
  Object.values(crm).forEach(c => {
    csv += `"${c.name}","${c.phone}","${c.city}","${c.totalOrders}","${c.totalSpend}","${c.lastOrder}"\n`;
  });

  downloadCsv(csv, `Patel_Sweet_Mart_Customers_CRM_${new Date().toISOString().slice(0, 10)}.csv`);
}

function downloadCsv(content, filename) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ---- SUPABASE SETTINGS ---- */
function saveSupabaseSettings(event) {
  event.preventDefault();
  const url = document.getElementById('cfg-supabase-url').value.trim();
  const key = document.getElementById('cfg-supabase-key').value.trim();

  if (url && key) {
    localStorage.setItem('psm_supabase_url', url);
    localStorage.setItem('psm_supabase_key', key);
    initSupabaseIfConfigured();
    testSupabaseConnection();
  }
}

async function testSupabaseConnection() {
  const box = document.getElementById('cfg-status-box');
  if (!box) return;

  const url = localStorage.getItem('psm_supabase_url');
  const key = localStorage.getItem('psm_supabase_key');

  box.style.display = 'block';
  box.style.background = '#FEF3C7';
  box.style.color = '#92400E';
  box.innerHTML = '&#9203; Connecting to Supabase Cloud...';

  if (!url || !key || !window.supabase) {
    box.style.background = '#FEE2E2';
    box.style.color = '#991B1B';
    box.innerHTML = '❌ કૃપા કરીને Project URL અને Anon Key બંને દાખલ કરો.';
    return;
  }

  try {
    const client = window.supabase.createClient(url, key);
    const { data, error } = await client.from('orders').select('id').limit(1);

    if (error) {
      box.style.background = '#FEF3C7';
      box.style.color = '#92400E';
      box.innerHTML = `⚠️ કનેક્શન સફળ છે, પરંતુ 'orders' ટેબલ હજુ બન્યું નથી. કૃપા કરીને માસ્ટર પ્લાનમાંથી SQL ક્વેરી રન કરો. (Error: ${error.message})`;
    } else {
      box.style.background = '#D1FAE5';
      box.style.color = '#065F46';
      box.innerHTML = `✓ અભિનંદન! Supabase ડેટાબેઝ સફળતાપૂર્વક કનેક્ટ થઈ ગયો છે! લાઈવ સિંક સક્રિય છે.`;
    }
  } catch (err) {
    box.style.background = '#FEE2E2';
    box.style.color = '#991B1B';
    box.innerHTML = `❌ કનેક્શન નિષ્ફળ થયું: ${err.message}`;
  }
}

/* ---- MASTER REFRESH ---- */
function renderAllViews() {
  renderKpis();
  renderOrdersTable();
  if (currentActiveTab === 'kitchen') renderKitchenPlanner();
  if (currentActiveTab === 'analytics') renderAnalyticsView();
  if (currentActiveTab === 'crm') renderCrmView();
  if (currentActiveTab === 'inventory') renderInventoryGrid();
}

// Load Supabase Config input values if existing
function loadExistingConfigInputs() {
  const url = localStorage.getItem('psm_supabase_url');
  const key = localStorage.getItem('psm_supabase_key');
  if (url && document.getElementById('cfg-supabase-url')) {
    document.getElementById('cfg-supabase-url').value = url;
  }
  if (key && document.getElementById('cfg-supabase-key')) {
    document.getElementById('cfg-supabase-key').value = key;
  }
}

// Initialization on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initDataStore();
  checkAuth();
  loadExistingConfigInputs();
  renderAllViews();
});
