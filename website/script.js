// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId, productName, productPrice) {
    let existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert("Item added to cart successfully!");
}

function updateCartUI() {
    let cartCount = document.getElementById('cart-count');
    if (cartCount) {
        let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }
}

// Language translation handling
function changeLanguage(lang) {
    localStorage.setItem('selectedLang', lang);
    applyTranslations(lang);
}

function applyTranslations(lang) {
    document.querySelectorAll('[data-en]').forEach(element => {
        if (lang === 'gu') {
            element.innerText = element.getAttribute('data-gu');
        } else {
            element.innerText = element.getAttribute('data-en');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    let savedLang = localStorage.getItem('selectedLang') || 'en';
    applyTranslations(savedLang);
});
