let cart = JSON.parse(localStorage.getItem('sweetmart_cart')) || [];
let currentLang = localStorage.getItem('sweetmart_lang') || 'gu';

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    applyLanguage();
});

// Custom Add to Cart with dynamic weight selection
function addCustomToCart(itemName, basePricePerKg, selectId) {
    let selectElement = document.getElementById(selectId);
    let selectedWeight = selectElement.value;
    
    let finalPrice = basePricePerKg;
    if (selectedWeight === '500g') {
        finalPrice = basePricePerKg / 2;
    } else if (selectedWeight === '250g') {
        finalPrice = basePricePerKg / 4;
    }

    let existingItem = cart.find(item => item.name === itemName && item.weight === selectedWeight);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: Math.round(finalPrice),
            weight: selectedWeight,
            quantity: 1
        });
    }

    localStorage.setItem('sweetmart_cart', JSON.stringify(cart));
    updateCartUI();
    
    alert(itemName + " (" + selectedWeight + ") Cart ma add thai gayo!");
}

// Update Cart Count UI
function updateCartUI() {
    let cartCountElement = document.getElementById('cart-count');
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// Language Switcher Function (Gujarati / English)
function toggleLanguage() {
    currentLang = currentLang === 'gu' ? 'en' : 'gu';
    localStorage.setItem('sweetmart_lang', currentLang);
    applyLanguage();
}

function applyLanguage() {
    const htmlRoot = document.getElementById('html-root');
    const storeTitle = document.getElementById('store-title');
    const secHeading = document.getElementById('sec-heading');
    const p1Name = document.querySelector('.p1-name');
    const p2Name = document.querySelector('.p2-name');

    htmlRoot.setAttribute('lang', currentLang);

    if (currentLang === 'en') {
        if(storeTitle) storeTitle.innerText = "Patel Sweet Mart";
        if(secHeading) secHeading.innerText = "Products / Items";
        if(p1Name) p1Name.innerText = "Toprapak";
        if(p2Name) p2Name.innerText = "Namkin Sev";
    } else {
        if(storeTitle) storeTitle.innerText = "પટેલ સ્વીટ માર્ટ";
        if(secHeading) secHeading.innerText = "વસ્તુઓ (Products)";
        if(p1Name) p1Name.innerText = "ટોપરાપાક (Toprapak)";
        if(p2Name) p2Name.innerText = "તીખી સેવ (Namkin Sev)";
    }
}
