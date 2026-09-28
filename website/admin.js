document.addEventListener("DOMContentLoaded", () => {
    const ordersContainer = document.getElementById("orders-container"); // Tamaru HTML container ID je admin.html ma che
    
    if (ordersContainer) {
        db.collection("orders").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            ordersContainer.innerHTML = "";
            if (snapshot.empty) {
                ordersContainer.innerHTML = "<p>Hajie koi order nathi.</p>";
                return;
            }
            
            snapshot.forEach((doc) => {
                const order = doc.data();
                const orderId = doc.id;
                
                let itemsList = "";
                if(order.items && Array.isArray(order.items)) {
                    itemsList = order.items.map(item => `<li>${item.name} (x${item.quantity}) - ₹${item.price}</li>`).join("");
                }

                const card = document.createElement("div");
                card.className = "order-card";
                card.style.cssText = "background: #fff; padding: 15px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); border-left: 4px solid #ff4757;";
                card.innerHTML = `
                    <h4>Order ID: ${orderId}</h4>
                    <p><b>Grahak nu Naam:</b> ${order.name}</p>
                    <p><b>Phone Number:</b> ${order.phone}</p>
                    <p><b>Sarunamaanu:</b> ${order.address}</p>
                    <p><b>Items:</b><ul>${itemsList}</ul></p>
                    <p><b>Kul Rakkam:</b> ₹${order.total}</p>
                    <p><b>Status:</b> <span style="color: orange; font-weight: bold;">${order.status}</span></p>
                `;
                ordersContainer.appendChild(card);
            });
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("login-modal");
    const adminDashboard = document.getElementById("admin-dashboard");
    const loginForm = document.getElementById("admin-login-form");
    const logoutBtn = document.getElementById("logout-btn");

    // Check if owner is already logged in
    if (localStorage.getItem("isOwnerLoggedIn") === "true") {
        loginModal.style.display = "none";
        adminDashboard.style.display = "block";
        loadOrders();
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userInput = document.getElementById("admin-user").value;
        const passInput = document.getElementById("admin-pass").value;

        // Tamaro secret username ane password ahiya check thase
        if (userInput === "admin@patelsweetmart.com" && passInput === "patel1995") {
            localStorage.setItem("isOwnerLoggedIn", "true");
            loginModal.style.display = "none";
            adminDashboard.style.display = "block";
            loadOrders();
        } else {
            alert("ખોટો પાસવર્ડ અથવા યુઝરનેમ છે!");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isOwnerLoggedIn");
        location.reload();
    });
});

function loadOrders() {
    const ordersList = document.getElementById("orders-list");
    const savedOrders = JSON.parse(localStorage.getItem("customerOrders")) || [];

    if (savedOrders.length === 0) {
        ordersList.innerHTML = "<p>હાલમાં કોઈ નવા ઓર્ડર નથી.</p>";
        return;
    }

    ordersList.innerHTML = "";
    savedOrders.forEach((order, index) => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-card";
        orderCard.innerHTML = `
            <p><strong>ઓર્ડર #${index + 1}</strong></p>
            <p>નામ: ${order.name}</p>
            <p>મોબાઈલ: ${order.phone}</p>
            <p>સરનામું: ${order.address}</p>
            <p>આઈટમ: ${order.items}</p>
            <hr>
        `;
        ordersList.appendChild(orderCard);
    });
}
