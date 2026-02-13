// 🔐 SECURE Authentication System for Kinniya Salon
// Uses Firebase Authentication - Passwords are NEVER stored in your database!
// Firebase automatically encrypts and hashes passwords on their secure servers

// Global variable to store current user profile
let currentUserProfile = null;

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI if on auth page
    if (window.location.pathname.includes('auth.html')) {
        initAuthPage();
    }
    
    // Listen for authentication state changes
    initAuthStateListener();
});

// Initialize Firebase Auth State Listener
// This automatically detects when users log in/out
function initAuthStateListener() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // User is signed in - fetch their profile from Firestore
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    currentUserProfile = {
                        uid: user.uid,
                        email: user.email,
                        ...userDoc.data()
                    };
                    console.log('✅ User authenticated:', currentUserProfile.name);
                } else {
                    console.warn('⚠️ User authenticated but profile not found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        } else {
            // User is signed out
            currentUserProfile = null;
            
            // Redirect to auth page if on protected page
            const currentPage = window.location.pathname;
            const publicPages = ['auth.html', 'index.html'];
            const isPublicPage = publicPages.some(page => currentPage.includes(page));
            
            if (!isPublicPage && !currentPage.includes('auth.html')) {
                window.location.href = 'auth.html';
            }
        }
    });
}

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

// 🔐 SECURE Customer Login using Firebase Authentication
async function loginCustomer() {
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

    try {
        // Sign in with Firebase Auth (password handled securely)
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Fetch user profile from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            showError(errorElement, 'User profile not found. Please contact support.');
            await auth.signOut();
            return;
        }

        const userData = userDoc.data();

        // Verify user role
        if (userData.role !== 'customer') {
            showError(errorElement, 'This account is not registered as a customer.');
            await auth.signOut();
            return;
        }

        console.log('✅ Customer login successful:', userData.name);
        
        // Redirect to customer pages
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error, errorElement);
    }
}

// 🔐 SECURE Customer Signup using Firebase Authentication
async function signupCustomer() {
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

    try {
        // Create account in Firebase Auth (password is encrypted automatically)
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save user profile to Firestore (NO PASSWORD - only profile data!)
        await db.collection('users').doc(user.uid).set({
            name: name,
            email: email,
            phone: phone,
            role: 'customer',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Customer account created successfully:', name);
        
        // Redirect to customer pages
        window.location.href = 'index.html';

    } catch (error) {
        console.error('Signup error:', error);
        handleAuthError(error, errorElement);
    }
}

// 🔐 SECURE Shop Owner Login using Firebase Authentication
async function loginOwner() {
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

    try {
        // Sign in with Firebase Auth (password handled securely)
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Fetch user profile from Firestore
        const userDoc = await db.collection('users').doc(user.uid).get();
        
        if (!userDoc.exists) {
            showError(errorElement, 'User profile not found. Please contact support.');
            await auth.signOut();
            return;
        }

        const userData = userDoc.data();

        // Verify user role
        if (userData.role !== 'owner') {
            showError(errorElement, 'This account is not registered as a shop owner.');
            await auth.signOut();
            return;
        }

        // Update last login
        await db.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Shop owner login successful:', userData.businessName);
        
        // Redirect to admin panel
        window.location.href = 'admin.html';

    } catch (error) {
        console.error('Login error:', error);
        handleAuthError(error, errorElement);
    }
}

// 🔐 SECURE Shop Owner Signup using Firebase Authentication
async function signupOwner() {
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

    try {
        // Create shop account in Firebase Auth (password is encrypted automatically)
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save shop owner profile to Firestore (NO PASSWORD - only profile data!)
        await db.collection('users').doc(user.uid).set({
            name: name,
            businessName: businessName,
            location: location,
            email: email,
            phone: phone,
            role: 'owner',
            bio: `Professional beauty and grooming services at ${businessName}`,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('✅ Shop owner account created successfully:', businessName);
        
        // Redirect to admin panel
        window.location.href = 'admin.html';

    } catch (error) {
        console.error('Signup error:', error);
        handleAuthError(error, errorElement);
    }
}

// Firebase Auth Error Handler
function handleAuthError(error, errorElement) {
    let message = 'An error occurred. Please try again.';
    
    switch (error.code) {
        case 'auth/email-already-in-use':
            message = 'An account with this email already exists.';
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;
        case 'auth/operation-not-allowed':
            message = 'Email/password accounts are not enabled.';
            break;
        case 'auth/weak-password':
            message = 'Password is too weak. Please use at least 6 characters.';
            break;
        case 'auth/user-disabled':
            message = 'This account has been disabled.';
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            message = 'Invalid email or password.';
            break;
        case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
        default:
            message = error.message || 'An error occurred. Please try again.';
    }
    
    showError(errorElement, message);
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

// 🔐 SECURE Check Authentication on Protected Pages
async function checkAuth() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe(); // Unsubscribe after first call
            
            const currentPage = window.location.pathname;

            // If no user is logged in, redirect to auth page
            if (!user) {
                if (!currentPage.includes('auth.html')) {
                    window.location.href = 'auth.html';
                }
                resolve(false);
                return;
            }

            // User is logged in - fetch their profile
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (!userDoc.exists) {
                    console.error('User profile not found');
                    await auth.signOut();
                    window.location.href = 'auth.html';
                    resolve(false);
                    return;
                }

                const userData = userDoc.data();

                // Check role-based access
                if (currentPage.includes('admin.html') && userData.role !== 'owner') {
                    // Customer trying to access admin page
                    alert('Access Denied: This page is only for shop owners');
                    window.location.href = 'index.html';
                    resolve(false);
                    return;
                }

                if (currentPage.includes('booking.html') && userData.role === 'owner') {
                    // Owner trying to access customer booking page
                    alert('Please use the admin panel to manage bookings');
                    window.location.href = 'admin.html';
                    resolve(false);
                    return;
                }

                resolve(true);
            } catch (error) {
                console.error('Error checking auth:', error);
                resolve(false);
            }
        });
    });
}

// 🔐 SECURE Logout Function
async function logout() {
    if (confirm('Are you sure you want to logout?')) {
        try {
            await auth.signOut();
            console.log('✅ User logged out successfully');
            window.location.href = 'auth.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        }
    }
}

// 🔐 SECURE Get Current User
async function getCurrentUser() {
    const user = auth.currentUser;
    
    if (!user) {
        return null;
    }

    // Return cached profile if available
    if (currentUserProfile && currentUserProfile.uid === user.uid) {
        return currentUserProfile;
    }

    // Fetch from Firestore
    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            currentUserProfile = {
                uid: user.uid,
                email: user.email,
                ...userDoc.data()
            };
            return currentUserProfile;
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }

    return null;
}

// 🔐 SECURE Check if user is logged in
function isLoggedIn() {
    return auth.currentUser !== null;
}

// 🔐 SECURE Get User UID
function getUserId() {
    const user = auth.currentUser;
    return user ? user.uid : null;
}

// Export functions for use in other files
window.AuthSystem = {
    checkAuth: checkAuth,
    logout: logout,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    getUserId: getUserId
};

console.log('🔐 Secure Authentication System Loaded - Passwords are NEVER stored in database!');
