// Dashboard JavaScript functionality

// Real-time update interval
let dashboardUpdateInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    loadDashboardData();
    initProfileForm();
    
    // Start real-time updates (refresh every 5 seconds)
    startRealTimeUpdates();
    
    // Update reminder statistics
    updateReminderStats();
    
    // Update reminder stats every minute
    setInterval(updateReminderStats, 60000);
});

// Start real-time updates
function startRealTimeUpdates() {
    // Update dashboard every 5 seconds
    dashboardUpdateInterval = setInterval(() => {
        loadDashboardData();
    }, 5000);
}

// Stop real-time updates (call when leaving dashboard)
function stopRealTimeUpdates() {
    if (dashboardUpdateInterval) {
        clearInterval(dashboardUpdateInterval);
    }
}

// Listen for storage changes from other tabs/windows
window.addEventListener('storage', function(e) {
    if (e.key === 'bookings' || e.key === 'userProfile') {
        loadDashboardData();
    }
});

// Initialize dashboard navigation
function initDashboard() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const actionLinks = document.querySelectorAll('.action-card[data-section]');

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

    // Quick action navigation
    actionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            // Update sidebar active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            const targetLink = document.querySelector(`.sidebar-link[data-section="${section}"]`);
            if (targetLink) targetLink.classList.add('active');
            
            // Show section
            showDashboardSection(section + '-section');
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
    loadOverviewSection(bookings, upcomingBookings, pastBookings);
    loadAnalytics(bookings);
    loadBookingHistory(bookings); // Pass ALL bookings, not just past ones
    loadProfileData(userProfile);
}

// Update dashboard statistics
function updateDashboardStats(allBookings, upcomingBookings, pastBookings) {
    const totalBookingsEl = document.getElementById('totalBookings');
    const completedBookingsEl = document.getElementById('completedBookings');
    const pendingCountEl = document.getElementById('pendingCount');

    const completedCount = allBookings.filter(booking => booking.status === 'completed').length;
    const pendingCount = allBookings.filter(booking => booking.status === 'pending').length;

    if (totalBookingsEl) totalBookingsEl.textContent = allBookings.length;
    if (completedBookingsEl) completedBookingsEl.textContent = completedCount;
    if (pendingCountEl) pendingCountEl.textContent = pendingCount;
}

// Load overview section
function loadOverviewSection(allBookings, upcomingBookings, pastBookings) {
    // Update overview stats
    const confirmedCount = allBookings.filter(b => b.status === 'confirmed').length;
    const completedCount = allBookings.filter(b => b.status === 'completed').length;
    const pendingCount = allBookings.filter(b => b.status === 'pending').length;
    const cancelledCount = allBookings.filter(b => b.status === 'cancelled').length;
    
    // Calculate total spent (only from completed bookings)
    const totalSpent = allBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);
    
    const overviewConfirmedEl = document.getElementById('overviewConfirmed');
    const overviewCompletedEl = document.getElementById('overviewCompleted');
    const overviewPendingEl = document.getElementById('overviewPending');
    const overviewCancelledEl = document.getElementById('overviewCancelled');
    const totalSpentEl = document.getElementById('totalSpent');
    
    if (overviewConfirmedEl) overviewConfirmedEl.textContent = confirmedCount;
    if (overviewCompletedEl) overviewCompletedEl.textContent = completedCount;
    if (overviewPendingEl) overviewPendingEl.textContent = pendingCount;
    if (overviewCancelledEl) overviewCancelledEl.textContent = cancelledCount;
    if (totalSpentEl) totalSpentEl.textContent = totalSpent.toFixed(0);
    
    // Load recent activity
    loadRecentActivity(allBookings);
}

// Load recent activity
function loadRecentActivity(bookings) {
    const container = document.getElementById('recentActivityList');
    const emptyState = document.getElementById('noActivityEmpty');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (bookings.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    // Sort by date and show last 3
    const recentBookings = bookings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    
    recentBookings.forEach(booking => {
        const activityItem = createActivityItem(booking);
        container.appendChild(activityItem);
    });
}

// Create activity item
function createActivityItem(booking) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const statusColors = {
        'completed': { bg: 'rgba(76, 175, 80, 0.2)', color: '#4CAF50', icon: 'fa-check-circle' },
        'pending': { bg: 'rgba(255, 193, 7, 0.2)', color: '#FFC107', icon: 'fa-clock' },
        'confirmed': { bg: 'rgba(33, 150, 243, 0.2)', color: '#2196F3', icon: 'fa-calendar-check' },
        'cancelled': { bg: 'rgba(244, 67, 54, 0.2)', color: '#F44336', icon: 'fa-times-circle' }
    };
    
    const status = statusColors[booking.status] || statusColors['pending'];
    
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    item.innerHTML = `
        <div class="activity-icon" style="background: ${status.bg}; color: ${status.color};">
            <i class="fas ${status.icon}"></i>
        </div>
        <div class="activity-details">
            <h4>${booking.service.split(' - ')[0]}</h4>
            <p>${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} • $${booking.price || '0'}</p>
        </div>
        <div class="activity-date">
            ${formattedDate}
        </div>
    `;
    
    return item;
}

// Load Analytics
function loadAnalytics(bookings) {
    const categoryContainer = document.getElementById('categorySpendingChart');
    const monthlyContainer = document.getElementById('monthlySpendingChart');
    const emptyState = document.getElementById('analyticsEmpty');
    
    // Filter only completed bookings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    
    if (completedBookings.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        if (categoryContainer) categoryContainer.style.display = 'none';
        if (monthlyContainer) monthlyContainer.parentElement.style.display = 'none';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    if (categoryContainer) categoryContainer.style.display = 'grid';
    if (monthlyContainer) monthlyContainer.parentElement.style.display = 'block';
    
    // Calculate category spending
    const categorySpending = {};
    completedBookings.forEach(booking => {
        const service = booking.service.toLowerCase();
        let category = 'Other';
        
        if (service.includes('hair') || service.includes('cut') || service.includes('style')) {
            category = 'Hair';
        } else if (service.includes('skin') || service.includes('facial') || service.includes('face')) {
            category = 'Skin Care';
        } else if (service.includes('nail') || service.includes('manicure') || service.includes('pedicure')) {
            category = 'Nails';
        } else if (service.includes('massage') || service.includes('spa')) {
            category = 'Massage & Spa';
        } else if (service.includes('makeup') || service.includes('bridal')) {
            category = 'Makeup';
        }
        
        if (!categorySpending[category]) {
            categorySpending[category] = { count: 0, amount: 0 };
        }
        categorySpending[category].count++;
        categorySpending[category].amount += parseFloat(booking.price) || 0;
    });
    
    // Display category spending
    if (categoryContainer) {
        categoryContainer.innerHTML = '';
        
        const categoryIcons = {
            'Hair': { icon: 'fa-cut', color: '#FF6B6B' },
            'Skin Care': { icon: 'fa-spa', color: '#4ECDC4' },
            'Nails': { icon: 'fa-hand-sparkles', color: '#FFE66D' },
            'Massage & Spa': { icon: 'fa-hands', color: '#95E1D3' },
            'Makeup': { icon: 'fa-palette', color: '#F38181' },
            'Other': { icon: 'fa-star', color: '#D4AF37' }
        };
        
        Object.keys(categorySpending).forEach(category => {
            const data = categorySpending[category];
            const iconData = categoryIcons[category] || categoryIcons['Other'];
            
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class=\"category-icon\" style=\"background: ${iconData.color}20; color: ${iconData.color};\">
                    <i class=\"fas ${iconData.icon}\"></i>
                </div>
                <div class=\"category-info\">
                    <div class=\"category-name\">${category}</div>
                    <div class=\"category-stats\">
                        <span class=\"category-count\">${data.count} booking${data.count > 1 ? 's' : ''}</span>
                        <span class=\"category-amount\">$${data.amount.toFixed(0)}</span>
                    </div>
                </div>
            `;
            categoryContainer.appendChild(card);
        });
    }
    
    // Calculate monthly spending
    const monthlySpending = {};
    completedBookings.forEach(booking => {
        const date = new Date(booking.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        if (!monthlySpending[monthKey]) {
            monthlySpending[monthKey] = { name: monthName, total: 0, categories: {} };
        }
        
        const service = booking.service.toLowerCase();
        let category = 'Other';
        
        if (service.includes('hair') || service.includes('cut') || service.includes('style')) {
            category = 'Hair';
        } else if (service.includes('skin') || service.includes('facial') || service.includes('face')) {
            category = 'Skin Care';
        } else if (service.includes('nail') || service.includes('manicure') || service.includes('pedicure')) {
            category = 'Nails';
        } else if (service.includes('massage') || service.includes('spa')) {
            category = 'Massage & Spa';
        } else if (service.includes('makeup') || service.includes('bridal')) {
            category = 'Makeup';
        }
        
        const amount = parseFloat(booking.price) || 0;
        monthlySpending[monthKey].total += amount;
        
        if (!monthlySpending[monthKey].categories[category]) {
            monthlySpending[monthKey].categories[category] = 0;
        }
        monthlySpending[monthKey].categories[category] += amount;
    });
    
    // Display monthly spending (sorted by date, most recent first)
    if (monthlyContainer) {
        monthlyContainer.innerHTML = '';
        
        const sortedMonths = Object.keys(monthlySpending).sort().reverse();
        
        sortedMonths.forEach(monthKey => {
            const data = monthlySpending[monthKey];
            
            const monthCard = document.createElement('div');
            monthCard.className = 'month-card';
            
            let breakdownHTML = '';
            Object.keys(data.categories).forEach(category => {
                breakdownHTML += `
                    <div class=\"breakdown-item\">
                        <span class=\"breakdown-category\">${category}</span>
                        <span class=\"breakdown-amount\">$${data.categories[category].toFixed(0)}</span>
                    </div>
                `;
            });
            
            monthCard.innerHTML = `
                <div class=\"month-header\">
                    <span class=\"month-name\">${data.name}</span>
                    <span class=\"month-total\">$${data.total.toFixed(0)}</span>
                </div>
                <div class=\"month-breakdown\">
                    ${breakdownHTML}
                </div>
            `;
            
            monthlyContainer.appendChild(monthCard);
        });
    }
}

// Store current filter state
let currentFilter = 'all';

// Load booking history
function loadBookingHistory(bookings) {
    const container = document.getElementById('historyAppointments');
    const emptyState = document.getElementById('historyEmpty');
    const filterTabs = document.querySelectorAll('.tab-btn');

    if (!container) return;

    // Sort bookings by date (most recent first)
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA;
    });

    // Apply current filter to display bookings
    displayFilteredBookings(sortedBookings, currentFilter);

    // Set up filter functionality (remove old listeners by cloning)
    filterTabs.forEach(tab => {
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        
        newTab.addEventListener('click', function() {
            // Update active state
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Get filter value and update current filter
            currentFilter = this.getAttribute('data-filter');
            
            // Display filtered bookings
            displayFilteredBookings(sortedBookings, currentFilter);
        });
    });
}

// Display filtered bookings based on status
function displayFilteredBookings(bookings, filter) {
    const container = document.getElementById('historyAppointments');
    const emptyState = document.getElementById('historyEmpty');

    if (!container) return;

    // Clear container
    container.innerHTML = '';

    // Filter bookings based on status
    let filteredBookings;
    if (filter === 'all') {
        filteredBookings = bookings;
    } else {
        filteredBookings = bookings.filter(booking => booking.status === filter);
    }

    // Show empty state if no bookings match filter
    if (filteredBookings.length === 0) {
        if (emptyState) {
            emptyState.style.display = 'block';
            const emptyIcon = emptyState.querySelector('.empty-icon i');
            const emptyTitle = emptyState.querySelector('h3');
            const emptyText = emptyState.querySelector('p');
            
            // Customize empty state message based on filter
            if (filter === 'all') {
                if (emptyIcon) emptyIcon.className = 'fas fa-history';
                if (emptyTitle) emptyTitle.textContent = 'No Booking History';
                if (emptyText) emptyText.textContent = 'Your appointments will appear here.';
            } else {
                if (emptyIcon) emptyIcon.className = 'fas fa-filter';
                if (emptyTitle) emptyTitle.textContent = `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Bookings`;
                if (emptyText) emptyText.textContent = `You don't have any ${filter} appointments.`;
            }
        }
        if (container) container.style.display = 'none';
        return;
    }

    // Hide empty state and show container
    if (emptyState) emptyState.style.display = 'none';
    if (container) container.style.display = 'block';

    // Create and append booking cards
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
                       booking.status === 'cancelled' ? 'cancelled' :
                       booking.status === 'pending' ? 'pending' : 'confirmed';

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
        </div>
    `;

    // Add event listener for view details
    const viewBtn = card.querySelector('.view-details');

    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showAppointmentModal(booking);
        });
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
    const bookings = Storage.get('bookings', []);
    const booking = bookings.find(b => b.id === bookingId);
    const actionText = booking && booking.status === 'pending' ? 'reject' : 'cancel';
    
    if (confirm(`Are you sure you want to ${actionText} this appointment? This action cannot be undone.`)) {
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'cancelled';
            bookings[bookingIndex].updatedAt = new Date().toISOString();
            Storage.set('bookings', bookings);

            // Trigger real-time update
            window.dispatchEvent(new Event('storage'));

            // Refresh dashboard
            loadDashboardData();
            closeAppointmentModal();

            showMessage(`Appointment ${actionText}led successfully`, 'success');
        }
    }
}

// Approve appointment
function approveAppointment(bookingId) {
    if (confirm('Approve this appointment?')) {
        const bookings = Storage.get('bookings', []);
        const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);

        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'confirmed';
            bookings[bookingIndex].updatedAt = new Date().toISOString();
            Storage.set('bookings', bookings);

            // Trigger real-time update
            window.dispatchEvent(new Event('storage'));

            // Refresh dashboard
            loadDashboardData();
            closeAppointmentModal();

            showMessage('Appointment approved successfully', 'success');
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

// Update reminder statistics display
function updateReminderStats() {
    if (typeof reminderService === 'undefined') return;
    
    const stats = reminderService.getStatistics();
    
    const reminders48hEl = document.getElementById('reminders48h');
    const reminders24hEl = document.getElementById('reminders24h');
    const reminders2hEl = document.getElementById('reminders2h');
    const upcomingRemindersEl = document.getElementById('upcomingReminders');
    
    if (reminders48hEl) reminders48hEl.textContent = stats.reminders48h;
    if (reminders24hEl) reminders24hEl.textContent = stats.reminders24h;
    if (reminders2hEl) reminders2hEl.textContent = stats.reminders2h;
    if (upcomingRemindersEl) upcomingRemindersEl.textContent = stats.upcomingReminders;
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
