// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    loadDashboardData();
    initProfileForm();
});

// Initialize dashboard navigation
function initDashboard() {
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
            showDashboardSection(sectionId);
        });
    });
}

// Show dashboard section
function showDashboardSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-content');
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

// Load dashboard data
function loadDashboardData() {
    const bookings = Storage.get('bookings', []);
    const userProfile = Storage.get('userProfile', {});

    // Separate upcoming and past bookings
    const now = new Date();
    const upcomingBookings = [];
    const pastBookings = [];

    bookings.forEach(booking => {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        if (bookingDateTime >= now && booking.status !== 'cancelled') {
            upcomingBookings.push(booking);
        } else {
            pastBookings.push(booking);
        }
    });

    // Sort bookings by date
    upcomingBookings.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    pastBookings.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

    // Update stats
    updateDashboardStats(bookings, upcomingBookings, pastBookings);

    // Load sections
    loadUpcomingAppointments(upcomingBookings);
    loadBookingHistory(pastBookings);
    loadProfileData(userProfile);
}

// Update dashboard statistics
function updateDashboardStats(allBookings, upcomingBookings, pastBookings) {
    const totalBookingsEl = document.getElementById('totalBookings');
    const completedBookingsEl = document.getElementById('completedBookings');
    const upcomingCountEl = document.getElementById('upcomingCount');

    const completedCount = pastBookings.filter(booking => booking.status === 'completed').length;

    if (totalBookingsEl) totalBookingsEl.textContent = allBookings.length;
    if (completedBookingsEl) completedBookingsEl.textContent = completedCount;
    if (upcomingCountEl) upcomingCountEl.textContent = upcomingBookings.length;
}

// Load upcoming appointments
function loadUpcomingAppointments(bookings) {
    const container = document.getElementById('upcomingAppointments');
    const emptyState = document.getElementById('upcomingEmpty');

    if (!container) return;

    container.innerHTML = '';

    if (bookings.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (container) container.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    bookings.forEach(booking => {
        const appointmentCard = createAppointmentCard(booking, 'upcoming');
        container.appendChild(appointmentCard);
    });
}

// Load booking history
function loadBookingHistory(bookings) {
    const container = document.getElementById('historyAppointments');
    const emptyState = document.getElementById('historyEmpty');
    const filterTabs = document.querySelectorAll('.tab-btn');

    if (!container) return;

    // Show all bookings initially
    filterBookings(bookings, 'all');

    // Filter functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterBookings(bookings, filter);
        });
    });
}

function filterBookings(bookings, filter) {
    const container = document.getElementById('historyAppointments');
    const emptyState = document.getElementById('historyEmpty');

    if (!container) return;

    container.innerHTML = '';

    let filteredBookings = bookings;

    if (filter !== 'all') {
        filteredBookings = bookings.filter(booking => booking.status === filter);
    }

    if (filteredBookings.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (container) container.style.display = 'none';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    filteredBookings.forEach(booking => {
        const appointmentCard = createAppointmentCard(booking, 'history');
        container.appendChild(appointmentCard);
    });
}

// Create appointment card
function createAppointmentCard(booking, type) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.setAttribute('data-booking-id', booking.id);

    // Format date and time
    const dateObj = new Date(booking.date);
    const timeObj = booking.time.split(':');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = formatTimeDisplay(parseInt(timeObj[0]), parseInt(timeObj[1]));

    // Status styling
    const statusClass = booking.status === 'completed' ? 'completed' :
                       booking.status === 'cancelled' ? 'cancelled' : 'confirmed';

    card.innerHTML = `
        <div class="appointment-header">
            <div class="appointment-info">
                <h4>${booking.service.split(' - ')[0]}</h4>
                <div class="appointment-meta">
                    <span class="date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span class="time"><i class="fas fa-clock"></i> ${formattedTime}</span>
                </div>
            </div>
            <div class="appointment-status">
                <span class="status-badge ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </div>
        </div>
        <div class="appointment-details">
            <div class="detail-item">
                <span class="label">Staff:</span>
                <span class="value">${booking.staff || 'Any available'}</span>
            </div>
            <div class="detail-item">
                <span class="label">Price:</span>
                <span class="value price">$${booking.price || '0'}</span>
            </div>
            <div class="detail-item">
                <span class="label">Booking ID:</span>
                <span class="value">${booking.id}</span>
            </div>
        </div>
        <div class="appointment-actions">
            <button class="btn-secondary view-details" data-booking-id="${booking.id}">
                <i class="fas fa-eye"></i> View Details
            </button>
            ${type === 'upcoming' && booking.status !== 'cancelled' ?
                `<button class="btn-outline cancel-booking" data-booking-id="${booking.id}">
                    <i class="fas fa-times"></i> Cancel
                </button>` : ''}
        </div>
    `;

    // Add event listeners
    const viewBtn = card.querySelector('.view-details');
    const cancelBtn = card.querySelector('.cancel-booking');

    if (viewBtn) {
        viewBtn.addEventListener('click', () => showAppointmentModal(booking));
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => cancelAppointment(booking.id));
    }

    return card;
}

// Show appointment modal
function showAppointmentModal(booking) {
    const modal = document.getElementById('appointmentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalService = document.getElementById('modalService');
    const modalDate = document.getElementById('modalDate');
    const modalTime = document.getElementById('modalTime');
    const modalStaff = document.getElementById('modalStaff');
    const modalPrice = document.getElementById('modalPrice');
    const modalStatus = document.getElementById('modalStatus');
    const modalNotes = document.getElementById('modalNotes');
    const notesGroup = document.getElementById('notesGroup');
    const modalActions = document.getElementById('modalActions');

    if (!modal) return;

    // Format date and time
    const dateObj = new Date(booking.date);
    const timeObj = booking.time.split(':');
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = formatTimeDisplay(parseInt(timeObj[0]), parseInt(timeObj[1]));

    // Update modal content
    modalTitle.textContent = 'Appointment Details';
    modalService.textContent = booking.service.split(' - ')[0];
    modalDate.textContent = formattedDate;
    modalTime.textContent = formattedTime;
    modalStaff.textContent = booking.staff || 'Any available';
    modalPrice.textContent = `$${booking.price || '0'}`;
    modalStatus.textContent = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    modalStatus.className = `status-badge ${booking.status}`;

    if (booking.notes) {
        modalNotes.textContent = booking.notes;
        notesGroup.style.display = 'block';
    } else {
        notesGroup.style.display = 'none';
    }

    // Modal actions
    modalActions.innerHTML = `
        <button class="btn-secondary" onclick="closeAppointmentModal()">Close</button>
        ${booking.status === 'confirmed' ?
            `<button class="btn-outline" onclick="cancelAppointment('${booking.id}')">
                <i class="fas fa-times"></i> Cancel Appointment
            </button>` : ''}
    `;

    // Show modal
    modal.classList.add('show');
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Cancel appointment
function cancelAppointment(bookingId) {
    if (confirm('Are you sure you want to cancel this appointment? This action cannot be undone.')) {
        const bookings = Storage.get('bookings', []);
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            Storage.set('bookings', bookings);

            // Refresh dashboard
            loadDashboardData();
            closeAppointmentModal();

            showMessage('Appointment cancelled successfully', 'success');
        }
    }
}

// Profile management
function initProfileForm() {
    const profileForm = document.getElementById('profileForm');

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(profileForm);
            const profileData = Object.fromEntries(formData);

            // Save profile data
            Storage.set('userProfile', profileData);

            showMessage('Profile updated successfully', 'success');
        });
    }
}

function loadProfileData(profileData) {
    const firstNameEl = document.getElementById('profileFirstName');
    const lastNameEl = document.getElementById('profileLastName');
    const emailEl = document.getElementById('profileEmail');
    const phoneEl = document.getElementById('profilePhone');
    const preferredStaffEl = document.getElementById('preferredStaff');
    const notificationsEl = document.getElementById('notificationPreference');

    if (firstNameEl) firstNameEl.value = profileData.firstName || '';
    if (lastNameEl) lastNameEl.value = profileData.lastName || '';
    if (emailEl) emailEl.value = profileData.email || '';
    if (phoneEl) phoneEl.value = profileData.phone || '';
    if (preferredStaffEl) preferredStaffEl.value = profileData.preferredStaff || '';
    if (notificationsEl) notificationsEl.value = profileData.notifications || 'all';
}

function resetProfileForm() {
    if (confirm('Are you sure you want to reset all profile changes?')) {
        loadProfileData(Storage.get('userProfile', {}));
    }
}

// Utility functions
function formatTimeDisplay(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Initialize modal close events
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('appointmentModal');
    const modalClose = document.querySelector('.modal-close');

    if (modal && modalClose) {
        modalClose.addEventListener('click', closeAppointmentModal);

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAppointmentModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeAppointmentModal();
            }
        });
    }
});
