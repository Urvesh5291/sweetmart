// Cart and Language Initialization
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLang = localStorage.getItem('selectedLang') || 'gu';

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
    updateCartCount();
});

// Language Toggle Function
function toggleLanguage() {
    currentLang = currentLang === 'gu' ? 'en' : 'gu';
    localStorage.setItem('selectedLang', currentLang);
    applyLanguage(currentLang);
}

// Apply Language to Elements
function applyLanguage(lang) {
    document.querySelectorAll('[data-en]').forEach(element => {
        if (lang === 'gu') {
            if(element.getAttribute('data-gu')) {
                element.innerText = element.getAttribute('data-gu');
            }
        } else {
            if(element.getAttribute('data-en')) {
                element.innerText = element.getAttribute('data-en');
            }
        }
    });
}

// Add to Cart with Dynamic Weight & Price Calculation
function addCustomToCart(productName, basePrice, selectId) {
    let selectElement = document.getElementById(selectId);
    let selectedValue = selectElement ? selectElement.value : '1kg';
    
    let finalPrice = basePrice;
    let weightLabel = '1 kg';

    if (selectedValue === '500g') {
        finalPrice = basePrice / 2;
        weightLabel = '500 g';
    } else if (selectedValue === '250g') {
        finalPrice = basePrice / 4;
        weightLabel = '250 g';
    }

    let itemFullName = `${productName} (${weightLabel})`;
    let existingItem = cart.find(item => item.name === itemFullName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemFullName, price: finalPrice, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Item Cart ma add thai gai che! 🛒");
}

// Update Cart Badge Count
function updateCartCount() {
    let cartCount = document.getElementById('cart-count');
    if (cartCount) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }
                   }
