'use strict';

// Storage is defined in main.js - verify it's available
if (typeof Storage === 'undefined') {
    console.error('WARNING: Storage not found from main.js! Defining fallback...');
    window.Storage = {
        get: function(key, defaultValue = null) {
            try {
                const stored = localStorage.getItem(key);
                return stored ? JSON.parse(stored) : defaultValue;
            } catch (error) {
                console.error('Storage get error:', error);
                return defaultValue;
            }
        },
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Storage set error:', error);
                return false;
            }
        }
    };
} else {
    console.log('SUCCESS: Storage loaded from main.js');
}

// ===== DATA ISOLATION SYSTEM =====
// Helper function to get current shop owner
function getCurrentOwner() {
    const currentUser = Storage.get('currentUser', null);
    if (!currentUser || currentUser.role !== 'owner') {
        console.error('No shop owner logged in!');
        return null;
    }
    return currentUser;
}

// Helper function to get owner's unique ID
function getOwnerKey() {
    const owner = getCurrentOwner();
    if (!owner) return null;
    // Use email as unique identifier for the shop owner
    return owner.email;
}

// Filter data by current owner
function getOwnerData(dataKey, defaultValue = []) {
    const ownerKey = getOwnerKey();
    if (!ownerKey) return defaultValue;
    
    const allData = Storage.get(dataKey, []);
    
    // Filter data that belongs to this owner
    return allData.filter(item => item.ownerId === ownerKey || item.ownerEmail === ownerKey);
}

// Save data with owner ID
function saveOwnerData(dataKey, newItem) {
    const ownerKey = getOwnerKey();
    if (!ownerKey) {
        console.error('Cannot save data: No owner logged in');
        return false;
    }
    
    // Add owner identifier to the item
    newItem.ownerId = ownerKey;
    newItem.ownerEmail = ownerKey;
    
    // Get all data and add the new item
    const allData = Storage.get(dataKey, []);
    allData.push(newItem);
    Storage.set(dataKey, allData);
    
    return true;
}

// Update owner's data
function updateOwnerData(dataKey, itemId, updatedItem) {
    const ownerKey = getOwnerKey();
    if (!ownerKey) return false;
    
    // Add owner identifier
    updatedItem.ownerId = ownerKey;
    updatedItem.ownerEmail = ownerKey;
    
    const allData = Storage.get(dataKey, []);
    const index = allData.findIndex(item => 
        item.id === itemId && (item.ownerId === ownerKey || item.ownerEmail === ownerKey)
    );
    
    if (index !== -1) {
        allData[index] = updatedItem;
        Storage.set(dataKey, allData);
        return true;
    }
    
    return false;
}

// Delete owner's data
function deleteOwnerData(dataKey, itemId) {
    const ownerKey = getOwnerKey();
    if (!ownerKey) return false;
    
    const allData = Storage.get(dataKey, []);
    const filteredData = allData.filter(item => 
        !(item.id === itemId && (item.ownerId === ownerKey || item.ownerEmail === ownerKey))
    );
    
    Storage.set(dataKey, filteredData);
    return true;
}
// ===== END DATA ISOLATION SYSTEM =====

// Initialize admin panel
function initAdminPanel() {
    console.log('Admin Panel Initializing...');
    console.log('DOM Ready:', document.readyState);
    
    try {
        initNavigation();
        console.log('SUCCESS: Navigation initialized');
    } catch (e) {
        console.error('ERROR: Navigation error:', e);
    }
    
    try {
        loadDashboardStats();
        console.log('SUCCESS: Dashboard stats loaded');
    } catch (e) {
        console.error('ERROR: Dashboard stats error:', e);
    }
    
    try {
        loadRecentActivity();
        console.log('SUCCESS: Activity loaded');
    } catch (e) {
        console.error('ERROR: Activity error:', e);
    }
    
    try {
        initModalButtons();
        console.log('SUCCESS: Modal buttons initialized');
    } catch (e) {
        console.error('ERROR: Modal buttons error:', e);
    }
    
    try {
        loadServices();
        console.log('SUCCESS: Services loaded');
    } catch (e) {
        console.error('ERROR: Services error:', e);
    }
    
    console.log('Admin Panel Ready!');
}

// Initialize when DOM is ready - use multiple methods for compatibility
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPanel);
} else {
    // DOM already loaded
    initAdminPanel();
}

// Fallback initialization
window.addEventListener('load', function() {
    console.log('Window loaded - verifying initialization');
    // Only re-init if something failed
    if (!document.querySelector('.sidebar-link.active')) {
        console.warn('WARNING: Admin not initialized, running fallback...');
        initAdminPanel();
    }
});

function initNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.admin-content');
    
    contentSections.forEach(section => {
        section.style.display = section.classList.contains('active') ? 'block' : 'none';
    });
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                e.preventDefault();
                
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                contentSections.forEach(section => {
                    const sectionId = targetSection + '-section';
                    if (section.id === sectionId) {
                        section.classList.add('active');
                        section.style.display = 'block';
                    } else {
                        section.classList.remove('active');
                        section.style.display = 'none';
                    }
                });
            }
        });
    });
}

function initModalButtons() {
    console.log('Initializing modal buttons...');
    
    // Add Service Modal
    const btnAddService = document.getElementById('btnAddService');
    const serviceModal = document.getElementById('addServiceModal');
    const closeService = document.getElementById('closeService');
    const cancelService = document.getElementById('cancelService');
    const saveServiceBtn = document.getElementById('saveServiceBtn');
    
    console.log('btnAddService:', btnAddService ? 'FOUND' : 'NOT FOUND');
    console.log('serviceModal:', serviceModal ? 'FOUND' : 'NOT FOUND');
    console.log('saveServiceBtn:', saveServiceBtn ? 'FOUND' : 'NOT FOUND');
    
    if (btnAddService && serviceModal) {
        // Remove any existing listeners by cloning
        const newBtn = btnAddService.cloneNode(true);
        btnAddService.parentNode.replaceChild(newBtn, btnAddService);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Service button clicked!');
            serviceModal.classList.add('active');
            const form = document.getElementById('serviceModalForm');
            if (form) form.reset();
            console.log('Modal opened');
        });
        console.log('Service button event attached');
    } else {
        console.error('Service button or modal not found!');
    }
    
    if (closeService && serviceModal) {
        closeService.addEventListener('click', function() {
            console.log('Closing service modal');
            serviceModal.classList.remove('active');
        });
    }
    
    if (cancelService && serviceModal) {
        cancelService.addEventListener('click', function() {
            console.log('Canceling service modal');
            serviceModal.classList.remove('active');
        });
    }
    
    if (saveServiceBtn) {
        // Clone to remove old listeners
        const newSaveBtn = saveServiceBtn.cloneNode(true);
        saveServiceBtn.parentNode.replaceChild(newSaveBtn, saveServiceBtn);
        
        newSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save Service button clicked!');
            
            // Check if we're in edit mode
            const mode = newSaveBtn.getAttribute('data-mode');
            if (mode === 'edit' && window.editingServiceId) {
                updateService(window.editingServiceId);
            } else {
                saveService();
            }
        });
        console.log('Save Service button event attached');
    } else {
        console.error('saveServiceBtn not found!');
    }
    
    // Add Staff Modal
    const btnAddStaff = document.getElementById('btnAddStaff');
    const staffModal = document.getElementById('addStaffModal');
    const closeStaff = document.getElementById('closeStaff');
    const cancelStaff = document.getElementById('cancelStaff');
    const saveStaffBtn = document.getElementById('saveStaffBtn');
    
    console.log('btnAddStaff:', btnAddStaff ? 'FOUND' : 'NOT FOUND');
    
    if (btnAddStaff && staffModal) {
        const newStaffBtn = btnAddStaff.cloneNode(true);
        btnAddStaff.parentNode.replaceChild(newStaffBtn, btnAddStaff);
        
        newStaffBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Staff button clicked!');
            staffModal.classList.add('active');
            document.getElementById('staffModalForm').reset();
        });
        console.log('Staff button event attached');
    }
    
    if (closeStaff && staffModal) {
        closeStaff.addEventListener('click', function() {
            staffModal.classList.remove('active');
        });
    }
    
    if (cancelStaff && staffModal) {
        cancelStaff.addEventListener('click', function() {
            staffModal.classList.remove('active');
        });
    }
    
    if (saveStaffBtn) {
        const newSaveStaffBtn = saveStaffBtn.cloneNode(true);
        saveStaffBtn.parentNode.replaceChild(newSaveStaffBtn, saveStaffBtn);
        
        newSaveStaffBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save Staff button clicked!');
            saveStaff();
        });
    }
    
    // Add Photo Modal
    const btnAddPhoto = document.getElementById('btnAddPhoto');
    const photoModal = document.getElementById('addPhotoModal');
    const closePhoto = document.getElementById('closePhoto');
    const cancelPhoto = document.getElementById('cancelPhoto');
    const savePhotoBtn = document.getElementById('savePhotoBtn');
    const photoImage = document.getElementById('modalPhotoImage');
    
    console.log('btnAddPhoto:', btnAddPhoto ? 'FOUND' : 'NOT FOUND');
    
    if (btnAddPhoto && photoModal) {
        const newPhotoBtn = btnAddPhoto.cloneNode(true);
        btnAddPhoto.parentNode.replaceChild(newPhotoBtn, btnAddPhoto);
        
        newPhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Photo button clicked!');
            photoModal.classList.add('active');
            document.getElementById('photoModalForm').reset();
            document.getElementById('photoPreview').style.display = 'none';
        });
        console.log('Photo button event attached');
    }
    
    if (closePhoto && photoModal) {
        closePhoto.addEventListener('click', function() {
            photoModal.classList.remove('active');
        });
    }
    
    if (cancelPhoto && photoModal) {
        cancelPhoto.addEventListener('click', function() {
            photoModal.classList.remove('active');
        });
    }
    
    if (savePhotoBtn) {
        const newSavePhotoBtn = savePhotoBtn.cloneNode(true);
        savePhotoBtn.parentNode.replaceChild(newSavePhotoBtn, savePhotoBtn);
        
        newSavePhotoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save Photo button clicked!');
            savePhoto();
        });
    }
    
    // Add Service from services list page
    const btnAddServiceFromList = document.getElementById('btnAddServiceFromList');
    if (btnAddServiceFromList && serviceModal) {
        btnAddServiceFromList.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Add Service From List clicked!');
            serviceModal.classList.add('active');
            const form = document.getElementById('serviceModalForm');
            if (form) form.reset();
        });
    }
    
    if (photoImage) {
        photoImage.addEventListener('change', function(e) {
            previewPhoto(e);
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.admin-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    console.log('All modal buttons initialized');
}

function loadDashboardStats() {
    // Get only THIS owner's data
    const bookings = getOwnerData('bookings', []);
    const customers = getOwnerData('customers', []);
    const services = getOwnerData('services', []);
    const staff = getOwnerData('staff', []);
    
    const today = new Date().toDateString();
    
    const todayBookings = bookings.filter(b => new Date(b.date).toDateString() === today);
    const upcomingBookings = bookings.filter(b => new Date(b.date) > new Date());
    const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    
    const todayBookingsEl = document.getElementById('todayBookings');
    const upcomingBookingsEl = document.getElementById('upcomingBookings');
    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalCustomersEl = document.getElementById('totalCustomers');
    
    if (todayBookingsEl) todayBookingsEl.textContent = todayBookings.length;
    if (upcomingBookingsEl) upcomingBookingsEl.textContent = upcomingBookings.length;
    if (totalRevenueEl) totalRevenueEl.textContent = '$' + totalRevenue.toFixed(0);
    if (totalCustomersEl) totalCustomersEl.textContent = customers.length;
    
    console.log(`Dashboard Stats - Owner: ${getOwnerKey()}, Bookings: ${bookings.length}, Customers: ${customers.length}`);
}

function loadRecentActivity() {
    // Get only THIS owner's activities
    const activities = getOwnerData('activities', []);
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

function addActivity(icon, message) {
    const ownerKey = getOwnerKey();
    if (!ownerKey) return;
    
    const activities = Storage.get('activities', []);
    activities.unshift({
        icon: icon,
        message: message,
        timestamp: new Date().toISOString(),
        ownerId: ownerKey,
        ownerEmail: ownerKey
    });
    Storage.set('activities', activities.slice(0, 50));
    loadRecentActivity();
}

function saveService() {
    console.log('saveService function called');
    
    const name = document.getElementById('modalServiceName').value.trim();
    const category = document.getElementById('modalServiceCategory').value.trim();
    const price = document.getElementById('modalServicePrice').value.trim();
    const duration = document.getElementById('modalServiceDuration').value.trim();
    const description = document.getElementById('modalServiceDescription').value.trim();
    
    console.log('Form values:', { name, category, price, duration, description });
    
    // Validation
    if (!name) {
        alert('Please enter service name');
        return;
    }
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    if (!price || parseFloat(price) <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    if (!duration || parseInt(duration) <= 0) {
        alert('Please enter a valid duration');
        return;
    }
    
    try {
        const newService = {
            id: Date.now(),
            name: name,
            category: category,
            price: parseFloat(price),
            duration: parseInt(duration),
            description: description,
            createdAt: new Date().toISOString()
        };
        
        console.log('New service:', newService);
        
        // Save with owner ID
        const saved = saveOwnerData('services', newService);
        
        if (!saved) {
            throw new Error('Failed to save to localStorage');
        }
        
        console.log('Service saved to localStorage');
        
        // Trigger event for services page to reload
        window.dispatchEvent(new Event('servicesUpdated'));
        
        // Reload services list
        loadServices();
        
        addActivity('plus-circle', 'New service added: ' + name);
        alert('SUCCESS! Service "' + name + '" added successfully!');
        
        // Close modal and reset form
        document.getElementById('addServiceModal').classList.remove('active');
        document.getElementById('serviceModalForm').reset();
        
        console.log('Service added successfully!');
    } catch (error) {
        console.error('Error saving service:', error);
        alert('ERROR: Failed to save service - ' + error.message);
    }
}

function saveStaff() {
    const firstName = document.getElementById('modalStaffFirstName').value.trim();
    const lastName = document.getElementById('modalStaffLastName').value.trim();
    const specialty = document.getElementById('modalStaffSpecialty').value.trim();
    const email = document.getElementById('modalStaffEmail').value.trim();
    const phone = document.getElementById('modalStaffPhone').value.trim();
    const bio = document.getElementById('modalStaffBio').value.trim();
    
    if (!firstName || !lastName || !specialty || !email || !phone) {
        alert('Please fill in all required fields');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    const staff = Storage.get('staff', []);
    
    const newStaff = {
        id: Date.now(),
        firstName: firstName,
        lastName: lastName,
        name: firstName + ' ' + lastName,
        specialty: specialty,
        email: email,
        phone: phone,
        bio: bio,
        createdAt: new Date().toISOString()
    };
    
    // Save with owner ID
    saveOwnerData('staff', newStaff);
    
    addActivity('user-plus', 'New staff member added: ' + firstName + ' ' + lastName);
    alert('SUCCESS! Staff member "' + firstName + ' ' + lastName + '" added successfully!');
    
    document.getElementById('addStaffModal').classList.remove('active');
    document.getElementById('staffModalForm').reset();
}

function previewPhoto(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('photoPreview');
    const previewImage = document.getElementById('previewImage');
    const previewVideo = document.getElementById('previewVideo');
    
    if (!preview || !previewImage) return;
    
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (file.type.startsWith('image/')) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block';
                if (previewVideo) previewVideo.style.display = 'none';
            } else if (file.type.startsWith('video/')) {
                if (previewVideo) {
                    previewVideo.src = e.target.result;
                    previewVideo.style.display = 'block';
                    previewImage.style.display = 'none';
                }
            }
            preview.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
}

function savePhoto() {
    const name = document.getElementById('modalPhotoTitle').value.trim();
    const category = document.getElementById('modalPhotoCategory').value.trim();
    const description = document.getElementById('modalPhotoDescription').value.trim();
    const mediaType = document.getElementById('modalMediaType').value;
    const fileInput = document.getElementById('modalPhotoImage');
    
    if (!name || !category || !fileInput.files[0]) {
        alert('Please fill in all required fields and select a file');
        return;
    }
    
    const file = fileInput.files[0];
    
    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
        alert('Please select a valid image or video file');
        return;
    }
    
    // Check file size (10MB for images, 50MB for videos)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
        alert(`File size should be less than ${isVideo ? '50MB' : '10MB'}`);
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const newPhoto = {
            id: Date.now(),
            name: name,
            category: category,
            description: description,
            image: e.target.result,
            mediaType: isVideo ? 'video' : 'image',
            createdAt: new Date().toISOString()
        };
        
        // Save with owner ID
        saveOwnerData('customerPhotos', newPhoto);
        
        addActivity('camera', `New customer ${isVideo ? 'video' : 'photo'} added: ${name}`);
        alert(`SUCCESS! ${isVideo ? 'Video' : 'Photo'} "${name}" added successfully!`);
        
        document.getElementById('addPhotoModal').classList.remove('active');
        document.getElementById('photoModalForm').reset();
        document.getElementById('photoPreview').style.display = 'none';
    };
    
    reader.onerror = function() {
        alert('Error reading image file');
    };
    
    reader.readAsDataURL(file);
}

function showToast(message, type) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'success');
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    toast.innerHTML = '<i class="fas ' + icon + '"></i><span>' + message + '</span>';
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.remove();
    }, 3000);
}

// ===================================
// SERVICES MANAGEMENT
// ===================================

function loadServices() {
    // Get only THIS owner's services
    const services = getOwnerData('services', []);
    const servicesGrid = document.getElementById('servicesGrid');
    const emptyState = document.getElementById('servicesEmpty');
    
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    if (services.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    services.forEach(function(service) {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.setAttribute('data-service-id', service.id);
    
    const categoryIcons = {
        'hair': 'fa-cut',
        'skin': 'fa-spa',
        'facial': 'fa-face-smile',
        'spa': 'fa-hot-tub-person',
        'bridal': 'fa-ring'
    };
    
    const categoryColors = {
        'hair': '#FF6B6B',
        'skin': '#4ECDC4',
        'facial': '#FFE66D',
        'spa': '#95E1D3',
        'bridal': '#F38181'
    };
    
    const icon = categoryIcons[service.category] || 'fa-concierge-bell';
    const color = categoryColors[service.category] || '#D4AF37';
    
    const categoryName = service.category.charAt(0).toUpperCase() + service.category.slice(1);
    const descriptionHTML = service.description ? '<p class="service-description">' + service.description + '</p>' : '';
    
    card.innerHTML = '<div class="service-card-header">' +
        '<div class="service-icon" style="background: ' + color + '20; color: ' + color + ';">' +
        '<i class="fas ' + icon + '"></i>' +
        '</div>' +
        '<div class="service-actions">' +
        '<button class="btn-icon btn-edit" onclick="editService(' + service.id + ')" title="Edit">' +
        '<i class="fas fa-edit"></i>' +
        '</button>' +
        '<button class="btn-icon btn-delete" onclick="deleteService(' + service.id + ')" title="Delete">' +
        '<i class="fas fa-trash"></i>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div class="service-card-body">' +
        '<h3>' + service.name + '</h3>' +
        '<div class="service-meta">' +
        '<span class="service-category">' + categoryName + '</span>' +
        '<span class="service-duration"><i class="fas fa-clock"></i> ' + service.duration + ' min</span>' +
        '</div>' +
        descriptionHTML +
        '<div class="service-price">$' + service.price.toFixed(2) + '</div>' +
        '</div>';
    
    return card;
}

function editService(serviceId) {
    console.log('Editing service:', serviceId);
    const services = Storage.get('services', []);
    const service = services.find(function(s) { return s.id === serviceId; });
    
    if (!service) {
        alert('Service not found');
        return;
    }
    
    // Populate modal with service data
    document.getElementById('modalServiceName').value = service.name;
    document.getElementById('modalServiceCategory').value = service.category;
    document.getElementById('modalServicePrice').value = service.price;
    document.getElementById('modalServiceDuration').value = service.duration;
    document.getElementById('modalServiceDescription').value = service.description || '';
    
    // Store the service ID for update
    window.editingServiceId = serviceId;
    
    // Change save button text
    const saveBtn = document.getElementById('saveServiceBtn');
    saveBtn.textContent = 'Update Service';
    saveBtn.setAttribute('data-mode', 'edit');
    
    // Open modal
    document.getElementById('addServiceModal').classList.add('active');
}

function updateService(serviceId) {
    console.log('Updating service:', serviceId);
    
    const name = document.getElementById('modalServiceName').value.trim();
    const category = document.getElementById('modalServiceCategory').value.trim();
    const price = document.getElementById('modalServicePrice').value.trim();
    const duration = document.getElementById('modalServiceDuration').value.trim();
    const description = document.getElementById('modalServiceDescription').value.trim();
    
    // Validation
    if (!name) {
        alert('Please enter service name');
        return;
    }
    
    if (!category) {
        alert('Please select a category');
        return;
    }
    
    if (!price || parseFloat(price) <= 0) {
        alert('Please enter a valid price');
        return;
    }
    
    if (!duration || parseInt(duration) <= 0) {
        alert('Please enter a valid duration');
        return;
    }
    
    try {
        const updatedService = {
            id: serviceId,
            name: name,
            category: category,
            price: parseFloat(price),
            duration: parseInt(duration),
            description: description,
            updatedAt: new Date().toISOString()
        };
        
        // Update using owner-specific function
        const success = updateOwnerData('services', serviceId, updatedService);
        
        if (!success) {
            alert('Service not found or you do not have permission to edit it');
            return;
        }
        
        console.log('Service updated successfully');
        
        // Trigger event for services page to reload
        window.dispatchEvent(new Event('servicesUpdated'));
        
        // Reload services list
        loadServices();
        
        addActivity('edit', 'Service updated: ' + name);
        alert('SUCCESS! Service "' + name + '" updated successfully!');
        
        // Reset modal
        document.getElementById('addServiceModal').classList.remove('active');
        document.getElementById('serviceModalForm').reset();
        
        // Reset save button
        const saveBtn = document.getElementById('saveServiceBtn');
        saveBtn.textContent = 'Save Service';
        saveBtn.removeAttribute('data-mode');
        window.editingServiceId = null;
    } catch (error) {
        console.error('Error updating service:', error);
        alert('ERROR: Failed to update service - ' + error.message);
    }
}

function deleteService(serviceId) {
    console.log('Deleting service:', serviceId);
    
    // Get only THIS owner's services
    const services = getOwnerData('services', []);
    const service = services.find(function(s) { return s.id === serviceId; });
    
    if (!service) {
        alert('Service not found');
        return;
    }
    
    if (!confirm('Are you sure you want to delete "' + service.name + '"?\n\nThis action cannot be undone.')) {
        return;
    }
    
    try {
        // Delete using owner-specific delete function
        deleteOwnerData('services', serviceId);
        
        console.log('Service deleted successfully');
        
        // Trigger event for services page to reload
        window.dispatchEvent(new Event('servicesUpdated'));
        
        // Reload services list
        loadServices();
        
        addActivity('trash', 'Service deleted: ' + service.name);
        alert('SUCCESS! Service "' + service.name + '" deleted successfully!');
    } catch (error) {
        console.error('Error deleting service:', error);
        alert('ERROR: Failed to delete service - ' + error.message);
    }
}

// Make functions globally accessible
window.editService = editService;
window.deleteService = deleteService;
