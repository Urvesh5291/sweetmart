// Firebase Configuration (Tame potani key muki sako cho, ahiya dummy config che)
const firebaseConfig = {
    apiKey: "TAMARI_API_KEY",
    authDomain: "TAMARI_AUTH_DOMAIN",
    projectId: "TAMARI_PROJECT_ID",
    storageBucket: "TAMARI_STORAGE_BUCKET",
    messagingSenderId: "TAMARI_MESSAGING_SENDER_ID",
    appId: "TAMARI_APP_ID"
};

// Initialize Firebase safely
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Cart Array initialization from LocalStorage
let cart = JSON.parse(localStorage.getItem('sweetmart_cart')) || [];

// Add to Cart Function
function addToCart(itemName, itemPrice, itemWeight) {
    let existingItem = cart.find(item => item.name === itemName && item.weight === itemWeight);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: Number(itemPrice),
            weight: itemWeight,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    alert(itemName + " (" + itemWeight + ") Cart ma add thai gayo che!");
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('sweetmart_cart', JSON.stringify(cart));
}

// Update Cart UI & Total
function updateCartUI() {
    let cartCountElement = document.getElementById('cart-count');
    let cartItemsList = document.getElementById('cart-items-list');
    let cartTotalElement = document.getElementById('cart-total');

    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.innerText = totalItems;
    }

    if (cartItemsList && cartTotalElement) {
        cartItemsList.innerHTML = "";
        let grandTotal = 0;

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            grandTotal += itemTotal;

            let li = document.createElement('li');
            li.innerHTML = `${item.name} (${item.weight}) - ₹${item.price} x ${item.quantity} = ₹${itemTotal} 
                            <button onclick="removeItem(${index})" style="color:red; margin-left:10px;">X</button>`;
            cartItemsList.appendChild(li);
        });

        cartTotalElement.innerText = grandTotal;
    }
}

// Remove Item from Cart
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

// Checkout and send via WhatsApp & Firebase
function checkoutOrder() {
    if (cart.length === 0) {
        alert("Tamaru cart khali che!");
        return;
    }

    let name = document.getElementById('cust-name').value;
    let phone = document.getElementById('cust-phone').value;
    let address = document.getElementById('cust-address').value;

    if (!name || !phone || !address) {
        alert("Krupa kari badhi details (Naam, Phone, Sarnamu) bharo!");
        return;
    }

    let grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let orderId = "#PSM-" + Math.floor(1000 + Math.random() * 9000);

    // Save to Firebase Database (Admin Panel mate)
    db.collection("orders").add({
        orderId: orderId,
        name: name,
        phone: phone,
        address: address,
        items: cart,
        total: grandTotal,
        status: "New",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        // Prepare WhatsApp Message
        let message = `*🛍️ પટેલ સ્વીટ માર્ટ — નવો ઓર્ડર / NEW ORDER*%0A`;
        message += `━━━━━━━━━━━━━━━━━━━━━%0A`;
        message += `*Order ID:* ${orderId}%0A`;
        message += `*Naam:* ${name}%0A`;
        message += `*Phone:* ${phone}%0A`;
        message += `*Sarnamu:* ${address}%0A`;
        message += `━━━━━━━━━━━━━━━━━━━━━%0A`;
        
        cart.forEach((item, i) => {
            message += `${i+1}. *${item.name}* - ${item.weight} | Qty: ${item.quantity} = ₹${item.price * item.quantity}%0A`;
        });
        
        message += `━━━━━━━━━━━━━━━━━━━━━%0A`;
        message += `*Grand Total:* ₹${grandTotal}%0A`;

        // Clear Cart
        cart = [];
        saveCart();
        updateCartUI();

        // Redirect to WhatsApp (Replace with your WhatsApp Number)
        let whatsappUrl = `https://wa.me/919601700812?text=${message}`;
        window.location.href = whatsappUrl;

    }).catch((error) => {
        console.error("Order save thavama bhool: ", error);
        alert("Order place thavama error aavi.");
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
