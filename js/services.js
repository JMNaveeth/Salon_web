// Services Page JavaScript - Enhanced with User-Friendly Features

// Wait for EVERYTHING to be ready
window.addEventListener('load', function() {
    console.log('%c=== SERVICES PAGE READY ===', 'background: #d4af37; color: #fff; padding: 5px 10px; font-weight: bold;');
    
    // Double-check Storage exists (from main.js)
    if (typeof Storage === 'undefined') {
        console.error('Storage not found! Check if main.js loaded correctly.');
        return;
    }
    
    try {
        // Load dynamic services
        loadDynamicServices();
        
        // Initialize features one by one with error handling
        try { initServiceFilters(); } catch(e) { console.error('Filter init error:', e); }
        try { initServiceSearch(); } catch(e) { console.error('Search init error:', e); }
        try { initPriceFilter(); } catch(e) { console.error('Price filter init error:', e); }
        try { initSortServices(); } catch(e) { console.error('Sort init error:', e); }
        try { initScrollAnimations(); } catch(e) { console.error('Animations init error:', e); }
        try { initSmoothScroll(); } catch(e) { console.error('Smooth scroll init error:', e); }
        try { initQuickActions(); } catch(e) { console.error('Quick actions init error:', e); }
        
        console.log('%c✓ ALL INITIALIZED', 'background: green; color: white; padding: 5px 10px; font-weight: bold;');
    } catch (error) {
        console.error('%c✗ CRITICAL ERROR:', 'background: red; color: white; padding: 5px 10px; font-weight: bold;', error);
    }
});

// Load services from localStorage and display them
function loadDynamicServices() {
    const services = Storage.get('services', []);
    const servicesContainer = document.getElementById('servicesContainer');
    const noServicesMessage = document.getElementById('noServicesMessage');
    
    // Show/hide "no services" message
    if (services.length === 0) {
        if (servicesContainer) servicesContainer.style.display = 'none';
        if (noServicesMessage) noServicesMessage.style.display = 'block';
        return;
    }
    
    if (servicesContainer) servicesContainer.style.display = 'block';
    if (noServicesMessage) noServicesMessage.style.display = 'none';
    
    // Group services by category
    const servicesByCategory = {};
    services.forEach(service => {
        const category = service.category.toLowerCase();
        if (!servicesByCategory[category]) {
            servicesByCategory[category] = [];
        }
        servicesByCategory[category].push(service);
    });
    
    // Clear existing services
    if (servicesContainer) {
        servicesContainer.innerHTML = '';
    }
    
    // Add services to their respective categories
    Object.keys(servicesByCategory).forEach(category => {
        const categorySection = createCategorySection(category);
        const servicesList = categorySection.querySelector('.services-list');
        
        if (servicesList) {
            // Add each service to the category
            servicesByCategory[category].forEach(service => {
                const serviceElement = createServiceElement(service);
                servicesList.appendChild(serviceElement);
            });
        }
        
        // Add category section to container
        if (servicesContainer) {
            servicesContainer.appendChild(categorySection);
        }
    });
}

// Create a new category section
function createCategorySection(category) {
    const categoryIcons = {
        'hair': 'fa-cut',
        'facial': 'fa-spa',
        'special': 'fa-gem',
        'others': 'fa-ellipsis-h'
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
        'facial': 'fa-spa',
        'special': 'fa-gem',
        'others': 'fa-ellipsis-h'
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
// Storage utility is defined in main.js - no need to redefine it here

// Service Category Filtering
function initServiceFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const categoryGroups = document.querySelectorAll('.service-category-section');

    console.log('🔘 Filter tabs:', filterTabs.length, '| Categories:', categoryGroups.length);

    if (filterTabs.length === 0) {
        console.warn('⚠️ No filter tabs found');
        return;
    }

    filterTabs.forEach((tab) => {
        // Remove any existing listeners
        tab.replaceWith(tab.cloneNode(true));
    });
    
    // Re-query after cloning
    const freshTabs = document.querySelectorAll('.filter-tab');
    
    freshTabs.forEach((tab) => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🎯 Tab clicked:', this.getAttribute('data-category'));
            
            // Remove active from all
            freshTabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');

            const category = this.getAttribute('data-category');

            // Show/hide sections
            categoryGroups.forEach(group => {
                const groupCategory = group.getAttribute('data-category');
                if (category === 'all' || groupCategory === category) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });
        });
    });
    
    console.log('✅ Filters ready');
}

// Service Search Functionality
function initServiceSearch() {
    const searchInput = document.getElementById('serviceSearch');
    
    console.log('🔍 Search input:', !!searchInput);

    if (!searchInput) {
        console.warn('⚠️ Search input not found');
        return;
    }

    searchInput.addEventListener('input', function() {
        const serviceItems = document.querySelectorAll('.service-item');
        const categoryGroups = document.querySelectorAll('.service-category-section');
        const searchTerm = this.value.toLowerCase().trim();
        
        console.log('🔎 Searching:', searchTerm || 'all');

        if (searchTerm === '') {
            serviceItems.forEach(item => item.style.display = 'flex');
            categoryGroups.forEach(group => group.style.display = 'block');
            return;
        }

        let visibleCategories = new Set();

        serviceItems.forEach(item => {
            const serviceName = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const serviceDesc = item.querySelector('.service-description')?.textContent.toLowerCase() || '';
            const searchContent = item.getAttribute('data-search-content') || '';
            const parentCategory = item.closest('.service-category-section');

            if (serviceName.includes(searchTerm) || serviceDesc.includes(searchTerm) || searchContent.includes(searchTerm)) {
                item.style.display = 'flex';
                if (parentCategory) visibleCategories.add(parentCategory);
            } else {
                item.style.display = 'none';
            }
        });

        categoryGroups.forEach(group => {
            group.style.display = visibleCategories.has(group) ? 'block' : 'none';
        });
    });
    
    console.log('✅ Search ready');
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
    console.log('💰 Price filter:', !!priceFilter);
    
    if (!priceFilter) {
        console.warn('⚠️ Price filter not found');
        return;
    }

    priceFilter.addEventListener('change', function() {
        const filterValue = this.value;
        const serviceItems = document.querySelectorAll('.service-item');

        console.log('💵 Filter:', filterValue);

        serviceItems.forEach(item => {
            const priceElement = item.querySelector('.service-item-price .price, .price');
            if (!priceElement) return;

            const priceText = priceElement.textContent.replace(/[^0-9.]/g, '');
            const price = parseFloat(priceText);

            if (isNaN(price)) return;

            let shouldShow = true;

            if (filterValue === 'low') shouldShow = price < 50;
            else if (filterValue === 'medium') shouldShow = price >= 50 && price <= 80;
            else if (filterValue === 'high') shouldShow = price > 80;

            item.style.display = shouldShow ? 'flex' : 'none';
        });

        updateVisibleCategories();
    });
    
    console.log('✅ Price filter ready');
}

// Sort Services Functionality
function initSortServices() {
    const sortSelect = document.getElementById('sortServices');
    console.log('🔢 Sort select:', !!sortSelect);
    
    if (!sortSelect) {
        console.warn('⚠️ Sort select not found');
        return;
    }

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const categoryGroups = document.querySelectorAll('.service-category-section');

        console.log('🔀 Sort:', sortValue);

        categoryGroups.forEach(group => {
            const servicesList = group.querySelector('.services-list');
            if (!servicesList) return;

            const items = Array.from(servicesList.querySelectorAll('.service-item'));

            items.sort((a, b) => {
                if (sortValue === 'price-low') return getPrice(a) - getPrice(b);
                if (sortValue === 'price-high') return getPrice(b) - getPrice(a);
                if (sortValue === 'duration') return getDuration(a) - getDuration(b);
                if (sortValue === 'rating') return getRating(b) - getRating(a);
                return 0;
            });

            items.forEach(item => servicesList.appendChild(item));
        });
    });
    
    console.log('✅ Sort ready');
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
