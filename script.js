// ============================================================
// PATEL SWEET MART
// CART SYSTEM - FINAL FIXED VERSION
// ============================================================

'use strict';


// ============================================================
// CART STORAGE KEY
// IMPORTANT: Existing website uses "psm-cart"
// ============================================================

const PSM_CART_KEY = 'psm-cart';


// ============================================================
// GET CART
// ============================================================

function getPSMCart() {
    try {
        const saved = localStorage.getItem(PSM_CART_KEY);

        if (!saved) return [];

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : [];

    } catch (error) {
        console.warn('Cart load error:', error);
        return [];
    }
}


// ============================================================
// SAVE CART
// ============================================================

function savePSMCart(cartData) {

    if (!Array.isArray(cartData)) {
        cartData = [];
    }

    try {

        localStorage.setItem(
            PSM_CART_KEY,
            JSON.stringify(cartData)
        );

        // Existing global cart variable update
        if (typeof window.cart !== 'undefined') {
            window.cart = cartData;
        }

        // Existing website functions
        if (typeof updateCartBadges === 'function') {
            updateCartBadges();
        }

        if (typeof renderCartBody === 'function') {
            renderCartBody();
        }

        updateCartCount();

    } catch (error) {

        console.error('Cart save error:', error);

        alert(
            'કાર્ટ સેવ કરવામાં સમસ્યા આવી. Browser storage check કરો.'
        );
    }
}


// ============================================================
// GET PRODUCT
// ============================================================

function getPSMProduct(productId) {

    let product = null;

    // ----------------------------------------------------------
    // 1. Existing PRODUCTS object
    // ----------------------------------------------------------

    if (
        typeof PRODUCTS !== 'undefined' &&
        PRODUCTS
    ) {

        product = PRODUCTS[productId];

        if (!product) {

            const productList =
                Object.values(PRODUCTS);

            product =
                productList.find(function (p) {

                    return String(p.id) ===
                        String(productId);

                }) || null;
        }
    }


    // ----------------------------------------------------------
    // 2. allProducts fallback
    // ----------------------------------------------------------

    if (
        !product &&
        typeof allProducts !== 'undefined' &&
        Array.isArray(allProducts)
    ) {

        product =
            allProducts.find(function (p) {

                return String(p.id) ===
                    String(productId);

            }) || null;
    }


    // ----------------------------------------------------------
    // 3. products fallback
    // ----------------------------------------------------------

    if (
        !product &&
        typeof products !== 'undefined' &&
        Array.isArray(products)
    ) {

        product =
            products.find(function (p) {

                return String(p.id) ===
                    String(productId);

            }) || null;
    }


    // ----------------------------------------------------------
    // 4. DEFAULT_PRODUCTS fallback
    // ----------------------------------------------------------

    if (
        !product &&
        typeof DEFAULT_PRODUCTS !== 'undefined' &&
        DEFAULT_PRODUCTS
    ) {

        product =
            DEFAULT_PRODUCTS[productId] || null;

        if (!product) {

            product =
                Object.values(DEFAULT_PRODUCTS)
                    .find(function (p) {

                        return String(p.id) ===
                            String(productId);

                    }) || null;
        }
    }


    return product;
}


// ============================================================
// WEIGHT LABEL
// ============================================================

function getCartWeightLabel(weightKg) {

    weightKg = Number(weightKg);

    if (!isFinite(weightKg) || weightKg <= 0) {
        weightKg = 1;
    }

    const grams = Math.round(weightKg * 1000);

    if (grams < 1000) {
        return grams + ' ગ્રામ';
    }

    if (weightKg === 1) {
        return '1 કિલો';
    }

    // Remove unnecessary decimal
    const clean =
        Number(weightKg.toFixed(2));

    return clean + ' કિલો';
}


// ============================================================
// ADD TO CART
// ============================================================

function addToCart(productId, weightKg = 1, qty = 1) {

    try {

        // ------------------------------------------------------
        // Product
        // ------------------------------------------------------

        const product =
            getPSMProduct(productId);

        if (!product) {

            console.error(
                'Product not found:',
                productId
            );

            alert(
                'Product મળી શક્યું નથી. Page refresh કરો અને ફરી પ્રયાસ કરો.'
            );

            return false;
        }


        // ------------------------------------------------------
        // Weight
        // ------------------------------------------------------

        weightKg = Number(weightKg);

        if (
            !isFinite(weightKg) ||
            weightKg <= 0
        ) {
            weightKg = 1;
        }


        // ------------------------------------------------------
        // Quantity
        // ------------------------------------------------------

        qty = Number(qty);

        if (
            !isFinite(qty) ||
            qty <= 0
        ) {
            qty = 1;
        }

        qty = Math.floor(qty);


        // ------------------------------------------------------
        // Base price
        // ------------------------------------------------------

        let basePrice = Number(
            product.basePrice ??
            product.price ??
            product.base_price ??
            product.pricePerKg ??
            product.price_per_kg ??
            0
        );


        if (
            !isFinite(basePrice) ||
            basePrice < 0
        ) {
            basePrice = 0;
        }


        // ------------------------------------------------------
        // Product names
        // ------------------------------------------------------

        const nameGu =
            product.nameGu ??
            product.name_gu ??
            product.name ??
            product.title ??
            'ઉત્પાદન';

        const nameEn =
            product.nameEn ??
            product.name_en ??
            product.name ??
            product.title ??
            'Product';


        // ------------------------------------------------------
        // Image
        // ------------------------------------------------------

        const image =
            product.img ||
            product.image ||
            product.imageUrl ||
            'images/product-toprapak.webp';


        // ------------------------------------------------------
        // Weight based price
        // ------------------------------------------------------

        const unitPrice =
            Math.round(
                basePrice * weightKg
            );


        // ------------------------------------------------------
        // Current cart
        // ------------------------------------------------------

        const cart =
            getPSMCart();


        // ------------------------------------------------------
        // Existing item
        // ------------------------------------------------------

        const existingIndex =
            cart.findIndex(function (item) {

                return (
                    String(item.productId) ===
                    String(productId)
                    &&
                    Math.abs(
                        Number(item.multiplier ?? item.weightKg ?? 1) -
                        weightKg
                    ) < 0.001
                );

            });


        // ------------------------------------------------------
        // Update existing item
        // ------------------------------------------------------

        if (existingIndex !== -1) {

            const item =
                cart[existingIndex];

            item.qty =
                Number(item.qty || item.quantity || 0) +
                qty;

            item.quantity =
                item.qty;

            item.price =
                Number(item.price || unitPrice);

            item.unitPrice =
                Number(item.unitPrice || unitPrice);

            item.unit_price =
                item.unitPrice;

            item.subtotal =
                item.unitPrice * item.qty;

            cart[existingIndex] =
                item;

        }


        // ------------------------------------------------------
        // Add new item
        // ------------------------------------------------------

        else {

            const weightLabel =
                getCartWeightLabel(weightKg);

            cart.push({

                id:
                    String(productId) +
                    '_' +
                    String(weightKg),

                productId:
                    String(productId),

                product_id:
                    String(productId),

                nameGu:
                    nameGu,

                name_gu:
                    nameGu,

                nameEn:
                    nameEn,

                name_en:
                    nameEn,

                weightKey:
                    weightKg === 0.25 ? '250g' :
                    weightKg === 0.5 ? '500g' :
                    weightKg === 0.75 ? '750g' :
                    weightKg === 1 ? '1kg' :
                    weightKg === 1.25 ? '1.25kg' :
                    weightKg === 1.5 ? '1.5kg' :
                    weightKg === 2 ? '2kg' :
                    String(weightKg) + 'kg',

                weightKg:
                    weightKg,

                weight_kg:
                    weightKg,

                multiplier:
                    weightKg,

                weightLabel:
                    weightLabel,

                weight_label:
                    weightLabel,

                weightLabelGu:
                    weightLabel,

                weightLabelEn:
                    weightKg + ' kg',

                basePrice:
                    basePrice,

                price:
                    unitPrice,

                unitPrice:
                    unitPrice,

                unit_price:
                    unitPrice,

                qty:
                    qty,

                quantity:
                    qty,

                subtotal:
                    unitPrice * qty,

                img:
                    image

            });

        }


        // ------------------------------------------------------
        // SAVE
        // ------------------------------------------------------

        savePSMCart(cart);


        // ------------------------------------------------------
        // Existing website cart variable
        // ------------------------------------------------------

        if (typeof window.cart !== 'undefined') {
            window.cart = cart;
        }


        // ------------------------------------------------------
        // Existing cart UI
        // ------------------------------------------------------

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


        updateCartCount();


        // ------------------------------------------------------
        // Button animation
        // ------------------------------------------------------

        const addButton =
            document.getElementById(
                'btn-add-' + productId
            );

        if (addButton) {

            const oldHTML =
                addButton.innerHTML;

            addButton.innerHTML =
                '✓ <span class="gu-text">કાર્ટમાં ઉમેર્યું</span>' +
                '<span class="en-text" style="display:none">Added</span>';

            addButton.classList.add(
                'added'
            );

            setTimeout(function () {

                addButton.innerHTML =
                    oldHTML;

                addButton.classList.remove(
                    'added'
                );

                if (
                    typeof applyLang ===
                    'function'
                ) {
                    applyLang(
                        typeof currentLang !== 'undefined'
                            ? currentLang
                            : 'gu'
                    );
                }

            }, 1200);
        }


        // ------------------------------------------------------
        // Toast
        // ------------------------------------------------------

        if (
            typeof showToast ===
            'function'
        ) {

            showToast(
                '✓ <strong>' +
                escapeCartHTML(nameGu) +
                '</strong> કાર્ટમાં ઉમેરાયું.'
            );

        }


        console.log(
            'ADD TO CART SUCCESS:',
            cart
        );


        return true;

    } catch (error) {

        console.error(
            'ADD TO CART ERROR:',
            error
        );

        alert(
            'Cartમાં product add કરવામાં error આવ્યો.'
        );

        return false;
    }
}


// ============================================================
// EXISTING WEBSITE FUNCTION
// IMPORTANT:
// index.html માં onclick="addCurrentProductToCart(...)"
// છે, એટલે આ function જરૂરી છે.
// ============================================================

function addCurrentProductToCart(productId) {

    try {

        const product =
            getPSMProduct(productId);

        if (!product) {

            alert(
                'Product મળી શક્યું નથી.'
            );

            return false;
        }


        // Existing selected weight system
        let selected = null;

        if (
            typeof selectedWeights !==
            'undefined' &&
            selectedWeights &&
            selectedWeights[productId]
        ) {

            selected =
                selectedWeights[productId];

        }


        // Default 1kg
        let weightKg =
            selected &&
            Number(selected.multiplier) > 0
                ? Number(selected.multiplier)
                : 1;


        // Add
        return addToCart(
            productId,
            weightKg,
            1
        );

    } catch (error) {

        console.error(
            'addCurrentProductToCart error:',
            error
        );

        return false;
    }
}


// ============================================================
// CART COUNT
// ============================================================

function updateCartCount() {

    const cart =
        getPSMCart();

    const count =
        cart.reduce(function (
            total,
            item
        ) {

            return total +
                Number(
                    item.qty ??
                    item.quantity ??
                    0
                );

        }, 0);


    // Main cart badge
    const cartBadge =
        document.getElementById(
            'cart-badge'
        );

    if (cartBadge) {
        cartBadge.textContent =
            count;
    }


    // Mobile badge
    const mobileBadge =
        document.getElementById(
            'mobile-cart-badge'
        );

    if (mobileBadge) {
        mobileBadge.textContent =
            count;
    }


    // Floating cart
    const floatingCount =
        document.getElementById(
            'cart-floating-count'
        );

    if (floatingCount) {
        floatingCount.textContent =
            count;
    }


    const floatingBar =
        document.getElementById(
            'cart-floating-bar'
        );

    if (floatingBar) {

        floatingBar.style.display =
            count > 0
                ? ''
                : 'none';
    }


    // Generic counters
    document
        .querySelectorAll(
            '#cart-count,' +
            '#cart-item-count,' +
            '.cart-count,' +
            '.cart-badge'
        )
        .forEach(function (element) {

            element.textContent =
                count;

        });


    return count;
}


// ============================================================
// CART TOTAL
// ============================================================

function getCartTotal() {

    const cart =
        getPSMCart();

    return cart.reduce(
        function (
            total,
            item
        ) {

            const qty =
                Number(
                    item.qty ??
                    item.quantity ??
                    1
                );

            const price =
                Number(
                    item.price ??
                    item.unitPrice ??
                    item.unit_price ??
                    0
                );

            return total +
                price * qty;

        },
        0
    );
}


// ============================================================
// CART UI
// ============================================================

function updateCartUI() {

    updateCartCount();


    // Existing website renderer
    if (
        typeof renderCartBody ===
        'function'
    ) {

        try {

            renderCartBody();

        } catch (error) {

            console.warn(
                'renderCartBody error:',
                error
            );

        }
    }


    if (
        typeof updateCartBadges ===
        'function'
    ) {

        try {

            updateCartBadges();

        } catch (error) {

            console.warn(
                'updateCartBadges error:',
                error
            );

        }
    }

}


// ============================================================
// REMOVE CART ITEM
// ============================================================

function removeFromCart(index) {

    try {

        const cart =
            getPSMCart();

        if (
            index < 0 ||
            index >= cart.length
        ) {
            return;
        }


        cart.splice(
            index,
            1
        );


        savePSMCart(
            cart
        );


        if (
            typeof showToast ===
            'function'
        ) {

            showToast(
                'કાર્ટમાંથી વસ્તુ દૂર થઈ ગઈ.'
            );

        }

    } catch (error) {

        console.error(
            'Remove cart error:',
            error
        );

    }
}


// ============================================================
// UPDATE CART QUANTITY
// ============================================================

function updateCartQty(index, change) {

    try {

        const cart =
            getPSMCart();

        if (
            index < 0 ||
            index >= cart.length
        ) {
            return;
        }


        const item =
            cart[index];


        let qty =
            Number(
                item.qty ||
                item.quantity ||
                1
            );


        qty += Number(change);


        // Minimum 1
        if (qty < 1) {
            qty = 1;
        }


        item.qty =
            qty;

        item.quantity =
            qty;


        const price =
            Number(
                item.price ||
                item.unitPrice ||
                0
            );


        item.subtotal =
            price * qty;


        cart[index] =
            item;


        savePSMCart(
            cart
        );


    } catch (error) {

        console.error(
            'Update quantity error:',
            error
        );

    }
}


// ============================================================
// CLEAR CART
// ============================================================

function clearCart() {

    try {

        localStorage.removeItem(
            PSM_CART_KEY
        );


        if (
            typeof window.cart !==
            'undefined'
        ) {
            window.cart = [];
        }


        updateCartUI();


        console.log(
            'Cart cleared.'
        );

    } catch (error) {

        console.error(
            'Clear cart error:',
            error
        );

    }
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeCartHTML(value) {

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


// ============================================================
// LOAD CART ON WEBSITE START
// ============================================================

function initFixedCartSystem() {

    try {

        const cart =
            getPSMCart();


        // Sync global cart
        if (
            typeof window.cart !==
            'undefined'
        ) {

            window.cart =
                cart;

        }


        updateCartCount();


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

    } catch (error) {

        console.error(
            'Cart initialization error:',
            error
        );

    }

}


// ============================================================
// DOM READY
// ============================================================

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


// ============================================================
// STORAGE SYNC
// ============================================================

window.addEventListener(
    'storage',
    function (event) {

        if (
            event.key ===
            PSM_CART_KEY
        ) {

            updateCartCount();

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

    }
);
