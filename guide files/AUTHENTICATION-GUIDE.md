# Authentication System Guide

## Overview
The Kinniya Salon website now includes a complete role-based authentication system that separates **Customers** and **Shop Owners** with different access levels and functionalities.

---

## Getting Started

### First Time Setup
1. Open `auth.html` in your browser
2. You'll see two options:
   - **Customer** - For clients who want to book appointments
   - **Shop Owner** - For salon owners who want to manage their business

---

## Customer Access

### Sign Up as Customer
1. Click on the **Customer** card
2. Click **Sign Up** at the bottom
3. Fill in:
   - Full Name
   - Email Address
   - Phone Number
   - Password (minimum 6 characters)
4. Click **Sign Up**
5. You'll be automatically logged in and redirected to the home page

### Customer Features
After logging in, customers can:
- ✅ Browse available services
- ✅ View salon gallery
- ✅ Book appointments with specific staff members
- ✅ View their booking dashboard
- ✅ Manage their appointments
- ❌ Cannot access admin panel

### Customer Pages
- `index.html` - Home page with salon information
- `services.html` - Browse and filter services
- `booking.html` - Book appointments
- `dashboard.html` - View and manage bookings
- `gallery.html` - View salon photos

---

## Shop Owner Access

### Sign Up as Shop Owner
1. Click on the **Shop Owner** card
2. Click **Sign Up** at the bottom
3. Fill in:
   - Salon Name
   - Email Address
   - Phone Number
   - Password (minimum 6 characters)
4. Click **Sign Up**
5. You'll be automatically logged in and redirected to the admin panel

### Shop Owner Features
After logging in, shop owners can:
- ✅ Add and manage services
- ✅ Add and manage staff members
- ✅ View all bookings
- ✅ Upload customer photos to gallery
- ✅ Manage salon operations
- ❌ Cannot access customer booking pages

### Shop Owner Pages
- `admin.html` - Complete admin panel for managing the salon

---

## Login Process

### For Existing Customers
1. Go to `auth.html`
2. Click **Customer** card
3. Enter your email and password
4. Click **Login**
5. Redirected to home page

### For Existing Shop Owners
1. Go to `auth.html`
2. Click **Shop Owner** card
3. Enter your email and password
4. Click **Login**
5. Redirected to admin panel

---

## Security Features

### Role-Based Access Control
- **Customers** are automatically redirected if they try to access `admin.html`
- **Shop Owners** are guided to use the admin panel instead of customer pages
- All pages check authentication status on load
- Unauthenticated users are redirected to `auth.html`

### Session Management
- User sessions are stored securely in localStorage
- Sessions persist until logout
- Each session includes:
  - User ID
  - Email
  - Name
  - Role (customer/owner)
  - Login timestamp

### Data Storage
- **Customers**: Stored in localStorage under `customers` key
- **Shop Owners**: Stored in localStorage under `shopOwners` key
- **Current Session**: Stored under `currentUser` key

---

## Logout

Both customers and shop owners can logout by:
1. Click the **Logout** button in the navigation bar
2. Confirm logout
3. Redirected to `auth.html`

---

## Password Requirements
- Minimum 6 characters
- No special requirements (can be enhanced for production)

---

## Email Validation
- Must be a valid email format (e.g., user@example.com)
- No duplicate emails allowed

---

## Technical Implementation

### Files Modified
1. **New Files**:
   - `auth.html` - Authentication page with role selection
   - `js/auth.js` - Authentication logic and session management

2. **Updated Files**:
   - `index.html` - Added auth check and logout button
   - `admin.html` - Added auth check and owner welcome message
   - `booking.html` - Added auth check
   - `services.html` - Added auth check
   - `dashboard.html` - Added auth check
   - `gallery.html` - Added auth check

### Key Functions in auth.js

```javascript
// Authentication Functions
loginCustomer()      // Handle customer login
signupCustomer()     // Handle customer signup
loginOwner()         // Handle shop owner login
signupOwner()        // Handle shop owner signup

// Session Management
checkAuth()          // Verify user is logged in
getCurrentUser()     // Get current user details
isLoggedIn()        // Check if any user is logged in
logout()            // End current session

// Form Toggles
showCustomerLogin()  // Show customer login form
showCustomerSignup() // Show customer signup form
showOwnerLogin()     // Show owner login form
showOwnerSignup()    // Show owner signup form
```

---

## Default Test Accounts

For testing, you can create accounts with these example credentials:

### Customer Account
- Name: John Doe
- Email: john@example.com
- Phone: +94 77 123 4567
- Password: customer123

### Shop Owner Account
- Salon Name: Elegant Salon
- Email: owner@elegant.com
- Phone: +94 77 999 8888
- Password: owner123

---

## Flow Diagram

```
auth.html (Entry Point)
    ↓
Choose Role: Customer or Shop Owner
    ↓
Login / Sign Up
    ↓
Session Created
    ↓
┌─────────────────┬─────────────────┐
│   CUSTOMER      │   SHOP OWNER    │
│   index.html    │   admin.html    │
│   services.html │                 │
│   booking.html  │                 │
│   dashboard.html│                 │
│   gallery.html  │                 │
└─────────────────┴─────────────────┘
         ↓
    Logout → auth.html
```

---

## Troubleshooting

### "Access Denied" Message
- You're trying to access a page not meant for your role
- Customers: Use index.html and related pages
- Shop Owners: Use admin.html

### Cannot Login
- Check email and password are correct
- Ensure you signed up with the correct role
- Clear browser localStorage and try again

### Redirected to auth.html
- Your session expired or you're not logged in
- Please login again

### Clear All Data (Reset)
Open browser console and run:
```javascript
localStorage.clear();
location.reload();
```

---

## Future Enhancements

Potential improvements for production:
- Password encryption (currently plain text)
- Email verification
- Password reset functionality
- Remember me option
- Two-factor authentication
- Session timeout
- Password strength meter
- Account recovery
- Profile management

---

## Support

For any issues or questions about the authentication system, please check:
1. This guide
2. Browser console for error messages
3. localStorage data structure

---

**Note**: This authentication system uses localStorage for demo purposes. For production, implement server-side authentication with proper security measures.
