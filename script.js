// BlackRaven AI - Ultra Modern Interactive Experience
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initFloatingNavigation();
    initHeroAnimations();
    initScrollAnimations();
    initCounters();
    initParticleSystem();
    initMobileMenu();
    initFormValidation();
    initSmoothScrolling();
    initParallaxEffects();
    initCursorEffects();
});

// ========================================
// FLOATING NAVIGATION
// ========================================

function initFloatingNavigation() {
    const nav = document.querySelector('.floating-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect with blur
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav.style.background = 'rgba(0, 0, 0, 0.95)';
            nav.style.backdropFilter = 'blur(25px)';
            nav.style.borderBottom = '1px solid rgba(0, 212, 255, 0.2)';
        } else {
            nav.style.background = 'rgba(0, 0, 0, 0.8)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        // Hide/show nav on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    }, 16));
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// ========================================
// HERO ANIMATIONS
// ========================================

function initHeroAnimations() {
    const titleLines = document.querySelectorAll('.title-line');
    const heroElements = document.querySelectorAll('.hero-badge, .hero-subtitle, .hero-stats, .hero-actions');
    
    // Staggered title animation
    titleLines.forEach((line, index) => {
        const delay = parseInt(line.dataset.delay) || index * 200;
        setTimeout(() => {
            line.style.animation = 'slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }, delay);
    });
    
    // Other elements animation
    setTimeout(() => {
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in', 'visible');
            }, index * 200);
        });
    }, 1000);
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if it's a counter
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .stat-number');
    animatedElements.forEach(el => {
        if (!el.classList.contains('stat-number')) {
            el.classList.add('fade-in');
        }
        observer.observe(el);
    });
}

// ========================================
// COUNTER ANIMATIONS
// ========================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        // Counter will be animated by scroll observer
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    
    // Only animate if data-target exists and is a valid number
    if (!target || isNaN(target)) {
        return;
    }
    
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ========================================
// PARTICLE SYSTEM
// ========================================

function initParticleSystem() {
    const particleField = document.querySelector('.particle-field');
    if (!particleField) return;
    
    // Create dynamic particles
    for (let i = 0; i < 50; i++) {
        createParticle(particleField);
    }
    
    // Add mouse interaction
    document.addEventListener('mousemove', (e) => {
        const particles = document.querySelectorAll('.dynamic-particle');
        particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const distance = Math.sqrt(x * x + y * y);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.style.transform = `translate(${x * force * 0.1}px, ${y * force * 0.1}px)`;
            }
        });
    });
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: ${Math.random() > 0.5 ? '#00d4ff' : '#8b5cf6'};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.5 + 0.2};
        animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
        pointer-events: none;
    `;
    
    container.appendChild(particle);
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// PARALLAX EFFECTS
// ========================================

function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.gradient-orb, .floating-element');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }, 16));
}

// ========================================
// CURSOR EFFECTS
// ========================================

function initCursorEffects() {
    // Create custom cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);
    
    // Follow mouse
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Scale on hover
    document.querySelectorAll('a, button, .btn').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// FORM VALIDATION
// ========================================

function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';
    
    clearFieldError(field);
    
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(field)} is required`;
        isValid = false;
    }
    
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
        isValid = false;
    }
    
    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        errorMessage = 'Please enter a valid phone number';
        isValid = false;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '';
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#f87171';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = `
        color: #f87171;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: slideInUp 0.3s ease;
    `;
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    return label ? label.textContent.replace('*', '').trim() : field.getAttribute('name');
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function submitForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Thank you! Your application has been submitted successfully. We\'ll get back to you within 24 hours.', 'success');
        
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        form.querySelectorAll('.field-error').forEach(error => error.remove());
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#f87171' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical image URLs here
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
preloadResources();

// ========================================
// CONSOLE BRANDING
// ========================================

console.log(`
%c
██╗  ██╗██╗     ██╗      █████╗  ██████╗██╗  ██╗    ██████╗  █████╗ ██╗   ██╗███████╗███╗   ██╗
██║ ██╔╝██║     ██║     ██╔══██╗██╔════╝██║  ██╗    ██╔══██╗██╔══██╗██║   ██║██╔════╝████╗  ██║
█████╔╝ ██║     ██║     ███████║██║     ███████║    ██████╔╝███████║██║   ██║█████╗  ██╔██╗ ██║
██╔═██╗ ██║     ██║     ██╔══██║██║     ██╔══██║    ██╔══██╗██╔══██║╚██╗ ██╔╝██╔══╝  ██║╚██╗██║
██║  ██╗███████╗███████╗██║  ██║╚██████╗██║  ██║    ██║  ██║██║  ██║ ╚████╔╝ ███████╗██║ ╚████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═══╝
%c
Elite Technology Solutions
%c
Built with precision, powered by innovation
`, 
'color: #00d4ff; font-size: 12px; font-family: monospace;',
'color: #8b5cf6; font-size: 16px; font-weight: bold;',
'color: #a0a0a0; font-size: 12px;'
);