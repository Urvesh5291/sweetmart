// Cart array banavo (LocalStorage mathi data load karse jethi page refresh thaya pachi pan cart gayab na thay)
let cart = JSON.parse(localStorage.getItem('sweetmart_cart')) || [];

// Add to Cart function
function addToCart(itemName, itemPrice, itemWeight = "1kg") {
    // Check karo ke same item cart ma already che ke nahi
    let existingItem = cart.find(item => item.name === itemName && item.weight === itemWeight);
    
    if (existingItem) {
        existingItem.quantity += 1; // Jo item hoy to quantity vadharo
    } else {
        // Navu item add karo
        cart.push({
            name: itemName,
            price: Number(itemPrice),
            weight: itemWeight,
            quantity: 1
        });
    }

    // LocalStorage ma save karo
    saveCart();
    
    // UI update karo ane user ne message apo
    updateCartUI();
    alert(itemName + " (" + itemWeight + ") Cart ma add thai gayo che!");
}

// Cart ne LocalStorage ma save karvani function
function saveCart() {
    localStorage.setItem('sweetmart_cart', JSON.stringify(cart));
}

// Cart UI (Count ane Total) update karva mate
function updateCartUI() {
    let cartCountElement = document.getElementById('cart-count'); // Tamara HTML ma cart ni badge id
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }
}

// Page load thay tyare cart count batavva mate
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
