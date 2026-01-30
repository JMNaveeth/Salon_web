// ==========================================
// KINNIYA SALON - ADMIN PANEL
// Full Working Version - No Errors
// ==========================================

'use strict';

// ==========================================
// GLOBAL STATE & CONFIG
// ==========================================

const AdminPanel = {
    currentSection: 'overview',
    initialized: false,
    debug: true // Set to false in production
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const Utils = {
    log: function(message, data = null) {
        if (AdminPanel.debug) {
            console.log(`[Admin Panel] ${message}`, data || '');
        }
    },
    
    error: function(message, error = null) {
        console.error(`[Admin Panel ERROR] ${message}`, error || '');
    },
    
    wait: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    formatCurrency: function(amount) {
        return `$${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    },
    
    formatDate: function(date) {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
};

// ==========================================
// LOCAL STORAGE HELPER
// ==========================================

const Storage = {
    get: function(key, defaultValue = null) {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (error) {
            Utils.error(`Failed to get ${key} from storage`, error);
            return defaultValue;
        }
    },
    
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            Utils.error(`Failed to set ${key} in storage`, error);
            return false;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            Utils.error(`Failed to remove ${key} from storage`, error);
            return false;
        }
    },
    
    clear: function() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            Utils.error('Failed to clear storage', error);
            return false;
        }
    }
};

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    Utils.log('DOM Content Loaded - Starting initialization...');
    
    // Initialize AOS animations if available
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                delay: 50,
                easing: 'ease-in-out'
            });
            Utils.log('✓ AOS initialized');
        } catch (error) {
            Utils.error('AOS initialization failed', error);
        }
    }
    
    // Wait for complete DOM ready
    setTimeout(function() {
        try {
            Utils.log('=== STARTING INITIALIZATION ===');
            initNavigation();
            loadAllData();
            initAllForms();
            initCustomCursor();
            AdminPanel.initialized = true;
            Utils.log('✓✓✓ Admin Panel Fully Initialized! ✓✓✓');
            
            // Force a test click to verify
            Utils.log('Admin panel is ready. Click any sidebar button to navigate.');
        } catch (error) {
            Utils.error('Critical initialization error', error);
            alert('⚠ Failed to initialize admin panel. Please refresh the page.');
        }
    }, 150);
});

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    Utils.log('DOM already loaded, initializing immediately...');
    setTimeout(function() {
        if (!AdminPanel.initialized) {
            try {
                Utils.log('=== BACKUP INITIALIZATION ===');
                initNavigation();
                loadAllData();
                initAllForms();
                initCustomCursor();
                AdminPanel.initialized = true;
                Utils.log('✓✓✓ Admin Panel Initialized via Backup! ✓✓✓');
            } catch (error) {
                Utils.error('Backup initialization error', error);
            }
        }
    }, 200);
}

// ==========================================
// NAVIGATION SYSTEM
// ==========================================

function initNavigation() {
    Utils.log('Initializing navigation system...');
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.admin-content');
    
    Utils.log(`Found ${sidebarLinks.length} sidebar links`);
    Utils.log(`Found ${contentSections.length} content sections`);
    
    // Validation
    if (sidebarLinks.length === 0) {
        Utils.error('No sidebar links found!');
        return;
    }
    
    if (contentSections.length === 0) {
        Utils.error('No content sections found!');
        return;
    }
    
    // Initialize display states
    contentSections.forEach(function(section) {
        const isActive = section.classList.contains('active');
        section.style.display = isActive ? 'block' : 'none';
        section.style.opacity = '1';
        Utils.log(`Section ${section.id}: ${isActive ? 'ACTIVE' : 'HIDDEN'}`);
    });
    
    // Attach click handlers
    sidebarLinks.forEach(function(link, index) {
        const section = link.getAttribute('data-section');
        Utils.log(`Attaching handler to Link ${index + 1}: ${section}`);
        
        // Remove any existing listeners
        link.onclick = null;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetSection = this.getAttribute('data-section');
            
            if (!targetSection) {
                Utils.error('No data-section attribute!');
                return false;
            }
            
            Utils.log(`>>> CLICKED: ${targetSection}`);
            navigateToSection(targetSection);
            return false;
        }, { passive: false });
        
        Utils.log(`✓ Handler attached to: ${section}`);
    });
    
    Utils.log('✓ Navigation initialized successfully');
}

// Global function for manual testing
window.testNavigation = function(section) {
    Utils.log(`Manual test navigation to: ${section}`);
    navigateToSection(section);
};

// Global function to check status
window.checkAdminStatus = function() {
    console.log('=== ADMIN PANEL STATUS ===');
    console.log('Initialized:', AdminPanel.initialized);
    console.log('Current Section:', AdminPanel.currentSection);
    console.log('Sidebar Links:', document.querySelectorAll('.sidebar-link').length);
    console.log('Content Sections:', document.querySelectorAll('.admin-content').length);
    console.log('Active Section:', document.querySelector('.admin-content.active')?.id || 'NONE');
    return AdminPanel;
};

function navigateToSection(sectionName) {
    Utils.log(`Navigating to: ${sectionName}`);
    
    try {
        // Update sidebar links
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(function(link) {
            if (link.getAttribute('data-section') === sectionName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update content sections
        const targetId = sectionName + '-section';
        const contentSections = document.querySelectorAll('.admin-content');
        let found = false;
        
        contentSections.forEach(function(section) {
            if (section.id === targetId) {
                // Show target
                section.classList.add('active');
                section.style.display = 'block';
                section.style.opacity = '0';
                
                // Fade in
                setTimeout(function() {
                    section.style.transition = 'opacity 0.3s ease';
                    section.style.opacity = '1';
                }, 10);
                
                found = true;
                Utils.log(`✓ Showing: ${targetId}`);
            } else {
                // Hide others
                section.classList.remove('active');
                section.style.display = 'none';
                section.style.opacity = '1';
            }
        });
        
        if (!found) {
            Utils.error(`Section not found: ${targetId}`);
            showNotification('Section not found!', 'error');
            return;
        }
        
        // Scroll to top
        const adminMain = document.querySelector('.admin-main');
        if (adminMain) {
            adminMain.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }
        
        // Refresh AOS
        if (typeof AOS !== 'undefined') {
            setTimeout(function() {
                AOS.refresh();
            }, 100);
        }
        
        // Update state
        AdminPanel.currentSection = sectionName;
        Utils.log(`✓ Navigation complete: ${sectionName}`);
        
    } catch (error) {
        Utils.error('Navigation error', error);
        showNotification('Navigation failed', 'error');
    }
}

// ==========================================
// DATA LOADING
// ==========================================

function loadAllData() {
    Utils.log('Loading all admin data...');
    
    try {
        loadStatistics();
        loadBookingsTable();
        loadServicesGrid();
        loadStaffGrid();
        loadRecentActivity();
        Utils.log('✓ All data loaded successfully');
    } catch (error) {
        Utils.error('Failed to load data', error);
    }
}

function loadStatistics() {
    // Calculate real statistics from actual data
    const bookings = Storage.get('bookings', []);
    const customers = Storage.get('customers', []);
    
    const today = new Date().toDateString();
    
    // Count today's bookings
    const todayBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date).toDateString();
        return bookingDate === today;
    }).length;
    
    // Count upcoming bookings (future dates)
    const upcomingBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate > new Date() && b.status !== 'cancelled' && b.status !== 'completed';
    }).length;
    
    // Calculate total revenue from completed bookings
    const totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    
    // Count unique customers
    const totalCustomers = customers.length || bookings.length;
    
    // Update the UI
    safeSetText('todayBookings', todayBookings);
    safeSetText('upcomingBookings', upcomingBookings);
    safeSetText('totalRevenue', Utils.formatCurrency(totalRevenue));
    safeSetText('totalCustomers', totalCustomers);
    
    Utils.log('✓ Statistics loaded (Real data)');
}

function loadBookingsTable() {
    const bookings = Storage.get('bookings', []);
    
    // If no bookings exist, create some sample data
    if (bookings.length === 0) {
        const sampleBookings = [
            { 
                id: '#BK001', 
                customer: 'Sarah Johnson', 
                service: 'Hair Styling', 
                date: new Date().toISOString().split('T')[0], 
                time: '10:00 AM', 
                staff: 'Emma W.', 
                status: 'confirmed',
                price: 45
            },
            { 
                id: '#BK002', 
                customer: 'Mike Chen', 
                service: 'Facial Treatment', 
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0], 
                time: '11:00 AM', 
                staff: 'David L.', 
                status: 'confirmed',
                price: 65
            },
            { 
                id: '#BK003', 
                customer: 'Jessica Davis', 
                service: 'Manicure & Pedicure', 
                date: new Date(Date.now() + 172800000).toISOString().split('T')[0], 
                time: '02:00 PM', 
                staff: 'Sarah J.', 
                status: 'pending',
                price: 35
            }
        ];
        Storage.set('bookings', sampleBookings);
        Storage.set('customers', [
            { name: 'Sarah Johnson', email: 'sarah@example.com', totalBookings: 1 },
            { name: 'Mike Chen', email: 'mike@example.com', totalBookings: 1 },
            { name: 'Jessica Davis', email: 'jessica@example.com', totalBookings: 1 }
        ]);
        return loadBookingsTable(); // Reload with sample data
    }
    
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) {
        Utils.log('Bookings table not found');
        return;
    }
    
    // Sort bookings by date (most recent first)
    const sortedBookings = bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    tableBody.innerHTML = sortedBookings.map(function(b) {
        return `
            <tr>
                <td>${b.id}</td>
                <td>${b.customer}</td>
                <td>${b.service}</td>
                <td>${b.date}<br><span style="font-size:0.85em;color:#888">${b.time}</span></td>
                <td>${b.staff}</td>
                <td><span class="status-badge ${b.status}">${b.status}</span></td>
                <td class="actions-cell">
                    <button class="btn-icon" title="View" onclick="viewBooking('${b.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${b.status !== 'completed' && b.status !== 'cancelled' ? `
                        <button class="btn-icon complete" title="Complete" onclick="completeBooking('${b.id}')">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    ${b.status !== 'cancelled' && b.status !== 'completed' ? `
                        <button class="btn-icon delete" title="Cancel" onclick="cancelBooking('${b.id}')">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
    
    Utils.log('✓ Bookings table loaded with real data');
}

function loadServicesGrid() {
    const servicesGrid = document.getElementById('servicesGridAdmin');
    if (!servicesGrid) {
        Utils.log('Services grid not found');
        return;
    }
    
    const services = Storage.get('services', []);
    
    if (services.length === 0) {
        servicesGrid.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No services added yet. Add your first service above!</p>';
        return;
    }
    
    servicesGrid.innerHTML = services.map(function(s) {
        return `
            <div class="service-admin-card">
                <div class="service-admin-header">
                    <h4>${s.name}</h4>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="editService(${s.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteService(${s.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="service-admin-details">
                    <div class="detail-item">
                        <span class="label">Category:</span>
                        <span class="value">${s.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Price:</span>
                        <span class="value price">$${s.price}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Duration:</span>
                        <span class="value">${s.duration} min</span>
                    </div>
                    ${s.description ? `<div class="detail-item" style="grid-column: 1/-1;">
                        <span class="label">Description:</span>
                        <span class="value">${s.description}</span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    Utils.log('✓ Services grid loaded');
}

function loadStaffGrid() {
    const staffGrid = document.getElementById('staffGrid');
    if (!staffGrid) {
        Utils.log('Staff grid not found');
        return;
    }
    
    const staff = Storage.get('staff', []);
    
    if (staff.length === 0) {
        staffGrid.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No staff members added yet. Add your first staff member above!</p>';
        return;
    }
    
    staffGrid.innerHTML = staff.map(function(s) {
        return `
            <div class="staff-admin-card">
                <div class="staff-admin-header">
                    <h4>${s.name}</h4>
                    <div class="actions-cell">
                        <button class="btn-icon" onclick="editStaff(${s.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteStaff(${s.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="staff-admin-details">
                    <div class="detail-item">
                        <span class="label">Role:</span>
                        <span class="value">${s.role}</span>
                    </div>
                    ${s.phone ? `<div class="detail-item">
                        <span class="label">Phone:</span>
                        <span class="value">${s.phone}</span>
                    </div>` : ''}
                    ${s.email ? `<div class="detail-item">
                        <span class="label">Email:</span>
                        <span class="value">${s.email}</span>
                    </div>` : ''}
                    ${s.bio ? `<div class="detail-item" style="grid-column: 1/-1;">
                        <span class="label">Bio:</span>
                        <span class="value">${s.bio}</span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    Utils.log('✓ Staff grid loaded');
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) {
        Utils.log('Recent activity not found');
        return;
    }
    
    // Get real activities from localStorage
    let activities = Storage.get('recentActivities', []);
    
    // If no activities, create some initial ones
    if (activities.length === 0) {
        activities = [
            { icon: 'calendar-check', text: 'New booking from Sarah Johnson', time: new Date().toISOString(), type: 'success' },
            { icon: 'user-plus', text: 'New customer registered', time: new Date(Date.now() - 3600000).toISOString(), type: 'primary' }
        ];
        Storage.set('recentActivities', activities);
    }
    
    // Sort by time (most recent first) and limit to 10
    activities = activities.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
    
    activityList.innerHTML = activities.map(function(a) {
        const timeAgo = getTimeAgo(new Date(a.time));
        return `
            <div class="activity-item">
                <div class="activity-icon ${a.type}">
                    <i class="fas fa-${a.icon}"></i>
                </div>
                <div class="activity-content">
                    <p>${a.text}</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    }).join('');
    
    Utils.log('✓ Recent activity loaded with real data');
}

// Add activity helper function
function addActivity(icon, text, type) {
    const activities = Storage.get('recentActivities', []);
    activities.unshift({
        icon: icon,
        text: text,
        time: new Date().toISOString(),
        type: type
    });
    
    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.pop();
    }
    
    Storage.set('recentActivities', activities);
    loadRecentActivity();
}

// Time ago helper
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hour' + (Math.floor(seconds / 3600) > 1 ? 's' : '') + ' ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + ' day' + (Math.floor(seconds / 86400) > 1 ? 's' : '') + ' ago';
    return Math.floor(seconds / 604800) + ' week' + (Math.floor(seconds / 604800) > 1 ? 's' : '') + ' ago';
}

// ==========================================
// FORM HANDLING
// ==========================================

function initAllForms() {
    Utils.log('Initializing all forms...');
    
    // Service Form
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', handleServiceSubmit);
        Utils.log('✓ Service form initialized');
    }
    
    // Staff Form
    const staffForm = document.getElementById('staffForm');
    if (staffForm) {
        staffForm.addEventListener('submit', handleStaffSubmit);
        Utils.log('✓ Staff form initialized');
    }
    
    // Settings Form
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
        Utils.log('✓ Settings form initialized');
    }
    
    // Photo Form
    initPhotoForm();
    loadUploadedPhotos();
    
    Utils.log('✓ All forms initialized');
}

function handleServiceSubmit(e) {
    e.preventDefault();
    Utils.log('Service form submitted');
    
    const formData = {
        id: Date.now(),
        name: getInputValue('serviceName'),
        category: getInputValue('serviceCategory'),
        price: parseFloat(getInputValue('servicePrice')) || 0,
        duration: parseInt(getInputValue('serviceDuration')) || 0,
        description: getInputValue('serviceDescription')
    };
    
    // Validation
    if (!formData.name || !formData.category || formData.price <= 0 || formData.duration <= 0) {
        showNotification('Please fill in all required fields correctly!', 'error');
        return;
    }
    
    // Save to storage
    const services = Storage.get('services', []);
    services.push(formData);
    Storage.set('services', services);
    
    // Add activity
    addActivity('plus-circle', `New service added: ${formData.name} - $${formData.price}`, 'success');
    
    showNotification(`✓ Service "${formData.name}" added successfully!`, 'success');
    document.getElementById('serviceForm').reset();
    loadServicesGrid();
}

function handleStaffSubmit(e) {
    e.preventDefault();
    Utils.log('Staff form submitted');
    
    const firstName = getInputValue('staffFirstName');
    const lastName = getInputValue('staffLastName');
    
    const formData = {
        id: Date.now(),
        name: firstName + ' ' + lastName,
        firstName: firstName,
        lastName: lastName,
        email: getInputValue('staffEmail'),
        phone: getInputValue('staffPhone'),
        role: getInputValue('staffSpecialty'),
        bio: getInputValue('staffBio')
    };
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.role) {
        showNotification('Please fill in all required fields!', 'error');
        return;
    }
    
    // Save to storage
    const staff = Storage.get('staff', []);
    staff.push(formData);
    Storage.set('staff', staff);
    
    // Add activity
    addActivity('user-plus', `New staff member added: ${formData.name} - ${formData.role}`, 'primary');
    
    showNotification(`✓ Staff member "${formData.name}" added successfully!`, 'success');
    document.getElementById('staffForm').reset();
    loadStaffGrid();
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    Utils.log('Settings form submitted');
    
    const formData = {
        businessName: getInputValue('businessName'),
        businessEmail: getInputValue('businessEmail'),
        businessPhone: getInputValue('businessPhone'),
        maxAdvanceBooking: getInputValue('maxAdvanceBooking'),
        cancellationHours: getInputValue('cancellationHours')
    };
    
    Storage.set('settings', formData);
    showNotification('✓ Settings saved successfully!', 'success');
}

// ==========================================
// CRUD OPERATIONS (GLOBAL FUNCTIONS)
// ==========================================

window.viewBooking = function(id) {
    const bookings = Storage.get('bookings', []);
    const booking = bookings.find(b => b.id === id);
    
    if (booking) {
        const details = `
Booking Details:
━━━━━━━━━━━━━━━━━━
ID: ${booking.id}
Customer: ${booking.customer}
Service: ${booking.service}
Date: ${booking.date}
Time: ${booking.time}
Staff: ${booking.staff}
Price: $${booking.price}
Status: ${booking.status.toUpperCase()}
        `;
        alert(details);
        Utils.log('View booking: ' + id);
    }
};

window.completeBooking = function(id) {
    if (confirm('Mark booking ' + id + ' as completed?')) {
        const bookings = Storage.get('bookings', []);
        const booking = bookings.find(b => b.id === id);
        
        if (booking) {
            booking.status = 'completed';
            Storage.set('bookings', bookings);
            
            // Add activity
            addActivity('check-circle', `Booking ${id} completed for ${booking.customer}`, 'success');
            addActivity('dollar-sign', `Payment received: $${booking.price}`, 'info');
            
            showNotification('Booking ' + id + ' marked as completed!', 'success');
            loadBookingsTable();
            loadStatistics(); // Update stats
        }
    }
};

window.cancelBooking = function(id) {
    if (confirm('Cancel booking ' + id + '?')) {
        const bookings = Storage.get('bookings', []);
        const booking = bookings.find(b => b.id === id);
        
        if (booking) {
            booking.status = 'cancelled';
            Storage.set('bookings', bookings);
            
            // Add activity
            addActivity('calendar-times', `Booking ${id} cancelled - ${booking.customer}`, 'danger');
            
            showNotification('Booking ' + id + ' cancelled', 'info');
            loadBookingsTable();
            loadStatistics(); // Update stats
        }
    }
};

window.editService = function(id) {
    showNotification('Editing service #' + id, 'info');
    navigateToSection('add-service');
};

window.deleteService = function(id) {
    if (confirm('Delete this service?')) {
        const services = Storage.get('services', []);
        const filtered = services.filter(function(s) { return s.id !== id; });
        Storage.set('services', filtered);
        showNotification('Service deleted successfully!', 'success');
        loadServicesGrid();
    }
};

window.editStaff = function(id) {
    showNotification('Editing staff member #' + id, 'info');
    navigateToSection('add-staff');
};

window.deleteStaff = function(id) {
    if (confirm('Delete this staff member?')) {
        const staff = Storage.get('staff', []);
        const filtered = staff.filter(function(s) { return s.id !== id; });
        Storage.set('staff', filtered);
        showNotification('Staff member deleted successfully!', 'success');
        loadStaffGrid();
    }
};

// ==========================================
// FORM RESET FUNCTIONS (GLOBAL)
// ==========================================

window.resetServiceForm = function() {
    const form = document.getElementById('serviceForm');
    if (form) {
        form.reset();
        showNotification('Form cleared', 'info');
    }
};

window.resetStaffForm = function() {
    const form = document.getElementById('staffForm');
    if (form) {
        form.reset();
        showNotification('Form cleared', 'info');
    }
};

window.resetSettings = function() {
    if (confirm('Reset all settings to default?')) {
        const form = document.getElementById('settingsForm');
        if (form) {
            form.reset();
            showNotification('Settings reset', 'info');
        }
    }
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function safeSetText(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    } else {
        Utils.log('Element not found: ' + elementId);
    }
}

function getInputValue(elementId) {
    const element = document.getElementById(elementId);
    return element ? element.value.trim() : '';
}

function showNotification(message, type) {
    type = type || 'info';
    
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    
    const icon = icons[type] || 'ℹ';
    alert(icon + ' ' + message);
    Utils.log('Notification (' + type + '): ' + message);
}

// ==========================================
// CUSTOM CURSOR
// ==========================================

function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) {
        Utils.log('Custom cursor elements not found - skipping');
        return;
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateOutline() {
        const distX = mouseX - outlineX;
        const distY = mouseY - outlineY;
        
        outlineX += distX * 0.15;
        outlineY += distY * 0.15;
        
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
        
        requestAnimationFrame(animateOutline);
    }
    animateOutline();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .sidebar-link, .stat-card, input, select, textarea');
    
    hoverElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
    
    Utils.log('✓ Custom cursor initialized');
}

// ==========================================
// CUSTOMER PHOTO MANAGEMENT
// ==========================================

// Reset photo form
window.resetPhotoForm = function() {
    const form = document.getElementById('photoForm');
    if (form) {
        form.reset();
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.style.display = 'none';
        }
    }
};

// Initialize photo upload form
function initPhotoForm() {
    const form = document.getElementById('photoForm');
    const photoFile = document.getElementById('photoFile');
    const previewImage = document.getElementById('previewImage');
    const photoPreview = document.getElementById('photoPreview');
    
    if (!form) {
        Utils.log('Photo form not found');
        return;
    }
    
    // Preview uploaded image
    if (photoFile) {
        photoFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (previewImage && photoPreview) {
                        previewImage.src = event.target.result;
                        photoPreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = getInputValue('photoTitle');
        const category = getInputValue('photoCategory');
        const description = getInputValue('photoDescription');
        const photoFile = document.getElementById('photoFile');
        
        if (!title || !category || !photoFile || !photoFile.files[0]) {
            showNotification('Please fill all required fields', 'error');
            return;
        }
        
        // Read the image file
        const reader = new FileReader();
        reader.onload = function(event) {
            const photoData = {
                id: 'photo_' + Date.now(),
                title: title,
                category: category,
                description: description,
                imageData: event.target.result,
                dateAdded: new Date().toISOString()
            };
            
            // Save to localStorage
            let customerPhotos = Storage.get('customerPhotos', []);
            customerPhotos.push(photoData);
            Storage.set('customerPhotos', customerPhotos);
            
            // Add activity
            addActivity('camera', `New customer photo uploaded: ${title}`, 'success');
            
            showNotification('Photo uploaded successfully! It will now appear in the gallery.', 'success');
            form.reset();
            if (photoPreview) {
                photoPreview.style.display = 'none';
            }
            
            // Refresh the photos list
            loadUploadedPhotos();
        };
        
        reader.readAsDataURL(photoFile.files[0]);
    });
    
    Utils.log('✓ Photo form initialized');
}

// Load and display uploaded photos in admin panel
function loadUploadedPhotos() {
    const photosList = document.getElementById('photosList');
    if (!photosList) return;
    
    const customerPhotos = Storage.get('customerPhotos', []);
    
    if (customerPhotos.length === 0) {
        photosList.innerHTML = '<p style="color: #999; padding: 20px; text-align: center;">No photos uploaded yet</p>';
        return;
    }
    
    photosList.innerHTML = customerPhotos.map(photo => `
        <div class="stat-card" style="position: relative; overflow: hidden;">
            <img src="${photo.imageData}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px 8px 0 0; margin: -20px -20px 10px -20px;" />
            <h4 style="margin-top: 10px; font-size: 14px;">${photo.title}</h4>
            <p style="font-size: 12px; color: #666; margin: 5px 0;">Category: ${photo.category}</p>
            <button onclick="deletePhoto('${photo.id}')" class="btn-secondary" style="width: 100%; margin-top: 10px; padding: 8px; font-size: 12px;">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `).join('');
}

// Delete a photo
window.deletePhoto = function(photoId) {
    if (!confirm('Are you sure you want to delete this photo?')) {
        return;
    }
    
    let customerPhotos = Storage.get('customerPhotos', []);
    customerPhotos = customerPhotos.filter(photo => photo.id !== photoId);
    Storage.set('customerPhotos', customerPhotos);
    
    showNotification('Photo deleted successfully', 'success');
    loadUploadedPhotos();
};

// ==========================================
// TEST DATA GENERATION
// ==========================================

window.createTestBooking = function() {
    const customers = ['John Smith', 'Emily Davis', 'Michael Brown', 'Sarah Wilson', 'David Garcia'];
    const services = ['Hair Styling', 'Facial Treatment', 'Manicure', 'Pedicure', 'Hair Coloring', 'Deep Conditioning'];
    const staff = ['Emma W.', 'David L.', 'Sarah J.', 'Michael R.', 'Lisa K.'];
    const prices = [45, 65, 35, 40, 85, 55];
    const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
    
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomService = services[Math.floor(Math.random() * services.length)];
    const randomStaff = staff[Math.floor(Math.random() * staff.length)];
    const randomPrice = prices[Math.floor(Math.random() * prices.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];
    
    // Random date within next 7 days
    const randomDays = Math.floor(Math.random() * 7);
    const bookingDate = new Date(Date.now() + (randomDays * 86400000));
    
    const bookings = Storage.get('bookings', []);
    const newBooking = {
        id: '#BK' + String(bookings.length + 1).padStart(3, '0'),
        customer: randomCustomer,
        service: randomService,
        date: bookingDate.toISOString().split('T')[0],
        time: randomTime,
        staff: randomStaff,
        status: 'confirmed',
        price: randomPrice
    };
    
    bookings.push(newBooking);
    Storage.set('bookings', bookings);
    
    // Add customer if doesn't exist
    let customers_db = Storage.get('customers', []);
    if (!customers_db.find(c => c.name === randomCustomer)) {
        customers_db.push({
            name: randomCustomer,
            email: randomCustomer.toLowerCase().replace(' ', '.') + '@example.com',
            totalBookings: 1
        });
        Storage.set('customers', customers_db);
    }
    
    // Add activity
    addActivity('calendar-check', `New booking created: ${randomCustomer} - ${randomService}`, 'success');
    
    showNotification(`✓ Test booking created for ${randomCustomer}!`, 'success');
    loadBookingsTable();
    loadStatistics();
};

// ==========================================
// ERROR HANDLING
// ==========================================

window.addEventListener('error', function(e) {
    Utils.error('Global error caught', e.error);
});

window.addEventListener('unhandledrejection', function(e) {
    Utils.error('Unhandled promise rejection', e.reason);
});

// ==========================================
// READY
// ==========================================

Utils.log('Admin Panel Script Loaded Successfully!');