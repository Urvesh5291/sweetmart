// Form switch karva mate nu function
function showForm(formId) {
    const containers = document.querySelectorAll('.form-container');
    containers.forEach(container => container.classList.remove('active'));
    document.getElementById(formId).classList.add('active');
}

// 1. SIGNUP LOGIC
function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signup-user').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-pass').value;
    const msg = document.getElementById('signup-msg');

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check jo email pela thi registered hoy to
    const existingUser = users.find(u => u.email === email);
    if(existingUser) {
        msg.style.color = "red";
        msg.innerText = "Aa email already registered che!";
        return;
    }

    // New user save karo
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));

    msg.style.color = "green";
    msg.innerText = "Signup successful! Have login karo.";
    setTimeout(() => {
        showForm('login-form');
        msg.innerText = "";
    }, 1500);
}

// 2. LOGIN LOGIC
function handleLogin(e) {
    e.preventDefault();
    const userInput = document.getElementById('login-user').value;
    const passInput = document.getElementById('login-pass').value;
    const msg = document.getElementById('login-msg');

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(u => (u.username === userInput || u.email === userInput) && u.password === passInput);

    if(user) {
        localStorage.setItem('loggedInUser', user.username);
        loadDashboard(user.username);
    } else {
        msg.style.color = "red";
        msg.innerText = "Username ya Password khoto che!";
    }
}

// 3. FORGET PASSWORD LOGIC
function handleForgot(e) {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const newPass = document.getElementById('new-pass').value;
    const msg = document.getElementById('forgot-msg');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.email === email);

    if(userIndex !== -1) {
        users[userIndex].password = newPass;
        localStorage.setItem('users', JSON.stringify(users));
        msg.style.color = "green";
        msg.innerText = "Password successfully update thai gayo!";
        setTimeout(() => {
            showForm('login-form');
            msg.innerText = "";
        }, 1500);
    } else {
        msg.style.color = "red";
        msg.innerText = "Aa email malyo nahi!";
    }
}

// 4. DASHBOARD & LOGOUT LOGIC
function loadDashboard(username) {
    const containers = document.querySelectorAll('.form-container');
    containers.forEach(container => container.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('user-display').innerText = username;
}

function handleLogout() {
    localStorage.removeItem('loggedInUser');
    showForm('login-form');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
}

// Page load thay tyare check karvu ke user already login to nathi ne?
window.onload = function() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if(loggedInUser) {
        loadDashboard(loggedInUser);
    }
}
