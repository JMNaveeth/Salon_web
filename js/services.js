// Services page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize services functionality
    initServiceFilters();
    initServiceSearch();
    initServiceBooking();
    initServiceModal();
});

// Service Filtering
function initServiceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceItems = document.querySelectorAll('.service-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            serviceItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger AOS animation refresh
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Service Search
function initServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const serviceItems = document.querySelectorAll('.service-item');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            serviceItems.forEach(item => {
                const serviceName = item.querySelector('h3').textContent.toLowerCase();
                const serviceDescription = item.querySelector('p').textContent.toLowerCase();
                const serviceCategory = item.getAttribute('data-category').toLowerCase();

                if (serviceName.includes(searchTerm) ||
                    serviceDescription.includes(searchTerm) ||
                    serviceCategory.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // Trigger AOS animation refresh
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
        });
    }
}

// Service Booking Buttons
function initServiceBooking() {
    const bookButtons = document.querySelectorAll('.book-service-btn');

    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');

            // Store selected service in localStorage for booking page
            if (typeof Storage !== 'undefined') {
                Storage.set('selectedService', serviceName);
            }

            // Navigate to booking page
            window.location.href = 'booking.html';
        });
    });
}

// Service Modal
function initServiceModal() {
    const serviceItems = document.querySelectorAll('.service-item');
    const modal = document.getElementById('serviceModal');
    const modalClose = document.querySelector('.modal-close');

    if (modal && modalClose) {
        // Open modal when clicking on service item (but not on book button)
        serviceItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('book-service-btn')) {
                    const serviceName = this.querySelector('h3').textContent;
                    const serviceCategory = this.querySelector('.service-category').textContent;
                    const serviceDescription = this.querySelector('p').textContent;
                    const servicePrice = this.querySelector('.price').textContent;
                    const serviceDuration = this.querySelector('.duration').textContent;
                    const serviceImage = this.querySelector('img').src;

                    openServiceModal({
                        name: serviceName,
                        category: serviceCategory,
                        description: serviceDescription,
                        price: servicePrice,
                        duration: serviceDuration,
                        image: serviceImage
                    });
                }
            });
        });

        // Close modal
        modalClose.addEventListener('click', closeServiceModal);

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeServiceModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeServiceModal();
            }
        });
    }
}

function openServiceModal(serviceData) {
    const modal = document.getElementById('serviceModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalPrice = document.getElementById('modalPrice');
    const modalDuration = document.getElementById('modalDuration');
    const modalDescription = document.getElementById('modalDescription');

    if (modal && modalTitle && modalImage && modalPrice && modalDuration && modalDescription) {
        // Update modal content
        modalTitle.textContent = serviceData.name;
        modalImage.src = serviceData.image;
        modalPrice.textContent = serviceData.price;
        modalDuration.textContent = serviceData.duration;
        modalDescription.textContent = serviceData.description;

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Service data for detailed information
const serviceDetails = {
    'Haircut & Styling': {
        features: [
            'Professional consultation',
            'Precision cutting techniques',
            'Professional styling products',
            'After-care advice',
            'Hot towel service'
        ]
    },
    'Hair Coloring': {
        features: [
            'Color consultation',
            'Premium hair color products',
            'Professional application',
            'Color correction if needed',
            'Post-color treatment',
            'Maintenance advice'
        ]
    },
    'Hair Treatment': {
        features: [
            'Hair analysis consultation',
            'Deep conditioning treatment',
            'Protein or moisture therapy',
            'Heat protection treatment',
            'Scalp massage',
            'Home care recommendations'
        ]
    },
    'Facial Treatment': {
        features: [
            'Skin analysis consultation',
            'Deep cleansing',
            'Exfoliation',
            'Extraction (if needed)',
            'Customized mask',
            'Moisturizing treatment',
            'Home care products'
        ]
    },
    'Body Waxing': {
        features: [
            'Professional consultation',
            'Premium wax products',
            'Gentle hair removal',
            'Soothing aftercare',
            'Skin calming products',
            'Maintenance schedule advice'
        ]
    },
    'Bridal Makeup': {
        features: [
            'Bridal consultation',
            'Trial makeup session',
            'Premium makeup products',
            'Airbrush technique available',
            'Setting spray application',
            'Touch-up kit included',
            'Photography ready'
        ]
    },
    'Bridal Hair': {
        features: [
            'Bridal hair consultation',
            'Trial styling session',
            'Premium hair products',
            'Hair accessories included',
            'Veil attachment service',
            'Photography styling',
            'Touch-up service'
        ]
    },
    'Swedish Massage': {
        features: [
            'Relaxation consultation',
            'Full body massage',
            'Swedish techniques',
            'Aromatherapy oils',
            'Hot towel treatment',
            'Post-massage recommendations'
        ]
    },
    'Manicure & Pedicure': {
        features: [
            'Nail consultation',
            'Professional nail care',
            'Cuticle treatment',
            'Nail shaping',
            'Choice of polish',
            'Hand/foot massage',
            'Moisturizing treatment'
        ]
    }
};

// Update modal with detailed service information
function updateServiceModalFeatures(serviceName) {
    const modalFeatures = document.getElementById('modalFeatures');
    const serviceInfo = serviceDetails[serviceName];

    if (modalFeatures && serviceInfo) {
        modalFeatures.innerHTML = '';
        serviceInfo.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });
    }
}

// Enhanced modal opening with features
const originalOpenServiceModal = openServiceModal;
openServiceModal = function(serviceData) {
    originalOpenServiceModal(serviceData);
    updateServiceModalFeatures(serviceData.name);
};

// Service statistics for display
const serviceStats = {
    totalServices: 9,
    categories: {
        hair: 3,
        skin: 2,
        bridal: 2,
        spa: 2
    },
    averageRating: 4.8,
    totalReviews: 1250
};

// Add service statistics display (optional enhancement)
function displayServiceStats() {
    // This could be used to show statistics in the services page
    console.log('Service Statistics:', serviceStats);
}

// Initialize service stats on page load
displayServiceStats();
