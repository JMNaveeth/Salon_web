// Admin Panel Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS first if available
    if(typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
    
    // Small delay to ensure everything is loaded
    setTimeout(() => {
        initAdminPanel();
        loadAdminData();
        initDynamicEvents();
        initCursor();
    }, 100);
});

// Storage Helper
const Storage = {
    get: function(key, defaultValue) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    },
    set: function(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

function initAdminPanel() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    // Initialize - show only the active section
    document.querySelectorAll('.admin-content').forEach(content => {
        if (content.classList.contains('active')) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active classes from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Hide all content sections
            document.querySelectorAll('.admin-content').forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            
            // Add active to current link
            this.classList.add('active');
            
            // Show target section
            const targetId = this.dataset.section + '-section';
            const targetContent = document.getElementById(targetId);
            
            if(targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                
                // Scroll to top of content
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Refresh AOS animations if available
                if(typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }
        });
    });
}

function loadAdminData() {
    // Dummy Data for Initialization
    const dummyBookings = [
        { id: '#BK001', customer: 'Sarah Johnson', service: 'Hair Styling', date: '2024-03-20', time: '10:00 AM', staff: 'Emma W.', status: 'confirmed' },
        { id: '#BK002', customer: 'Mike Chen', service: 'Facial', date: '2024-03-20', time: '11:00 AM', staff: 'David L.', status: 'confirmed' },
        { id: '#BK003', customer: 'Jessica Davis', service: 'Manicure', date: '2024-03-20', time: '02:00 PM', staff: 'Sarah J.', status: 'pending' },
        { id: '#BK004', customer: 'Tom Wilson', service: 'Haircut', date: '2024-03-19', time: '03:00 PM', staff: 'David L.', status: 'completed' },
    ];
    
    // Populate Stats
    document.getElementById('todayBookings').textContent = '4';
    document.getElementById('upcomingBookings').textContent = '12';
    document.getElementById('totalRevenue').textContent = '$1,240';
    document.getElementById('totalCustomers').textContent = '86';

    // Populate Bookings Table
    const tableBody = document.getElementById('bookingsTableBody');
    if(tableBody) {
        tableBody.innerHTML = dummyBookings.map(b => `
            <tr>
                <td>${b.id}</td>
                <td>${b.customer}</td>
                <td>${b.service}</td>
                <td>${b.date} <br> <span style="font-size:0.8em;color:#888">${b.time}</span></td>
                <td>${b.staff}</td>
                <td><span class="status-badge ${b.status}">${b.status}</span></td>
                <td class="actions-cell">
                    <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                    ${b.status !== 'completed' ? `<button class="btn-icon complete" title="Complete"><i class="fas fa-check"></i></button>` : ''}
                    <button class="btn-icon delete" title="Cancel"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    // Populate Services Grid
    const servicesGrid = document.getElementById('servicesGridAdmin');
    if(servicesGrid) {
        const services = Storage.get('services', [
            { name: 'Hair Cut & Style', price: 45, category: 'Hair', duration: 45 },
            { name: 'Classic Facial', price: 65, category: 'Skin', duration: 60 },
            { name: 'Gel Manicure', price: 35, category: 'Nails', duration: 40 }
        ]);
        
        servicesGrid.innerHTML = services.map((s, index) => `
            <div class="service-admin-card">
                <div class="service-admin-header">
                    <h4>${s.name}</h4>
                    <div class="actions-cell">
                        <button class="btn-icon"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="service-admin-details">
                    <div class="detail-item"><span class="label">Category:</span><span class="value">${s.category}</span></div>
                    <div class="detail-item"><span class="label">Price:</span><span class="value price">$${s.price}</span></div>
                    <div class="detail-item"><span class="label">Duration:</span><span class="value">${s.duration}m</span></div>
                </div>
            </div>
        `).join('');
    }

    // Populate Staff Grid
    const staffGrid = document.getElementById('staffGrid');
    if(staffGrid) {
        const staff = Storage.get('staff', [
            { name: 'Emma Wilson', role: 'Senior Stylist', phone: '555-0123' },
            { name: 'David Lee', role: 'Barber', phone: '555-0124' }
        ]);
        
        staffGrid.innerHTML = staff.map(s => `
            <div class="staff-admin-card">
                <div class="staff-admin-header">
                    <h4>${s.name}</h4>
                    <div class="actions-cell">
                        <button class="btn-icon"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="staff-admin-details">
                    <div class="detail-item"><span class="label">Role:</span><span class="value">${s.role}</span></div>
                    <div class="detail-item"><span class="label">Phone:</span><span class="value">${s.phone}</span></div>
                </div>
            </div>
        `).join('');
    }
}

function initDynamicEvents() {
    // Add Service Modal Logic
    const addServiceBtn = document.querySelector('button[onclick="showAddServiceModal()"]');
    if(addServiceBtn) {
        addServiceBtn.onclick = function() {
            openModal('serviceModal');
        };
    }

    // Add Staff Modal Logic
    const addStaffBtn = document.querySelector('button[onclick="showAddStaffModal()"]');
    if(addStaffBtn) {
        addStaffBtn.onclick = function() {
            openModal('staffModal');
        };
    }

    // Close Modal Logic
    document.querySelectorAll('.modal-close, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.admin-modal');
            if(modal) modal.classList.remove('show');
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.display = 'flex';
        modal.classList.add('show');
    }
}

// Global functions for inline onclicks
window.showAddServiceModal = function() { openModal('serviceModal'); };
window.showAddStaffModal = function() { openModal('staffModal'); };
window.closeServiceModal = function() { document.getElementById('serviceModal').classList.remove('show'); };
window.closeStaffModal = function() { document.getElementById('staffModal').classList.remove('show'); };

// Custom Cursor
function initCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

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

    // Add hover effects
    const hoverElements = document.querySelectorAll('a, button, .sidebar-link, .stat-card, .action-btn, input, select, textarea');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', function() {
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}
