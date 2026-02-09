// Authentication System for Kinniya Salon
// Manages user authentication, role-based access, and session management

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI if on auth page
    if (window.location.pathname.includes('auth.html')) {
        initAuthPage();
    }
});

function initAuthPage() {
    // Role selection cards
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', function() {
            const role = this.dataset.role;
            selectRole(role);
        });
    });
}

function selectRole(role) {
    const roleSelection = document.getElementById('roleSelection');
    const customerForm = document.getElementById('customerForm');
    const ownerForm = document.getElementById('ownerForm');

    // Hide role selection
    roleSelection.style.display = 'none';

    // Show appropriate form
    if (role === 'customer') {
        customerForm.classList.add('active');
    } else if (role === 'owner') {
        ownerForm.classList.add('active');
    }
}

function backToRoleSelection() {
    const roleSelection = document.getElementById('roleSelection');
    const customerForm = document.getElementById('customerForm');
    const ownerForm = document.getElementById('ownerForm');

    // Show role selection
    roleSelection.style.display = 'grid';

    // Hide forms
    customerForm.classList.remove('active');
    ownerForm.classList.remove('active');

    // Clear error messages
    document.getElementById('customerError').classList.remove('show');
    document.getElementById('ownerError').classList.remove('show');
}

// Customer Login
function loginCustomer() {
    const email = document.getElementById('customerLoginEmail').value.trim();
    const password = document.getElementById('customerLoginPassword').value.trim();
    const errorElement = document.getElementById('customerError');

    // Validation
    if (!email || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }

    // Get customers from storage
    const customers = Storage.get('customers', []);
    const customer = customers.find(c => c.email === email && c.password === password);

    if (customer) {
        // Create session
        const session = {
            userId: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer',
            loginTime: new Date().toISOString()
        };

        Storage.set('currentUser', session);
        
        // Redirect to customer pages
        window.location.href = 'index.html';
    } else {
        showError(errorElement, 'Invalid email or password');
    }
}

// Customer Signup
function signupCustomer() {
    const name = document.getElementById('customerSignupName').value.trim();
    const email = document.getElementById('customerSignupEmail').value.trim();
    const phone = document.getElementById('customerSignupPhone').value.trim();
    const password = document.getElementById('customerSignupPassword').value.trim();
    const errorElement = document.getElementById('customerError');

    // Validation
    if (!name || !email || !phone || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError(errorElement, 'Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    const customers = Storage.get('customers', []);
    if (customers.some(c => c.email === email)) {
        showError(errorElement, 'An account with this email already exists');
        return;
    }

    // Create new customer
    const newCustomer = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password,
        role: 'customer',
        createdAt: new Date().toISOString()
    };

    customers.push(newCustomer);
    Storage.set('customers', customers);

    // Auto login
    const session = {
        userId: newCustomer.id,
        email: newCustomer.email,
        name: newCustomer.name,
        role: 'customer',
        loginTime: new Date().toISOString()
    };

    Storage.set('currentUser', session);
    
    // Redirect to customer pages
    window.location.href = 'index.html';
}

// Shop Owner Login
function loginOwner() {
    const email = document.getElementById('ownerLoginEmail').value.trim();
    const password = document.getElementById('ownerLoginPassword').value.trim();
    const errorElement = document.getElementById('ownerError');

    // Validation
    if (!email || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }

    // Get shop owners from storage
    const owners = Storage.get('shopOwners', []);
    const owner = owners.find(o => o.email === email && o.password === password);

    if (owner) {
        // Create session
        const session = {
            userId: owner.id,
            email: owner.email,
            name: owner.name,
            role: 'owner',
            loginTime: new Date().toISOString()
        };

        Storage.set('currentUser', session);
        
        // Redirect to admin panel
        window.location.href = 'admin.html';
    } else {
        showError(errorElement, 'Invalid email or password');
    }
}

// Shop Owner Signup
function signupOwner() {
    const name = document.getElementById('ownerSignupName').value.trim();
    const businessName = document.getElementById('ownerSignupBusinessName').value.trim();
    const location = document.getElementById('ownerSignupLocation').value.trim();
    const email = document.getElementById('ownerSignupEmail').value.trim();
    const phone = document.getElementById('ownerSignupPhone').value.trim();
    const password = document.getElementById('ownerSignupPassword').value.trim();
    const errorElement = document.getElementById('ownerError');

    // Validation
    if (!name || !businessName || !location || !email || !phone || !password) {
        showError(errorElement, 'Please fill in all fields');
        return;
    }

    if (!validateEmail(email)) {
        showError(errorElement, 'Please enter a valid email address');
        return;
    }

    if (password.length < 6) {
        showError(errorElement, 'Password must be at least 6 characters long');
        return;
    }

    // Check if email already exists
    const owners = Storage.get('shopOwners', []);
    if (owners.some(o => o.email === email)) {
        showError(errorElement, 'An account with this email already exists');
        return;
    }

    // Create new shop owner with business details
    const newOwner = {
        id: Date.now(),
        name: name,
        businessName: businessName,
        location: location,
        email: email,
        phone: phone,
        password: password,
        role: 'owner',
        bio: `Professional beauty and grooming services at ${businessName}`,
        createdAt: new Date().toISOString()
    };

    owners.push(newOwner);
    Storage.set('shopOwners', owners);

    // Auto login
    const session = {
        userId: newOwner.id,
        email: newOwner.email,
        name: newOwner.name,
        businessName: newOwner.businessName,
        location: newOwner.location,
        role: 'owner',
        loginTime: new Date().toISOString()
    };

    Storage.set('currentUser', session);
    
    // Redirect to admin panel
    window.location.href = 'admin.html';
}

// Form Toggle Functions
function showCustomerLogin() {
    document.getElementById('customerLoginForm').style.display = 'block';
    document.getElementById('customerSignupForm').style.display = 'none';
    document.getElementById('customerError').classList.remove('show');
}

function showCustomerSignup() {
    document.getElementById('customerLoginForm').style.display = 'none';
    document.getElementById('customerSignupForm').style.display = 'block';
    document.getElementById('customerError').classList.remove('show');
}

function showOwnerLogin() {
    document.getElementById('ownerLoginForm').style.display = 'block';
    document.getElementById('ownerSignupForm').style.display = 'none';
    document.getElementById('ownerError').classList.remove('show');
}

function showOwnerSignup() {
    document.getElementById('ownerLoginForm').style.display = 'none';
    document.getElementById('ownerSignupForm').style.display = 'block';
    document.getElementById('ownerError').classList.remove('show');
}

// Utility Functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check Authentication on Protected Pages
function checkAuth() {
    const currentUser = Storage.get('currentUser', null);
    const currentPage = window.location.pathname;

    // If no user is logged in, redirect to auth page
    if (!currentUser) {
        if (!currentPage.includes('auth.html')) {
            window.location.href = 'auth.html';
        }
        return false;
    }

    // Check role-based access
    if (currentPage.includes('admin.html') && currentUser.role !== 'owner') {
        // Customer trying to access admin page
        alert('Access Denied: This page is only for shop owners');
        window.location.href = 'index.html';
        return false;
    }

    if (currentPage.includes('index.html') && currentUser.role === 'owner') {
        // Owner trying to access customer page
        alert('Please use the admin panel to manage your salon');
        window.location.href = 'admin.html';
        return false;
    }

    return true;
}

// Logout Function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        Storage.remove('currentUser');
        window.location.href = 'auth.html';
    }
}

// Get Current User
function getCurrentUser() {
    return Storage.get('currentUser', null);
}

// Check if user is logged in
function isLoggedIn() {
    return Storage.get('currentUser', null) !== null;
}

// Export functions for use in other files
window.AuthSystem = {
    checkAuth: checkAuth,
    logout: logout,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn
};
