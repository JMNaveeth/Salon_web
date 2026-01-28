// Main JavaScript file for JK Salon website

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Mobile menu functionality
    initMobileMenu();

    // Contact form handling
    initContactForm();

    // Smooth scrolling for navigation links
    initSmoothScrolling();

    // Navbar scroll effect
    initNavbarScroll();

    // Admin access gate
    initAdminAccess();

    // 3D parallax effects
    init3DParallax();

    // Card tilt and glow on mouse move
    initCardInteractivity();

    // Custom Cursor Logic
    initCustomCursor();
});

// Custom Cursor Logic
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (!cursorDot || !cursorOutline) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Outline follows with slight delay/trail
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Add pointer hover effect
    const interactables = document.querySelectorAll('a, button, input, textarea, .hover-trigger, .card, .service-item, .salon-card, .slot-card');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'scale(1.5)';
            cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        });
        
        el.addEventListener('mouseleave', () => {
             cursorOutline.style.transform = 'scale(1)';
             cursorOutline.style.backgroundColor = 'transparent';
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-menu');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('mobile-menu');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (validateContactForm(data)) {
                // Simulate form submission
                showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');

                // Reset form
                contactForm.reset();
            }
        });
    }
}

// Form Validation
function validateContactForm(data) {
    const { name, email, phone, message } = data;

    // Name validation
    if (!name || name.trim().length < 2) {
        showMessage('Please enter a valid name (at least 2 characters)', 'error');
        return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone || !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showMessage('Please enter a valid phone number', 'error');
        return false;
    }

    // Message validation
    if (!message || message.trim().length < 10) {
        showMessage('Please enter a message (at least 10 characters)', 'error');
        return false;
    }

    return true;
}

// Show Message Function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-notification');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-notification ${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="message-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(messageEl);

    // Show message with animation
    setTimeout(() => messageEl.classList.add('show'), 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);

    // Close button functionality
    const closeBtn = messageEl.querySelector('.message-close');
    closeBtn.addEventListener('click', function() {
        messageEl.classList.remove('show');
        setTimeout(() => messageEl.remove(), 300);
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerOffset = 70;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }

        // Add background on scroll
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });
}

// Admin access gate (simple front-end gate with client-side validation)
function initAdminAccess() {
    const triggers = document.querySelectorAll('[data-admin-login]');
    const modal = document.getElementById('adminGate');
    const closeBtn = modal ? modal.querySelector('.admin-gate__close') : null;
    const form = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('adminEmail');
    const codeInput = document.getElementById('adminAccessCode');

    if (!triggers.length || !modal || !form || !emailInput || !codeInput) {
        return;
    }

    const ownerEmail = 'owner@kinniyasalon.com';
    const accessCode = 'salon-admin-2024';

    const openModal = () => {
        modal.classList.add('show');
        document.body.classList.add('no-scroll');
        modal.setAttribute('aria-hidden', 'false');
        emailInput.focus();
    };

    const closeModal = () => {
        modal.classList.remove('show');
        document.body.classList.remove('no-scroll');
        modal.setAttribute('aria-hidden', 'true');
        form.reset();
    };

    triggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const code = codeInput.value.trim();

        if (!email || !code) {
            showMessage('Please provide your work email and access code.', 'error');
            return;
        }

        if (email === ownerEmail && code === accessCode) {
            showMessage('Access granted. Redirecting to admin dashboard...', 'success');
            setTimeout(() => {
                closeModal();
                window.location.href = 'admin.html';
            }, 800);
        } else {
            showMessage('Invalid admin credentials. Contact the owner if you need access.', 'error');
        }
    });
}

// Utility Functions

// Debounce function for performance
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

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phoneNumber;
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add loading states
function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    button.disabled = true;

    return {
        hide: function() {
            button.innerHTML = originalText;
            button.disabled = false;
        }
    };
}

// Local Storage helpers
const Storage = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },

    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },

    clear: function() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

// Add message notification styles dynamically
function addMessageStyles() {
    if (!document.getElementById('message-styles')) {
        const style = document.createElement('style');
        style.id = 'message-styles';
        style.textContent = `
            .message-notification {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }

            .message-notification.show {
                transform: translateX(0);
            }

            .message-content {
                background: white;
                border-radius: 8px;
                padding: 15px 20px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                gap: 15px;
                border-left: 4px solid;
            }

            .message-notification.success .message-content {
                border-left-color: #10B981;
            }

            .message-notification.error .message-content {
                border-left-color: #EF4444;
            }

            .message-notification.info .message-content {
                border-left-color: #3B82F6;
            }

            .message-notification i {
                font-size: 1.2rem;
            }

            .message-notification.success i {
                color: #10B981;
            }

            .message-notification.error i {
                color: #EF4444;
            }

            .message-notification.info i {
                color: #3B82F6;
            }

            .message-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6B7280;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: auto;
            }

            .message-close:hover {
                color: #374151;
            }

            @media (max-width: 480px) {
                .message-notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize message styles
addMessageStyles();

// 3D Parallax Effect on scroll
function init3DParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        parallaxElements.forEach(element => {
            const depth = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrollY * depth}px)`;
        });
    });
}

// Card interactivity - mouse follow glow and tilt
function initCardInteractivity() {
    // Select cards from all pages including dashboard/services/admin
    const tiltCards = document.querySelectorAll(
        '.tilt, .service-item, .gallery-item, .admin-card, .service-card, .sidebar-menu, .sidebar-stats, .appointment-card, .how-card, .salon-card, .slot-card, .contact-info-card'
    );
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Store mouse position for radial gradient
            card.style.setProperty('--x', x + 'px');
            card.style.setProperty('--y', y + 'px');
            
            // Calculate rotation based on mouse position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // limit rotation to max 8 degrees for subtler effect on content cards
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            // Use specific z-translation based on card type importance
            const zDepth = card.classList.contains('service-item') || card.classList.contains('gallery-item') ? 15 : 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${zDepth}px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset transforms with smooth transition
            card.style.transition = 'transform 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            
            // Remove transition after it completes to allow instant mouse movement tracking later
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
        
        // Add entrance animation class for 3D reveal
        card.classList.add('card-3d-entrance');
    });
}

