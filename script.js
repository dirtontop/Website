const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const dashTabs = document.querySelectorAll('.dash-tab');
const dashContents = document.querySelectorAll('.dash-content');
const loginBtn = document.getElementById('loginBtn');
const loginMsg = document.getElementById('loginMsg');
const dashboard = document.getElementById('dashboard');
const navbar = document.getElementById('navbar');
const keyList = document.getElementById('keyList');
const generateKeyBtn = document.getElementById('generateKey');
const logoutBtn = document.getElementById('logoutBtn');
const accountMsg = document.getElementById('accountMsg');

let username = "Admin_KeyAcc";
let password = "dirthuborzexonhub121212123311";
let generatedKeys = JSON.parse(localStorage.getItem("keys")) || [];

// Tab navigation
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const target = tab.dataset.tab;

    tabContents.forEach(content => {
      content.classList.remove('active');
      if (content.id === target) content.classList.add('active');
    });
  });
});

// Copy buttons
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.copy);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = `Copy ${btn.dataset.copy}`), 1500);
  });
});

// Login
loginBtn.addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if (user === username && pass === password) {
    loginMsg.textContent = "Login successful!";
    setTimeout(() => {
      document.getElementById('login').classList.add('hidden');
      document.querySelector('[data-tab="login"]').remove();
      navbar.insertAdjacentHTML('beforeend', `<button class="tab-button" data-tab="dashboard">Dashboard</button>`);
      dashboard.classList.remove('hidden');
      showTab('dashboard');
      refreshKeys();
    }, 800);
  } else {
    loginMsg.textContent = "Invalid credentials.";
  }
});

function showTab(id) {
  tabContents.forEach(c => c.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Dashboard inner tabs
dashTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    dashTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    dashContents.forEach(c => c.classList.remove('active'));
    document.getElementById(tab.dataset.dash).classList.add('active');
  });
});

// Generate key
generateKeyBtn.addEventListener('click', () => {
  const key = generateKey();
  generatedKeys.push(key);
  localStorage.setItem("keys", JSON.stringify(generatedKeys));
  refreshKeys();
});

function generateKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) key += "-";
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function refreshKeys() {
  keyList.innerHTML = "";
  generatedKeys.forEach(k => {
    const li = document.createElement("li");
    li.textContent = k;
    keyList.appendChild(li);
  });
}

// Account updates
document.getElementById('updateAccount').addEventListener('click', () => {
  const newUser = document.getElementById('newUsername').value.trim();
  const newPass = document.getElementById('newPassword').value.trim();

  if (newUser) username = newUser;
  if (newPass) password = newPass;

  accountMsg.textContent = "Account updated successfully!";
  setTimeout(() => (accountMsg.textContent = ""), 2000);
});

// Logout
logoutBtn.addEventListener('click', () => {
  showTab('home');
  dashboard.classList.add('hidden');
  navbar.insertAdjacentHTML('beforeend', `<button class="tab-button" data-tab="login">Login</button>`);
});
