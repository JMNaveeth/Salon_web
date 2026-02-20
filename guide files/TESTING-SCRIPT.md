# Complete Authentication System Test Script

## 🧪 Pre-Test Setup

Before starting tests, ensure:
- [ ] Browser console is open (F12)
- [ ] localStorage is cleared: `localStorage.clear()`
- [ ] All files are saved
- [ ] Server is running (if using local server)

---

## TEST SUITE 1: Role Selection & UI

### Test 1.1: Initial Page Load
**Steps:**
1. Open `auth.html` in browser
2. Observe the page

**Expected Results:**
- ✓ Dark background with gradient
- ✓ Floating animation visible
- ✓ "Welcome to Kinniya Salon" header
- ✓ Two role cards visible: Customer and Shop Owner
- ✓ Customer card has person icon
- ✓ Shop Owner card has briefcase icon
- ✓ Both cards have descriptions

**Pass/Fail:** ______

---

### Test 1.2: Role Card Hover Effects
**Steps:**
1. Hover mouse over Customer card
2. Observe effect
3. Move mouse away
4. Hover over Shop Owner card
5. Observe effect

**Expected Results:**
- ✓ Card scales up slightly on hover
- ✓ Golden border glow appears
- ✓ Smooth transition animation
- ✓ Effect works for both cards
- ✓ Effect disappears when mouse leaves

**Pass/Fail:** ______

---

### Test 1.3: Mobile Responsive View
**Steps:**
1. Resize browser to mobile size (< 768px)
2. Observe layout

**Expected Results:**
- ✓ Cards stack vertically
- ✓ Full width on mobile
- ✓ Content remains readable
- ✓ No horizontal scrolling
- ✓ Spacing looks good

**Pass/Fail:** ______

---

## TEST SUITE 2: Customer Authentication

### Test 2.1: Customer Login Form Display
**Steps:**
1. Click "Customer" role card
2. Observe form

**Expected Results:**
- ✓ Role selection disappears
- ✓ Customer login form appears
- ✓ "Customer Login" header visible
- ✓ Email field visible with icon
- ✓ Password field visible with icon
- ✓ Login button visible
- ✓ "Sign Up" link visible
- ✓ Back button visible

**Pass/Fail:** ______

---

### Test 2.2: Customer Login Validation - Empty Fields
**Steps:**
1. Click "Customer" card
2. Click "Login" button without filling anything

**Expected Results:**
- ✓ Error message appears: "Please fill in all fields"
- ✓ Error has red background
- ✓ Form doesn't submit
- ✓ No redirect occurs

**Pass/Fail:** ______

---

### Test 2.3: Customer Login Validation - Invalid Email
**Steps:**
1. Click "Customer" card
2. Enter email: "notanemail"
3. Enter password: "test123"
4. Click "Login"

**Expected Results:**
- ✓ Error message: "Please enter a valid email address"
- ✓ Form doesn't submit
- ✓ No redirect occurs

**Pass/Fail:** ______

---

### Test 2.4: Customer Login - Non-existent Account
**Steps:**
1. Click "Customer" card
2. Enter email: "doesnotexist@test.com"
3. Enter password: "wrongpass"
4. Click "Login"

**Expected Results:**
- ✓ Error message: "Invalid email or password"
- ✓ Form doesn't submit
- ✓ No redirect occurs

**Pass/Fail:** ______

---

### Test 2.5: Customer Signup Form Display
**Steps:**
1. Click "Customer" card
2. Click "Sign Up" link

**Expected Results:**
- ✓ Login form disappears
- ✓ Signup form appears
- ✓ "Create Customer Account" header visible
- ✓ Name field visible
- ✓ Email field visible
- ✓ Phone field visible
- ✓ Password field visible
- ✓ Sign Up button visible
- ✓ "Login" link visible

**Pass/Fail:** ______

---

### Test 2.6: Customer Signup Validation - Empty Fields
**Steps:**
1. Click "Customer" → "Sign Up"
2. Click "Sign Up" button without filling anything

**Expected Results:**
- ✓ Error message: "Please fill in all fields"
- ✓ No account created
- ✓ No redirect

**Pass/Fail:** ______

---

### Test 2.7: Customer Signup Validation - Short Password
**Steps:**
1. Click "Customer" → "Sign Up"
2. Fill in all fields
3. Enter password: "abc" (less than 6 characters)
4. Click "Sign Up"

**Expected Results:**
- ✓ Error message: "Password must be at least 6 characters long"
- ✓ No account created
- ✓ No redirect

**Pass/Fail:** ______

---

### Test 2.8: Customer Signup - Success
**Steps:**
1. Click "Customer" → "Sign Up"
2. Fill in:
   - Name: "Test Customer"
   - Email: "customer@test.com"
   - Phone: "+94 77 123 4567"
   - Password: "test123"
3. Click "Sign Up"
4. Check localStorage in browser console: `localStorage.getItem('customers')`

**Expected Results:**
- ✓ No error message
- ✓ Redirects to index.html
- ✓ Customer added to localStorage
- ✓ Session created in localStorage ('currentUser')
- ✓ User role is 'customer'
- ✓ Logout button visible in navbar

**Pass/Fail:** ______

---

### Test 2.9: Customer Signup - Duplicate Email
**Steps:**
1. Logout from current session
2. Go to auth.html
3. Click "Customer" → "Sign Up"
4. Use same email from Test 2.8
5. Fill other fields
6. Click "Sign Up"

**Expected Results:**
- ✓ Error message: "An account with this email already exists"
- ✓ No second account created
- ✓ No redirect

**Pass/Fail:** ______

---

### Test 2.10: Customer Login - Success
**Steps:**
1. Logout from current session
2. Go to auth.html
3. Click "Customer"
4. Enter email: "customer@test.com"
5. Enter password: "test123"
6. Click "Login"

**Expected Results:**
- ✓ No error message
- ✓ Redirects to index.html
- ✓ Session created in localStorage
- ✓ Logout button visible

**Pass/Fail:** ______

---

## TEST SUITE 3: Shop Owner Authentication

### Test 3.1: Owner Login Form Display
**Steps:**
1. Logout and go to auth.html
2. Click "Shop Owner" card
3. Observe form

**Expected Results:**
- ✓ Role selection disappears
- ✓ Owner login form appears
- ✓ "Shop Owner Login" header visible
- ✓ Email field visible
- ✓ Password field visible
- ✓ Login button visible
- ✓ "Sign Up" link visible
- ✓ Back button visible

**Pass/Fail:** ______

---

### Test 3.2: Owner Signup Form Display
**Steps:**
1. Click "Shop Owner" card
2. Click "Sign Up" link

**Expected Results:**
- ✓ Signup form appears
- ✓ "Create Shop Owner Account" header visible
- ✓ Salon Name field visible (not "Name")
- ✓ Email field visible
- ✓ Phone field visible
- ✓ Password field visible
- ✓ Sign Up button visible

**Pass/Fail:** ______

---

### Test 3.3: Owner Signup - Success
**Steps:**
1. Click "Shop Owner" → "Sign Up"
2. Fill in:
   - Salon Name: "Test Salon"
   - Email: "owner@test.com"
   - Phone: "+94 77 999 8888"
   - Password: "owner123"
3. Click "Sign Up"
4. Check localStorage: `localStorage.getItem('shopOwners')`

**Expected Results:**
- ✓ Redirects to admin.html
- ✓ Owner added to localStorage
- ✓ Session created with role 'owner'
- ✓ Welcome message shows: "Admin Panel - Welcome, Test Salon"
- ✓ Logout button visible

**Pass/Fail:** ______

---

### Test 3.4: Owner Login - Success
**Steps:**
1. Logout from current session
2. Go to auth.html
3. Click "Shop Owner"
4. Enter email: "owner@test.com"
5. Enter password: "owner123"
6. Click "Login"

**Expected Results:**
- ✓ Redirects to admin.html
- ✓ Session created
- ✓ Welcome message displays
- ✓ Logout button visible

**Pass/Fail:** ______

---

## TEST SUITE 4: Access Control & Security

### Test 4.1: Customer Cannot Access Admin
**Steps:**
1. Login as customer (customer@test.com)
2. Manually navigate to admin.html in address bar

**Expected Results:**
- ✓ Alert message: "Access Denied: This page is only for shop owners"
- ✓ Automatically redirected to index.html
- ✓ Customer remains logged in

**Pass/Fail:** ______

---

### Test 4.2: Owner Guided to Admin Panel
**Steps:**
1. Login as owner (owner@test.com)
2. Manually navigate to index.html in address bar

**Expected Results:**
- ✓ Alert message: "Please use the admin panel to manage your salon"
- ✓ Automatically redirected to admin.html
- ✓ Owner remains logged in

**Pass/Fail:** ______

---

### Test 4.3: Unauthenticated User - Index Page
**Steps:**
1. Logout completely
2. Clear session: `localStorage.removeItem('currentUser')`
3. Navigate to index.html

**Expected Results:**
- ✓ Automatically redirected to auth.html
- ✓ No access to page content

**Pass/Fail:** ______

---

### Test 4.4: Unauthenticated User - Admin Page
**Steps:**
1. Ensure logged out
2. Navigate to admin.html

**Expected Results:**
- ✓ Automatically redirected to auth.html
- ✓ No access to admin content

**Pass/Fail:** ______

---

### Test 4.5: Unauthenticated User - Booking Page
**Steps:**
1. Ensure logged out
2. Navigate to booking.html

**Expected Results:**
- ✓ Automatically redirected to auth.html

**Pass/Fail:** ______

---

### Test 4.6: Unauthenticated User - Services Page
**Steps:**
1. Ensure logged out
2. Navigate to services.html

**Expected Results:**
- ✓ Automatically redirected to auth.html

**Pass/Fail:** ______

---

### Test 4.7: Unauthenticated User - Dashboard Page
**Steps:**
1. Ensure logged out
2. Navigate to dashboard.html

**Expected Results:**
- ✓ Automatically redirected to auth.html

**Pass/Fail:** ______

---

### Test 4.8: Unauthenticated User - Gallery Page
**Steps:**
1. Ensure logged out
2. Navigate to gallery.html

**Expected Results:**
- ✓ Automatically redirected to auth.html

**Pass/Fail:** ______

---

## TEST SUITE 5: Session Management

### Test 5.1: Session Persistence
**Steps:**
1. Login as customer
2. Refresh the page (F5)
3. Check if still logged in

**Expected Results:**
- ✓ User remains logged in after refresh
- ✓ Session data intact
- ✓ Logout button still visible

**Pass/Fail:** ______

---

### Test 5.2: Session After Browser Close (Same Tab)
**Steps:**
1. Login as customer
2. Close browser tab
3. Open new tab
4. Navigate to index.html

**Expected Results:**
- ✓ User remains logged in
- ✓ Session persists

**Pass/Fail:** ______

---

### Test 5.3: Already Logged In - Auth Page Redirect (Customer)
**Steps:**
1. Login as customer
2. Navigate to auth.html

**Expected Results:**
- ✓ Automatically redirected to index.html
- ✓ Don't see role selection
- ✓ Session maintained

**Pass/Fail:** ______

---

### Test 5.4: Already Logged In - Auth Page Redirect (Owner)
**Steps:**
1. Login as owner
2. Navigate to auth.html

**Expected Results:**
- ✓ Automatically redirected to admin.html
- ✓ Don't see role selection
- ✓ Session maintained

**Pass/Fail:** ______

---

### Test 5.5: Logout Functionality - Customer
**Steps:**
1. Login as customer
2. Click "Logout" button in navbar
3. Confirm logout in alert
4. Check localStorage: `localStorage.getItem('currentUser')`

**Expected Results:**
- ✓ Confirmation alert appears
- ✓ Redirected to auth.html after confirm
- ✓ Session cleared from localStorage
- ✓ Cannot access protected pages

**Pass/Fail:** ______

---

### Test 5.6: Logout Functionality - Owner
**Steps:**
1. Login as owner
2. Click "Logout" button in navbar
3. Confirm logout

**Expected Results:**
- ✓ Confirmation alert appears
- ✓ Redirected to auth.html
- ✓ Session cleared
- ✓ Cannot access admin.html

**Pass/Fail:** ______

---

### Test 5.7: Logout Cancel
**Steps:**
1. Login as customer
2. Click "Logout"
3. Click "Cancel" in confirmation dialog

**Expected Results:**
- ✓ User remains logged in
- ✓ Stays on current page
- ✓ Session intact

**Pass/Fail:** ______

---

## TEST SUITE 6: UI/UX & Navigation

### Test 6.1: Back Button - Customer Form
**Steps:**
1. Click "Customer" card
2. Click "Back" button

**Expected Results:**
- ✓ Returns to role selection
- ✓ Both role cards visible again
- ✓ Form data cleared
- ✓ Error messages cleared

**Pass/Fail:** ______

---

### Test 6.2: Back Button - Owner Form
**Steps:**
1. Click "Shop Owner" card
2. Click "Back" button

**Expected Results:**
- ✓ Returns to role selection
- ✓ Both role cards visible again

**Pass/Fail:** ______

---

### Test 6.3: Form Toggle - Customer Login/Signup
**Steps:**
1. Click "Customer" card
2. Click "Sign Up" link
3. Observe transition
4. Click "Login" link
5. Observe transition

**Expected Results:**
- ✓ Smooth transition between forms
- ✓ Forms switch correctly
- ✓ No layout breaking
- ✓ Error messages clear on switch

**Pass/Fail:** ______

---

### Test 6.4: Form Toggle - Owner Login/Signup
**Steps:**
1. Click "Shop Owner" card
2. Click "Sign Up" link
3. Click "Login" link

**Expected Results:**
- ✓ Smooth form transitions
- ✓ Forms switch correctly

**Pass/Fail:** ______

---

### Test 6.5: Input Field Icons
**Steps:**
1. Open any login/signup form
2. Observe input fields

**Expected Results:**
- ✓ Email fields have email icon
- ✓ Password fields have lock icon
- ✓ Name fields have user icon
- ✓ Phone fields have phone icon
- ✓ Icons are visible and aligned

**Pass/Fail:** ______

---

### Test 6.6: Input Field Focus States
**Steps:**
1. Open any form
2. Click into each input field
3. Observe styling

**Expected Results:**
- ✓ Golden border appears on focus
- ✓ Subtle glow effect
- ✓ Smooth transition
- ✓ Good visibility

**Pass/Fail:** ______

---

## TEST SUITE 7: Data Storage

### Test 7.1: Customer Data Structure
**Steps:**
1. Create customer account
2. Check localStorage: `JSON.parse(localStorage.getItem('customers'))`

**Expected Results:**
- ✓ Customer object has id
- ✓ Has name, email, phone, password
- ✓ Has role: 'customer'
- ✓ Has createdAt timestamp
- ✓ Data structure correct

**Pass/Fail:** ______

---

### Test 7.2: Owner Data Structure
**Steps:**
1. Create owner account
2. Check localStorage: `JSON.parse(localStorage.getItem('shopOwners'))`

**Expected Results:**
- ✓ Owner object has id
- ✓ Has name (salon name), email, phone, password
- ✓ Has role: 'owner'
- ✓ Has createdAt timestamp
- ✓ Data structure correct

**Pass/Fail:** ______

---

### Test 7.3: Session Data Structure
**Steps:**
1. Login as customer
2. Check session: `JSON.parse(localStorage.getItem('currentUser'))`

**Expected Results:**
- ✓ Session has userId
- ✓ Has email, name
- ✓ Has role: 'customer'
- ✓ Has loginTime timestamp
- ✓ Data structure correct

**Pass/Fail:** ______

---

### Test 7.4: Multiple Customers in Storage
**Steps:**
1. Create 3 different customer accounts
2. Check customers array in localStorage

**Expected Results:**
- ✓ Array contains 3 customers
- ✓ Each has unique id
- ✓ Each has unique email
- ✓ All data preserved

**Pass/Fail:** ______

---

### Test 7.5: Multiple Owners in Storage
**Steps:**
1. Create 2 different owner accounts
2. Check shopOwners array

**Expected Results:**
- ✓ Array contains 2 owners
- ✓ Each has unique id
- ✓ Each has unique email

**Pass/Fail:** ______

---

## TEST SUITE 8: Integration Tests

### Test 8.1: Owner Adds Staff → Customer Books
**Steps:**
1. Login as owner
2. Add a staff member "John Stylist"
3. Logout
4. Login as customer
5. Go to booking.html
6. Check staff dropdown

**Expected Results:**
- ✓ "John Stylist" appears in staff dropdown
- ✓ Real staff data showing (not hardcoded)
- ✓ Customer can select the staff

**Pass/Fail:** ______

---

### Test 8.2: Customer Views Dashboard
**Steps:**
1. Login as customer
2. Navigate to dashboard.html
3. Check console for messages

**Expected Results:**
- ✓ Dashboard loads successfully
- ✓ Console shows: "Loading dashboard for: [Customer Name]"
- ✓ No errors in console

**Pass/Fail:** ______

---

### Test 8.3: Owner Views Admin Panel
**Steps:**
1. Login as owner
2. Check admin.html header
3. Verify quick actions available

**Expected Results:**
- ✓ Header shows: "Admin Panel - Welcome, [Salon Name]"
- ✓ Add Service button visible
- ✓ Add Staff button visible
- ✓ Add Photo button visible

**Pass/Fail:** ______

---

## TEST SUITE 9: Edge Cases

### Test 9.1: Special Characters in Password
**Steps:**
1. Create account with password: "test@#$%123"
2. Login with same password

**Expected Results:**
- ✓ Account created successfully
- ✓ Can login with special characters
- ✓ Password stored correctly

**Pass/Fail:** ______

---

### Test 9.2: Very Long Email
**Steps:**
1. Try creating account with email: "verylongemailaddress@verylongdomainname.com"

**Expected Results:**
- ✓ Email accepted if valid format
- ✓ No truncation issues
- ✓ Can login successfully

**Pass/Fail:** ______

---

### Test 9.3: Spaces in Input Fields
**Steps:**
1. Try signup with name: "  John Doe  " (spaces before/after)
2. Try email: " test@test.com " (spaces)

**Expected Results:**
- ✓ Spaces trimmed automatically
- ✓ Account created with clean data
- ✓ Login works with or without spaces

**Pass/Fail:** ______

---

### Test 9.4: Case Sensitivity in Email
**Steps:**
1. Create account with email: "Test@Example.com"
2. Try login with: "test@example.com"

**Expected Results:**
- ✓ Email stored as entered
- ✓ Login is case-sensitive (should fail)
- ✓ User must match exact case

**Pass/Fail:** ______

---

### Test 9.5: Rapid Form Submission
**Steps:**
1. Fill login form
2. Click "Login" button multiple times rapidly

**Expected Results:**
- ✓ Only one login attempt processed
- ✓ No duplicate sessions created
- ✓ Redirects once

**Pass/Fail:** ______

---

## TEST SUITE 10: Console Error Check

### Test 10.1: No Console Errors - Auth Page
**Steps:**
1. Open auth.html
2. Check browser console for errors

**Expected Results:**
- ✓ No JavaScript errors
- ✓ No CSS errors
- ✓ No 404 errors for resources

**Pass/Fail:** ______

---

### Test 10.2: No Console Errors - After Login
**Steps:**
1. Login as customer
2. Navigate through all pages
3. Check console

**Expected Results:**
- ✓ No errors on any page
- ✓ All scripts load correctly

**Pass/Fail:** ______

---

## 📊 Test Results Summary

### Pass/Fail Count:
- Total Tests: 76
- Passed: _____
- Failed: _____
- Success Rate: _____%

### Critical Failures (if any):
1. _______________________
2. _______________________
3. _______________________

### Known Issues:
1. _______________________
2. _______________________

---

## 🎯 Final Checklist

Before declaring the system ready:
- [ ] All authentication paths work
- [ ] Access control properly enforced
- [ ] No console errors
- [ ] Data stored correctly in localStorage
- [ ] Sessions persist appropriately
- [ ] Logout works everywhere
- [ ] UI looks good on all screen sizes
- [ ] Error messages are user-friendly
- [ ] Navigation flows smoothly
- [ ] Integration with existing features works

---

**Tester Name:** _______________________
**Test Date:** _______________________
**Browser Tested:** _______________________
**Overall Status:** PASS / FAIL

---

**Notes:**
_______________________________________________________
_______________________________________________________
_______________________________________________________
