'use strict';

const AdminPanel = {
    currentSection: 'overview',
    initialized: false,
    debug: true
};

const Utils = {
    log: function(message, data = null) {
        if (AdminPanel.debug) {
            console.log(`[Admin Panel] ${message}`, data || '');
        }
    },
    
    error: function(message, error = null) {
        console.error(`[Admin Panel ERROR] ${message}`, error || '');
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
    }
};

document.addEventListener('DOMContentLoaded', function() {
    Utils.log('Initializing Admin Panel...');
    
    if (typeof AOS !== 'undefined') {
        try {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                delay: 50,
                easing: 'ease-in-out'
            });
            Utils.log('AOS initialized');
        } catch (error) {
            Utils.error('AOS initialization failed', error);
        }
    }
    
    setTimeout(function() {
        try {
            initNavigation();
            loadAllData();
            initCustomCursor();
            AdminPanel.initialized = true;
            Utils.log('Admin Panel Initialized Successfully');
        } catch (error) {
            Utils.error('Initialization error', error);
        }
    }, 150);
});

function initNavigation() {
    Utils.log('Initializing navigation...');
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.admin-content');
    
    contentSections.forEach(function(section) {
        const isActive = section.classList.contains('active');
        section.style.display = isActive ? 'block' : 'none';
    });
    
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetSection = this.getAttribute('data-section');
            
            if (targetSection) {
                e.preventDefault();
                navigateToSection(targetSection);
            }
        });
    });
    
    Utils.log('Navigation initialized');
}

function navigateToSection(sectionName) {
    Utils.log(`Navigating to: ${sectionName}`);
    
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(function(link) {
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    const targetId = sectionName + '-section';
    const contentSections = document.querySelectorAll('.admin-content');
    
    contentSections.forEach(function(section) {
        if (section.id === targetId) {
            section.classList.add('active');
            section.style.display = 'block';
        } else {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    });
    
    AdminPanel.currentSection = sectionName;
}

function loadAllData() {
    loadDashboardStats();
    loadRecentActivity();
}

function loadDashboardStats() {
    const bookings = Storage.get('bookings', []);
    const today = new Date().toDateString();
    
    const todayBookings = bookings.filter(b => new Date(b.date).toDateString() === today);
    const upcomingBookings = bookings.filter(b => new Date(b.date) > new Date());
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    const customers = Storage.get('customers', []);
    
    document.getElementById('todayBookings').textContent = todayBookings.length;
    document.getElementById('upcomingBookings').textContent = upcomingBookings.length;
    document.getElementById('totalRevenue').textContent = Utils.formatCurrency(totalRevenue);
    document.getElementById('totalCustomers').textContent = customers.length;
}

function loadRecentActivity() {
    const activities = Storage.get('activities', []);
    const activityList = document.getElementById('recentActivity');
    
    if (!activityList) return;
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = activities.slice(0, 10).map(activity => `
        <div class="activity-item">
            <i class="fas fa-${activity.icon}"></i>
            <div class="activity-info">
                <p>${activity.message}</p>
                <span>${new Date(activity.timestamp).toLocaleString()}</span>
            </div>
        </div>
    `).join('');
}

function addActivity(icon, message, type) {
    const activities = Storage.get('activities', []);
    activities.unshift({
        icon: icon,
        message: message,
        type: type,
        timestamp: new Date().toISOString()
    });
    Storage.set('activities', activities.slice(0, 50));
}

function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    document.addEventListener('mousemove', function(e) {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        cursorOutline.style.left = e.clientX + 'px';
        cursorOutline.style.top = e.clientY + 'px';
    });
}

// Service Modal Functions
window.openServiceModal = function() {
    Utils.log('Opening Service Modal');
    const modal = document.getElementById('addServiceModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('serviceModalForm')?.reset();
    }
};

window.closeServiceModal = function() {
    Utils.log('Closing Service Modal');
    const modal = document.getElementById('addServiceModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('serviceModalForm')?.reset();
    }
};

window.saveService = function() {
    Utils.log('Saving Service');
    const form = document.getElementById('serviceModalForm');
    if (!form) return;
    
    const name = document.getElementById('modalServiceName')?.value?.trim();
    const category = document.getElementById('modalServiceCategory')?.value?.trim();
    const price = document.getElementById('modalServicePrice')?.value?.trim();
    const duration = document.getElementById('modalServiceDuration')?.value?.trim();
    const description = document.getElementById('modalServiceDescription')?.value?.trim();
    
    if (!name || !category || !price || !duration) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const services = Storage.get('services', []);
    
    const newService = {
        id: Date.now(),
        name: name,
        category: category,
        price: parseFloat(price),
        duration: parseInt(duration),
        description: description || '',
        createdAt: new Date().toISOString()
    };
    
    services.push(newService);
    Storage.set('services', services);
    
    addActivity('plus-circle', `New service added: ${name}`, 'success');
    showToast(`Service "${name}" added successfully!`, 'success');
    
    closeServiceModal();
};

// Staff Modal Functions
window.openStaffModal = function() {
    Utils.log('Opening Staff Modal');
    const modal = document.getElementById('addStaffModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('staffModalForm')?.reset();
    }
};

window.closeStaffModal = function() {
    Utils.log('Closing Staff Modal');
    const modal = document.getElementById('addStaffModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('staffModalForm')?.reset();
    }
};

window.saveStaff = function() {
    Utils.log('Saving Staff');
    const form = document.getElementById('staffModalForm');
    if (!form) return;
    
    const firstName = document.getElementById('modalStaffFirstName')?.value?.trim();
    const lastName = document.getElementById('modalStaffLastName')?.value?.trim();
    const specialty = document.getElementById('modalStaffSpecialty')?.value?.trim();
    const email = document.getElementById('modalStaffEmail')?.value?.trim();
    const phone = document.getElementById('modalStaffPhone')?.value?.trim();
    const bio = document.getElementById('modalStaffBio')?.value?.trim();
    
    if (!firstName || !lastName || !specialty || !email || !phone) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    const staff = Storage.get('staff', []);
    
    const newStaff = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: `${firstName} ${lastName}`,
        specialty: specialty,
        email: email,
        phone: phone,
        bio: bio || '',
        createdAt: new Date().toISOString()
    };
    
    staff.push(newStaff);
    Storage.set('staff', staff);
    
    addActivity('user-plus', `New staff member added: ${firstName} ${lastName}`, 'success');
    showToast(`Staff member "${firstName} ${lastName}" added successfully!`, 'success');
    
    closeStaffModal();
};

// Photo Modal Functions
window.openPhotoModal = function() {
    Utils.log('Opening Photo Modal');
    const modal = document.getElementById('addPhotoModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('photoModalForm')?.reset();
        const preview = document.getElementById('photoPreview');
        if (preview) {
            preview.style.display = 'none';
        }
    }
};

window.closePhotoModal = function() {
    Utils.log('Closing Photo Modal');
    const modal = document.getElementById('addPhotoModal');
    if (modal) {
        modal.classList.remove('active');
        document.getElementById('photoModalForm')?.reset();
    }
};

window.previewPhoto = function(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    
    if (!preview || !previewImage) return;
    
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
};

window.savePhoto = function() {
    Utils.log('Saving Photo');
    const form = document.getElementById('photoModalForm');
    if (!form) return;
    
    const title = document.getElementById('modalPhotoTitle')?.value?.trim();
    const category = document.getElementById('modalPhotoCategory')?.value?.trim();
    const description = document.getElementById('modalPhotoDescription')?.value?.trim();
    const fileInput = document.getElementById('modalPhotoImage');
    
    if (!title || !category || !fileInput || !fileInput.files[0]) {
        showToast('Please fill in all required fields and select an image', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const photos = Storage.get('customerPhotos', []);
        
        const newPhoto = {
            id: Date.now(),
            title: title,
            category: category,
            description: description || '',
            image: e.target.result,
            createdAt: new Date().toISOString()
        };
        
        photos.push(newPhoto);
        Storage.set('customerPhotos', photos);
        
        addActivity('camera', `New customer photo added: ${title}`, 'success');
        showToast(`Photo "${title}" added successfully!`, 'success');
        
        closePhotoModal();
    };
    
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    
    reader.readAsDataURL(file);
};

// Toast Notification
function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close modals on background click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('admin-modal')) {
        if (e.target.id === 'addServiceModal') {
            closeServiceModal();
        } else if (e.target.id === 'addStaffModal') {
            closeStaffModal();
        } else if (e.target.id === 'addPhotoModal') {
            closePhotoModal();
        }
    }
});

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.admin-modal.active');
        if (activeModal) {
            if (activeModal.id === 'addServiceModal') {
                closeServiceModal();
            } else if (activeModal.id === 'addStaffModal') {
                closeStaffModal();
            } else if (activeModal.id === 'addPhotoModal') {
                closePhotoModal();
            }
        }
    }
});