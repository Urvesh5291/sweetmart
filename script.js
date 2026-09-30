/* ================================================================
   PATEL SWEET MART — script.js
   Main Website Controller
   Cart + Orders + WhatsApp + Language + Owner Hub + Live Pricing
   ================================================================ */

'use strict';


/* ================================================================
   CONFIG
================================================================ */

const PSM_CONFIG = {

    whatsappNumber:
        '9173565466',

    currency:
        '₹',

    cartKey:
        'psm_cart',

    ordersKey:
        'psm_orders',

    priceKey:
        'psm_product_prices',

    catalogKey:
        'psm_custom_catalog',

    languageKey:
        'psm-lang',

    orderPrefix:
        'PSM'
};


/* ================================================================
   DEFAULT PRODUCT CATALOG
================================================================ */

const PRODUCTS = {

    toprapak: {
        id: 'toprapak',
        nameGu: 'ટોપરાપાક',
        nameEn: 'Toprapak',
        basePrice: 500,
        category: 'mithai',
        img: 'images/product-toprapak.webp',
        descGu: 'સ્વાદિષ્ટ પરંપરાગત મીઠાઈ',
        descEn: 'Delicious traditional sweet'
    },

    mohanthal: {
        id: 'mohanthal',
        nameGu: 'મોહનથાળ',
        nameEn: 'Mohanthal',
        basePrice: 480,
        category: 'mithai',
        img: 'images/product-mohanthal.webp',
        descGu: 'શુદ્ધ દેશી ઘીથી બનાવેલ મોહનથાળ',
        descEn: 'Traditional mohanthal made with pure ghee'
    },

    penda: {
        id: 'penda',
        nameGu: 'માવા પેંડા',
        nameEn: 'Mava Penda',
        basePrice: 520,
        category: 'mithai',
        img: 'images/product-penda.webp',
        descGu: 'તાજા માવાથી બનાવેલા પેંડા',
        descEn: 'Fresh traditional mava peda'
    },

    ladva: {
        id: 'ladva',
        nameGu: 'સ્પેશિયલ લાડવા',
        nameEn: 'Special Ladva',
        basePrice: 400,
        category: 'mithai',
        img: 'images/product-ladva.webp',
        descGu: 'ઘી અને ગુણવત્તાયુક્ત સામગ્રીથી બનાવેલા લાડવા',
        descEn: 'Traditional ladva made with quality ingredients'
    },

    jalebi: {
        id: 'jalebi',
        nameGu: 'ગરમ જલેબી',
        nameEn: 'Hot Jalebi',
        basePrice: 380,
        category: 'mithai',
        img: 'images/product-jalebi.webp',
        descGu: 'ગરમ અને રસદાર જલેબી',
        descEn: 'Hot and juicy jalebi'
    },

    feni: {
        id: 'feni',
        nameGu: 'સ્વાદિષ્ટ ફેણી',
        nameEn: 'Feni',
        basePrice: 450,
        category: 'mithai',
        img: 'images/product-feni.webp',
        descGu: 'પરંપરાગત સ્વાદિષ્ટ ફેણી',
        descEn: 'Traditional delicious feni'
    },

    ganthiya: {
        id: 'ganthiya',
        nameGu: 'ચટાકેદાર ગાંઠિયા',
        nameEn: 'Ganthiya',
        basePrice: 340,
        category: 'namkeen',
        img: 'images/product-ganthiya.webp',
        descGu: 'ક્રિસ્પી અને ચટાકેદાર ગાંઠિયા',
        descEn: 'Crispy traditional ganthiya'
    },

    chorafari: {
        id: 'chorafari',
        nameGu: 'ચોરાફળી',
        nameEn: 'Chorafari',
        basePrice: 360,
        category: 'namkeen',
        img: 'images/product-chorafari.webp',
        descGu: 'ક્રિસ્પી ચોરાફળી',
        descEn: 'Crispy traditional chorafari'
    },

    chavanu: {
        id: 'chavanu',
        nameGu: 'મિક્સ ચવાણું',
        nameEn: 'Mix Chavanu',
        basePrice: 350,
        category: 'namkeen',
        img: 'images/product-chavanu.webp',
        descGu: 'સ્વાદિષ્ટ મિક્સ ચવાણું',
        descEn: 'Tasty mixed snack'
    },

    farali: {
        id: 'farali',
        nameGu: 'ફરાળી નાસ્તો',
        nameEn: 'Farali Snacks',
        basePrice: 400,
        category: 'namkeen',
        img: 'images/product-farali.webp',
        descGu: 'ફરાળી નાસ્તા માટે ઉત્તમ પસંદગી',
        descEn: 'Perfect traditional fasting snack'
    },

    hamper: {
        id: 'hamper',
        nameGu: 'પ્રીમિયમ ગિફ્ટ બોક્સ',
        nameEn: 'Premium Gift Box',
        basePrice: 850,
        category: 'gifting',
        img: 'images/category-gifting.webp',
        descGu: 'ખાસ પ્રસંગ માટે પ્રીમિયમ ગિફ્ટ બોક્સ',
        descEn: 'Premium gift box for special occasions'
    }
};


/* ================================================================
   GLOBAL STATE
================================================================ */

let currentLang =
    localStorage.getItem(
        PSM_CONFIG.languageKey
    ) || 'gu';

let cart = [];

let currentProductId = null;


/* ================================================================
   BASIC HELPERS
================================================================ */

function readJSON(
    key,
    fallback
) {

    try {

        const value =
            JSON.parse(
                localStorage.getItem(key)
            );

        return value ?? fallback;

    } catch (error) {

        console.warn(
            'PSM JSON error:',
            key,
            error
        );

        return fallback;
    }
}


function writeJSON(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch (error) {

        console.error(
            'PSM storage error:',
            error
        );

        return false;
    }
}


function escapeHtml(value) {

    return String(
        value ?? ''
    ).replace(
        /[&<>"']/g,
        character => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]
    );
}


/* ================================================================
   PRODUCT PRICE SYSTEM
================================================================ */

function loadSavedPrices() {

    return readJSON(
        PSM_CONFIG.priceKey,
        {}
    );
}


function loadCustomCatalog() {

    return readJSON(
        PSM_CONFIG.catalogKey,
        {}
    );
}


function mergeProductCatalog() {

    const savedPrices =
        loadSavedPrices();

    const customCatalog =
        loadCustomCatalog();


    Object.keys(
        savedPrices
    ).forEach(id => {

        if (PRODUCTS[id]) {

            PRODUCTS[id].basePrice =
                Number(
                    savedPrices[id]
                ) ||
                PRODUCTS[id].basePrice;
        }
    });


    Object.keys(
        customCatalog
    ).forEach(id => {

        PRODUCTS[id] =
            customCatalog[id];
    });


    Object.keys(
        savedPrices
    ).forEach(id => {

        if (PRODUCTS[id]) {

            PRODUCTS[id].basePrice =
                Number(
                    savedPrices[id]
                ) ||
                PRODUCTS[id].basePrice;
        }
    });
}


function getProduct(
    productId
) {

    mergeProductCatalog();

    return PRODUCTS[
        productId
    ] || null;
}


function getProductPrice(
    productId,
    weightKg = 1
) {

    const product =
        getProduct(
            productId
        );


    if (!product) {

        return 0;
    }


    const price =
        Number(
            product.basePrice
        ) || 0;


    return Math.round(
        price *
        Number(weightKg || 1)
    );
}


/* ================================================================
   CART LOAD / SAVE
================================================================ */

function loadCart() {

    const saved =
        readJSON(
            PSM_CONFIG.cartKey,
            []
        );


    if (!Array.isArray(saved)) {

        cart = [];

        saveCart();

        return;
    }


    cart =
        saved
            .filter(item =>
                item &&
                item.productId
            )
            .map(item => {

                const product =
                    getProduct(
                        item.productId
                    );


                const weightKg =
                    Number(
                        item.weightKg
                    ) || 1;


                const qty =
                    Math.max(
                        1,
                        Number(
                            item.qty
                        ) || 1
                    );


                return {

                    ...item,

                    nameGu:
                        item.nameGu ||
                        product?.nameGu ||
                        'Product',

                    nameEn:
                        item.nameEn ||
                        product?.nameEn ||
                        'Product',

                    weightKg,

                    qty,

                    unitPrice:
                        Number(
                            item.unitPrice
                        ) ||
                        getProductPrice(
                            item.productId,
                            weightKg
                        ) /
                        weightKg
                };
            });


    saveCart();
}


function saveCart() {

    writeJSON(
        PSM_CONFIG.cartKey,
        cart
    );
}


function clearCart() {

    cart = [];

    saveCart();

    renderCart();

    updateCartBadge();

    updateCartTotals();
}


window.clearCart =
    clearCart;


/* ================================================================
   ADD TO CART
================================================================ */

function addToCart(
    productId,
    weightKg = 1,
    qty = 1
) {

    try {

        mergeProductCatalog();


        const product =
            PRODUCTS[
                productId
            ];


        if (!product) {

            console.error(
                'Product not found:',
                productId
            );

            alert(
                currentLang === 'gu'
                    ? 'આ product મળ્યું નથી.'
                    : 'Product not found.'
            );

            return false;
        }


        weightKg =
            Number(
                weightKg
            ) || 1;


        qty =
            Math.max(
                1,
                Number(qty) || 1
            );


        const unitPrice =
            getProductPrice(
                productId,
                weightKg
            ) /
            weightKg;


        /*
           Same product + same weight
           = increase quantity.
        */

        const existing =
            cart.find(item =>
                String(
                    item.productId
                ) ===
                String(
                    productId
                ) &&
                Number(
                    item.weightKg
                ) ===
                Number(
                    weightKg
                )
            );


        if (existing) {

            existing.qty =
                Number(
                    existing.qty
                ) +
                qty;

            existing.unitPrice =
                unitPrice;

        } else {

            cart.push({

                cartId:
                    productId +
                    '_' +
                    weightKg +
                    '_' +
                    Date.now(),

                productId,

                nameGu:
                    product.nameGu,

                nameEn:
                    product.nameEn,

                weightKg,

                qty,

                unitPrice,

                image:
                    product.img

            });
        }


        saveCart();

        renderCart();

        updateCartBadge();

        updateCartTotals();

        showCartToast(
            currentLang === 'gu'
                ? '✓ Cart માં ઉમેર્યું'
                : '✓ Added to cart'
        );


        return true;

    } catch (error) {

        console.error(
            'addToCart error:',
            error
        );

        return false;
    }
}


window.addToCart =
    addToCart;


/* ================================================================
   ADD TO CART FROM BUTTON
================================================================ */

function addProductToCartFromElement(
    button
) {

    if (!button) return;


    const productId =
        button.dataset.productId ||
        button.dataset.id;


    const weightKg =
        Number(
            button.dataset.weight ||
            button.dataset.weightKg ||
            1
        );


    const qty =
        Number(
            button.dataset.qty ||
            1
        );


    if (!productId) {

        console.warn(
            'Add cart button has no product ID.'
        );

        return;
    }


    addToCart(
        productId,
        weightKg,
        qty
    );
}


window.addProductToCartFromElement =
    addProductToCartFromElement;


/* ================================================================
   CART ITEM QUANTITY
================================================================ */

function increaseCartItem(
    cartId
) {

    const item =
        cart.find(
            item =>
                String(item.cartId) ===
                String(cartId)
        );


    if (!item) return;


    item.qty =
        Number(item.qty) + 1;


    saveCart();

    renderCart();

    updateCartBadge();

    updateCartTotals();
}


window.increaseCartItem =
    increaseCartItem;


function decreaseCartItem(
    cartId
) {

    const index =
        cart.findIndex(
            item =>
                String(item.cartId) ===
                String(cartId)
        );


    if (index === -1) return;


    if (
        Number(
            cart[index].qty
        ) > 1
    ) {

        cart[index].qty--;

    } else {

        cart.splice(
            index,
            1
        );
    }


    saveCart();

    renderCart();

    updateCartBadge();

    updateCartTotals();
}


window.decreaseCartItem =
    decreaseCartItem;


function removeCartItem(
    cartId
) {

    cart =
        cart.filter(
            item =>
                String(item.cartId) !==
                String(cartId)
        );


    saveCart();

    renderCart();

    updateCartBadge();

    updateCartTotals();
}


window.removeCartItem =
    removeCartItem;


/* ================================================================
   CART TOTALS
================================================================ */

function getCartItemSubtotal(
    item
) {

    return Math.round(
        (
            Number(
                item.unitPrice
            ) || 0
        ) *
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
}


function getCartTotal() {

    return cart.reduce(
        (
            total,
            item
        ) =>
            total +
            getCartItemSubtotal(
                item
            ),
        0
    );
}


function getCartQuantity() {

    return cart.reduce(
        (
            total,
            item
        ) =>
            total +
            (
                Number(
                    item.qty
                ) || 0
            ),
        0
    );
}


function getCartWeight() {

    return cart.reduce(
        (
            total,
            item
        ) =>
            total +
            (
                Number(
                    item.weightKg
                ) || 0
            ) *
            (
                Number(
                    item.qty
                ) || 0
            ),
        0
    );
}


/* ================================================================
   CART BADGE
================================================================ */

function updateCartBadge() {

    const count =
        getCartQuantity();


    const selectors = [

        '#cart-count',

        '#cart-badge',

        '.cart-count',

        '.cart-badge',

        '[data-cart-count]'

    ];


    document
        .querySelectorAll(
            selectors.join(',')
        )
        .forEach(element => {

            element.textContent =
                count;

            element.style.display =
                count > 0
                    ? ''
                    : '';
        });
}


window.updateCartBadge =
    updateCartBadge;


/* ================================================================
   CART TOTAL ELEMENTS
================================================================ */

function updateCartTotals() {

    const total =
        getCartTotal();


    const quantity =
        getCartQuantity();


    const weight =
        getCartWeight();


    document
        .querySelectorAll(
            [
                '#cart-total',
                '#cart-subtotal',
                '[data-cart-total]'
            ].join(',')
        )
        .forEach(element => {

            element.textContent =
                PSM_CONFIG.currency +
                total.toLocaleString(
                    'en-IN'
                );
        });


    document
        .querySelectorAll(
            [
                '#cart-items-count',
                '[data-cart-items-count]'
            ].join(',')
        )
        .forEach(element => {

            element.textContent =
                quantity;
        });


    document
        .querySelectorAll(
            [
                '#cart-weight',
                '[data-cart-weight]'
            ].join(',')
        )
        .forEach(element => {

            element.textContent =
                weight.toFixed(2) +
                ' kg';
        });
}


/* ================================================================
   CART RENDER
================================================================ */

function findCartContainer() {

    const selectors = [

        '#cart-items',

        '#cartItems',

        '.cart-items',

        '[data-cart-items]',

        '#cart-list',

        '.cart-list'

    ];


    for (
        const selector of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            return element;
        }
    }


    return null;
}


function renderCart() {

    const container =
        findCartContainer();


    if (!container) {

        updateCartTotals();

        updateCartBadge();

        return;
    }


    if (!cart.length) {

        container.innerHTML = `

            <div
                style="
                    padding:30px 15px;
                    text-align:center;
                    color:#64748B;
                "
            >

                <div
                    style="
                        font-size:42px;
                        margin-bottom:10px;
                    "
                >
                    🛒
                </div>

                <strong>
                    ${
                        currentLang === 'gu'
                            ? 'તમારું cart ખાલી છે'
                            : 'Your cart is empty'
                    }
                </strong>

                <div
                    style="
                        margin-top:7px;
                        font-size:13px;
                    "
                >
                    ${
                        currentLang === 'gu'
                            ? 'મનપસંદ મીઠાઈ cart માં ઉમેરો.'
                            : 'Add your favourite sweets to cart.'
                    }
                </div>

            </div>
        `;

        updateCartBadge();

        updateCartTotals();

        return;
    }


    container.innerHTML =
        cart
            .map(item => {

                const product =
                    getProduct(
                        item.productId
                    );


                const image =
                    item.image ||
                    product?.img ||
                    'images/product-toprapak.webp';


                const name =
                    currentLang === 'gu'
                        ? (
                            item.nameGu ||
                            product?.nameGu
                        )
                        : (
                            item.nameEn ||
                            product?.nameEn
                        );


                const subtotal =
                    getCartItemSubtotal(
                        item
                    );


                return `

                    <div
                        class="psm-cart-item"
                        data-cart-id="${escapeHtml(
                            item.cartId
                        )}"
                        style="
                            display:flex;
                            gap:12px;
                            padding:12px 0;
                            border-bottom:1px solid #E5E7EB;
                        "
                    >

                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            style="
                                width:70px;
                                height:70px;
                                object-fit:cover;
                                border-radius:10px;
                            "
                            onerror="
                                this.src='images/product-toprapak.webp'
                            "
                        >

                        <div
                            style="
                                flex:1;
                                min-width:0;
                            "
                        >

                            <strong
                                style="
                                    display:block;
                                    margin-bottom:4px;
                                "
                            >
                                ${escapeHtml(name)}
                            </strong>

                            <small
                                style="
                                    color:#64748B;
                                "
                            >
                                ${Number(
                                    item.weightKg
                                )} kg ×
                                ${Number(
                                    item.qty
                                )}
                            </small>

                            <div
                                style="
                                    font-weight:800;
                                    margin-top:5px;
                                "
                            >
                                ₹${subtotal.toLocaleString(
                                    'en-IN'
                                )}
                            </div>

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:7px;
                                    margin-top:7px;
                                "
                            >

                                <button
                                    type="button"
                                    onclick="
                                        decreaseCartItem(
                                            '${escapeHtml(item.cartId)}'
                                        )
                                    "
                                    style="
                                        width:30px;
                                        height:30px;
                                        border:1px solid #CBD5E1;
                                        background:#fff;
                                        border-radius:7px;
                                    "
                                >
                                    −
                                </button>

                                <span
                                    style="
                                        min-width:25px;
                                        text-align:center;
                                        font-weight:700;
                                    "
                                >
                                    ${Number(
                                        item.qty
                                    )}
                                </span>

                                <button
                                    type="button"
                                    onclick="
                                        increaseCartItem(
                                            '${escapeHtml(item.cartId)}'
                                        )
                                    "
                                    style="
                                        width:30px;
                                        height:30px;
                                        border:1px solid #CBD5E1;
                                        background:#fff;
                                        border-radius:7px;
                                    "
                                >
                                    +
                                </button>

                                <button
                                    type="button"
                                    onclick="
                                        removeCartItem(
                                            '${escapeHtml(item.cartId)}'
                                        )
                                    "
                                    style="
                                        border:0;
                                        background:#FEE2E2;
                                        color:#B91C1C;
                                        border-radius:7px;
                                        padding:6px 9px;
                                        margin-left:5px;
                                    "
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    </div>

                `;
            })
            .join('');


    updateCartBadge();

    updateCartTotals();
}


window.renderCart =
    renderCart;


/* ================================================================
   CART OPEN / CLOSE
================================================================ */

function openCart() {

    const selectors = [

        '#cart-modal',

        '#cartModal',

        '.cart-modal',

        '#cart-drawer',

        '.cart-drawer'

    ];


    let found = false;


    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(element => {

                    element.classList.add(
                        'open'
                    );

                    element.classList.add(
                        'active'
                    );

                    element.style.display =
                        '';

                    found = true;
                });
        }
    );


    renderCart();

    updateCartTotals();

    updateCartBadge();


    if (!found) {

        const cartContainer =
            findCartContainer();


        if (cartContainer) {

            cartContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}


window.openCart =
    openCart;


function closeCart() {

    const selectors = [

        '#cart-modal',

        '#cartModal',

        '.cart-modal',

        '#cart-drawer',

        '.cart-drawer'

    ];


    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(element => {

                    element.classList.remove(
                        'open'
                    );

                    element.classList.remove(
                        'active'
                    );
                });
        }
    );
}


window.closeCart =
    closeCart;


/* ================================================================
   TOAST
================================================================ */

function showCartToast(
    message
) {

    let toast =
        document.getElementById(
            'psm-cart-toast'
        );


    if (!toast) {

        toast =
            document.createElement(
                'div'
            );

        toast.id =
            'psm-cart-toast';


        toast.style.cssText = `

            position:fixed;

            left:50%;

            bottom:30px;

            transform:translateX(-50%);

            z-index:999999;

            background:#173F8A;

            color:#fff;

            padding:12px 18px;

            border-radius:999px;

            font-weight:700;

            box-shadow:
                0 10px 35px
                rgba(0,0,0,.25);

            opacity:0;

            pointer-events:none;

            transition:.25s ease;

        `;


        document.body.appendChild(
            toast
        );
    }


    toast.textContent =
        message;


    toast.style.opacity =
        '1';


    setTimeout(
        () => {

            toast.style.opacity =
                '0';

        },
        1800
    );
}


/* ================================================================
   ORDER ID
================================================================ */

function createOrderId() {

    const now =
        new Date();


    const date =
        now
            .toISOString()
            .slice(
                0,
                10
            )
            .replace(
                /-/g,
                ''
            );


    const random =
        Math.floor(
            1000 +
            Math.random() *
            9000
        );


    return (
        PSM_CONFIG.orderPrefix +
        '-' +
        date +
        '-' +
        random
    );
}


/* ================================================================
   CUSTOMER FORM HELPERS
================================================================ */

function getFieldValue(
    selectors
) {

    if (!Array.isArray(
        selectors
    )) {

        selectors =
            [selectors];
    }


    for (
        const selector
        of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (
            element &&
            String(
                element.value
            ).trim()
        ) {

            return String(
                element.value
            ).trim();
        }
    }


    return '';
}


/* ================================================================
   CREATE ORDER OBJECT
================================================================ */

function createOrderObject() {

    const customerName =
        getFieldValue([

            '#customer-name',
            '#customerName',
            '#order-name',
            '[name="customerName"]',
            '[name="customer_name"]'

        ]);


    const phone =
        getFieldValue([

            '#customer-phone',
            '#customerPhone',
            '#order-phone',
            '[name="phone"]',
            '[name="customerPhone"]',
            '[name="customer_phone"]'

        ]);


    const city =
        getFieldValue([

            '#customer-city',
            '#customerCity',
            '#order-city',
            '[name="city"]',
            '[name="customerCity"]'

        ]);


    const address =
        getFieldValue([

            '#customer-address',
            '#customerAddress',
            '#order-address',
            '[name="address"]',
            '[name="customerAddress"]'

        ]);


    const notes =
        getFieldValue([

            '#order-notes',
            '#customer-notes',
            '#notes',
            '[name="notes"]',
            '[name="orderNotes"]'

        ]);


    const orderId =
        createOrderId();


    const items =
        cart.map(item => {

            const product =
                getProduct(
                    item.productId
                );


            const subtotal =
                getCartItemSubtotal(
                    item
                );


            return {

                productId:
                    item.productId,

                nameGu:
                    item.nameGu ||
                    product?.nameGu ||
                    '',

                nameEn:
                    item.nameEn ||
                    product?.nameEn ||
                    '',

                weightKg:
                    Number(
                        item.weightKg
                    ) || 1,

                weightLabel:
                    (
                        Number(
                            item.weightKg
                        ) || 1
                    ) +
                    'kg',

                unitPrice:
                    Number(
                        item.unitPrice
                    ) || 0,

                qty:
                    Number(
                        item.qty
                    ) || 1,

                subtotal
            };
        });


    return {

        id:
            orderId,

        orderNumber:
            orderId,

        date:
            new Date().toISOString(),

        createdAt:
            new Date().toISOString(),

        customerName,

        phone,

        city,

        address,

        notes,

        status:
            'new',

        totalAmount:
            getCartTotal(),

        totalItems:
            getCartQuantity(),

        totalKg:
            getCartWeight(),

        items,

        source:
            'website',

        whatsappSent:
            false
    };
}


/* ================================================================
   SAVE ORDER LOCALLY
================================================================ */

function saveOrderLocally(
    order
) {

    const orders =
        readJSON(
            PSM_CONFIG.ordersKey,
            []
        );


    const safeOrders =
        Array.isArray(
            orders
        )
            ? orders
            : [];


    const existingIndex =
        safeOrders.findIndex(
            oldOrder =>
                String(
                    oldOrder.id
                ) ===
                String(
                    order.id
                )
        );


    if (
        existingIndex >= 0
    ) {

        safeOrders[
            existingIndex
        ] = order;

    } else {

        safeOrders.unshift(
            order
        );
    }


    writeJSON(
        PSM_CONFIG.ordersKey,
        safeOrders
    );


    /*
       Trigger storage event for
       other tabs.
    */

    try {

        window.dispatchEvent(
            new StorageEvent(
                'storage',
                {
                    key:
                        PSM_CONFIG.ordersKey,

                    newValue:
                        JSON.stringify(
                            safeOrders
                        )
                }
            )
        );

    } catch (error) {

        console.warn(
            'Storage event:',
            error
        );
    }


    return order;
}


/* ================================================================
   WHATSAPP MESSAGE
================================================================ */

function createWhatsAppMessage(
    order
) {

    let message =
        '🍬 *PATEL SWEET MART*' +
        '\n' +
        '━━━━━━━━━━━━━━━━━━' +
        '\n' +
        '🧾 *Order:* #' +
        order.id +
        '\n';


    message +=
        '📅 *Date:* ' +
        new Date(
            order.date
        ).toLocaleString(
            'en-IN'
        ) +
        '\n\n';


    message +=
        '👤 *Customer:* ' +
        (
            order.customerName ||
            '-'
        ) +
        '\n';


    message +=
        '📱 *Phone:* ' +
        (
            order.phone ||
            '-'
        ) +
        '\n';


    if (order.city) {

        message +=
            '🏙️ *City:* ' +
            order.city +
            '\n';
    }


    if (order.address) {

        message +=
            '📍 *Address:* ' +
            order.address +
            '\n';
    }


    message +=
        '\n🛒 *ORDER ITEMS*' +
        '\n' +
        '━━━━━━━━━━━━━━━━━━' +
        '\n';


    order.items.forEach(
        (
            item,
            index
        ) => {

            message +=
                (
                    index + 1
                ) +
                '. ' +
                (
                    currentLang === 'gu'
                        ? (
                            item.nameGu ||
                            item.nameEn
                        )
                        : (
                            item.nameEn ||
                            item.nameGu
                        )
                ) +
                '\n';


            message +=
                '   Weight: ' +
                item.weightLabel +
                '\n';


            message +=
                '   Qty: ' +
                item.qty +
                '\n';


            message +=
                '   ₹' +
                Number(
                    item.subtotal
                ).toLocaleString(
                    'en-IN'
                ) +
                '\n\n';
        }
    );


    message +=
        '━━━━━━━━━━━━━━━━━━' +
        '\n';


    message +=
        '⚖️ *Total Weight:* ' +
        Number(
            order.totalKg
        ).toFixed(2) +
        ' kg' +
        '\n';


    message +=
        '📦 *Total Items:* ' +
        order.totalItems +
        '\n';


    message +=
        '💰 *TOTAL:* ₹' +
        Number(
            order.totalAmount
        ).toLocaleString(
            'en-IN'
        ) +
        '\n';


    if (order.notes) {

        message +=
            '\n📝 *Notes:* ' +
            order.notes +
            '\n';
    }


    message +=
        '\n🙏 Thank you for ordering from Patel Sweet Mart.';


    return message;
}


/* ================================================================
   OPEN WHATSAPP
================================================================ */

function sendOrderToWhatsApp(
    order
) {

    const number =
        String(
            PSM_CONFIG.whatsappNumber
        )
        .replace(
            /\D/g,
            ''
        );


    if (
        !number ||
        number.length < 10
    ) {

        alert(
            currentLang === 'gu'
                ? 'WhatsApp number script.js માં set કરો.'
                : 'Please set WhatsApp number in script.js.'
        );

        return false;
    }


    const message =
        createWhatsAppMessage(
            order
        );


    const url =
        'https://wa.me/' +
        number +
        '?text=' +
        encodeURIComponent(
            message
        );


    /*
       Mobile / desktop WhatsApp.
    */

    window.open(
        url,
        '_blank'
    );


    order.whatsappSent =
        true;

    order.whatsappSentAt =
        new Date().toISOString();


    saveOrderLocally(
        order
    );


    return true;
}


window.sendOrderToWhatsApp =
    sendOrderToWhatsApp;


/* ================================================================
   CONFIRM + SEND WHATSAPP ORDER
================================================================ */

function confirmAndSendWhatsAppOrder() {

    if (!cart.length) {

        alert(
            currentLang === 'gu'
                ? 'તમારું cart ખાલી છે.'
                : 'Your cart is empty.'
        );

        return;
    }


    const order =
        createOrderObject();


    /*
       Basic customer validation.
    */

    if (
        !order.customerName
    ) {

        alert(
            currentLang === 'gu'
                ? 'કૃપા કરીને તમારું નામ દાખલ કરો.'
                : 'Please enter your name.'
        );

        focusFirst([
            '#customer-name',
            '#customerName',
            '#order-name',
            '[name="customerName"]'
        ]);

        return;
    }


    if (
        !order.phone
    ) {

        alert(
            currentLang === 'gu'
                ? 'કૃપા કરીને મોબાઇલ નંબર દાખલ કરો.'
                : 'Please enter mobile number.'
        );

        focusFirst([
            '#customer-phone',
            '#customerPhone',
            '#order-phone',
            '[name="phone"]'
        ]);

        return;
    }


    /*
       Save order BEFORE WhatsApp.
       Therefore Owner Hub can see it even if
       WhatsApp window is closed.
    */

    saveOrderLocally(
        order
    );


    /*
       WhatsApp
    */

    sendOrderToWhatsApp(
        order
    );


    /*
       Clear cart after successful order
       save.
    */

    cart = [];

    saveCart();

    renderCart();

    updateCartBadge();

    updateCartTotals();


    /*
       Close cart / order modal.
    */

    closeCart();


    [
        '#checkout-modal',
        '#checkoutModal',
        '.checkout-modal'
    ]
        .forEach(
            selector => {

                document
                    .querySelectorAll(
                        selector
                    )
                    .forEach(
                        element =>
                            element.classList.remove(
                                'open',
                                'active'
                            )
                    );
            }
        );


    showCartToast(
        currentLang === 'gu'
            ? '✓ Order save થયો અને WhatsApp ખુલ્યું'
            : '✓ Order saved and WhatsApp opened'
    );


    /*
       Reset customer form.
    */

    resetOrderForm();


    return order;
}


window.confirmAndSendWhatsAppOrder =
    confirmAndSendWhatsAppOrder;


/* ================================================================
   CHECKOUT ALIASES
================================================================ */

function checkoutAndWhatsApp() {

    return confirmAndSendWhatsAppOrder();
}


window.checkoutAndWhatsApp =
    checkoutAndWhatsApp;


function placeOrder() {

    return confirmAndSendWhatsAppOrder();
}


window.placeOrder =
    placeOrder;


/* ================================================================
   FOCUS
================================================================ */

function focusFirst(
    selectors
) {

    for (
        const selector
        of selectors
    ) {

        const element =
            document.querySelector(
                selector
            );


        if (element) {

            element.focus();

            return;
        }
    }
}


/* ================================================================
   RESET ORDER FORM
================================================================ */

function resetOrderForm() {

    const selectors = [

        '#checkout-form',

        '#order-form',

        '#customer-form'

    ];


    selectors.forEach(
        selector => {

            const form =
                document.querySelector(
                    selector
                );


            if (
                form &&
                typeof form.reset ===
                    'function'
            ) {

                form.reset();
            }
        }
    );
}


/* ================================================================
   LANGUAGE SYSTEM
================================================================ */

const LANGUAGE_MAP = {

    gu: {

        navHome: 'હોમ',

        navProducts: 'મીઠાઈ',

        navNamkeen: 'નમકીન',

        navAbout: 'અમારા વિશે',

        navContact: 'સંપર્ક',

        cart: 'કાર્ટ',

        addToCart: 'કાર્ટમાં ઉમેરો',

        buyNow: 'હમણાં ખરીદો',

        order: 'ઓર્ડર કરો',

        ownerHub: 'ઓનર હબ',

        checkout: 'ચેકઆઉટ',

        total: 'કુલ',

        quantity: 'જથ્થો',

        emptyCart: 'તમારું કાર્ટ ખાલી છે',

        remove: 'દૂર કરો',

        customerName: 'ગ્રાહકનું નામ',

        phone: 'મોબાઇલ નંબર',

        address: 'સરનામું',

        city: 'શહેર',

        notes: 'નોંધ',

        sendWhatsApp:
            'WhatsApp પર ઓર્ડર મોકલો'

    },

    en: {

        navHome: 'Home',

        navProducts: 'Sweets',

        navNamkeen: 'Namkeen',

        navAbout: 'About Us',

        navContact: 'Contact',

        cart: 'Cart',

        addToCart: 'Add to Cart',

        buyNow: 'Buy Now',

        order: 'Order Now',

        ownerHub: 'Owner Hub',

        checkout: 'Checkout',

        total: 'Total',

        quantity: 'Quantity',

        emptyCart: 'Your cart is empty',

        remove: 'Remove',

        customerName: 'Customer Name',

        phone: 'Mobile Number',

        address: 'Address',

        city: 'City',

        notes: 'Notes',

        sendWhatsApp:
            'Send Order on WhatsApp'

    }

};


function t(
    key
) {

    return (
        LANGUAGE_MAP[
            currentLang
        ]?.[key]
        ||
        LANGUAGE_MAP.gu[key]
        ||
        key
    );
}


window.t =
    t;


/* ================================================================
   APPLY LANGUAGE
================================================================ */

function applyLang(
    lang
) {

    if (
        lang !== 'gu' &&
        lang !== 'en'
    ) {

        lang = 'gu';
    }


    currentLang =
        lang;


    localStorage.setItem(
        PSM_CONFIG.languageKey,
        lang
    );


    document.documentElement
        .setAttribute(
            'data-lang',
            lang
        );


    document.documentElement.lang =
        lang === 'gu'
            ? 'gu-IN'
            : 'en-IN';


    /*
       data-gu / data-en support.
    */

    document
        .querySelectorAll(
            '[data-gu][data-en]'
        )
        .forEach(element => {

            const value =
                element.dataset[
                    lang === 'gu'
                        ? 'gu'
                        : 'en'
                ];


            if (
                value !== undefined
            ) {

                element.textContent =
                    value;
            }
        });


    /*
       Placeholder language
    */

    document
        .querySelectorAll(
            '[data-placeholder-gu][data-placeholder-en]'
        )
        .forEach(element => {

            element.placeholder =
                lang === 'gu'
                    ? element.dataset
                        .placeholderGu
                    : element.dataset
                        .placeholderEn;
        });


    /*
       Title language
    */

    document
        .querySelectorAll(
            '[data-title-gu][data-title-en]'
        )
        .forEach(element => {

            element.title =
                lang === 'gu'
                    ? element.dataset
                        .titleGu
                    : element.dataset
                        .titleEn;
        });


    /*
       Buttons.
    */

    document
        .querySelectorAll(
            '[data-lang-key]'
        )
        .forEach(element => {

            const key =
                element.dataset.langKey;


            const translated =
                t(key);


            if (translated) {

                element.textContent =
                    translated;
            }
        });


    /*
       Common navigation selectors.
    */

    replaceText(
        [
            '[data-nav-home]'
        ],
        t('navHome')
    );


    replaceText(
        [
            '[data-nav-products]'
        ],
        t('navProducts')
    );


    replaceText(
        [
            '[data-nav-namkeen]'
        ],
        t('navNamkeen')
    );


    replaceText(
        [
            '[data-nav-about]'
        ],
        t('navAbout')
    );


    replaceText(
        [
            '[data-nav-contact]'
        ],
        t('navContact')
    );


    replaceText(
        [
            '[data-cart-label]'
        ],
        t('cart')
    );


    replaceText(
        [
            '[data-owner-hub]'
        ],
        t('ownerHub')
    );


    /*
       Language buttons state.
    */

    document
        .querySelectorAll(
            '[data-lang-switch]'
        )
        .forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.langSwitch ===
                    lang
            );
        });


    document
        .querySelectorAll(
            '[data-lang="gu"]'
        )
        .forEach(button => {

            if (
                button.dataset.langSwitch
            ) {

                button.classList.toggle(
                    'active',
                    lang === 'gu'
                );
            }
        });


    document
        .querySelectorAll(
            '[data-lang="en"]'
        )
        .forEach(button => {

            if (
                button.dataset.langSwitch
            ) {

                button.classList.toggle(
                    'active',
                    lang === 'en'
                );
            }
        });


    /*
       Product text refresh.
    */

    refreshProductLanguage();


    renderCart();


    updateCartBadge();


    updateCartTotals();
}


window.applyLang =
    applyLang;


/* ================================================================
   LANGUAGE SWITCH
================================================================ */

function switchLanguage(
    lang
) {

    applyLang(
        lang
    );
}


window.switchLanguage =
    switchLanguage;


function changeLanguage(
    lang
) {

    applyLang(
        lang
    );
}


window.changeLanguage =
    changeLanguage;


/* ================================================================
   REPLACE TEXT
================================================================ */

function replaceText(
    selectors,
    value
) {

    selectors.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    element =>
                        element.textContent =
                            value
                );
        }
    );
}


/* ================================================================
   PRODUCT LANGUAGE
================================================================ */

function refreshProductLanguage() {

    mergeProductCatalog();


    document
        .querySelectorAll(
            '[data-product-id]'
        )
        .forEach(element => {

            const id =
                element.dataset.productId;


            const product =
                PRODUCTS[id];


            if (!product) return;


            const name =
                currentLang === 'gu'
                    ? product.nameGu
                    : product.nameEn;


            if (
                element.dataset.productName !==
                undefined
            ) {

                element.dataset.productName =
                    name;
            }


            element
                .querySelectorAll(
                    '[data-product-name]'
                )
                .forEach(
                    child =>
                        child.textContent =
                            name
                );


            element
                .querySelectorAll(
                    '[data-add-cart-text]'
                )
                .forEach(
                    child =>
                        child.textContent =
                            t('addToCart')
                );
        });
}


/* ================================================================
   OWNER HUB
================================================================ */

function openOwnerHubPage() {

    window.location.href =
        'admin.html';
}


window.openOwnerHubPage =
    openOwnerHubPage;


function openSingleAdminHub() {

    window.location.href =
        'admin.html';
}


window.openSingleAdminHub =
    openSingleAdminHub;


function openAdminHub() {

    window.location.href =
        'admin.html';
}


window.openAdminHub =
    openAdminHub;


/* ================================================================
   OPEN OWNER HUB NEW TAB
================================================================ */

function openOwnerHubNewTab() {

    window.open(
        'admin.html',
        '_blank'
    );
}


window.openOwnerHubNewTab =
    openOwnerHubNewTab;


/* ================================================================
   PRODUCT CARD PRICE REFRESH
================================================================ */

function refreshProductPrices() {

    mergeProductCatalog();


    document
        .querySelectorAll(
            '[data-product-id]'
        )
        .forEach(card => {

            const id =
                card.dataset.productId;


            const product =
                PRODUCTS[id];


            if (!product) return;


            const price =
                Number(
                    product.basePrice
                ) || 0;


            card
                .querySelectorAll(
                    '[data-product-price]'
                )
                .forEach(
                    element => {

                        element.textContent =
                            '₹' +
                            price.toLocaleString(
                                'en-IN'
                            );
                    }
                );


            card
                .querySelectorAll(
                    '.product-price'
                )
                .forEach(
                    element => {

                        element.textContent =
                            '₹' +
                            price.toLocaleString(
                                'en-IN'
                            );
                    }
                );
        });
}


window.refreshProductPrices =
    refreshProductPrices;


/* ================================================================
   PRODUCT MODAL
================================================================ */

function openProductModal(
    productId
) {

    const product =
        getProduct(
            productId
        );


    if (!product) return;


    currentProductId =
        productId;


    const modal =
        document.querySelector(
            '#product-modal'
        )
        ||
        document.querySelector(
            '#productModal'
        );


    if (!modal) {

        addToCart(
            productId,
            1,
            1
        );

        return;
    }


    modal.classList.add(
        'open'
    );

    modal.classList.add(
        'active'
    );


    modal.dataset.productId =
        productId;


    const image =
        modal.querySelector(
            '[data-modal-product-image]'
        );


    const name =
        modal.querySelector(
            '[data-modal-product-name]'
        );


    const description =
        modal.querySelector(
            '[data-modal-product-description]'
        );


    const price =
        modal.querySelector(
            '[data-modal-product-price]'
        );


    if (image) {

        image.src =
            product.img;
    }


    if (name) {

        name.textContent =
            currentLang === 'gu'
                ? product.nameGu
                : product.nameEn;
    }


    if (description) {

        description.textContent =
            currentLang === 'gu'
                ? product.descGu
                : product.descEn;
    }


    if (price) {

        price.textContent =
            '₹' +
            Number(
                product.basePrice
            ).toLocaleString(
                'en-IN'
            );
    }
}


window.openProductModal =
    openProductModal;


function closeProductModal() {

    document
        .querySelectorAll(
            '#product-modal,#productModal'
        )
        .forEach(
            modal =>
                modal.classList.remove(
                    'open',
                    'active'
                )
        );


    currentProductId =
        null;
}


window.closeProductModal =
    closeProductModal;


/* ================================================================
   BUY NOW
================================================================ */

function buyNow(
    productId,
    weightKg = 1
) {

    cart = [];


    saveCart();


    addToCart(
        productId,
        weightKg,
        1
    );


    openCart();
}


window.buyNow =
    buyNow;


/* ================================================================
   EVENT DELEGATION
================================================================ */

document.addEventListener(
    'click',
    event => {

        const button =
            event.target.closest(
                '[data-add-to-cart]'
            );


        if (button) {

            event.preventDefault();

            addProductToCartFromElement(
                button
            );

            return;
        }


        const cartButton =
            event.target.closest(
                '[data-open-cart]'
            );


        if (cartButton) {

            event.preventDefault();

            openCart();

            return;
        }


        const closeCartButton =
            event.target.closest(
                '[data-close-cart]'
            );


        if (closeCartButton) {

            event.preventDefault();

            closeCart();

            return;
        }


        const languageButton =
            event.target.closest(
                '[data-lang-switch]'
            );


        if (languageButton) {

            event.preventDefault();

            applyLang(
                languageButton.dataset
                    .langSwitch
            );

            return;
        }


        const ownerButton =
            event.target.closest(
                '[data-open-owner-hub]'
            );


        if (ownerButton) {

            event.preventDefault();

            openOwnerHubPage();

            return;
        }


        const buyButton =
            event.target.closest(
                '[data-buy-now]'
            );


        if (buyButton) {

            event.preventDefault();


            const id =
                buyButton.dataset
                    .productId;


            const weight =
                Number(
                    buyButton.dataset
                        .weight ||
                    1
                );


            if (id) {

                buyNow(
                    id,
                    weight
                );
            }
        }

    }
);


/* ================================================================
   CHECKOUT BUTTON AUTO HOOK
================================================================ */

function attachCheckoutButtons() {

    const selectors = [

        '#checkout-button',

        '#checkoutButton',

        '#whatsapp-order-button',

        '#send-whatsapp-order',

        '[data-checkout]',

        '[data-whatsapp-order]'

    ];


    document
        .querySelectorAll(
            selectors.join(',')
        )
        .forEach(button => {

            if (
                button.dataset
                    .psmCheckoutAttached
            ) {

                return;
            }


            button.dataset
                .psmCheckoutAttached =
                    'true';


            button.addEventListener(
                'click',
                event => {

                    event.preventDefault();

                    confirmAndSendWhatsAppOrder();

                }
            );
        });
}


/* ================================================================
   PRODUCT BUTTON AUTO HOOK
================================================================ */

function attachProductButtons() {

    document
        .querySelectorAll(
            '[data-product-id]'
        )
        .forEach(card => {

            const buttons =
                card.querySelectorAll(
                    '[data-add-to-cart]'
                );


            buttons.forEach(
                button => {

                    if (
                        button.dataset
                            .psmAttached
                    ) {

                        return;
                    }


                    button.dataset
                        .psmAttached =
                            'true';


                    if (
                        !button.dataset
                            .productId
                    ) {

                        button.dataset
                            .productId =
                                card.dataset
                                    .productId;
                    }
                }
            );
        });
}


/* ================================================================
   CART FORM AUTO DETECTION
================================================================ */

function attachCartForm() {

    const form =
        document.querySelector(
            '#checkout-form'
        );


    if (!form) return;


    if (
        form.dataset
            .psmAttached
    ) {

        return;
    }


    form.dataset
        .psmAttached =
            'true';


    form.addEventListener(
        'submit',
        event => {

            event.preventDefault();

            confirmAndSendWhatsAppOrder();

        }
    );
}


/* ================================================================
   STORAGE SYNC
================================================================ */

window.addEventListener(
    'storage',
    event => {

        if (
            event.key ===
            PSM_CONFIG.cartKey
        ) {

            loadCart();

            renderCart();

            updateCartBadge();

            updateCartTotals();
        }


        if (
            event.key ===
            PSM_CONFIG.priceKey
            ||
            event.key ===
            PSM_CONFIG.catalogKey
        ) {

            mergeProductCatalog();

            refreshProductPrices();

            refreshProductLanguage();

            renderCart();
        }


        if (
            event.key ===
            PSM_CONFIG.languageKey
        ) {

            currentLang =
                event.newValue ||
                'gu';

            applyLang(
                currentLang
            );
        }

    }
);


/* ================================================================
   PERIODIC PRICE REFRESH
================================================================ */

let lastPriceSignature =
    '';


function getPriceSignature() {

    return JSON.stringify({

        prices:
            readJSON(
                PSM_CONFIG.priceKey,
                {}
            ),

        catalog:
            readJSON(
                PSM_CONFIG.catalogKey,
                {}
            )

    });
}


function checkPriceChanges() {

    const signature =
        getPriceSignature();


    if (
        signature !==
        lastPriceSignature
    ) {

        lastPriceSignature =
            signature;


        mergeProductCatalog();

        refreshProductPrices();

        refreshProductLanguage();

        renderCart();
    }
}


/* ================================================================
   INITIALIZATION
================================================================ */

function initializePatelSweetMart() {

    mergeProductCatalog();


    loadCart();


    applyLang(
        currentLang
    );


    refreshProductPrices();


    refreshProductLanguage();


    renderCart();


    updateCartBadge();


    updateCartTotals();


    attachCheckoutButtons();


    attachProductButtons();


    attachCartForm();


    lastPriceSignature =
        getPriceSignature();


    /*
       Re-run after existing page scripts.
    */

    setTimeout(
        () => {

            mergeProductCatalog();

            loadCart();

            applyLang(
                currentLang
            );

            refreshProductPrices();

            refreshProductLanguage();

            renderCart();

            updateCartBadge();

            updateCartTotals();

            attachCheckoutButtons();

            attachProductButtons();

            attachCartForm();

        },
        300
    );


    /*
       Check owner changes every 2 seconds.
    */

    setInterval(
        checkPriceChanges,
        2000
    );
}


/* ================================================================
   DOM READY
================================================================ */

if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        initializePatelSweetMart
    );

} else {

    initializePatelSweetMart();
}


/* ================================================================
   GLOBAL EXPORTS
================================================================ */

window.PSM = {

    PRODUCTS,

    cart,

    config:
        PSM_CONFIG,

    addToCart,

    loadCart,

    saveCart,

    clearCart,

    renderCart,

    openCart,

    closeCart,

    getCartTotal,

    getCartQuantity,

    getCartWeight,

    createOrderObject,

    saveOrderLocally,

    createWhatsAppMessage,

    sendOrderToWhatsApp,

    confirmAndSendWhatsAppOrder,

    applyLang,

    switchLanguage,

    changeLanguage,

    openOwnerHubPage,

    openSingleAdminHub,

    refreshProductPrices,

    getProduct,

    getProductPrice

};
/* ============================================================
   PATEL SWEET MART — FINAL COMPATIBILITY FIX
   Fix:
   1. Add To Cart
   2. Weight selection
   3. Gujarati / English language
   4. Cart drawer ID mismatch
   5. Cart badge
   ============================================================ */

(function () {

    'use strict';


    /* ==========================================================
       LANGUAGE FIX
       Supports BOTH:
       .gu-text / .en-text
       AND
       [data-lang="gu"] / [data-lang="en"]
       ========================================================== */

    window.applyLang = function (lang) {

        lang = String(lang || '').toLowerCase() === 'en'
            ? 'en'
            : 'gu';

        currentLang = lang;

        localStorage.setItem('psm-lang', lang);

        document.documentElement.setAttribute(
            'data-lang',
            lang
        );

        document.documentElement.lang =
            lang === 'gu'
                ? 'gu-IN'
                : 'en-IN';


        /* Old language system */

        document.querySelectorAll('.gu-text').forEach(function (el) {

            el.style.display =
                lang === 'gu'
                    ? ''
                    : 'none';

        });


        document.querySelectorAll('.en-text').forEach(function (el) {

            el.style.display =
                lang === 'en'
                    ? ''
                    : 'none';

        });


        /* New data-lang system */

        document.querySelectorAll('[data-lang="gu"]').forEach(function (el) {

            el.style.display =
                lang === 'gu'
                    ? ''
                    : 'none';

        });


        document.querySelectorAll('[data-lang="en"]').forEach(function (el) {

            el.style.display =
                lang === 'en'
                    ? ''
                    : 'none';

        });


        /* Language buttons */

        var guButton =
            document.getElementById('btn-gu');

        var enButton =
            document.getElementById('btn-en');


        if (guButton) {

            guButton.classList.toggle(
                'active-lang',
                lang === 'gu'
            );

        }


        if (enButton) {

            enButton.classList.toggle(
                'active-lang',
                lang === 'en'
            );

        }


        /* Other possible buttons */

        document
            .querySelectorAll('[data-set-lang="gu"]')
            .forEach(function (el) {

                el.classList.toggle(
                    'active-lang',
                    lang === 'gu'
                );

            });


        document
            .querySelectorAll('[data-set-lang="en"]')
            .forEach(function (el) {

                el.classList.toggle(
                    'active-lang',
                    lang === 'en'
                );

            });


        /* Refresh cart language */

        if (typeof updateCartBadges === 'function') {
            updateCartBadges();
        }

        if (typeof renderCartBody === 'function') {
            renderCartBody();
        }


        /* Custom cart system */

        if (typeof renderCart === 'function') {
            renderCart();
        }

    };


    window.toggleLang = function () {

        var nextLanguage =
            currentLang === 'gu'
                ? 'en'
                : 'gu';

        window.applyLang(nextLanguage);

    };


    window.setLang = function (lang) {

        window.applyLang(lang);

    };


    /* ==========================================================
       WEIGHT SELECTION FIX
       ========================================================== */

    window.selectProductWeight = function (
        productId,
        weightKey,
        multiplier,
        label
    ) {

        productId = String(productId);

        var product =
            typeof PRODUCTS !== 'undefined'
                ? PRODUCTS[productId]
                : null;


        if (!product) {

            console.warn(
                'Product not found:',
                productId
            );

            return;

        }


        multiplier =
            Number(multiplier);


        if (!Number.isFinite(multiplier) ||
            multiplier <= 0) {

            multiplier = 1;

        }


        var basePrice =
            Number(product.basePrice) || 0;


        var calculatedPrice =
            Math.round(
                basePrice * multiplier
            );


        var labelData;


        if (typeof formatWeightLabel === 'function') {

            labelData =
                formatWeightLabel(multiplier);

        } else {

            labelData = {

                gu:
                    multiplier === 1
                        ? '1kg'
                        : Math.round(multiplier * 1000) + 'g',

                en:
                    multiplier === 1
                        ? '1kg'
                        : Math.round(multiplier * 1000) + 'g',

                key:
                    weightKey || String(multiplier)

            };

        }


        if (typeof selectedWeights === 'undefined') {

            window.selectedWeights = {};

        }


        selectedWeights[productId] = {

            weightKey:
                weightKey || labelData.key,

            multiplier:
                multiplier,

            label:
                label ||
                (
                    currentLang === 'gu'
                        ? labelData.gu
                        : labelData.en
                ),

            labelGu:
                labelData.gu,

            labelEn:
                labelData.en,

            price:
                calculatedPrice

        };


        /* Update product card selected button */

        var card =
            document.querySelector(
                '[data-product-id="' +
                productId +
                '"]'
            );


        if (card) {

            card
                .querySelectorAll(
                    '[data-weight]'
                )
                .forEach(function (btn) {

                    btn.classList.remove(
                        'active',
                        'selected'
                    );

                });


            var selectedButton =
                card.querySelector(
                    '[data-weight="' +
                    (weightKey || labelData.key) +
                    '"]'
                );


            if (selectedButton) {

                selectedButton.classList.add(
                    'active',
                    'selected'
                );

            }

        }


        /* Common IDs */

        var priceElements = [

            'price-' + productId,

            'product-price-' + productId,

            'selected-price-' + productId,

            'weight-price-' + productId

        ];


        priceElements.forEach(function (elementId) {

            var element =
                document.getElementById(elementId);


            if (element) {

                element.textContent =
                    '₹' +
                    calculatedPrice.toLocaleString(
                        'en-IN'
                    );

            }

        });


        /* Selected weight display */

        var weightElements = [

            'selected-weight-' + productId,

            'weight-label-' + productId,

            'current-weight-' + productId

        ];


        weightElements.forEach(function (elementId) {

            var element =
                document.getElementById(elementId);


            if (element) {

                element.textContent =
                    currentLang === 'gu'
                        ? labelData.gu
                        : labelData.en;

            }

        });


        /* Radio buttons */

        document
            .querySelectorAll(
                'input[name="weight-' +
                productId +
                '"]'
            )
            .forEach(function (radio) {

                radio.checked =
                    String(radio.value) ===
                    String(weightKey);

            });

    };


    /* ==========================================================
       FORCE WEIGHT BUTTONS TO WORK
       ========================================================== */

    document.addEventListener(
        'click',
        function (event) {

            var button =
                event.target.closest(
                    '[data-weight]'
                );


            if (!button) {
                return;
            }


            var productId =
                button.getAttribute(
                    'data-product-id'
                );


            if (!productId) {

                var parent =
                    button.closest(
                        '[data-product-id]'
                    );


                if (parent) {

                    productId =
                        parent.getAttribute(
                            'data-product-id'
                        );

                }

            }


            if (!productId) {
                return;
            }


            var weightKey =
                button.getAttribute(
                    'data-weight'
                );


            var multiplier =
                Number(
                    button.getAttribute(
                        'data-multiplier'
                    )
                );


            if (!Number.isFinite(multiplier)) {

                var weightText =
                    String(weightKey || '')
                        .toLowerCase()
                        .replace('kg', '')
                        .replace('g', '');


                var numeric =
                    Number(weightText);


                if (weightKey &&
                    weightKey.toLowerCase().includes('g')) {

                    multiplier =
                        numeric / 1000;

                } else {

                    multiplier =
                        numeric || 1;

                }

            }


            var label =
                button.getAttribute(
                    'data-label'
                ) ||
                button.textContent.trim();


            window.selectProductWeight(
                productId,
                weightKey,
                multiplier,
                label
            );

        }
    );


    /* ==========================================================
       ADD TO CART FIX
       ========================================================== */

    window.addToCart = function (
        id,
        nameGu,
        nameEn,
        price,
        img,
        unit
    ) {

        var productId =
            String(id || '').trim();


        if (!productId) {

            console.error(
                'Add to Cart: Product ID missing'
            );

            return;

        }


        var basePrice =
            Number(price) || 0;


        /* Get actual product */

        var product =
            typeof PRODUCTS !== 'undefined'
                ? PRODUCTS[productId]
                : null;


        if (product) {

            nameGu =
                product.nameGu ||
                nameGu ||
                productId;

            nameEn =
                product.nameEn ||
                nameEn ||
                productId;

            basePrice =
                Number(
                    product.basePrice
                ) || basePrice;

            img =
                product.img ||
                img ||
                'logo.png';

        }


        /* Selected weight */

        var selected =
            typeof selectedWeights !== 'undefined'
                ? selectedWeights[productId]
                : null;


        if (!selected) {

            selected = {

                weightKey: '1kg',

                multiplier: 1,

                label: '1kg',

                labelGu: '1kg',

                labelEn: '1kg',

                price: basePrice

            };


            if (typeof selectedWeights !== 'undefined') {

                selectedWeights[productId] =
                    selected;

            }

        }


        var weightKey =
            selected.weightKey ||
            '1kg';


        var multiplier =
            Number(
                selected.multiplier
            ) || 1;


        var selectedPrice =
            Number(
                selected.price
            );


        if (!Number.isFinite(selectedPrice) ||
            selectedPrice <= 0) {

            selectedPrice =
                Math.round(
                    basePrice * multiplier
                );

        }


        var cartItemId =
            productId +
            '_' +
            weightKey;


        /* Make sure cart exists */

        if (!Array.isArray(cart)) {
            cart = [];
        }


        /* Find existing item */

        var existing =
            cart.find(function (item) {

                return String(item.id) ===
                    String(cartItemId);

            });


        if (existing) {

            existing.qty =
                Math.max(
                    1,
                    Number(existing.qty || 0) + 1
                );

        } else {

            cart.push({

                id:
                    cartItemId,

                productId:
                    productId,

                nameGu:
                    nameGu,

                nameEn:
                    nameEn,

                weightKey:
                    weightKey,

                weightLabel:
                    selected.label ||
                    unit ||
                    '1kg',

                weightLabelGu:
                    selected.labelGu ||
                    selected.label ||
                    unit ||
                    '1kg',

                weightLabelEn:
                    selected.labelEn ||
                    selected.label ||
                    unit ||
                    '1kg',

                multiplier:
                    multiplier,

                basePrice:
                    basePrice,

                price:
                    selectedPrice,

                img:
                    img || 'logo.png',

                qty:
                    1

            });

        }


        /* Save */

        if (typeof saveCart === 'function') {

            saveCart();

        } else {

            var data =
                JSON.stringify(cart);

            localStorage.setItem(
                'psm-cart',
                data
            );

            localStorage.setItem(
                'psm_cart',
                data
            );

        }


        /* Update UI */

        if (typeof updateCartBadges === 'function') {
            updateCartBadges();
        }

        if (typeof renderCartBody === 'function') {
            renderCartBody();
        }


        /* Button feedback */

        var button =
            document.getElementById(
                'btn-add-' + productId
            );


        if (button) {

            var oldHTML =
                button.innerHTML;


            button.classList.add(
                'added'
            );


            button.innerHTML =
                currentLang === 'gu'
                    ? '✓ ઉમેરાયું'
                    : '✓ Added';


            setTimeout(function () {

                button.innerHTML =
                    oldHTML;

                button.classList.remove(
                    'added'
                );

            }, 1200);

        }


        /* Toast */

        var displayName =
            currentLang === 'gu'
                ? nameGu
                : nameEn;


        if (typeof showToast === 'function') {

            showToast(

                currentLang === 'gu'

                    ? '🛒 <strong>' +
                      displayName +
                      '</strong> (' +
                      (selected.label || '1kg') +
                      ') કાર્ટમાં ઉમેરાયું!'

                    : '🛒 <strong>' +
                      displayName +
                      '</strong> (' +
                      (selected.label || '1kg') +
                      ') added to cart!'

            );

        }


        console.log(
            'Added to cart:',
            cartItemId,
            cart
        );

    };


    /* ==========================================================
       CART ID COMPATIBILITY
       ========================================================== */

    function setupCartCompatibility() {

        var oldDrawer =
            document.getElementById(
                'cart-drawer'
            );


        var newDrawer =
            document.getElementById(
                'cartDrawer'
            );


        var oldBackdrop =
            document.getElementById(
                'cart-backdrop'
            );


        var newBackdrop =
            document.getElementById(
                'cartOverlay'
            );


        var oldBody =
            document.getElementById(
                'cart-body'
            );


        var newBody =
            document.getElementById(
                'cartItems'
            );


        /*
         * Current script uses old IDs.
         * If new HTML uses new IDs, create aliases.
         */

        if (!oldDrawer && newDrawer) {

            newDrawer.id =
                'cart-drawer';

        }


        if (!oldBackdrop && newBackdrop) {

            newBackdrop.id =
                'cart-backdrop';

        }


        if (!oldBody && newBody) {

            newBody.id =
                'cart-body';

        }

    }


    /* ==========================================================
       CHECKOUT COMPATIBILITY
       ========================================================== */

    window.openCheckout = function () {

        /* First support old checkout */

        var oldCheckout =
            document.getElementById(
                'checkout-modal'
            );


        if (oldCheckout) {

            oldCheckout.classList.add(
                'open'
            );

            oldCheckout.setAttribute(
                'aria-hidden',
                'false'
            );

            return;

        }


        /* New checkout modal */

        var modal =
            document.getElementById(
                'checkoutModal'
            );


        if (modal) {

            modal.classList.add(
                'active'
            );

            modal.setAttribute(
                'aria-hidden',
                'false'
            );


            if (
                typeof renderCartBody ===
                'function'
            ) {

                renderCartBody();

            }

        }

    };


    window.closeCheckout = function () {

        var modal =
            document.getElementById(
                'checkoutModal'
            );


        if (modal) {

            modal.classList.remove(
                'active'
            );

            modal.setAttribute(
                'aria-hidden',
                'true'
            );

        }


        var oldModal =
            document.getElementById(
                'checkout-modal'
            );


        if (oldModal) {

            oldModal.classList.remove(
                'open'
            );

            oldModal.setAttribute(
                'aria-hidden',
                'true'
            );

        }

    };


    /* ==========================================================
       OPEN CART COMPATIBILITY
       ========================================================== */

    var originalOpenCart =
        window.openCart;


    window.openCart = function () {

        setupCartCompatibility();


        
           if (
            typeof originalOpenCart ===
            'function'
        ) {
              originalOpenCart();

            return;

    }
       var drawer =
            document.getElementById(
                'cart-drawer'
            );
       var backdrop =
            document.getElementById(
                'cart-backdrop'
            );
       if (drawer) {

            drawer.classList.add(
                'open'
            );

       }
       if (backdrop) {

            backdrop.classList.add(
                'open'
            );

        }


        if (typeof renderCartBody === 'function') {

            renderCartBody();

        }

    };
   /* ============================================================
   FINAL ADD TO CART FIX
   PATEL SWEET MART
   ============================================================ */

function addCurrentProductToCart(productId) {

    try {

        const id = String(productId || '').trim();

        console.log('ADD TO CART CLICK:', id);

        /* ---------------- PRODUCT CHECK ---------------- */

        if (
            typeof PRODUCTS === 'undefined' ||
            !PRODUCTS ||
            !PRODUCTS[id]
        ) {

            console.error(
                'PRODUCT NOT FOUND:',
                id,
                typeof PRODUCTS !== 'undefined'
                    ? PRODUCTS
                    : 'PRODUCTS undefined'
            );

            showToast(
                currentLang === 'gu'
                    ? '❌ ઉત્પાદન મળ્યું નથી.'
                    : '❌ Product not found.'
            );

            return false;
        }


        const product = PRODUCTS[id];


        /* ---------------- CART CHECK ---------------- */

        if (!Array.isArray(cart)) {
            cart = [];
        }


        /* ---------------- WEIGHT ---------------- */

        let selected =
            selectedWeights &&
            selectedWeights[id]
                ? selectedWeights[id]
                : null;


        /*
         * જો કોઈ weight select નથી તો 1kg
         * default રહેશે.
         */

        if (!selected) {

            selected = {

                weightKey: '1kg',

                multiplier: 1,

                label: '1kg',

                labelGu: '1kg',

                labelEn: '1kg',

                price:
                    Number(product.basePrice) || 0

            };

            selectedWeights[id] = selected;

        }


        let weightKey =
            String(
                selected.weightKey || '1kg'
            );


        let multiplier =
            Number(
                selected.multiplier
            );


        if (
            !Number.isFinite(multiplier) ||
            multiplier <= 0
        ) {

            multiplier = 1;

        }


        /* ---------------- PRICE ---------------- */

        let itemPrice =
            Number(selected.price);


        if (
            !Number.isFinite(itemPrice) ||
            itemPrice <= 0
        ) {

            itemPrice =
                Math.round(
                    (Number(product.basePrice) || 0)
                    * multiplier
                );

        }


        /* ---------------- CART ITEM ID ---------------- */

        const cartItemId =
            id + '_' + weightKey;


        /* ---------------- EXISTING ITEM ---------------- */

        const existingIndex =
            cart.findIndex(function (item) {

                return String(item.id) ===
                    String(cartItemId);

            });


        if (existingIndex !== -1) {

            cart[existingIndex].qty =
                Number(
                    cart[existingIndex].qty || 0
                ) + 1;

        } else {

            /* ---------------- NEW ITEM ---------------- */

            cart.push({

                id:
                    cartItemId,

                productId:
                    id,

                nameGu:
                    product.nameGu ||
                    product.name ||
                    id,

                nameEn:
                    product.nameEn ||
                    product.name ||
                    id,

                weightKey:
                    weightKey,

                weightLabel:
                    selected.label ||
                    weightKey,

                weightLabelGu:
                    selected.labelGu ||
                    selected.label ||
                    weightKey,

                weightLabelEn:
                    selected.labelEn ||
                    selected.label ||
                    weightKey,

                multiplier:
                    multiplier,

                basePrice:
                    Number(
                        product.basePrice
                    ) || 0,

                price:
                    itemPrice,

                img:
                    product.img ||
                    'logo.png',

                qty:
                    1

            });

        }


        console.log(
            'CART AFTER ADD:',
            cart
        );


        /* ---------------- SAVE CART ---------------- */

        saveCart();


        /* ---------------- FORCE LOCAL STORAGE ---------------- */

        const cartJSON =
            JSON.stringify(cart);


        localStorage.setItem(
            'psm-cart',
            cartJSON
        );

        localStorage.setItem(
            'psm_cart',
            cartJSON
        );


        /* ---------------- UPDATE CART UI ---------------- */

        updateCartBadges();

        renderCartBody();


        /* ---------------- BUTTON EFFECT ---------------- */

        const button =
            document.getElementById(
                'btn-add-' + id
            );


        if (button) {

            const originalHTML =
                button.innerHTML;


            button.classList.add(
                'added'
            );


            button.innerHTML =
                currentLang === 'gu'

                    ? '✓ ઉમેરાયું'

                    : '✓ Added';


            setTimeout(function () {

                button.innerHTML =
                    originalHTML;

                button.classList.remove(
                    'added'
                );

            }, 1200);

        }


        /* ---------------- TOAST ---------------- */

        const displayName =
            currentLang === 'gu'
                ? (
                    product.nameGu ||
                    product.name ||
                    id
                )
                : (
                    product.nameEn ||
                    product.name ||
                    id
                );


        const weightText =
            selected.label ||
            weightKey;


        showToast(

            currentLang === 'gu'

                ? '🛒 <strong>' +
                  displayName +
                  '</strong> (' +
                  weightText +
                  ') કાર્ટમાં ઉમેરાયું!'

                : '🛒 <strong>' +
                  displayName +
                  '</strong> (' +
                  weightText +
                  ') added to cart!'

        );


        /* ---------------- OPEN CART ---------------- */

        /*
         * Cart drawer automatically open કરવું હોય
         * તો નીચેની line uncomment કરી શકો.
         */

        // openCart();


        return true;


    } catch (error) {

        console.error(
            'ADD TO CART ERROR:',
            error
        );


        showToast(

            currentLang === 'gu'

                ? '❌ કાર્ટમાં ઉમેરવામાં error આવ્યો.'

                : '❌ Error adding product to cart.'

        );


        return false;

    }

               }
   /* ==========================================================
       INIT
       ========================================================== */

    function finalFixInit() {

        setupCartCompatibility();


        var savedLanguage =
            localStorage.getItem(
                'psm-lang'
            ) || 'gu';


        window.applyLang(
            savedLanguage
        );
       if (
            typeof updateCartBadges ===
            'function'
        ) {

            updateCartBadges();

        }


        if (
            typeof renderCartBody ===
            'function'
        ) {

            renderCartBody();

        }

    }
   if (
        document.readyState ===
        'loading'
    ) {

        document.addEventListener(
            'DOMContentLoaded',
            finalFixInit
        );

    } else {

        finalFixInit();

    }


})();
