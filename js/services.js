// Services page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize services functionality
    initServiceFilters();
    initServiceSearch();
    initServiceModal();
    initScrollAnimations();
});

// Service Filtering
function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Add fade-in animation
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Service Search
function initServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const serviceCards = document.querySelectorAll('.service-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            serviceCards.forEach(card => {
                const serviceName = card.querySelector('h3').textContent.toLowerCase();
                const serviceDescription = card.querySelector('.salon-desc').textContent.toLowerCase();
                const serviceCategory = card.getAttribute('data-category').toLowerCase();

                if (serviceName.includes(searchTerm) ||
                    serviceDescription.includes(searchTerm) ||
                    serviceCategory.includes(searchTerm) ||
                    searchTerm === '') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Service Modal Functionality
function initServiceModal() {
    const modal = document.getElementById('serviceModal');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    const closeButtons = document.querySelectorAll('.modal-close-btn');

    if (modal) {
        // Open modal when clicking view details button
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const serviceType = this.getAttribute('data-service');
                openServiceModal(serviceType);
            });
        });

        // Close modal
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                closeServiceModal();
            });
        });

        // Close modal when clicking backdrop
        const backdrop = modal.querySelector('.admin-gate__backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeServiceModal);
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeServiceModal();
            }
        });
    }
}

// Service Details Data
const serviceDetails = {
    'haircut': {
        title: 'Haircut & Styling',
        price: '$45',
        duration: '45 mins',
        description: 'Professional haircuts, styling, and finishing for all hair types. Our expert stylists will consult with you to create the perfect look that suits your face shape and lifestyle.',
        features: [
            'Professional consultation and style advice',
            'Precision cutting with premium tools',
            'Blow-dry and professional styling',
            'Hot towel treatment',
            'Complimentary beverages',
            'Post-care maintenance tips'
        ],
        icon: 'fa-cut',
        bookingUrl: 'booking.html?service=haircut'
    },
    'coloring': {
        title: 'Hair Coloring',
        price: '$85',
        duration: '90 mins',
        description: 'Expert hair coloring services including highlights, balayage, ombre, and full color. We use premium, ammonia-free color products that are gentle on your hair.',
        features: [
            'Color consultation and strand test',
            'Premium hair color products',
            'Professional application technique',
            'Toner and gloss treatment',
            'Deep conditioning mask',
            'Color maintenance guide',
            'Touch-up recommendations'
        ],
        icon: 'fa-palette',
        bookingUrl: 'booking.html?service=coloring'
    },
    'treatment': {
        title: 'Hair Treatment',
        price: '$65',
        duration: '60 mins',
        description: 'Deep conditioning treatments, keratin smoothing, and comprehensive hair repair services to restore health and shine to damaged hair.',
        features: [
            'Hair analysis and consultation',
            'Deep conditioning treatment',
            'Protein or moisture therapy',
            'Steam treatment for deep penetration',
            'Scalp massage and treatment',
            'Heat protection application',
            'Home care product recommendations'
        ],
        icon: 'fa-magic',
        bookingUrl: 'booking.html?service=treatment'
    },
    'facial': {
        title: 'Facial Treatment',
        price: '$70',
        duration: '75 mins',
        description: 'Customized facial treatments with deep cleansing, exfoliation, extraction, and moisturizing therapy tailored to your skin type and concerns.',
        features: [
            'Skin analysis and consultation',
            'Deep cleansing and steam',
            'Exfoliation treatment',
            'Extraction (if needed)',
            'Customized facial mask',
            'Facial massage and lymphatic drainage',
            'Moisturizing and SPF protection',
            'Skincare routine recommendations'
        ],
        icon: 'fa-face-smile',
        bookingUrl: 'booking.html?service=facial'
    },
    'waxing': {
        title: 'Body Waxing',
        price: '$40',
        duration: '45 mins',
        description: 'Professional body waxing services using premium, gentle wax products for smooth, long-lasting results with minimal discomfort.',
        features: [
            'Pre-wax consultation',
            'Premium hard or soft wax',
            'Gentle hair removal technique',
            'Soothing post-wax treatment',
            'Ingrown hair prevention',
            'Skin calming products',
            'Maintenance schedule advice'
        ],
        icon: 'fa-spray-can',
        bookingUrl: 'booking.html?service=waxing'
    },
    'bridal-makeup': {
        title: 'Bridal Makeup',
        price: '$150',
        duration: '120 mins',
        description: 'Complete bridal makeup package with trial session, premium products, airbrush technique, and touch-up kit for your special day.',
        features: [
            'Pre-wedding consultation',
            'Complimentary trial makeup session',
            'Premium and luxury makeup products',
            'Airbrush or traditional application',
            'False lashes application',
            'Long-lasting setting spray',
            'Touch-up kit included',
            'Photography and HD ready makeup'
        ],
        icon: 'fa-gem',
        bookingUrl: 'booking.html?service=bridal-makeup'
    },
    'bridal-hair': {
        title: 'Bridal Hair',
        price: '$120',
        duration: '90 mins',
        description: 'Expert bridal hair styling with trial session, premium products, accessories, and veil attachment to complete your bridal look.',
        features: [
            'Bridal hair consultation',
            'Complimentary trial styling session',
            'Premium styling products',
            'Updo or down-style options',
            'Hair accessories and flowers',
            'Veil attachment service',
            'Long-lasting hold products',
            'On-location service available'
        ],
        icon: 'fa-crown',
        bookingUrl: 'booking.html?service=bridal-hair'
    },
    'massage': {
        title: 'Swedish Massage',
        price: '$80',
        duration: '60 mins',
        description: 'Relaxing full-body Swedish massage to relieve muscle tension, reduce stress, and promote overall wellness and circulation.',
        features: [
            'Relaxation consultation',
            'Full body massage therapy',
            'Swedish massage techniques',
            'Premium aromatherapy oils',
            'Hot towel treatment',
            'Pressure customization',
            'Post-massage relaxation time',
            'Wellness recommendations'
        ],
        icon: 'fa-hands',
        bookingUrl: 'booking.html?service=massage'
    },
    'manicure': {
        title: 'Manicure & Pedicure',
        price: '$55',
        duration: '75 mins',
        description: 'Complete nail care services including nail shaping, cuticle care, exfoliation, massage, and your choice of regular or gel polish.',
        features: [
            'Nail consultation and analysis',
            'Professional nail shaping',
            'Cuticle care and treatment',
            'Exfoliation and scrub',
            'Hand and foot massage',
            'Choice of regular or gel polish',
            'Moisturizing treatment',
            'Nail health recommendations'
        ],
        icon: 'fa-hand-sparkles',
        bookingUrl: 'booking.html?service=manicure'
    }
};

// Open Service Modal
function openServiceModal(serviceType) {
    const modal = document.getElementById('serviceModal');
    const service = serviceDetails[serviceType];

    if (modal && service) {
        // Update modal content
        document.getElementById('modalServiceTitle').textContent = service.title;
        document.getElementById('modalPrice').textContent = service.price;
        document.getElementById('modalDuration').textContent = service.duration;
        document.getElementById('modalDescription').textContent = service.description;

        // Update icon
        const modalIcon = modal.querySelector('.service-modal-icon i');
        if (modalIcon) {
            modalIcon.className = `fas ${service.icon}`;
        }

        // Update features list
        const featuresList = document.getElementById('modalFeaturesList');
        if (featuresList) {
            featuresList.innerHTML = '';
            service.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
        }

        // Update booking button
        const bookBtn = document.getElementById('modalBookBtn');
        if (bookBtn) {
            bookBtn.href = service.bookingUrl;
        }

        // Show modal
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close Service Modal
function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Scroll Animations
function initScrollAnimations() {
    const cards = document.querySelectorAll('.service-card');
    
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

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);