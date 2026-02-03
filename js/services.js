// Services Page JavaScript - Enhanced with User-Friendly Features

document.addEventListener('DOMContentLoaded', function() {
    console.log('Services page loading...');
    loadDynamicServices(); // Load services from localStorage first
    
    // Initialize all features after a short delay to ensure DOM is ready
    setTimeout(function() {
        initServiceFilters();
        initServiceSearch();
        initPriceFilter();
        initSortServices();
        initScrollAnimations();
        initSmoothScroll();
        initQuickActions();
        console.log('All services features initialized');
    }, 100);
});

// Load services from localStorage and display them
function loadDynamicServices() {
    const services = Storage.get('services', []);
    
    if (services.length === 0) return; // No custom services added yet
    
    // Group services by category
    const servicesByCategory = {};
    services.forEach(service => {
        const category = service.category.toLowerCase();
        if (!servicesByCategory[category]) {
            servicesByCategory[category] = [];
        }
        servicesByCategory[category].push(service);
    });
    
    // Add services to their respective categories
    Object.keys(servicesByCategory).forEach(category => {
        let categorySection = document.querySelector(`.service-category-section[data-category="${category}"]`);
        
        // If category doesn't exist, create it
        if (!categorySection) {
            categorySection = createCategorySection(category);
        }
        
        const servicesList = categorySection.querySelector('.services-list');
        if (servicesList) {
            // Add each service to the category
            servicesByCategory[category].forEach(service => {
                // Check if service already exists (avoid duplicates)
                const existingService = servicesList.querySelector(`[data-service-id="${service.id}"]`);
                if (!existingService) {
                    const serviceElement = createServiceElement(service);
                    servicesList.appendChild(serviceElement);
                }
            });
        }
    });
}

// Create a new category section if it doesn't exist
function createCategorySection(category) {
    const categoryIcons = {
        'hair': 'fa-cut',
        'skin care': 'fa-spa',
        'nails': 'fa-hand-sparkles',
        'makeup': 'fa-palette',
        'massage': 'fa-hands',
        'facial': 'fa-face-smile',
        'body': 'fa-person'
    };
    
    const icon = categoryIcons[category.toLowerCase()] || 'fa-star';
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    const section = document.createElement('div');
    section.className = 'service-category-section';
    section.setAttribute('data-category', category.toLowerCase());
    section.innerHTML = `
        <div class="category-header">
            <div class="category-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div>
                <h2>${categoryName} Services</h2>
                <p>Professional ${category.toLowerCase()} treatments</p>
            </div>
        </div>
        <div class="services-list"></div>
    `;
    
    // Add to the page before the footer
    const mainSection = document.querySelector('.services-main-section .container');
    if (mainSection) {
        mainSection.appendChild(section);
    }
    
    return section;
}

// Create service element HTML
function createServiceElement(service) {
    const serviceDiv = document.createElement('div');
    serviceDiv.className = 'service-item';
    serviceDiv.setAttribute('data-service-id', service.id);
    serviceDiv.setAttribute('data-search-content', `${service.name} ${service.description || ''}`);
    
    const icon = getCategoryIcon(service.category);
    
    serviceDiv.innerHTML = `
        <div class="service-item-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="service-item-content">
            <div class="service-item-header">
                <h3>${service.name}</h3>
                <div class="service-item-price">
                    <span class="price">$${service.price}</span>
                    <span class="duration">${service.duration} min</span>
                </div>
            </div>
            <p class="service-description">${service.description || 'Professional service'}</p>
            <div class="service-item-footer">
                <span class="added-badge"><i class="fas fa-plus-circle"></i> Custom Service</span>
                <button class="btn-book-service" onclick="bookService('${service.name}', ${service.price})">
                    Book Now
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;
    
    return serviceDiv;
}

// Get icon based on category
function getCategoryIcon(category) {
    const iconMap = {
        'hair': 'fa-cut',
        'skin care': 'fa-spa',
        'nails': 'fa-hand-sparkles',
        'makeup': 'fa-palette',
        'massage': 'fa-hands',
        'facial': 'fa-face-smile',
        'body': 'fa-person'
    };
    return iconMap[category.toLowerCase()] || 'fa-star';
}

// Book service function (redirect to booking page)
window.bookService = function(serviceName, price) {
    // Store selected service in localStorage
    Storage.set('selectedService', {
        name: serviceName,
        price: price,
        selectedAt: new Date().toISOString()
    });
    
    // Redirect to booking page
    window.location.href = 'booking.html';
};

// Storage utility (if not already defined)
const Storage = {
    get: function(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    }
};

// Service Category Filtering
function initServiceFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const categoryGroups = document.querySelectorAll('.service-category-section');

    console.log('Initializing filters - Tabs found:', filterTabs.length);
    console.log('Initializing filters - Categories found:', categoryGroups.length);

    if (filterTabs.length === 0) {
        console.error('No filter tabs found!');
        return;
    }

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked tab
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Show/hide category sections
            categoryGroups.forEach(group => {
                const groupCategory = group.getAttribute('data-category');
                
                if (category === 'all') {
                    group.style.display = 'block';
                    group.style.animation = 'fadeInUp 0.6s ease';
                } else if (groupCategory === category) {
                    group.style.display = 'block';
                    group.style.animation = 'fadeInUp 0.6s ease';
                } else {
                    group.style.display = 'none';
                }
            });

            // Smooth scroll to services list
            const servicesSection = document.getElementById('services-list');
            if (servicesSection && category !== 'all') {
                setTimeout(() => {
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });
}

// Service Search Functionality
function initServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    const serviceItems = document.querySelectorAll('.service-item');
    const categoryGroups = document.querySelectorAll('.service-category-section');

    console.log('Initializing search - Input found:', !!searchInput);
    console.log('Service items found:', serviceItems.length);

    if (!searchInput) {
        console.error('Search input not found!');
        return;
    }

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            if (searchTerm === '') {
                // Show all services when search is empty
                serviceItems.forEach(item => {
                    item.style.display = 'flex';
                });
                categoryGroups.forEach(group => {
                    group.style.display = 'block';
                });
                return;
            }

            let visibleCategories = new Set();

            // Search through all service items
            serviceItems.forEach(item => {
                const serviceName = item.querySelector('h3').textContent.toLowerCase();
                const serviceDesc = item.querySelector('.service-description').textContent.toLowerCase();
                const searchContent = item.getAttribute('data-search-content') || '';
                const parentCategory = item.closest('.service-category-section');

                if (serviceName.includes(searchTerm) || 
                    serviceDesc.includes(searchTerm) || 
                    searchContent.includes(searchTerm)) {
                    item.style.display = 'flex';
                    item.style.animation = 'fadeInUp 0.5s ease';
                    if (parentCategory) {
                        visibleCategories.add(parentCategory);
                    }
                } else {
                    item.style.display = 'none';
                }
            });

            // Show/hide category sections based on search results
            categoryGroups.forEach(group => {
                if (visibleCategories.has(group)) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });

            // Show "no results" message if needed
            if (visibleCategories.size === 0) {
                showNoResultsMessage(searchTerm);
            } else {
                removeNoResultsMessage();
            }
        });
    }
}

// Show No Results Message
function showNoResultsMessage(searchTerm) {
    removeNoResultsMessage(); // Remove existing message first

    const container = document.querySelector('.services-main-section .container');
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 20px; margin-top: 30px;">
            <i class="fas fa-search" style="font-size: 64px; color: var(--primary); opacity: 0.5; margin-bottom: 20px;"></i>
            <h3 style="font-size: 1.8rem; color: var(--text); margin-bottom: 15px;">No services found</h3>
            <p style="color: var(--text-light); font-size: 1.1rem;">We couldn't find any services matching "${searchTerm}"</p>
            <button onclick="document.getElementById('serviceSearch').value = ''; document.getElementById('serviceSearch').dispatchEvent(new Event('input'));" 
                    class="btn-primary" style="margin-top: 25px;">
                Clear Search <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(noResultsDiv);
}

// Remove No Results Message
function removeNoResultsMessage() {
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Scroll Animations
function initScrollAnimations() {
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

    // Observe category sections
    const categoryGroups = document.querySelectorAll('.service-category-section');
    categoryGroups.forEach(group => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(30px)';
        group.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(group);
    });

    // Observe individual service items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Service Item Hover Effect Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Highlight Active Section on Scroll
function highlightActiveSection() {
    const categoryGroups = document.querySelectorAll('.service-category-section');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const category = entry.target.getAttribute('data-category');
                
                // Update active tab
                filterTabs.forEach(tab => {
                    if (tab.getAttribute('data-category') === category) {
                        filterTabs.forEach(t => t.classList.remove('active'));
                        tab.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });

    categoryGroups.forEach(group => observer.observe(group));
}

// Initialize highlight on scroll (optional feature)
// highlightActiveSection();

// Add animation styles dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .service-item.animate-in {
        animation: slideInLeft 0.6s ease forwards;
    }

    .service-category-section.animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
`;
document.head.appendChild(style);

// Log service counts for debugging
console.log('Services Page Initialized');
console.log('Total service items:', document.querySelectorAll('.service-item').length);
console.log('Service categories:', document.querySelectorAll('.service-category-section').length);

// Price Filter Functionality
function initPriceFilter() {
    const priceFilter = document.getElementById('priceFilter');
    console.log('Initializing price filter - Found:', !!priceFilter);
    
    if (!priceFilter) {
        console.error('Price filter dropdown not found!');
        return;
    }

    priceFilter.addEventListener('change', function() {
        const filterValue = this.value;
        const serviceItems = document.querySelectorAll('.service-item');

        serviceItems.forEach(item => {
            const priceElement = item.querySelector('.service-item-price .price');
            if (!priceElement) return;

            const priceText = priceElement.textContent.replace(/[^0-9]/g, '');
            const price = parseInt(priceText);

            let shouldShow = true;

            switch(filterValue) {
                case 'low':
                    shouldShow = price < 50;
                    break;
                case 'medium':
                    shouldShow = price >= 50 && price <= 80;
                    break;
                case 'high':
                    shouldShow = price > 80;
                    break;
                case 'all':
                default:
                    shouldShow = true;
            }

            item.style.display = shouldShow ? 'flex' : 'none';
        });

        updateVisibleCategories();
    });
}

// Sort Services Functionality
function initSortServices() {
    const sortSelect = document.getElementById('sortServices');
    console.log('Initializing sort - Found:', !!sortSelect);
    
    if (!sortSelect) {
        console.error('Sort dropdown not found!');
        return;
    }

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const categoryGroups = document.querySelectorAll('.service-category-section');

        categoryGroups.forEach(group => {
            const servicesList = group.querySelector('.services-list');
            if (!servicesList) return;

            const items = Array.from(servicesList.querySelectorAll('.service-item'));

            items.sort((a, b) => {
                switch(sortValue) {
                    case 'price-low':
                        return getPrice(a) - getPrice(b);
                    case 'price-high':
                        return getPrice(b) - getPrice(a);
                    case 'duration':
                        return getDuration(a) - getDuration(b);
                    case 'rating':
                        return getRating(b) - getRating(a);
                    default:
                        return 0;
                }
            });

            // Re-append sorted items
            items.forEach(item => servicesList.appendChild(item));
        });
    });
}

// Helper functions for sorting
function getPrice(item) {
    const priceElement = item.querySelector('.service-item-price .price');
    if (!priceElement) return 0;
    return parseInt(priceElement.textContent.replace(/[^0-9]/g, ''));
}

function getDuration(item) {
    const durationElement = item.querySelector('.duration');
    if (!durationElement) return 0;
    return parseInt(durationElement.textContent.replace(/[^0-9]/g, ''));
}

function getRating(item) {
    const ratingElement = item.querySelector('.service-rating span');
    if (!ratingElement) return 0;
    const ratingText = ratingElement.textContent;
    const match = ratingText.match(/([0-9.]+)/);
    return match ? parseFloat(match[1]) : 0;
}

// Update visible categories after filtering
function updateVisibleCategories() {
    const categoryGroups = document.querySelectorAll('.service-category-section');
    
    categoryGroups.forEach(group => {
        const visibleItems = group.querySelectorAll('.service-item[style*="flex"]');
        group.style.display = visibleItems.length > 0 ? 'block' : 'none';
    });
}

// Quick Actions - Add tooltips and keyboard shortcuts
function initQuickActions() {
    // Add keyboard shortcut hints
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('serviceSearch');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

    // Add click-to-copy for prices
    const priceElements = document.querySelectorAll('.service-item-price .price');
    priceElements.forEach(price => {
        price.style.cursor = 'pointer';
        price.title = 'Click to see details';
    });

    // Enhance book buttons with loading state
    const bookButtons = document.querySelectorAll('.btn-book');
    bookButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.style.pointerEvents = 'none';
            
            // Reset after navigation (this won't execute but shows intent)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
}

// Listen for storage changes (when admin adds a new service)
window.addEventListener('storage', function(e) {
    if (e.key === 'services') {
        // Reload services dynamically without full page reload
        reloadServices();
    }
});

// Also listen for custom event (for same-tab updates)
window.addEventListener('servicesUpdated', function() {
    reloadServices();
});

// Reload services dynamically without full page refresh
function reloadServices() {
    console.log('Reloading services...');
    
    // Remove all dynamically added services (those with data-service-id)
    document.querySelectorAll('[data-service-id]').forEach(el => el.remove());
    
    // Reload services from localStorage
    loadDynamicServices();
    
    // Re-initialize all features to include new services
    setTimeout(function() {
        initServiceFilters();
        initServiceSearch();
        initPriceFilter();
        initSortServices();
        console.log('Features re-initialized after reload');
    }, 100);
    
    // Re-initialize filters and animations for new items
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach((item, index) => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s forwards`;
        }, 10);
    });
}
