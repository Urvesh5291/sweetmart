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
