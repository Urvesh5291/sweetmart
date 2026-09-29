/* ================================================================
   PATEL SWEET MART — admin.js
   Owner Hub: orders, live prices, products, Supabase sync, backup
   ================================================================ */

'use strict';

/* ================================================================
   STORAGE KEYS
   ================================================================ */

const ADMIN_AUTH_KEY = 'psm_owner_logged_in';
const ADMIN_SESSION_KEY = 'psm_admin_auth';
const ADMIN_LANG_KEY = 'psm-admin-lang';

const ORDERS_KEY = 'psm_orders';
const PRICES_KEY = 'psm_product_prices';
const CATALOG_KEY = 'psm_custom_catalog';

const SUPA_URL_KEY = 'psm_supabase_url';
const SUPA_KEY_KEY = 'psm_supabase_key';


/* ================================================================
   DEFAULT PRODUCTS
   ================================================================ */

const DEFAULT_PRODUCTS = {

    toprapak: {
        id: 'toprapak',
        nameGu: 'ટોપરાપાક',
        nameEn: 'Toprapak',
        basePrice: 500,
        category: 'mithai',
        img: 'images/product-toprapak.webp'
    },

    mohanthal: {
        id: 'mohanthal',
        nameGu: 'મોહનથાળ',
        nameEn: 'Mohanthal',
        basePrice: 480,
        category: 'mithai',
        img: 'images/product-mohanthal.webp'
    },

    penda: {
        id: 'penda',
        nameGu: 'માવા પેંડા',
        nameEn: 'Mava Penda',
        basePrice: 520,
        category: 'mithai',
        img: 'images/product-penda.webp'
    },

    ladva: {
        id: 'ladva',
        nameGu: 'સ્પેશિયલ લાડવા',
        nameEn: 'Special Ladva',
        basePrice: 400,
        category: 'mithai',
        img: 'images/product-ladva.webp'
    },

    jalebi: {
        id: 'jalebi',
        nameGu: 'ગરમ જલેબી',
        nameEn: 'Hot Jalebi',
        basePrice: 380,
        category: 'mithai',
        img: 'images/product-jalebi.webp'
    },

    feni: {
        id: 'feni',
        nameGu: 'સ્વાદિષ્ટ ફેણી',
        nameEn: 'Feni',
        basePrice: 450,
        category: 'mithai',
        img: 'images/product-feni.webp'
    },

    ganthiya: {
        id: 'ganthiya',
        nameGu: 'ચટાકેદાર ગાંઠિયા',
        nameEn: 'Ganthiya',
        basePrice: 340,
        category: 'namkeen',
        img: 'images/product-ganthiya.webp'
    },

    chorafari: {
        id: 'chorafari',
        nameGu: 'ચોરાફળી',
        nameEn: 'Chorafari',
        basePrice: 360,
        category: 'namkeen',
        img: 'images/product-chorafari.webp'
    },

    chavanu: {
        id: 'chavanu',
        nameGu: 'મિક્સ ચવાણું',
        nameEn: 'Mix Chavanu',
        basePrice: 350,
        category: 'namkeen',
        img: 'images/product-chavanu.webp'
    },

    farali: {
        id: 'farali',
        nameGu: 'ફરાળી નાસ્તો',
        nameEn: 'Farali Snacks',
        basePrice: 400,
        category: 'namkeen',
        img: 'images/product-farali.webp'
    },

    hamper: {
        id: 'hamper',
        nameGu: 'પ્રીમિયમ ગિફ્ટ બોક્સ',
        nameEn: 'Royal Gift Box',
        basePrice: 850,
        category: 'mithai',
        img: 'images/category-gifting.webp'
    }
};


/* ================================================================
   GLOBAL VARIABLES
   ================================================================ */

let products = {};
let allOrders = [];

let activeStatus = 'all';
let searchTerm = '';
let dateRange = 'all';


/* ================================================================
   JSON HELPERS
   ================================================================ */

function readJSON(key, fallback) {

    try {

        const value = JSON.parse(
            localStorage.getItem(key)
        );

        return value ?? fallback;

    } catch (error) {

        console.warn(
            'JSON read error:',
            key,
            error
        );

        return fallback;
    }
}


function writeJSON(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            'JSON write error:',
            key,
            error
        );

        return false;
    }
}


/* ================================================================
   OWNER LOGIN
   ================================================================ */

function isOwnerLoggedIn() {

    return (
        sessionStorage.getItem(
            ADMIN_SESSION_KEY
        ) === 'authenticated'
        ||
        localStorage.getItem(
            ADMIN_AUTH_KEY
        ) === 'true'
    );
}


function requireOwner() {

    if (!isOwnerLoggedIn()) {

        showLogin();

        return false;
    }

    return true;
}


function showLogin() {

    const modal =
        document.getElementById(
            'admin-login-modal'
        );

    if (modal) {

        modal.classList.add('open');
    }
}


function hideLogin() {

    const modal =
        document.getElementById(
            'admin-login-modal'
        );

    if (modal) {

        modal.classList.remove('open');
    }
}


/* ================================================================
   LOGIN
   ================================================================ */

function handleAdminLogin(event) {

    event.preventDefault();

    const input =
        document.getElementById(
            'login-password'
        );

    const remember =
        document.getElementById(
            'login-remember'
        )?.checked;

    const pass =
        (input?.value || '').trim();


    if (!pass) {

        alert(
            'કૃપા કરીને પાસવર્ડ દાખલ કરો.'
        );

        return;
    }


    /*
       Default Owner Hub passwords:

       patel1995
       admin123
       patel
    */

    const validPassword =
        pass === 'patel1995'
        ||
        pass === 'admin123'
        ||
        pass.toLowerCase() === 'patel';


    if (!validPassword) {

        alert(
            'ખોટો પાસવર્ડ.\n\n' +
            'Default password: patel1995'
        );

        return;
    }


    sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        'authenticated'
    );


    if (remember) {

        localStorage.setItem(
            ADMIN_AUTH_KEY,
            'true'
        );
    }


    hideLogin();

    refreshAdminOrders(true);

    loadInventory();

    updateDashboard();
}


function bypassDemoAccess() {

    sessionStorage.setItem(
        ADMIN_SESSION_KEY,
        'authenticated'
    );

    localStorage.setItem(
        ADMIN_AUTH_KEY,
        'true'
    );

    hideLogin();

    refreshAdminOrders(true);

    loadInventory();

    updateDashboard();
}


function adminLogout() {

    sessionStorage.removeItem(
        ADMIN_SESSION_KEY
    );

    localStorage.removeItem(
        ADMIN_AUTH_KEY
    );

    location.href = 'index.html';
}


function toggleAdminPasswordVisibility(
    id,
    btn
) {

    const element =
        document.getElementById(id);

    if (!element) return;


    element.type =
        element.type === 'password'
            ? 'text'
            : 'password';


    if (btn) {

        btn.innerHTML =
            element.type === 'password'
                ? '&#128065;'
                : '&#128064;';
    }
}


/* ================================================================
   SUPABASE
   ================================================================ */

function getSupabaseConfig() {

    const url =
        (
            localStorage.getItem(
                SUPA_URL_KEY
            ) || ''
        )
        .trim()
        .replace(/\/+$/, '');


    const key =
        (
            localStorage.getItem(
                SUPA_KEY_KEY
            ) || ''
        )
        .trim();


    return {

        url,

        key,

        configured:
            !!(
                url &&
                key
            )
    };
}


function supaHeaders() {

    const config =
        getSupabaseConfig();


    return {

        'apikey':
            config.key,

        'Authorization':
            'Bearer ' + config.key,

        'Content-Type':
            'application/json',

        'Accept':
            'application/json'
    };
}


/* ================================================================
   SUPABASE ORDERS
   ================================================================ */

async function fetchSupabaseOrders() {

    const config =
        getSupabaseConfig();


    if (!config.configured) {

        return [];
    }


    const response =
        await fetch(
            `${config.url}/rest/v1/orders?select=*&order=created_at.desc`,
            {
                headers:
                    supaHeaders()
            }
        );


    if (!response.ok) {

        throw new Error(
            await response.text()
        );
    }


    const rows =
        await response.json();


    let itemRows = [];


    try {

        const itemResponse =
            await fetch(
                `${config.url}/rest/v1/order_items?select=*&order=order_id.asc`,
                {
                    headers:
                        supaHeaders()
                }
            );


        if (itemResponse.ok) {

            itemRows =
                await itemResponse.json();
        }

    } catch (error) {

        console.warn(
            'Supabase order items unavailable:',
            error
        );
    }


    return rows.map(row => {

        const items =
            itemRows
                .filter(
                    item =>
                        String(item.order_id) ===
                        String(row.id)
                )
                .map(item => {

                    return {

                        productId:
                            item.product_id,

                        nameGu:
                            item.product_name_gu ||
                            item.product_name_en ||
                            'Product',

                        nameEn:
                            item.product_name_en ||
                            item.product_name_gu ||
                            'Product',

                        weightLabel:
                            item.weight_label ||
                            (
                                (
                                    Number(
                                        item.weight_kg
                                    ) || 1
                                ) +
                                'kg'
                            ),

                        weightKg:
                            Number(
                                item.weight_kg
                            ) || 1,

                        unitPrice:
                            Number(
                                item.unit_price
                            ) || 0,

                        qty:
                            Number(
                                item.quantity
                            ) || 1,

                        subtotal:
                            Number(
                                item.subtotal
                            ) || 0
                    };
                });


        return {

            id:
                row.order_number ||
                ('DB-' + row.id),

            dbId:
                row.id,

            date:
                row.created_at ||
                new Date().toISOString(),

            customerName:
                row.customer_name ||
                '',

            phone:
                row.customer_phone ||
                '',

            city:
                row.delivery_city ||
                '',

            address:
                row.delivery_address ||
                '',

            notes:
                row.order_notes ||
                '',

            status:
                row.status ||
                'new',

            totalAmount:
                Number(
                    row.total_amount
                ) || 0,

            totalItems:
                Number(
                    row.total_items
                ) ||
                items.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        item.qty,
                    0
                ),

            items
        };
    });
}


/* ================================================================
   REFRESH ORDERS
   ================================================================ */

async function refreshAdminOrders(
    showNotice = false
) {

    if (!requireOwner()) return;


    const localOrders =
        readJSON(
            ORDERS_KEY,
            []
        );


    let sharedOrders = [];


    try {

        sharedOrders =
            await fetchSupabaseOrders();


        setSyncStatus(
            true,
            'Supabase Cloud Sync'
        );

    } catch (error) {

        console.warn(
            'Supabase unavailable:',
            error
        );


        setSyncStatus(
            false,
            'Local Orders (Supabase unavailable)'
        );
    }


    const orderMap =
        new Map();


    localOrders.forEach(order => {

        orderMap.set(
            String(order.id),
            order
        );
    });


    sharedOrders.forEach(order => {

        const old =
            orderMap.get(
                String(order.id)
            ) || {};


        orderMap.set(
            String(order.id),
            {
                ...old,
                ...order,

                items:
                    order.items?.length
                        ? order.items
                        : (
                            old.items || []
                        )
            }
        );
    });


    allOrders =
        [...orderMap.values()]
            .sort(
                (a, b) =>
                    new Date(
                        b.date || 0
                    ) -
                    new Date(
                        a.date || 0
                    )
            );


    writeJSON(
        ORDERS_KEY,
        allOrders
    );


    renderOrders();

    updateDashboard();

    renderCustomers();

    renderAnalytics();

    renderKitchen();


    const badge =
        document.getElementById(
            'tab-orders-badge'
        );


    if (badge) {

        badge.textContent =
            allOrders.length;
    }


    if (showNotice) {

        flash(
            '✓ Orders refreshed'
        );
    }
}


window.refreshAdminOrders =
    refreshAdminOrders;


/* ================================================================
   LOCAL ORDER REFRESH
   ================================================================ */

function refreshOrdersFromLocalStorage() {

    allOrders =
        readJSON(
            ORDERS_KEY,
            []
        );


    renderOrders();

    updateDashboard();
}


window.refreshOrdersFromLocalStorage =
    refreshOrdersFromLocalStorage;


/* ================================================================
   SYNC STATUS
   ================================================================ */

function setSyncStatus(
    ok,
    label
) {

    const dot =
        document.getElementById(
            'sync-status'
        );

    const labelElement =
        document.getElementById(
            'sync-label'
        );


    if (dot) {

        dot.classList.toggle(
            'offline',
            !ok
        );
    }


    if (labelElement) {

        labelElement.textContent =
            label;
    }
}


/* ================================================================
   DATE FILTER
   ================================================================ */

function normalizeDate(order) {

    return new Date(
        order.date ||
        order.createdAt ||
        0
    );
}


function inDateRange(order) {

    if (dateRange === 'all') {

        return true;
    }


    const date =
        normalizeDate(order);

    const now =
        new Date();

    const start =
        new Date(now);


    if (dateRange === 'today') {

        start.setHours(
            0,
            0,
            0,
            0
        );

    } else if (
        dateRange === 'week'
    ) {

        start.setDate(
            now.getDate() - 6
        );

        start.setHours(
            0,
            0,
            0,
            0
        );

    } else if (
        dateRange === 'month'
    ) {

        start.setDate(1);

        start.setHours(
            0,
            0,
            0,
            0
        );
    }


    return date >= start;
}


/* ================================================================
   FILTER ORDERS
   ================================================================ */

function filteredOrders() {

    return allOrders.filter(order => {

        const searchText =
            [
                order.id,
                order.customerName,
                order.phone,
                order.city,
                order.address
            ]
                .join(' ')
                .toLowerCase();


        const statusOK =
            activeStatus === 'all'
            ||
            order.status ===
                activeStatus;


        const searchOK =
            !searchTerm
            ||
            searchText.includes(
                searchTerm
            );


        return (
            statusOK &&
            searchOK &&
            inDateRange(order)
        );
    });
}


function handleOrderSearch(value) {

    searchTerm =
        (
            value || ''
        )
            .toLowerCase()
            .trim();


    renderOrders();
}


function filterOrdersByStatus(status) {

    activeStatus =
        status;


    document
        .querySelectorAll(
            '.order-status-filter'
        )
        .forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.status ===
                    status
            );
        });


    renderOrders();
}


function filterByDateRange(range) {

    dateRange =
        range;


    document
        .querySelectorAll(
            '[data-range]'
        )
        .forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.range ===
                    range
            );
        });


    renderOrders();

    updateDashboard();
}


/* ================================================================
   HTML ESCAPE
   ================================================================ */

function escapeHtml(value) {

    return String(
        value ?? ''
    ).replace(
        /[&<>'"]/g,
        character => {

            return {

                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'

            }[character];
        }
    );
}


/* ================================================================
   ORDER ITEMS TEXT
   ================================================================ */

function itemsText(order) {

    return (
        order.items || []
    )
        .map(item => {

            return (
                escapeHtml(
                    item.nameGu ||
                    item.nameEn
                ) +
                ' (' +
                escapeHtml(
                    item.weightLabel ||
                    '1kg'
                ) +
                ') × ' +
                (
                    item.qty || 1
                )
            );
        })
        .join('<br>') || '—';
}


/* ================================================================
   RENDER ORDERS
   ================================================================ */

function renderOrders() {

    const tbody =
        document.getElementById(
            'orders-tbody'
        );


    if (!tbody) return;


    const orders =
        filteredOrders();


    if (!orders.length) {

        tbody.innerHTML =
            `
            <tr>
                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:32px;
                        color:#64748B;
                    "
                >
                    કોઈ ઓર્ડર મળ્યો નથી.
                </td>
            </tr>
            `;

        return;
    }


    tbody.innerHTML =
        orders
            .map(order => {

                const total =
                    Number(
                        order.totalAmount
                    ) || 0;


                const phone =
                    escapeHtml(
                        order.phone
                    );


                const waPhone =
                    String(
                        order.phone || ''
                    )
                    .replace(
                        /\D/g,
                        ''
                    );


                const statusOptions =
                    [
                        'new',
                        'confirmed',
                        'packed',
                        'dispatched',
                        'delivered'
                    ]
                        .map(
                            status =>
                                `
                                <option
                                    value="${status}"
                                    ${
                                        order.status === status
                                            ? 'selected'
                                            : ''
                                    }
                                >
                                    ${status}
                                </option>
                                `
                        )
                        .join('');


                const waMessage =
                    encodeURIComponent(
                        'નમસ્તે ' +
                        (
                            order.customerName ||
                            ''
                        ) +
                        ', Patel Sweet Mart order #' +
                        order.id +
                        ' વિશે સંપર્ક કરવા માટે આ મેસેજ છે.'
                    );


                return `
                    <tr>

                        <td>
                            <strong>
                                #${escapeHtml(order.id)}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                new Date(
                                    order.date ||
                                    Date.now()
                                ).toLocaleString(
                                    'en-IN'
                                )
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    order.customerName
                                )}
                            </strong>
                            <br>
                            <small>
                                ${phone}
                            </small>
                        </td>

                        <td>
                            ${escapeHtml(
                                order.city
                            )}
                            <br>
                            <small>
                                ${escapeHtml(
                                    order.address
                                )}
                            </small>
                        </td>

                        <td>
                            ${itemsText(order)}
                        </td>

                        <td>
                            <strong>
                                ₹${total.toLocaleString(
                                    'en-IN'
                                )}
                            </strong>
                        </td>

                        <td>

                            <select
                                class="admin-input"
                                onchange="
                                    updateAdminOrderStatus(
                                        '${escapeHtml(order.id)}',
                                        this.value
                                    )
                                "
                            >

                                ${statusOptions}

                            </select>

                        </td>

                        <td>

                            <button
                                class="btn-panel-action"
                                onclick="
                                    openOrderModal(
                                        '${escapeHtml(order.id)}'
                                    )
                                "
                            >
                                View
                            </button>

                            <a
                                class="btn-panel-action"
                                style="
                                    background:#25D366;
                                    color:#fff;
                                    text-decoration:none;
                                    display:inline-block;
                                    margin-top:4px;
                                "
                                target="_blank"
                                href="https://wa.me/91${waPhone}?text=${waMessage}"
                            >
                                WhatsApp
                            </a>

                        </td>

                    </tr>
                `;
            })
            .join('');
}


/* ================================================================
   UPDATE ORDER STATUS
   ================================================================ */

async function updateAdminOrderStatus(
    orderId,
    status
) {

    if (!requireOwner()) return;


    const order =
        allOrders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) return;


    order.status =
        status;


    order.updatedAt =
        new Date().toISOString();


    writeJSON(
        ORDERS_KEY,
        allOrders
    );


    /*
       Optional Supabase update
    */

    const config =
        getSupabaseConfig();


    if (
        config.configured &&
        order.dbId
    ) {

        try {

            const response =
                await fetch(
                    `${config.url}/rest/v1/orders?id=eq.${encodeURIComponent(order.dbId)}`,
                    {
                        method: 'PATCH',

                        headers: {
                            ...supaHeaders(),
                            'Prefer':
                                'return=minimal'
                        },

                        body:
                            JSON.stringify({
                                status:
                                    status
                            })
                    }
                );


            if (!response.ok) {

                console.warn(
                    'Supabase status update failed:',
                    await response.text()
                );
            }

        } catch (error) {

            console.warn(
                'Supabase status error:',
                error
            );
        }
    }


    renderOrders();

    updateDashboard();

    flash(
        '✓ Order status updated'
    );
}


window.updateAdminOrderStatus =
    updateAdminOrderStatus;


/* ================================================================
   ORDER MODAL
   ================================================================ */

function openOrderModal(orderId) {

    const order =
        allOrders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );


    if (!order) return;


    const modal =
        document.getElementById(
            'order-view-modal'
        );


    if (!modal) {

        alert(
            'Order #' +
            orderId +
            '\n\n' +
            'Customer: ' +
            order.customerName +
            '\n' +
            'Phone: ' +
            order.phone +
            '\n' +
            'City: ' +
            order.city +
            '\n' +
            'Address: ' +
            order.address +
            '\n' +
            'Total: ₹' +
            Number(
                order.totalAmount || 0
            ).toLocaleString(
                'en-IN'
            )
        );

        return;
    }


    const title =
        document.getElementById(
            'order-modal-title'
        );


    const body =
        document.getElementById(
            'order-modal-body'
        );


    if (title) {

        title.textContent =
            'Order #' +
            order.id;
    }


    if (body) {

        body.innerHTML = `

            <div
                style="
                    display:grid;
                    gap:10px;
                "
            >

                <div>
                    <strong>
                        Customer:
                    </strong>
                    ${escapeHtml(
                        order.customerName
                    )}
                </div>

                <div>
                    <strong>
                        Phone:
                    </strong>
                    ${escapeHtml(
                        order.phone
                    )}
                </div>

                <div>
                    <strong>
                        City:
                    </strong>
                    ${escapeHtml(
                        order.city
                    )}
                </div>

                <div>
                    <strong>
                        Address:
                    </strong>
                    ${escapeHtml(
                        order.address
                    )}
                </div>

                <div>
                    <strong>
                        Notes:
                    </strong>
                    ${escapeHtml(
                        order.notes ||
                        ''
                    )}
                </div>

                <hr>

                <div>
                    <strong>
                        Products:
                    </strong>
                    <br>
                    ${itemsText(order)}
                </div>

                <div
                    style="
                        font-size:20px;
                        font-weight:800;
                    "
                >
                    Total:
                    ₹${Number(
                        order.totalAmount || 0
                    ).toLocaleString(
                        'en-IN'
                    )}
                </div>

            </div>
        `;
    }


    modal.classList.add(
        'open'
    );
}


window.openOrderModal =
    openOrderModal;


function closeOrderModal() {

    document
        .getElementById(
            'order-view-modal'
        )
        ?.classList.remove(
            'open'
        );
}


window.closeOrderModal =
    closeOrderModal;


/* ================================================================
   PRODUCTS
   ================================================================ */

function loadProducts() {

    products = {
        ...DEFAULT_PRODUCTS
    };


    const customCatalog =
        readJSON(
            CATALOG_KEY,
            {}
        );


    Object.keys(
        customCatalog
    ).forEach(id => {

        products[id] =
            customCatalog[id];
    });


    const savedPrices =
        readJSON(
            PRICES_KEY,
            {}
        );


    Object.keys(
        savedPrices
    ).forEach(id => {

        if (products[id]) {

            products[id].basePrice =
                Number(
                    savedPrices[id]
                ) ||
                products[id].basePrice;
        }
    });


    return products;
}


/* ================================================================
   SAVE PRICE
   ================================================================ */

function savePrice(
    productId,
    price
) {

    const prices =
        readJSON(
            PRICES_KEY,
            {}
        );


    prices[productId] =
        Math.round(
            Number(price) || 0
        );


    writeJSON(
        PRICES_KEY,
        prices
    );


    if (products[productId]) {

        products[productId].basePrice =
            prices[productId];
    }
}


window.savePrice =
    savePrice;


/* ================================================================
   LIVE PRICE UPDATE
   ================================================================ */

function updateProductPrice(
    productId,
    value
) {

    if (!requireOwner()) return;


    const price =
        Math.round(
            Number(value)
        );


    if (!Number.isFinite(price) || price < 0) {

        alert(
            'Valid price દાખલ કરો.'
        );

        return;
    }


    savePrice(
        productId,
        price
    );


    loadInventory();


    flash(
        '✓ Price updated'
    );
}


window.updateProductPrice =
    updateProductPrice;


/* ================================================================
   INVENTORY
   ================================================================ */

function loadInventory() {

    loadProducts();


    const tbody =
        document.getElementById(
            'inventory-tbody'
        );


    if (!tbody) return;


    tbody.innerHTML =
        Object.values(products)
            .map(product => {

                const category =
                    product.category ===
                    'namkeen'
                        ? 'નમકીન'
                        : 'મીઠાઈ';


                return `

                    <tr>

                        <td>

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:10px;
                                "
                            >

                                <img
                                    src="${escapeHtml(
                                        product.img ||
                                        'images/product-toprapak.webp'
                                    )}"
                                    style="
                                        width:55px;
                                        height:55px;
                                        object-fit:cover;
                                        border-radius:8px;
                                    "
                                    onerror="
                                        this.src='images/product-toprapak.webp'
                                    "
                                >

                                <div>

                                    <strong>
                                        ${escapeHtml(
                                            product.nameGu ||
                                            product.nameEn
                                        )}
                                    </strong>

                                    <br>

                                    <small>
                                        ${escapeHtml(
                                            product.nameEn ||
                                            ''
                                        )}
                                    </small>

                                </div>

                            </div>

                        </td>

                        <td>
                            ${category}
                        </td>

                        <td>

                            <input
                                class="admin-input"
                                type="number"
                                min="0"
                                value="${Number(
                                    product.basePrice || 0
                                )}"
                                onchange="
                                    updateProductPrice(
                                        '${escapeHtml(product.id)}',
                                        this.value
                                    )
                                "
                            >

                        </td>

                        <td>

                            <button
                                class="btn-panel-action"
                                onclick="
                                    updateProductPrice(
                                        '${escapeHtml(product.id)}',
                                        prompt(
                                            'New price:',
                                            '${Number(
                                                product.basePrice || 0
                                            )}'
                                        )
                                    )
                                "
                            >
                                Change
                            </button>

                        </td>

                    </tr>

                `;
            })
            .join('');
}


window.loadInventory =
    loadInventory;


/* ================================================================
   BULK PRICE UPDATE
   ================================================================ */

function applyBulkPriceChange() {

    if (!requireOwner()) return;


    const type =
        document.getElementById(
            'bulk-price-type'
        )?.value ||
        'percent';


    const amount =
        Number(
            document.getElementById(
                'bulk-price-value'
            )?.value
        );


    if (
        !Number.isFinite(amount)
    ) {

        alert(
            'Bulk price value દાખલ કરો.'
        );

        return;
    }


    Object.values(
        products
    ).forEach(product => {

        const oldPrice =
            Number(
                product.basePrice || 0
            );


        let newPrice =
            oldPrice;


        if (type === 'percent') {

            newPrice =
                oldPrice +
                (
                    oldPrice *
                    amount /
                    100
                );

        } else if (
            type === 'fixed'
        ) {

            newPrice =
                oldPrice +
                amount;
        }


        newPrice =
            Math.max(
                0,
                Math.round(newPrice)
            );


        savePrice(
            product.id,
            newPrice
        );
    });


    loadInventory();


    flash(
        '✓ Bulk pricing updated'
    );
}


window.applyBulkPriceChange =
    applyBulkPriceChange;


/* ================================================================
   ADD PRODUCT MODAL
   ================================================================ */

function openAddProductModal() {

    if (!requireOwner()) return;


    document
        .getElementById(
            'add-product-modal'
        )
        ?.classList.add(
            'open'
        );
}


window.openAddProductModal =
    openAddProductModal;


function closeAddProductModal() {

    document
        .getElementById(
            'add-product-modal'
        )
        ?.classList.remove(
            'open'
        );
}


window.closeAddProductModal =
    closeAddProductModal;


/* ================================================================
   NEW PRODUCT PREVIEW
   ================================================================ */

function updateNewProdPreview() {

    const gu =
        document.getElementById(
            'new-prod-name-gu'
        )?.value ||
        'નવું ઉત્પાદન';


    const en =
        document.getElementById(
            'new-prod-name-en'
        )?.value ||
        'New Product';


    const price =
        Number(
            document.getElementById(
                'new-prod-price'
            )?.value
        ) || 0;


    const category =
        document.getElementById(
            'new-prod-category'
        )?.value ||
        'mithai';


    const image =
        document.getElementById(
            'new-prod-img'
        )?.value ||
        'images/product-toprapak.webp';


    const name =
        document.getElementById(
            'new-prod-preview-name'
        );


    const nameEn =
        document.getElementById(
            'new-prod-preview-en'
        );


    const priceElement =
        document.getElementById(
            'new-prod-preview-price'
        );


    const imageElement =
        document.getElementById(
            'new-prod-preview-img'
        );


    const tag =
        document.getElementById(
            'new-prod-preview-tag'
        );


    if (name) {

        name.textContent =
            gu;
    }


    if (nameEn) {

        nameEn.textContent =
            en;
    }


    if (priceElement) {

        priceElement.textContent =
            '₹' +
            Number(
                price
            ).toLocaleString(
                'en-IN'
            );
    }


    if (imageElement) {

        imageElement.src =
            image;
    }


    if (tag) {

        tag.textContent =
            category === 'namkeen'
                ? 'નમકીન'
                : 'મીઠાઈ';
    }
}


window.updateNewProdPreview =
    updateNewProdPreview;


/* ================================================================
   IMAGE PRESET
   ================================================================ */

function onNewProdPresetChange() {

    const select =
        document.getElementById(
            'new-prod-preset-img'
        );


    const value =
        select?.value ||
        '';


    const customGroup =
        document.getElementById(
            'new-prod-custom-url-group'
        );


    const imageInput =
        document.getElementById(
            'new-prod-img'
        );


    const preview =
        document.getElementById(
            'new-prod-preview-img'
        );


    if (customGroup) {

        customGroup.style.display =
            value === 'custom'
                ? 'block'
                : 'none';
    }


    if (
        value !== 'custom' &&
        value
    ) {

        if (imageInput) {

            imageInput.value =
                value;
        }


        if (preview) {

            preview.src =
                value;
        }
    }


    updateNewProdPreview();
}


window.onNewProdPresetChange =
    onNewProdPresetChange;


/* ================================================================
   ADD NEW PRODUCT
   ================================================================ */

function handleAddNewProduct(event) {

    event.preventDefault();


    if (!requireOwner()) return;


    const gu =
        document.getElementById(
            'new-prod-name-gu'
        )
        ?.value
        .trim();


    const en =
        document.getElementById(
            'new-prod-name-en'
        )
        ?.value
        .trim();


    const category =
        document.getElementById(
            'new-prod-category'
        )
        ?.value ||
        'mithai';


    const price =
        Math.round(
            Number(
                document.getElementById(
                    'new-prod-price'
                )?.value
            )
        );


    const image =
        document.getElementById(
            'new-prod-img'
        )
        ?.value
        .trim()
        ||
        'images/product-toprapak.webp';


    const description =
        document.getElementById(
            'new-prod-desc-gu'
        )
        ?.value
        .trim();


    if (
        !gu ||
        !en ||
        !price
    ) {

        alert(
            'બધી જરૂરી વિગતો भरो.'
        );

        return;
    }


    const id =
        (
            en
                .toLowerCase()
                .replace(
                    /[^a-z0-9]+/g,
                    '_'
                )
            ||
            'product'
        ) +
        '_' +
        Date.now();


    const product = {

        id,

        nameGu:
            gu,

        nameEn:
            en,

        basePrice:
            price,

        category,

        img:
            image,

        descGu:
            description ||
            'શુદ્ધ દેશી ઘી અને તાજી સામગ્રી સાથે પરંપરાગત બનાવટ',

        descEn:
            'Fresh handcrafted traditional product',

        isAvailable:
            true,

        isCustom:
            true,

        createdAt:
            new Date().toISOString()
    };


    const catalog =
        readJSON(
            CATALOG_KEY,
            {}
        );


    catalog[id] =
        product;


    writeJSON(
        CATALOG_KEY,
        catalog
    );


    savePrice(
        id,
        price
    );


    closeAddProductModal();


    document
        .getElementById(
            'add-product-form'
        )
        ?.reset();


    loadInventory();


    flash(
        '✓ નવું ઉત્પાદન live ઉમેરાયું'
    );
}


window.handleAddNewProduct =
    handleAddNewProduct;


/* ================================================================
   ADMIN TABS
   ================================================================ */

function switchAdminTab(tab) {

    if (!requireOwner()) return;


    document
        .querySelectorAll(
            '.admin-panel-view'
        )
        .forEach(panel => {

            panel.classList.toggle(
                'active',
                panel.id ===
                    'panel-' + tab
            );
        });


    document
        .querySelectorAll(
            '.admin-tab-btn'
        )
        .forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.tab ===
                    tab
            );
        });


    if (tab === 'orders') {

        refreshAdminOrders(false);
    }


    if (tab === 'inventory') {

        loadInventory();
    }


    if (tab === 'analytics') {

        renderAnalytics();
    }


    if (tab === 'crm') {

        renderCustomers();
    }


    if (tab === 'kitchen') {

        renderKitchen();
    }
}


window.switchAdminTab =
    switchAdminTab;


/* ================================================================
   FLASH MESSAGE
   ================================================================ */

function flash(message) {

    const element =
        document.createElement(
            'div'
        );


    element.textContent =
        message;


    element.style.cssText = `

        position:fixed;

        right:20px;

        bottom:20px;

        z-index:99999;

        background:#173F8A;

        color:#fff;

        padding:12px 16px;

        border-radius:10px;

        font-weight:700;

        box-shadow:
            0 8px 30px
            rgba(0,0,0,.2);

    `;


    document.body.appendChild(
        element
    );


    setTimeout(
        () => element.remove(),
        2500
    );
}


/* ================================================================
   DASHBOARD
   ================================================================ */

function updateDashboard() {

    const orders =
        allOrders.filter(
            inDateRange
        );


    const revenue =
        orders.reduce(
            (sum, order) =>
                sum +
                Number(
                    order.totalAmount || 0
                ),
            0
        );


    const totalKg =
        orders.reduce(
            (sum, order) => {

                if (
                    Number(
                        order.totalKg
                    )
                ) {

                    return (
                        sum +
                        Number(
                            order.totalKg
                        )
                    );
                }


                return (
                    sum +
                    (
                        order.items || []
                    ).reduce(
                        (
                            itemSum,
                            item
                        ) => {

                            return (
                                itemSum +
                                (
                                    Number(
                                        item.weightKg
                                    ) || 1
                                ) *
                                (
                                    Number(
                                        item.qty
                                    ) || 1
                                )
                            );
                        },
                        0
                    )
                );
            },
            0
        );


    const count =
        orders.length;


    const average =
        count
            ? revenue / count
            : 0;


    const revenueElement =
        document.getElementById(
            'kpi-revenue'
        );


    if (revenueElement) {

        revenueElement.textContent =
            '₹' +
            revenue.toLocaleString(
                'en-IN'
            );
    }


    const countElement =
        document.getElementById(
            'kpi-orders-count'
        );


    if (countElement) {

        countElement.textContent =
            count;
    }


    const kgElement =
        document.getElementById(
            'kpi-total-kg'
        );


    if (kgElement) {

        kgElement.textContent =
            totalKg.toFixed(2) +
            ' kg';
    }


    const averageElement =
        document.getElementById(
            'kpi-aov'
        );


    if (averageElement) {

        averageElement.textContent =
            '₹' +
            Math.round(
                average
            ).toLocaleString(
                'en-IN'
            );
    }


    const subtitle =
        document.getElementById(
            'kpi-orders-sub'
        );


    if (subtitle) {

        subtitle.textContent =
            'ખેરવા & અમદાવાદ';
    }
}


/* ================================================================
   CUSTOMERS
   ================================================================ */

function renderCustomers() {

    const tbody =
        document.getElementById(
            'customers-tbody'
        );


    if (!tbody) return;


    const customerMap =
        new Map();


    allOrders.forEach(order => {

        const key =
            order.phone ||
            order.customerName;


        if (!customerMap.has(key)) {

            customerMap.set(
                key,
                {
                    ...order,
                    count: 0,
                    total: 0
                }
            );
        }


        const customer =
            customerMap.get(key);


        customer.count++;

        customer.total +=
            Number(
                order.totalAmount || 0
            );
    });


    const customers =
        [...customerMap.values()];


    tbody.innerHTML =
        customers
            .map(
                customer =>
                    `
                    <tr>

                        <td>
                            ${escapeHtml(
                                customer.customerName
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                customer.phone
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                customer.city || ''
                            )}
                        </td>

                        <td>
                            ${customer.count}
                        </td>

                        <td>
                            ₹${customer.total.toLocaleString(
                                'en-IN'
                            )}
                        </td>

                    </tr>
                    `
            )
            .join('')
            ||
            `
            <tr>
                <td colspan="5">
                    No customers yet.
                </td>
            </tr>
            `;
}


window.renderCustomers =
    renderCustomers;


/* ================================================================
   ANALYTICS
   ================================================================ */

function renderAnalytics() {

    const tbody =
        document.getElementById(
            'analytics-products-tbody'
        );


    if (!tbody) return;


    const map = {};


    allOrders.forEach(order => {

        (
            order.items || []
        ).forEach(item => {

            const key =
                item.productId ||
                item.nameEn;


            if (!map[key]) {

                map[key] = {

                    name:
                        item.nameGu ||
                        item.nameEn,

                    qty: 0,

                    revenue: 0,

                    kg: 0
                };
            }


            map[key].qty +=
                Number(
                    item.qty
                ) || 0;


            map[key].revenue +=
                Number(
                    item.subtotal
                ) || 0;


            map[key].kg +=
                (
                    Number(
                        item.weightKg
                    ) || 1
                ) *
                (
                    Number(
                        item.qty
                    ) || 1
                );
        });
    });


    const data =
        Object.values(map)
            .sort(
                (a, b) =>
                    b.revenue -
                    a.revenue
            );


    tbody.innerHTML =
        data
            .map(
                item =>
                    `
                    <tr>

                        <td>
                            ${escapeHtml(
                                item.name
                            )}
                        </td>

                        <td>
                            ${item.qty}
                        </td>

                        <td>
                            ${item.kg.toFixed(2)}
                            kg
                        </td>

                        <td>
                            ₹${item.revenue.toLocaleString(
                                'en-IN'
                            )}
                        </td>

                    </tr>
                    `
            )
            .join('')
            ||
            `
            <tr>
                <td colspan="4">
                    No sales data.
                </td>
            </tr>
            `;
}


window.renderAnalytics =
    renderAnalytics;


/* ================================================================
   KITCHEN
   ================================================================ */

function renderKitchen() {

    const grid =
        document.getElementById(
            'kitchen-grid'
        );


    if (!grid) return;


    const map = {};


    allOrders
        .filter(
            order =>
                order.status !==
                'delivered'
        )
        .forEach(order => {

            (
                order.items || []
            ).forEach(item => {

                const key =
                    item.productId ||
                    item.nameEn;


                if (!map[key]) {

                    map[key] = {

                        name:
                            item.nameGu ||
                            item.nameEn,

                        kg: 0
                    };
                }


                map[key].kg +=
                    (
                        Number(
                            item.weightKg
                        ) || 1
                    ) *
                    (
                        Number(
                            item.qty
                        ) || 1
                    );
            });
        });


    grid.innerHTML =
        Object.values(map)
            .map(
                item =>
                    `
                    <div
                        style="
                            padding:14px;
                            background:#fff;
                            border:1px solid #E2E8F0;
                            border-radius:10px;
                        "
                    >

                        <strong>
                            ${escapeHtml(
                                item.name
                            )}
                        </strong>

                        <div
                            style="
                                font-size:1.2rem;
                                font-weight:800;
                                color:var(--cobalt);
                            "
                        >
                            ${item.kg.toFixed(2)}
                            kg
                        </div>

                    </div>
                    `
            )
            .join('')
            ||
            `
            <div
                style="
                    padding:20px;
                    color:#64748B;
                "
            >
                હાલ કોઈ kitchen batch નથી.
            </div>
            `;
}


window.renderKitchen =
    renderKitchen;


/* ================================================================
   CSV EXPORT
   ================================================================ */

function downloadCsv(
    filename,
    rows
) {

    const csv =
        '\ufeff' +
        rows
            .map(row =>
                row
                    .map(
                        value =>
                            '"' +
                            String(
                                value ?? ''
                            ).replace(
                                /"/g,
                                '""'
                            ) +
                            '"'
                    )
                    .join(',')
            )
            .join('\n');


    const blob =
        new Blob(
            [csv],
            {
                type:
                    'text/csv;charset=utf-8'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            'a'
        );


    link.href =
        url;

    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () =>
            URL.revokeObjectURL(
                url
            ),
        1000
    );
}


/* ================================================================
   EXPORT ORDERS
   ================================================================ */

function exportOrdersToExcel() {

    const rows = [
        [
            'Order ID',
            'Date',
            'Customer',
            'Phone',
            'City',
            'Address',
            'Status',
            'Total',
            'Items'
        ]
    ];


    allOrders.forEach(order => {

        rows.push([

            order.id,

            order.date,

            order.customerName,

            order.phone,

            order.city,

            order.address,

            order.status,

            order.totalAmount,

            (
                order.items || []
            )
                .map(
                    item =>
                        `${item.nameEn} ${item.weightLabel} x${item.qty}`
                )
                .join(' | ')

        ]);
    });


    downloadCsv(
        'patel-sweet-mart-orders.csv',
        rows
    );
}


window.exportOrdersToExcel =
    exportOrdersToExcel;


/* ================================================================
   EXPORT CUSTOMERS
   ================================================================ */

function exportCustomersToExcel() {

    const rows = [
        [
            'Customer',
            'Phone',
            'City',
            'Orders',
            'Total'
        ]
    ];


    const map = {};


    allOrders.forEach(order => {

        const key =
            order.phone ||
            order.customerName;


        if (!map[key]) {

            map[key] = {

                name:
                    order.customerName,

                phone:
                    order.phone,

                city:
                    order.city,

                count: 0,

                total: 0
            };
        }


        map[key].count++;

        map[key].total +=
            Number(
                order.totalAmount || 0
            );
    });


    Object.values(map)
        .forEach(customer => {

            rows.push([

                customer.name,

                customer.phone,

                customer.city,

                customer.count,

                customer.total

            ]);
        });


    downloadCsv(
        'patel-sweet-mart-customers.csv',
        rows
    );
}


window.exportCustomersToExcel =
    exportCustomersToExcel;


/* ================================================================
   FULL BACKUP
   ================================================================ */

function exportFullBackup() {

    const backup = {

        version: 2,

        exportedAt:
            new Date().toISOString(),

        orders:
            readJSON(
                ORDERS_KEY,
                []
            ),

        prices:
            readJSON(
                PRICES_KEY,
                {}
            ),

        customCatalog:
            readJSON(
                CATALOG_KEY,
                {}
            ),

        supabase: {

            url:
                localStorage.getItem(
                    SUPA_URL_KEY
                ) || '',

            key:
                localStorage.getItem(
                    SUPA_KEY_KEY
                ) || ''
        }
    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    'application/json'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            'a'
        );


    link.href =
        url;


    link.download =
        'patel-sweet-mart-backup-' +
        new Date()
            .toISOString()
            .slice(0, 10) +
        '.json';


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () =>
            URL.revokeObjectURL(
                url
            ),
        1000
    );


    const backupText =
        document.getElementById(
            'safety-last-backup-text'
        );


    if (backupText) {

        backupText.textContent =
            'છેલ્લું બેકઅપ: ' +
            new Date().toLocaleString(
                'en-IN'
            );
    }
}


window.exportFullBackup =
    exportFullBackup;


/* ================================================================
   RESTORE BACKUP
   ================================================================ */

function triggerRestoreBackup() {

    document
        .getElementById(
            'backup-file-input'
        )
        ?.click();
}


window.triggerRestoreBackup =
    triggerRestoreBackup;


function handleRestoreBackupFile(event) {

    const file =
        event.target.files?.[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload =
        () => {

            try {

                const backup =
                    JSON.parse(
                        reader.result
                    );


                if (
                    Array.isArray(
                        backup.orders
                    )
                ) {

                    writeJSON(
                        ORDERS_KEY,
                        backup.orders
                    );
                }


                if (backup.prices) {

                    writeJSON(
                        PRICES_KEY,
                        backup.prices
                    );
                }


                if (
                    backup.customCatalog
                ) {

                    writeJSON(
                        CATALOG_KEY,
                        backup.customCatalog
                    );
                }


                loadProducts();

                loadInventory();

                refreshAdminOrders(false);


                flash(
                    '✓ Backup restored'
                );

            } catch (error) {

                alert(
                    'Backup invalid:\n\n' +
                    error.message
                );
            }
        };


    reader.readAsText(file);
}


window.handleRestoreBackupFile =
    handleRestoreBackupFile;


/* ================================================================
   RESET DEFAULT PRODUCTS
   ================================================================ */

function confirmResetDefaults() {

    const confirmReset =
        confirm(
            'Local product prices અને custom catalog defaults પર reset કરવા છે?\n\nOrders delete નહીં થાય.'
        );


    if (!confirmReset) return;


    localStorage.removeItem(
        PRICES_KEY
    );


    localStorage.removeItem(
        CATALOG_KEY
    );


    loadProducts();

    loadInventory();


    flash(
        '✓ Product defaults restored'
    );
}


window.confirmResetDefaults =
    confirmResetDefaults;


/* ================================================================
   SUPABASE CONFIG
   ================================================================ */

function saveSupabaseConfig(event) {

    event.preventDefault();


    const url =
        document
            .getElementById(
                'cfg-supabase-url'
            )
            ?.value
            .trim()
            .replace(
                /\/+$/,
                ''
            );


    const key =
        document
            .getElementById(
                'cfg-supabase-key'
            )
            ?.value
            .trim();


    localStorage.setItem(
        SUPA_URL_KEY,
        url
    );


    localStorage.setItem(
        SUPA_KEY_KEY,
        key
    );


    updateConfigStatus();

    refreshAdminOrders(true);
}


window.saveSupabaseConfig =
    saveSupabaseConfig;


function updateConfigStatus() {

    const config =
        getSupabaseConfig();


    const box =
        document.getElementById(
            'cfg-status-box'
        );


    if (box) {

        box.innerHTML =
            config.configured

                ? `
                    ✅ Supabase configured.
                    Orders will sync across devices
                    when the database tables/RLS
                    allow REST access.
                  `

                : `
                    ⚠️ Supabase not configured.
                    Orders are still saved locally
                    in this browser.
                  `;
    }


    const urlInput =
        document.getElementById(
            'cfg-supabase-url'
        );


    const keyInput =
        document.getElementById(
            'cfg-supabase-key'
        );


    if (urlInput) {

        urlInput.value =
            config.url;
    }


    if (keyInput) {

        keyInput.value =
            config.key;
    }
}


window.updateConfigStatus =
    updateConfigStatus;


/* ================================================================
   TEST SUPABASE
   ================================================================ */

async function testSupabaseConnection() {

    const config =
        getSupabaseConfig();


    if (!config.configured) {

        alert(
            'પહેલા Supabase URL અને Anon Key સેવ કરો.'
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${config.url}/rest/v1/orders?select=id&limit=1`,
                {
                    headers:
                        supaHeaders()
                }
            );


        if (!response.ok) {

            throw new Error(
                await response.text()
            );
        }


        alert(
            '✅ Supabase connection OK'
        );


        setSyncStatus(
            true,
            'Supabase Cloud Sync'
        );

    } catch (error) {

        alert(
            '❌ Supabase connection failed\n\n' +
            error.message
        );


        setSyncStatus(
            false,
            'Supabase connection failed'
        );
    }
}


window.testSupabaseConnection =
    testSupabaseConnection;


/* ================================================================
   REMOVE SUPABASE CONFIG
   ================================================================ */

function removeSupabaseConfig() {

    localStorage.removeItem(
        SUPA_URL_KEY
    );


    localStorage.removeItem(
        SUPA_KEY_KEY
    );


    updateConfigStatus();


    setSyncStatus(
        false,
        'Local Orders'
    );
}


window.removeSupabaseConfig =
    removeSupabaseConfig;


/* ================================================================
   LIVE STORAGE SYNC
   ================================================================ */

window.addEventListener(
    'storage',
    event => {

        if (
            [
                ORDERS_KEY,
                PRICES_KEY,
                CATALOG_KEY
            ].includes(
                event.key
            )
        ) {

            loadProducts();


            if (
                event.key !==
                ORDERS_KEY
            ) {

                loadInventory();
            }


            if (
                event.key ===
                ORDERS_KEY
            ) {

                allOrders =
                    readJSON(
                        ORDERS_KEY,
                        []
                    );


                renderOrders();

                updateDashboard();

                renderCustomers();

                renderAnalytics();

                renderKitchen();
            }
        }
    }
);


/* ================================================================
   DOM READY
   ================================================================ */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const supabaseForm =
            document.getElementById(
                'supabase-config-form'
            );


        if (supabaseForm) {

            supabaseForm.addEventListener(
                'submit',
                saveSupabaseConfig
            );
        }


        loadProducts();

        updateConfigStatus();


        if (
            isOwnerLoggedIn()
        ) {

            hideLogin();

            loadInventory();

            refreshAdminOrders(false);

        } else {

            showLogin();
        }


        const previewImage =
            document.getElementById(
                'new-prod-preview-img'
            );


        if (previewImage) {

            previewImage.addEventListener(
                'error',
                event => {

                    event.target.src =
                        'images/product-toprapak.webp';
                }
            );
        }


        /*
           Auto update new product preview
        */

        [
            'new-prod-name-gu',
            'new-prod-name-en',
            'new-prod-price',
            'new-prod-category',
            'new-prod-img'
        ].forEach(id => {

            document
                .getElementById(id)
                ?.addEventListener(
                    'input',
                    updateNewProdPreview
                );

            document
                .getElementById(id)
                ?.addEventListener(
                    'change',
                    updateNewProdPreview
                );
        });
    }
);
