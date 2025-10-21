// ==========================================
// TradePro Platform - JavaScript
// ==========================================

// Smooth Scrolling for Navigation
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const sectionTop = section.offsetTop - navHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Copy Script to Clipboard
function copyScript() {
    const scriptCode = document.getElementById('scriptCode');
    const text = scriptCode.textContent;
    
    // Use the Clipboard API
    navigator.clipboard.writeText(text).then(() => {
        showNotification();
    }).catch(err => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification();
        } catch (err) {
            alert('Failed to copy script. Please try selecting and copying manually.');
        }
        
        document.body.removeChild(textArea);
    });
}

// Show Copy Notification
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Active Navigation Link Handler
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Navbar Scroll Effect
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Intersection Observer for Fade-in Animations
function initObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe ToS cards
    const tosCards = document.querySelectorAll('.tos-card');
    tosCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe info cards
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Handle Navigation Clicks
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Parallax Effect for Hero Section
function handleParallax() {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroStats = document.querySelector('.hero-stats');
    
    if (heroContent && heroStats) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroStats.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
}

// Add Hover Effect to Buttons
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                width: 100px;
                height: 100px;
                margin-top: -50px;
                margin-left: -50px;
                animation: ripple 0.6s;
                pointer-events: none;
            `;
            
            const rect = button.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Stats Counter Animation
function animateStats() {
    const statCards = document.querySelectorAll('.stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statCard = entry.target;
                statCard.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(statCard);
            }
        });
    }, { threshold: 0.5 });
    
    statCards.forEach(card => {
        observer.observe(card);
    });
}

// Add Typing Effect to Hero Title (Optional Enhancement)
function addTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let index = 0;
        const typingSpeed = 50;
        
        function type() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            }
        }
        
        // Uncomment to enable typing effect
        // setTimeout(type, 500);
    }
}

// Preload Images and Assets
function preloadAssets() {
    // Add any image preloading here if needed
    console.log('Assets loaded');
}

// Handle Window Resize
function handleResize() {
    // Add any resize-specific logic here
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile specific adjustments
        console.log('Mobile view active');
    }
}

// Add Easter Egg (Konami Code)
function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 3s linear infinite';
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 3000);
}

// Performance Monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
        });
    }
}

// Initialize All Features
function init() {
    // Core functionality
    setupNavigation();
    initObserver();
    animateStats();
    initButtonEffects();
    
    // Optional features
    initEasterEgg();
    preloadAssets();
    initPerformanceMonitoring();
    
    // Event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        handleNavbarScroll();
        handleParallax();
    });
    
    window.addEventListener('resize', handleResize);
    
    // Log initialization
    console.log('%c🎮 TradePro Platform Loaded', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cVersion 1.0.0', 'color: #8b5cf6; font-size: 14px;');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export functions for global access (if needed)
window.TradePro = {
    scrollToSection,
    copyScript,
    showNotification
};
