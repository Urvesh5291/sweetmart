// ============================================================
// ADD TO CART - FIXED VERSION
// ============================================================

function addToCart(productId, weightKg = 1, qty = 1) {

    try {

        // Cart load કરો
        let cart = [];

        try {
            const savedCart = localStorage.getItem("psm_cart");

            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    cart = parsedCart;
                }
            }
        } catch (error) {
            console.warn("Cart load error:", error);
            cart = [];
        }


        // Product શોધો
        let product = null;

        // allProducts array હોય તો
        if (typeof allProducts !== "undefined" && Array.isArray(allProducts)) {
            product = allProducts.find(function (p) {
                return String(p.id) === String(productId);
            });
        }

        // products array હોય તો
        if (!product && typeof products !== "undefined" && Array.isArray(products)) {
            product = products.find(function (p) {
                return String(p.id) === String(productId);
            });
        }

        // DEFAULT_PRODUCTS object હોય તો
        if (
            !product &&
            typeof DEFAULT_PRODUCTS !== "undefined" &&
            DEFAULT_PRODUCTS
        ) {
            product = DEFAULT_PRODUCTS[productId];

            if (!product) {
                product = Object.values(DEFAULT_PRODUCTS).find(function (p) {
                    return String(p.id) === String(productId);
                });
            }
        }


        // Product ન મળે તો
        if (!product) {
            console.error("Product not found:", productId);

            alert("Product મળી શક્યું નથી. Page refresh કરો અને ફરી પ્રયાસ કરો.");

            return false;
        }


        // Weight validate
        weightKg = Number(weightKg);

        if (!weightKg || weightKg <= 0) {
            weightKg = 1;
        }


        // Quantity validate
        qty = Number(qty);

        if (!qty || qty <= 0) {
            qty = 1;
        }


        // Product price શોધો
        let basePrice = Number(
            product.price ??
            product.basePrice ??
            product.base_price ??
            product.pricePerKg ??
            product.price_per_kg ??
            0
        );

        if (!basePrice || basePrice < 0) {
            basePrice = 0;
        }


        // Weight પ્રમાણે price
        let unitPrice = Math.round(basePrice * weightKg);


        // Product name
        const nameGu =
            product.nameGu ??
            product.name_gu ??
            product.name ??
            product.title ??
            "ઉત્પાદન";


        const nameEn =
            product.nameEn ??
            product.name_en ??
            product.name ??
            product.title ??
            "Product";


        // Existing cart item શોધો
        const existingIndex = cart.findIndex(function (item) {

            return (
                String(item.productId) === String(productId) &&
                Number(item.weightKg) === Number(weightKg)
            );

        });


        // Existing item હોય તો quantity વધારો
        if (existingIndex !== -1) {

            cart[existingIndex].qty =
                Number(cart[existingIndex].qty || 0) + qty;

            cart[existingIndex].quantity =
                cart[existingIndex].qty;

            cart[existingIndex].subtotal =
                Number(cart[existingIndex].unitPrice || unitPrice) *
                cart[existingIndex].qty;

        }

        // New item
        else {

            cart.push({

                id:
                    String(productId) +
                    "_" +
                    String(weightKg),

                productId: String(productId),

                product_id: String(productId),

                nameGu: nameGu,

                name_gu: nameGu,

                nameEn: nameEn,

                name_en: nameEn,

                weightKg: weightKg,

                weight_kg: weightKg,

                weightLabel:
                    getCartWeightLabel(weightKg),

                weight_label:
                    getCartWeightLabel(weightKg),

                qty: qty,

                quantity: qty,

                unitPrice: unitPrice,

                unit_price: unitPrice,

                subtotal: unitPrice * qty

            });

        }


        // LocalStorageમાં save
        localStorage.setItem(
            "psm_cart",
            JSON.stringify(cart)
        );


        // Global cart variable હોય તો update
        if (typeof window.cart !== "undefined") {
            window.cart = cart;
        }


        // Cart render
        updateCartUI();


        // Cart count
        updateCartCount();


        // Cart drawer open કરો જો function હોય
        if (typeof openCart === "function") {
            openCart();
        }

        else if (typeof toggleCart === "function") {
            toggleCart(true);
        }


        console.log("Cart updated:", cart);

        return true;

    } catch (error) {

        console.error(
            "ADD TO CART ERROR:",
            error
        );

        alert(
            "Cartમાં product add કરવામાં error આવ્યો. Browser console check કરો."
        );

        return false;
    }
}


// ============================================================
// WEIGHT LABEL
// ============================================================

function getCartWeightLabel(weightKg) {

    weightKg = Number(weightKg);

    if (weightKg === 0.25) {
        return "250 ગ્રામ";
    }

    if (weightKg === 0.5) {
        return "500 ગ્રામ";
    }

    if (weightKg === 0.75) {
        return "750 ગ્રામ";
    }

    if (weightKg === 1) {
        return "1 કિલો";
    }

    if (weightKg === 1.25) {
        return "1.25 કિલો";
    }

    if (weightKg === 1.5) {
        return "1.5 કિલો";
    }

    if (weightKg === 2) {
        return "2 કિલો";
    }

    return weightKg + " કિલો";
}


// ============================================================
// CART COUNT
// ============================================================

function updateCartCount() {

    let cart = [];

    try {

        const saved = localStorage.getItem("psm_cart");

        if (saved) {
            cart = JSON.parse(saved);
        }

    } catch (error) {
        cart = [];
    }


    if (!Array.isArray(cart)) {
        cart = [];
    }


    const count = cart.reduce(function (total, item) {

        return total + Number(
            item.qty ??
            item.quantity ??
            0
        );

    }, 0);


    // બધા common cart count IDs
    const selectors = [
        "#cart-count",
        "#cart-badge",
        "#cart-item-count",
        ".cart-count",
        ".cart-badge"
    ];


    selectors.forEach(function (selector) {

        document
            .querySelectorAll(selector)
            .forEach(function (element) {

                element.textContent = count;

                element.style.display =
                    count > 0 ? "" : "none";

            });

    });


    return count;
}


// ============================================================
// CART UI UPDATE
// ============================================================

function updateCartUI() {

    // Existing project function હોય તો તેનો ઉપયોગ કરો
    if (typeof renderCart === "function") {

        try {
            renderCart();
        } catch (error) {
            console.warn(
                "renderCart error:",
                error
            );
        }

    }


    if (typeof updateCart === "function") {

        try {
            updateCart();
        } catch (error) {
            console.warn(
                "updateCart error:",
                error
            );
        }

    }


    updateCartCount();

    // Custom cart renderer
    const cartContainer =
        document.querySelector("#cart-items");

    if (!cartContainer) {
        return;
    }


    let cart = [];

    try {

        const saved =
            localStorage.getItem("psm_cart");

        if (saved) {
            cart = JSON.parse(saved);
        }

    } catch (error) {
        cart = [];
    }


    if (!Array.isArray(cart)) {
        cart = [];
    }


    if (cart.length === 0) {

        cartContainer.innerHTML =
            '<div class="empty-cart">તમારો કાર્ટ ખાલી છે.</div>';

        return;
    }


    cartContainer.innerHTML =
        cart.map(function (item, index) {

            const name =
                item.nameGu ||
                item.name_gu ||
                item.nameEn ||
                "Product";

            const weight =
                item.weightLabel ||
                item.weight_label ||
                getCartWeightLabel(item.weightKg);

            const qty =
                Number(item.qty || item.quantity || 1);

            const subtotal =
                Number(
                    item.subtotal ||
                    (
                        Number(item.unitPrice || 0) *
                        qty
                    )
                );


            return `
                <div class="cart-item">

                    <div class="cart-item-info">

                        <strong>
                            ${escapeCartHTML(name)}
                        </strong>

                        <small>
                            ${escapeCartHTML(weight)}
                        </small>

                    </div>

                    <div class="cart-item-qty">
                        ${qty}
                    </div>

                    <div class="cart-item-price">
                        ₹${subtotal.toLocaleString("en-IN")}
                    </div>

                    <button
                        type="button"
                        onclick="removeFromCart(${index})"
                        class="cart-remove-btn"
                    >
                        ×
                    </button>

                </div>
            `;

        }).join("");

}


// ============================================================
// REMOVE FROM CART
// ============================================================

function removeFromCart(index) {

    let cart = [];

    try {

        const saved =
            localStorage.getItem("psm_cart");

        if (saved) {
            cart = JSON.parse(saved);
        }

    } catch (error) {
        cart = [];
    }


    if (!Array.isArray(cart)) {
        cart = [];
    }


    cart.splice(index, 1);


    localStorage.setItem(
        "psm_cart",
        JSON.stringify(cart)
    );


    updateCartUI();

    updateCartCount();

}


// ============================================================
// CLEAR CART
// ============================================================

function clearCart() {

    localStorage.removeItem("psm_cart");

    if (typeof window.cart !== "undefined") {
        window.cart = [];
    }

    updateCartUI();

    updateCartCount();

}


// ============================================================
// HTML SAFETY
// ============================================================

function escapeCartHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ============================================================
// LOAD CART WHEN WEBSITE OPENS
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateCartUI();

    }
);
