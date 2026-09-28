// Cart Array initialization from LocalStorage
let cart = JSON.parse(localStorage.getItem('sweetmart_cart')) || [];

// Page load thaya pachi badha add-to-cart button par listener lagavo
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Badha "Add to Cart" button par click event set karo
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            const price = Number(e.target.getAttribute('data-price'));
            const weight = e.target.getAttribute('data-weight');
            
            addToCart(name, price, weight);
        });
    });
});

// Add to Cart Logic
function addToCart(itemName, itemPrice, itemWeight) {
    let existingItem = cart.find(item => item.name === itemName && item.weight === itemWeight);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: itemPrice,
            weight: itemWeight,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    alert(itemName + " (" + itemWeight + ") Cart ma add thai gayo che!");
}

// Save to LocalStorage
function saveCart() {
    localStorage.setItem('sweetmart_cart', JSON.stringify(cart));
}

// Update UI
function updateCartUI() {
    let cartCountElement = document.getElementById('cart-count');
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}
