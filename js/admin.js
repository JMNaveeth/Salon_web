// Admin panel JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin panel
    initAdminPanel();
    loadAdminData();
});

// Initialize admin panel navigation
function initAdminPanel() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');

            // Show corresponding section
            const sectionId = this.getAttribute('data-section') + '-section';
            showAdminSection(sectionId);
        });
    });

    // Initialize filters
    initFilters();

    // Initialize settings form
    initSettingsForm();
}

// Show admin section
function showAdminSection(sectionId) {
    const sections = document.querySelectorAll('.admin-content');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Trigger AOS refresh
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }
}

// Load admin data
function loadAdminData() {
    const bookings = Storage.get('bookings', []);
    const services = Storage.get('services', getDefaultServices());
    const staff = Storage.get('staff', getDefaultStaff());

    // Update overview stats
    updateOverviewStats(bookings);

    // Load sections
    loadRecentActivity(bookings);
    loadBookingsTable(bookings);
    loadServicesGrid(services);
    loadStaffGrid(staff);
}

// Update overview statistics
function updateOverviewStats(bookings) {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking =>
        booking.date === today && booking.status === 'confirmed'
    );

    const upcomingBookings = bookings.filter(booking => {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        return bookingDateTime >= new Date() && booking.status === 'confirmed';
    });

    const totalRevenue = bookings
        .filter(booking => booking.status === 'completed')
        .reduce((sum, booking) => sum + (booking.price || 0), 0);

    const uniqueCustomers = new Set(
        bookings.map(booking => booking.email)
    ).size;

    document.getElementById('todayBookings').textContent = todayBookings.length;
    document.getElementById('upcomingBookings').textContent = upcomingBookings.length;
    document.getElementById('totalRevenue').textContent = `$${totalRevenue}`;
    document.getElementById('totalCustomers').textContent = uniqueCustomers;
}

// Load recent activity
function loadRecentActivity(bookings) {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;

    // Sort bookings by creation date (most recent first)
    const recentBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    activityList.innerHTML = '';

    if (recentBookings.length === 0) {
        activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
        return;
    }

    recentBookings.forEach(booking => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        const date = new Date(booking.createdAt).toLocaleDateString();
        const time = formatTimeDisplay(
            parseInt(booking.time.split(':')[0]),
            parseInt(booking.time.split(':')[1])
        );

        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${getActivityIcon(booking.status)}"></i>
            </div>
            <div class="activity-info">
                <div class="activity-text">
                    ${booking.firstName} ${booking.lastName} ${getActivityText(booking.status)}
                    <strong>${booking.service.split(' - ')[0]}</strong>
                </div>
                <div class="activity-time">${date} at ${time}</div>
            </div>
        `;

        activityList.appendChild(activityItem);
    });
}

function getActivityIcon(status) {
    switch (status) {
        case 'confirmed': return 'fa-calendar-plus';
        case 'completed': return 'fa-check-circle';
        case 'cancelled': return 'fa-times-circle';
        default: return 'fa-info-circle';
    }
}

function getActivityText(status) {
    switch (status) {
        case 'confirmed': return 'booked';
        case 'completed': return 'completed';
        case 'cancelled': return 'cancelled';
        default: return 'updated';
    }
}

// Load bookings table
function loadBookingsTable(bookings) {
    const tableBody = document.getElementById('bookingsTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (bookings.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" class="empty-table">No bookings found</td>';
        tableBody.appendChild(emptyRow);
        return;
    }

    // Sort bookings by date and time
    bookings.sort((a, b) => {
        const dateTimeA = new Date(`${a.date}T${a.time}`);
        const dateTimeB = new Date(`${b.date}T${b.time}`);
        return dateTimeB - dateTimeA; // Most recent first
    });

    bookings.forEach(booking => {
        const row = createBookingRow(booking);
        tableBody.appendChild(row);
    });
}

function createBookingRow(booking) {
    const row = document.createElement('tr');

    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    const timeObj = booking.time.split(':');
    const formattedTime = formatTimeDisplay(parseInt(timeObj[0]), parseInt(timeObj[1]));

    const statusClass = booking.status === 'completed' ? 'completed' :
                       booking.status === 'cancelled' ? 'cancelled' : 'confirmed';

    row.innerHTML = `
        <td>${booking.id}</td>
        <td>${booking.firstName} ${booking.lastName}</td>
        <td>${booking.service.split(' - ')[0]}</td>
        <td>${formattedDate} ${formattedTime}</td>
        <td>${booking.staff || 'Any available'}</td>
        <td><span class="status-badge ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span></td>
        <td class="actions-cell">
            <button class="btn-icon" onclick="viewBooking('${booking.id}')" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="editBooking('${booking.id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            ${booking.status === 'confirmed' ?
                `<button class="btn-icon complete" onclick="completeBooking('${booking.id}')" title="Mark Complete">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon cancel" onclick="cancelBooking('${booking.id}')" title="Cancel">
                    <i class="fas fa-times"></i>
                </button>` : ''}
        </td>
    `;

    return row;
}

// Booking actions
function viewBooking(bookingId) {
    const bookings = Storage.get('bookings', []);
    const booking = bookings.find(b => b.id === bookingId);

    if (booking) {
        // For now, just show an alert with booking details
        // In a real app, this would open a detailed modal
        alert(`Booking Details:\n\nID: ${booking.id}\nCustomer: ${booking.firstName} ${booking.lastName}\nService: ${booking.service}\nDate: ${booking.date}\nTime: ${booking.time}\nStatus: ${booking.status}\nNotes: ${booking.notes || 'None'}`);
    }
}

function editBooking(bookingId) {
    // For demo purposes, just show an alert
    alert('Edit booking functionality would open a modal to modify booking details');
}

function completeBooking(bookingId) {
    if (confirm('Mark this booking as completed?')) {
        const bookings = Storage.get('bookings', []);
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'completed';
            Storage.set('bookings', bookings);
            loadAdminData();
            showMessage('Booking marked as completed', 'success');
        }
    }
}

function cancelBooking(bookingId) {
    if (confirm('Cancel this booking?')) {
        const bookings = Storage.get('bookings', []);
        const bookingIndex = bookings.findIndex(b => b.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            Storage.set('bookings', bookings);
            loadAdminData();
            showMessage('Booking cancelled', 'success');
        }
    }
}

// Load services grid
function loadServicesGrid(services) {
    const container = document.getElementById('servicesGridAdmin');
    if (!container) return;

    container.innerHTML = '';

    services.forEach(service => {
        const serviceCard = createServiceCard(service);
        container.appendChild(serviceCard);
    });
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-admin-card';

    card.innerHTML = `
        <div class="service-admin-header">
            <h4>${service.name}</h4>
            <div class="service-admin-actions">
                <button class="btn-icon" onclick="editService('${service.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteService('${service.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="service-admin-details">
            <div class="detail-item">
                <span class="label">Category:</span>
                <span class="value">${getCategoryName(service.category)}</span>
            </div>
            <div class="detail-item">
                <span class="label">Price:</span>
                <span class="value price">$${service.price}</span>
            </div>
            <div class="detail-item">
                <span class="label">Duration:</span>
                <span class="value">${service.duration} mins</span>
            </div>
        </div>
    `;

    return card;
}

function getCategoryName(category) {
    const categories = {
        hair: 'Hair Care',
        skin: 'Skin Care',
        bridal: 'Bridal',
        spa: 'Spa & Wellness'
    };
    return categories[category] || category;
}

// Service management
function showAddServiceModal() {
    document.getElementById('serviceModalTitle').textContent = 'Add Service';
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceModal').classList.add('show');
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('show');
}

function saveService() {
    const form = document.getElementById('serviceForm');
    const formData = new FormData(form);

    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return;
    }

    const serviceData = {
        id: 'service_' + Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        duration: parseInt(formData.get('duration')),
        description: formData.get('description')
    };

    const services = Storage.get('services', []);
    services.push(serviceData);
    Storage.set('services', services);

    closeServiceModal();
    loadServicesGrid(services);
    showMessage('Service added successfully', 'success');
}

function editService(serviceId) {
    const services = Storage.get('services', []);
    const service = services.find(s => s.id === serviceId);

    if (service) {
        document.getElementById('serviceModalTitle').textContent = 'Edit Service';
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceCategory').value = service.category;
        document.getElementById('servicePrice').value = service.price;
        document.getElementById('serviceDuration').value = service.duration;
        document.getElementById('serviceDescription').value = service.description;

        document.getElementById('serviceModal').classList.add('show');

        // Update save function to edit instead of add
        const saveBtn = document.querySelector('#serviceModal .btn-primary');
        const originalOnclick = saveBtn.onclick;
        saveBtn.onclick = function() {
            if (confirm('Save changes to this service?')) {
                const form = document.getElementById('serviceForm');
                const formData = new FormData(form);

                service.name = formData.get('name');
                service.category = formData.get('category');
                service.price = parseFloat(formData.get('price'));
                service.duration = parseInt(formData.get('duration'));
                service.description = formData.get('description');

                Storage.set('services', services);
                closeServiceModal();
                loadServicesGrid(services);
                showMessage('Service updated successfully', 'success');
            }
        };
    }
}

function deleteService(serviceId) {
    if (confirm('Delete this service? This action cannot be undone.')) {
        const services = Storage.get('services', []);
        const updatedServices = services.filter(s => s.id !== serviceId);
        Storage.set('services', updatedServices);
        loadServicesGrid(updatedServices);
        showMessage('Service deleted', 'success');
    }
}

// Load staff grid
function loadStaffGrid(staff) {
    const container = document.getElementById('staffGrid');
    if (!container) return;

    container.innerHTML = '';

    staff.forEach(member => {
        const staffCard = createStaffCard(member);
        container.appendChild(staffCard);
    });
}

function createStaffCard(member) {
    const card = document.createElement('div');
    card.className = 'staff-admin-card';

    card.innerHTML = `
        <div class="staff-admin-header">
            <h4>${member.firstName} ${member.lastName}</h4>
            <div class="staff-admin-actions">
                <button class="btn-icon" onclick="editStaff('${member.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteStaff('${member.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="staff-admin-details">
            <div class="detail-item">
                <span class="label">Specialty:</span>
                <span class="value">${member.specialty}</span>
            </div>
            <div class="detail-item">
                <span class="label">Email:</span>
                <span class="value">${member.email || 'Not provided'}</span>
            </div>
            <div class="detail-item">
                <span class="label">Phone:</span>
                <span class="value">${member.phone || 'Not provided'}</span>
            </div>
        </div>
    `;

    return card;
}

// Staff management functions (similar to services)
function showAddStaffModal() {
    document.getElementById('staffModalTitle').textContent = 'Add Staff';
    document.getElementById('staffForm').reset();
    document.getElementById('staffModal').classList.add('show');
}

function closeStaffModal() {
    document.getElementById('staffModal').classList.remove('show');
}

function saveStaff() {
    const form = document.getElementById('staffForm');
    const formData = new FormData(form);

    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return;
    }

    const staffData = {
        id: 'staff_' + Date.now(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        specialty: formData.get('specialty'),
        bio: formData.get('bio')
    };

    const staff = Storage.get('staff', []);
    staff.push(staffData);
    Storage.set('staff', staff);

    closeStaffModal();
    loadStaffGrid(staff);
    showMessage('Staff member added successfully', 'success');
}

function editStaff(staffId) {
    const staff = Storage.get('staff', []);
    const member = staff.find(s => s.id === staffId);

    if (member) {
        document.getElementById('staffModalTitle').textContent = 'Edit Staff';
        document.getElementById('staffFirstName').value = member.firstName;
        document.getElementById('staffLastName').value = member.lastName;
        document.getElementById('staffEmail').value = member.email || '';
        document.getElementById('staffPhone').value = member.phone || '';
        document.getElementById('staffSpecialty').value = member.specialty;
        document.getElementById('staffBio').value = member.bio || '';

        document.getElementById('staffModal').classList.add('show');
    }
}

function deleteStaff(staffId) {
    if (confirm('Delete this staff member? This action cannot be undone.')) {
        const staff = Storage.get('staff', []);
        const updatedStaff = staff.filter(s => s.id !== staffId);
        Storage.set('staff', updatedStaff);
        loadStaffGrid(updatedStaff);
        showMessage('Staff member deleted', 'success');
    }
}

// Initialize filters
function initFilters() {
    const dateFilter = document.getElementById('bookingDateFilter');
    const statusFilter = document.getElementById('bookingStatusFilter');

    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            filterBookings();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterBookings();
        });
    }
}

function filterBookings() {
    const dateFilter = document.getElementById('bookingDateFilter').value;
    const statusFilter = document.getElementById('bookingStatusFilter').value;
    const bookings = Storage.get('bookings', []);

    let filteredBookings = bookings;

    if (dateFilter) {
        filteredBookings = filteredBookings.filter(booking => booking.date === dateFilter);
    }

    if (statusFilter !== 'all') {
        filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }

    loadBookingsTable(filteredBookings);
}

// Settings form
function initSettingsForm() {
    const settingsForm = document.getElementById('settingsForm');

    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(settingsForm);
            const settings = Object.fromEntries(formData);

            Storage.set('settings', settings);
            showMessage('Settings saved successfully', 'success');
        });
    }
}

function resetSettings() {
    if (confirm('Reset all settings to default values?')) {
        document.getElementById('settingsForm').reset();
        Storage.remove('settings');
        showMessage('Settings reset to defaults', 'success');
    }
}

// Default data
function getDefaultServices() {
    return [
        { id: 'service_1', name: 'Haircut & Styling', category: 'hair', price: 45, duration: 45, description: 'Professional haircuts, styling, and finishing' },
        { id: 'service_2', name: 'Hair Coloring', category: 'hair', price: 85, duration: 90, description: 'Expert hair coloring services' },
        { id: 'service_3', name: 'Facial Treatment', category: 'skin', price: 75, duration: 60, description: 'Customized facial treatments' },
        { id: 'service_4', name: 'Swedish Massage', category: 'spa', price: 80, duration: 60, description: 'Relaxing full-body massage' }
    ];
}

function getDefaultStaff() {
    return [
        { id: 'staff_1', firstName: 'Sarah', lastName: 'Johnson', email: 'sarah@jksalon.com', phone: '+1234567890', specialty: 'Hair Specialist', bio: 'Expert in all hair services' },
        { id: 'staff_2', firstName: 'Mike', lastName: 'Chen', email: 'mike@jksalon.com', phone: '+1234567891', specialty: 'Color Expert', bio: 'Specializes in hair coloring and treatments' },
        { id: 'staff_3', firstName: 'Emma', lastName: 'Davis', email: 'emma@jksalon.com', phone: '+1234567892', specialty: 'Spa Therapist', bio: 'Certified massage and spa therapist' }
    ];
}

// Utility functions
function formatTimeDisplay(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Initialize modal close events
document.addEventListener('DOMContentLoaded', function() {
    // Service modal
    const serviceModal = document.getElementById('serviceModal');
    const serviceClose = serviceModal?.querySelector('.modal-close');
    if (serviceClose) {
        serviceClose.addEventListener('click', closeServiceModal);
    }

    // Staff modal
    const staffModal = document.getElementById('staffModal');
    const staffClose = staffModal?.querySelector('.modal-close');
    if (staffClose) {
        staffClose.addEventListener('click', closeStaffModal);
    }

    // Close modals when clicking outside
    [serviceModal, staffModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        }
    });
});
