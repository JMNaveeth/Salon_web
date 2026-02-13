// 🔐 SECURE Authentication System for Kinniya Salon
// Uses Firebase Authentication - Passwords are NEVER stored in your database!
// Firebase automatically encrypts and hashes passwords on their secure servers

// Global variable to store current user profile
let currentUserProfile = null;

// 📍 Location Data - All 25 Districts of Sri Lanka with Areas
const LOCATION_DATA = {
    // Eastern Province
    'Trincomalee': [
        'Kinniya',
        'Trincomalee Town',
        'Nilaveli',
        'Kuchchaveli',
        'Mutur',
        'Kantale',
        'Gomarankadawala',
        'Seruwila',
        'Thampalakamam',
        'Town & Gravets',
        'Kinniya Pattu'
    ],
    'Batticaloa': [
        'Batticaloa Town',
        'Kaluwanchikudy',
        'Valachchenai',
        'Eravur',
        'Kattankudy',
        'Oddamavadi',
        'Chenkalady',
        'Vakarai',
        'Koralai Pattu',
        'Manmunai North',
        'Manmunai South West',
        'Manmunai Pattu',
        'Porativu Pattu'
    ],
    'Ampara': [
        'Ampara Town',
        'Akkaraipattu',
        'Kalmunai',
        'Sainthamaruthu',
        'Pottuvil',
        'Sammanthurai',
        'Thirukkovil',
        'Nintavur',
        'Addalachchenai',
        'Dehiattakandiya',
        'Damana',
        'Padiyathalawa',
        'Uhana'
    ],
    
    // Northern Province
    'Jaffna': [
        'Jaffna Town',
        'Nallur',
        'Chavakachcheri',
        'Point Pedro',
        'Chankanai',
        'Karainagar',
        'Velanai',
        'Vaddukoddai',
        'Kayts',
        'Delft',
        'Valvettithurai',
        'Tellippalai',
        'Sandilipay',
        'Uduvil'
    ],
    'Kilinochchi': [
        'Kilinochchi Town',
        'Pallai',
        'Paranthan',
        'Poonakary',
        'Karachchi',
        'Pachchilaipalli'
    ],
    'Mannar': [
        'Mannar Town',
        'Madhu',
        'Nanattan',
        'Manthai West',
        'Musali',
        'Nanaddan'
    ],
    'Mullaitivu': [
        'Mullaitivu Town',
        'Oddusuddan',
        'Puthukudiyiruppu',
        'Manthai East',
        'Thunukkai',
        'Welioya'
    ],
    'Vavuniya': [
        'Vavuniya Town',
        'Vavuniya South',
        'Vavuniya North',
        'Vengalacheddikulam',
        'Cheddikulam',
        'Omanthai'
    ],
    
    // North Western Province
    'Puttalam': [
        'Puttalam Town',
        'Chilaw',
        'Wennappuwa',
        'Nattandiya',
        'Marawila',
        'Dankotuwa',
        'Anamaduwa',
        'Mundel',
        'Palavi',
        'Kalpitiya'
    ],
    'Kurunegala': [
        'Kurunegala Town',
        'Kuliyapitiya',
        'Narammala',
        'Wariyapola',
        'Pannala',
        'Maho',
        'Melsiripura',
        'Galgamuwa',
        'Nikaweratiya',
        'Polgahawela',
        'Mawathagama',
        'Giriulla',
        'Bingiriya',
        'Alawwa'
    ],
    
    // North Central Province
    'Anuradhapura': [
        'Anuradhapura Town',
        'Medawachchiya',
        'Kebithigollawa',
        'Horowpothana',
        'Kekirawa',
        'Thambuttegama',
        'Thalawa',
        'Nochchiyagama',
        'Galenbindunuwewa',
        'Mihintale',
        'Rambewa',
        'Kahatagasdigiliya'
    ],
    'Polonnaruwa': [
        'Polonnaruwa Town',
        'Kaduruwela',
        'Medirigiriya',
        'Hingurakgoda',
        'Dimbulagala',
        'Elahera',
        'Welikanda',
        'Lankapura',
        'Aralaganwila'
    ],
    
    // Central Province
    'Matale': [
        'Matale Town',
        'Dambulla',
        'Sigiriya',
        'Galewela',
        'Naula',
        'Ukuwela',
        'Rattota',
        'Pallepola',
        'Yatawatta',
        'Laggala'
    ],
    'Kandy': [
        'Kandy City',
        'Peradeniya',
        'Katugastota',
        'Gampola',
        'Nawalapitiya',
        'Akurana',
        'Galagedara',
        'Pilimathalawa',
        'Kadugannawa',
        'Teldeniya',
        'Kundasale',
        'Wattegama',
        'Harispattuwa',
        'Panvila'
    ],
    'Nuwara Eliya': [
        'Nuwara Eliya Town',
        'Hatton',
        'Nuwara Eliya',
        'Walapane',
        'Hanguranketha',
        'Kothmale',
        'Nildandahinna',
        'Ambagamuwa',
        'Maskeliya',
        'Ginigathena'
    ],
    
    // Uva Province
    'Badulla': [
        'Badulla Town',
        'Bandarawela',
        'Haputale',
        'Welimada',
        'Mahiyanganaya',
        'Hali Ela',
        'Passara',
        'Ella',
        'Diyatalawa',
        'Haldummulla',
        'Soranathota',
        'Meegahakivula'
    ],
    'Monaragala': [
        'Monaragala Town',
        'Wellawaya',
        'Bibile',
        'Buttala',
        'Katharagama',
        'Thanamalwila',
        'Siyambalanduwa',
        'Medagama',
        'Badalkumbura'
    ],
    
    // Sabaragamuwa Province
    'Ratnapura': [
        'Ratnapura Town',
        'Embilipitiya',
        'Balangoda',
        'Pelmadulla',
        'Kuruwita',
        'Eheliyagoda',
        'Kahawatta',
        'Kalawana',
        'Kolonna',
        'Elapatha',
        'Nivithigala'
    ],
    'Kegalle': [
        'Kegalle Town',
        'Mawanella',
        'Warakapola',
        'Rambukkana',
        'Galigamuwa',
        'Ruwanwella',
        'Dehiowita',
        'Deraniyagala',
        'Yatiyantota',
        'Kitulgala',
        'Aranayake'
    ],
    
    // Western Province
    'Colombo': [
        'Colombo City',
        'Fort',
        'Pettah',
        'Kollupitiya',
        'Bambalapitiya',
        'Wellawatta',
        'Dehiwala',
        'Mount Lavinia',
        'Borella',
        'Maradana',
        'Kotahena',
        'Grandpass',
        'Slave Island',
        'Cinnamon Gardens',
        'Havelock Town',
        'Nugegoda',
        'Maharagama',
        'Kotte',
        'Rajagiriya',
        'Battaramulla',
        'Nawala',
        'Kaduwela',
        'Kolonnawa',
        'Kesbewa',
        'Homagama',
        'Padukka',
        'Hanwella',
        'Avissawella',
        'Seethawaka'
    ],
    'Gampaha': [
        'Gampaha Town',
        'Negombo',
        'Katunayake',
        'Ja-Ela',
        'Wattala',
        'Kelaniya',
        'Peliyagoda',
        'Kadawatha',
        'Ragama',
        'Kiribathgoda',
        'Minuwangoda',
        'Divulapitiya',
        'Mirigama',
        'Nittambuwa',
        'Veyangoda',
        'Ganemulla',
        'Dompe',
        'Attanagalla',
        'Biyagama'
    ],
    'Kalutara': [
        'Kalutara Town',
        'Panadura',
        'Horana',
        'Beruwala',
        'Aluthgama',
        'Matugama',
        'Bandaragama',
        'Ingiriya',
        'Wadduwa',
        'Dodangoda',
        'Agalawatta',
        'Palindanuwara',
        'Bulathsinhala',
        'Madurawala'
    ],
    
    // Southern Province
    'Galle': [
        'Galle City',
        'Hikkaduwa',
        'Ambalangoda',
        'Elpitiya',
        'Bentota',
        'Baddegama',
        'Karapitiya',
        'Habaraduwa',
        'Ahangama',
        'Balapitiya',
        'Neluwa',
        'Galle Fort',
        'Unawatuna',
        'Koggala'
    ],
    'Matara': [
        'Matara Town',
        'Weligama',
        'Mirissa',
        'Akuressa',
        'Deniyaya',
        'Dikwella',
        'Hakmana',
        'Kamburugamuwa',
        'Devinuwara',
        'Gandara',
        'Thihagoda',
        'Kotapola'
    ],
    'Hambantota': [
        'Hambantota Town',
        'Tangalle',
        'Tissamaharama',
        'Ambalantota',
        'Beliatta',
        'Weeraketiya',
        'Middeniya',
        'Lunugamvehera',
        'Sooriyawewa',
        'Hambegamuwa'
    ]
};

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI if on auth page
    if (window.location.pathname.includes('auth.html')) {
        initAuthPage();
    }
    
    // Initialize location dropdowns (district/area selectors)
    initLocationDropdowns();
    
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
    const district = document.getElementById('ownerSignupDistrict')?.value || '';
    const area = document.getElementById('ownerSignupArea')?.value || '';
    const email = document.getElementById('ownerSignupEmail').value.trim();
    const phone = document.getElementById('ownerSignupPhone').value.trim();
    const password = document.getElementById('ownerSignupPassword').value.trim();
    const errorElement = document.getElementById('ownerError');

    // Validation
    if (!name || !businessName || !district || !area || !email || !phone || !password) {
        showError(errorElement, 'Please fill in all fields including district and area');
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
            district: district,
            area: area,
            location: `${area}, ${district}`, // Combined for display
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

// 📍 LOCATION FUNCTIONS

// Get all available districts
function getDistricts() {
    return Object.keys(LOCATION_DATA);
}

// Get areas for a specific district
function getAreasForDistrict(district) {
    return LOCATION_DATA[district] || [];
}

// Get shops by location (district and/or area)
async function getShopsByLocation(district = null, area = null) {
    try {
        let query = db.collection('users').where('role', '==', 'owner');

        // Filter by district if provided
        if (district) {
            query = query.where('district', '==', district);
        }

        // Filter by area if provided
        if (area) {
            query = query.where('area', '==', area);
        }

        const snapshot = await query.get();
        const shops = [];

        snapshot.forEach(doc => {
            shops.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ Found ${shops.length} shops in ${area || district || 'all locations'}`);
        return shops;

    } catch (error) {
        console.error('Error fetching shops by location:', error);
        return [];
    }
}

// Populate district dropdown
function populateDistrictDropdown(selectElementId) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '<option value="">Select District</option>';

    // Add districts
    const districts = getDistricts();
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        selectElement.appendChild(option);
    });
}

// Populate area dropdown based on selected district
function populateAreaDropdown(selectElementId, district) {
    const selectElement = document.getElementById(selectElementId);
    if (!selectElement) return;

    // Clear existing options
    selectElement.innerHTML = '<option value="">Select Area</option>';

    if (!district) {
        selectElement.disabled = true;
        return;
    }

    selectElement.disabled = false;

    // Add areas for selected district
    const areas = getAreasForDistrict(district);
    areas.forEach(area => {
        const option = document.createElement('option');
        option.value = area;
        option.textContent = area;
        selectElement.appendChild(option);
    });
}

// Initialize location dropdowns on page load
function initLocationDropdowns() {
    // For owner signup - district dropdown
    const ownerDistrictSelect = document.getElementById('ownerSignupDistrict');
    if (ownerDistrictSelect) {
        populateDistrictDropdown('ownerSignupDistrict');
        
        // Listen for district changes to update area dropdown
        ownerDistrictSelect.addEventListener('change', function() {
            populateAreaDropdown('ownerSignupArea', this.value);
        });
    }

    // For customer location filter - district dropdown
    const customerDistrictSelect = document.getElementById('customerFilterDistrict');
    if (customerDistrictSelect) {
        populateDistrictDropdown('customerFilterDistrict');
        
        // Listen for district changes to update area dropdown
        customerDistrictSelect.addEventListener('change', function() {
            populateAreaDropdown('customerFilterArea', this.value);
        });
    }
}

// Export functions for use in other files
window.AuthSystem = {
    checkAuth: checkAuth,
    logout: logout,
    getCurrentUser: getCurrentUser,
    isLoggedIn: isLoggedIn,
    getUserId: getUserId,
    // Location functions
    getDistricts: getDistricts,
    getAreasForDistrict: getAreasForDistrict,
    getShopsByLocation: getShopsByLocation,
    populateDistrictDropdown: populateDistrictDropdown,
    populateAreaDropdown: populateAreaDropdown,
    initLocationDropdowns: initLocationDropdowns,
    LOCATION_DATA: LOCATION_DATA
};

console.log('🔐 Secure Authentication System Loaded - Passwords are NEVER stored in database!');
