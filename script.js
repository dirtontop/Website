/* === NAVIGATION & SCROLL === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

/* === NOTIFICATIONS SYSTEM === */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-area');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = 'fa-circle-info';
    if(type === 'success') icon = 'fa-check';
    if(type === 'error') icon = 'fa-xmark';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* === LOGIN MODAL === */
const loginModal = document.getElementById('login-modal');

function openLogin() {
    loginModal.classList.add('active');
}

function closeLogin() {
    loginModal.classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === loginModal) {
        closeLogin();
    }
    if (event.target === document.getElementById('legal-modal')) {
        closeLegal();
    }
}

/* === FAKE DASHBOARD LOGIC === */
function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    
    // Fake loading state
    btn.innerText = "Authenticating...";
    btn.disabled = true;

    setTimeout(() => {
        closeLogin();
        document.getElementById('dashboard-overlay').style.display = 'flex';
        showNotification('Logged in successfully', 'success');
        btn.innerText = originalText;
        btn.disabled = false;
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }, 1500);
}

function logout() {
    document.getElementById('dashboard-overlay').style.display = 'none';
    document.body.style.overflow = 'auto';
    showNotification('Logged out', 'info');
}

/* === DASHBOARD FUNCTIONS === */
function copyKey() {
    const keyText = document.getElementById('user-key').innerText;
    navigator.clipboard.writeText(keyText).then(() => {
        showNotification('Script Key copied to clipboard!', 'success');
    }).catch(err => {
        showNotification('Failed to copy', 'error');
    });
}

function startDownload() {
    const btn = document.querySelector('.download-section button');
    btn.disabled = true;
    btn.innerText = "Downloading...";
    
    setTimeout(() => {
        btn.innerText = "Download Complete";
        showNotification('Zexon Client downloaded', 'success');
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "Download v1.2";
        }, 3000);
    }, 2000);
}

/* === LEGAL TEXT GENERATOR === */
const legalModal = document.getElementById('legal-modal');
const legalTitle = document.getElementById('legal-title');
const legalContent = document.getElementById('legal-content');

const legalTexts = {
    tos: `
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing Zexon Development tools, you agree to be bound by these Terms of Service.</p>
        <h3>2. Usage License</h3>
        <p>Permission is granted to temporarily download one copy of the materials (information or software) on Zexon's website for personal, non-commercial transitory viewing only.</p>
        <h3>3. Restrictions</h3>
        <p>You may not attempt to reverse engineer any software contained on Zexon Development's website.</p>
    `,
    privacy: `
        <h3>1. Information Collection</h3>
        <p>We collect standard log data and authentication cookies to maintain your session.</p>
        <h3>2. Data Security</h3>
        <p>Zexon uses industry-standard encryption to protect your script keys and account data.</p>
    `,
    copyright: `
        <h3>Copyright © 2026 Zexon Development</h3>
        <p>All rights reserved. The Zexon Client and Lua Obfuscator are intellectual property of Zexon Development.</p>
    `
};

function openLegal(type) {
    legalModal.classList.add('active');
    if (type === 'tos') {
        legalTitle.innerText = "Terms of Service";
        legalContent.innerHTML = legalTexts.tos;
    } else if (type === 'privacy') {
        legalTitle.innerText = "Privacy Policy";
        legalContent.innerHTML = legalTexts.privacy;
    } else {
        legalTitle.innerText = "Copyright";
        legalContent.innerHTML = legalTexts.copyright;
    }
}

function closeLegal() {
    legalModal.classList.remove('active');
}
