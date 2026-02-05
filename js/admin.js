'use strict';

const Storage = {
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

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Panel Loading...');
    
    initNavigation();
    loadDashboardStats();
    loadRecentActivity();
    initModalButtons();
    loadServices(); // Load services on page load
    
    console.log('Admin Panel Ready!');
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
    
    console.log('Service button found:', !!btnAddService);
    console.log('Service modal found:', !!serviceModal);
    
    if (btnAddService && serviceModal) {
        btnAddService.addEventListener('click', function() {
            console.log('Opening Service Modal');
            serviceModal.classList.add('active');
            const form = document.getElementById('serviceModalForm');
            if (form) form.reset();
        });
        console.log('Service button event listener attached');
    } else {
        console.error('Service button or modal not found!');
    }
    
    if (closeService && serviceModal) {
        closeService.addEventListener('click', function() {
            serviceModal.classList.remove('active');
        });
    }
    
    if (cancelService && serviceModal) {
        cancelService.addEventListener('click', function() {
            serviceModal.classList.remove('active');
        });
    }
    
    if (saveServiceBtn) {
        console.log('Attaching saveService button event listener');
        saveServiceBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save Service button clicked');
            saveService();
        });
    } else {
        console.error('saveServiceBtn not found!');
    }
    
    // Add Staff Modal
    const btnAddStaff = document.getElementById('btnAddStaff');
    const staffModal = document.getElementById('addStaffModal');
    const closeStaff = document.getElementById('closeStaff');
    const cancelStaff = document.getElementById('cancelStaff');
    const saveStaffBtn = document.getElementById('saveStaffBtn');
    
    if (btnAddStaff) {
        btnAddStaff.addEventListener('click', function() {
            console.log('Opening Staff Modal');
            staffModal.classList.add('active');
            document.getElementById('staffModalForm').reset();
        });
    }
    
    if (closeStaff) {
        closeStaff.addEventListener('click', function() {
            staffModal.classList.remove('active');
        });
    }
    
    if (cancelStaff) {
        cancelStaff.addEventListener('click', function() {
            staffModal.classList.remove('active');
        });
    }
    
    if (saveStaffBtn) {
        saveStaffBtn.addEventListener('click', function() {
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
    
    if (btnAddPhoto) {
        btnAddPhoto.addEventListener('click', function() {
            console.log('Opening Photo Modal');
            photoModal.classList.add('active');
            document.getElementById('photoModalForm').reset();
            document.getElementById('photoPreview').style.display = 'none';
        });
    }
    
    if (closePhoto) {
        closePhoto.addEventListener('click', function() {
            photoModal.classList.remove('active');
        });
    }
    
    if (cancelPhoto) {
        cancelPhoto.addEventListener('click', function() {
            photoModal.classList.remove('active');
        });
    }
    
    if (savePhotoBtn) {
        savePhotoBtn.addEventListener('click', function() {
            savePhoto();
        });
    }
    
    // Add Service from services list page
    const btnAddServiceFromList = document.getElementById('btnAddServiceFromList');
    if (btnAddServiceFromList) {
        btnAddServiceFromList.addEventListener('click', function() {
            if (serviceModal) {
                serviceModal.classList.add('active');
                const form = document.getElementById('serviceModalForm');
                if (form) form.reset();
            }
        });
    }
    
    if (photoImage) {
        photoImage.addEventListener('change', function(e) {
            previewPhoto(e);
        });
    }
    
    // Close on Escape key only (removed background click to prevent accidental closes)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.admin-modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
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
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue.toFixed(0);
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

function addActivity(icon, message) {
    const activities = Storage.get('activities', []);
    activities.unshift({
        icon: icon,
        message: message,
        timestamp: new Date().toISOString()
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
        const services = Storage.get('services', []);
        console.log('Current services:', services);
        
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
        
        services.push(newService);
        Storage.set('services', services);
        
        console.log('Service saved to localStorage');
        
        // Trigger event for services page to reload
        window.dispatchEvent(new Event('servicesUpdated'));
        
        // Reload services list
        loadServices();
        
        addActivity('plus-circle', `New service added: ${name}`);
        alert(`Service "${name}" added successfully!`);
        
        // Close modal and reset form
        document.getElementById('addServiceModal').classList.remove('active');
        document.getElementById('serviceModalForm').reset();
        
        console.log('Service added successfully!');
    } catch (error) {
        console.error('Error saving service:', error);
        alert('Error saving service: ' + error.message);
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
        bio: bio,
        createdAt: new Date().toISOString()
    };
    
    staff.push(newStaff);
    Storage.set('staff', staff);
    
    addActivity('user-plus', `New staff member added: ${firstName} ${lastName}`);
    showToast(`Staff member "${firstName} ${lastName}" added successfully!`, 'success');
    
    document.getElementById('addStaffModal').classList.remove('active');
    document.getElementById('staffModalForm').reset();
}

function previewPhoto(event) {
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
}

function savePhoto() {
    const title = document.getElementById('modalPhotoTitle').value.trim();
    const category = document.getElementById('modalPhotoCategory').value.trim();
    const description = document.getElementById('modalPhotoDescription').value.trim();
    const fileInput = document.getElementById('modalPhotoImage');
    
    if (!title || !category || !fileInput.files[0]) {
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
            description: description,
            image: e.target.result,
            createdAt: new Date().toISOString()
        };
        
        photos.push(newPhoto);
        Storage.set('customerPhotos', photos);
        
        addActivity('camera', `New customer photo added: ${title}`);
        showToast(`Photo "${title}" added successfully!`, 'success');
        
        document.getElementById('addPhotoModal').classList.remove('active');
        document.getElementById('photoModalForm').reset();
        document.getElementById('photoPreview').style.display = 'none';
    };
    
    reader.onerror = function() {
        showToast('Error reading image file', 'error');
    };
    
    reader.readAsDataURL(file);
}

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
        toast.remove();
    }, 3000);
}

// ===================================
// SERVICES MANAGEMENT
// ===================================

function loadServices() {
    const services = Storage.get('services', []);
    const servicesGrid = document.getElementById('servicesGrid');
    const emptyState = document.getElementById('servicesEmpty');
    
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = '';
    
    if (services.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    services.forEach(service => {
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
    
    card.innerHTML = `
        <div class="service-card-header">
            <div class="service-icon" style="background: ${color}20; color: ${color};">
                <i class="fas ${icon}"></i>
            </div>
            <div class="service-actions">
                <button class="btn-icon btn-edit" onclick="editService(${service.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteService(${service.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="service-card-body">
            <h3>${service.name}</h3>
            <div class="service-meta">
                <span class="service-category">${service.category.charAt(0).toUpperCase() + service.category.slice(1)}</span>
                <span class="service-duration"><i class="fas fa-clock"></i> ${service.duration} min</span>
            </div>
            ${service.description ? `<p class="service-description">${service.description}</p>` : ''}
            <div class="service-price">$${service.price.toFixed(2)}</div>
        </div>
    `;
    
    return card;
}

function editService(serviceId) {
    const services = Storage.get('services', []);
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
        showToast('Service not found', 'error');
        return;
    }
    
    // Populate modal with service data
    document.getElementById('modalServiceName').value = service.name;
    document.getElementById('modalServiceCategory').value = service.category;
    document.getElementById('modalServicePrice').value = service.price;
    document.getElementById('modalServiceDuration').value = service.duration;
    document.getElementById('modalServiceDescription').value = service.description || '';
    
    // Change save button to update
    const saveBtn = document.getElementById('saveServiceBtn');
    saveBtn.textContent = 'Update Service';
    saveBtn.onclick = function() {
        updateService(serviceId);
    };
    
    // Open modal
    document.getElementById('addServiceModal').classList.add('active');
}

function updateService(serviceId) {
    const name = document.getElementById('modalServiceName').value.trim();
    const category = document.getElementById('modalServiceCategory').value.trim();
    const price = document.getElementById('modalServicePrice').value.trim();
    const duration = document.getElementById('modalServiceDuration').value.trim();
    const description = document.getElementById('modalServiceDescription').value.trim();
    
    if (!name || !category || !price || !duration) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    const services = Storage.get('services', []);
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) {
        showToast('Service not found', 'error');
        return;
    }
    
    services[serviceIndex] = {
        ...services[serviceIndex],
        name: name,
        category: category,
        price: parseFloat(price),
        duration: parseInt(duration),
        description: description,
        updatedAt: new Date().toISOString()
    };
    
    Storage.set('services', services);
    
    // Trigger event for services page to reload
    window.dispatchEvent(new Event('servicesUpdated'));
    
    // Reload services list
    loadServices();
    
    addActivity('edit', `Service updated: ${name}`);
    showToast(`Service "${name}" updated successfully!`, 'success');
    
    // Reset modal
    document.getElementById('addServiceModal').classList.remove('active');
    document.getElementById('serviceModalForm').reset();
    
    // Reset save button
    const saveBtn = document.getElementById('saveServiceBtn');
    saveBtn.textContent = 'Save Service';
    saveBtn.onclick = function() {
        saveService();
    };
}

function deleteService(serviceId) {
    const services = Storage.get('services', []);
    const service = services.find(s => s.id === serviceId);
    
    if (!service) {
        showToast('Service not found', 'error');
        return;
    }
    
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
        return;
    }
    
    const updatedServices = services.filter(s => s.id !== serviceId);
    Storage.set('services', updatedServices);
    
    // Trigger event for services page to reload
    window.dispatchEvent(new Event('servicesUpdated'));
    
    // Reload services list
    loadServices();
    
    addActivity('trash', `Service deleted: ${service.name}`);
    showToast(`Service "${service.name}" deleted successfully!`, 'success');
}

// Make functions globally accessible
window.editService = editService;
window.deleteService = deleteService;
