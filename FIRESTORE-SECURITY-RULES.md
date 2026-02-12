# 🔐 Firestore Security Rules - CRITICAL SETUP

## ⚠️ IMPORTANT: You MUST configure these security rules in Firebase Console!

Without these rules, your database is either:
- ❌ **Completely open** (anyone can read/write/delete everything)
- ❌ **Completely locked** (your app won't work)

---

## 📋 How to Set Up Security Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **LUXE SALON**
3. Click **Firestore Database** in the left menu
4. Click the **Rules** tab at the top

### Step 2: Replace the Rules
Copy and paste the rules below into the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function - Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function - Check if user is the owner of the document
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function - Check if user has a specific role
    function hasRole(role) {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    
    // ========================================
    // USERS Collection Rules
    // ========================================
    match /users/{userId} {
      // Anyone can create their own account during signup
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Users can read their own profile
      allow read: if isOwner(userId);
      
      // Users can update their own profile (except role - prevent privilege escalation)
      allow update: if isOwner(userId) && 
                      request.resource.data.role == resource.data.role;
      
      // Only the user themselves can delete their account
      allow delete: if isOwner(userId);
      
      // Shop owners can read all customer profiles (for booking management)
      allow read: if hasRole('owner');
    }
    
    // ========================================
    // SERVICES Collection Rules
    // ========================================
    match /services/{serviceId} {
      // Anyone (including guests) can read services
      allow read: if true;
      
      // Only shop owners can create, update, or delete services
      allow create, update, delete: if hasRole('owner');
    }
    
    // ========================================
    // STAFF Collection Rules
    // ========================================
    match /staff/{staffId} {
      // Anyone can read staff information
      allow read: if true;
      
      // Only shop owners can manage staff
      allow create, update, delete: if hasRole('owner');
    }
    
    // ========================================
    // BOOKINGS Collection Rules
    // ========================================
    match /bookings/{bookingId} {
      // Customers can create bookings (must be authenticated)
      allow create: if isAuthenticated() && 
                      request.resource.data.customerId == request.auth.uid;
      
      // Users can read their own bookings
      allow read: if isAuthenticated() && 
                    (resource.data.customerId == request.auth.uid || hasRole('owner'));
      
      // Users can update/cancel their own bookings
      allow update: if isAuthenticated() && 
                      (resource.data.customerId == request.auth.uid || hasRole('owner'));
      
      // Users can delete their own bookings
      allow delete: if isAuthenticated() && 
                      (resource.data.customerId == request.auth.uid || hasRole('owner'));
      
      // Shop owners can read all bookings
      allow read: if hasRole('owner');
      
      // Shop owners can update any booking (for status changes)
      allow update: if hasRole('owner');
    }
    
    // ========================================
    // GALLERY Collection Rules
    // ========================================
    match /gallery/{photoId} {
      // Anyone can view gallery photos
      allow read: if true;
      
      // Only shop owners can upload, update, or delete gallery photos
      allow create, update, delete: if hasRole('owner');
    }
    
    // ========================================
    // REVIEWS Collection Rules
    // ========================================
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      
      // Authenticated customers can create reviews
      allow create: if isAuthenticated() && 
                      hasRole('customer') &&
                      request.resource.data.customerId == request.auth.uid;
      
      // Users can update their own reviews
      allow update: if isAuthenticated() && 
                      resource.data.customerId == request.auth.uid;
      
      // Users can delete their own reviews, or shop owners can delete any review
      allow delete: if isAuthenticated() && 
                      (resource.data.customerId == request.auth.uid || hasRole('owner'));
    }
    
    // ========================================
    // SHOP_OWNERS Collection Rules (Business Details)
    // ========================================
    match /shop_owners/{ownerId} {
      // Anyone can read shop information (public)
      allow read: if true;
      
      // Only the owner can update their shop details
      allow update: if isOwner(ownerId) && hasRole('owner');
      
      // Only authenticated owners can create shop details
      allow create: if isAuthenticated() && 
                      hasRole('owner') && 
                      request.auth.uid == ownerId;
    }
  }
}
```

### Step 3: Publish the Rules
1. Click **Publish** button in Firebase Console
2. Wait for confirmation message: "Rules published successfully"

---

## 🔒 What These Rules Do:

### ✅ **Security Features:**
1. **Role-Based Access Control**
   - Customers can only see their own data
   - Shop owners can manage all salon data
   - Guests can view public information (services, gallery)

2. **Data Protection**
   - Users cannot change their own role (prevents privilege escalation)
   - Users can only modify their own data
   - All destructive operations require authentication

3. **Privacy**
   - Personal data is protected
   - Users cannot see other customers' bookings
   - Only authorized users can modify sensitive data

---

## 🧪 Testing Your Security Rules

### In Firebase Console:
1. Go to Firestore Database → Rules
2. Click **Rules Playground** tab
3. Test different scenarios:

**Test 1: Authenticated Customer Reading Their Profile**
```
Location: /users/{their-uid}
Auth: Authenticated (customer)
Operation: get
Expected: ALLOWED ✅
```

**Test 2: Customer Trying to Read Another Customer's Profile**
```
Location: /users/{other-uid}
Auth: Authenticated (customer)
Operation: get
Expected: DENIED ❌
```

**Test 3: Guest Viewing Services**
```
Location: /services/service1
Auth: Unauthenticated
Operation: get
Expected: ALLOWED ✅
```

**Test 4: Customer Creating Service**
```
Location: /services/newService
Auth: Authenticated (customer)
Operation: create
Expected: DENIED ❌
```

---

## 📊 Firestore Data Structure

### **users** Collection
```javascript
users/{userId}
  {
    email: "user@example.com",
    name: "John Doe",
    phone: "+1234567890",
    role: "customer" | "owner",
    createdAt: timestamp,
    lastLogin: timestamp,
    
    // For shop owners only:
    businessName: "Luxe Salon",
    location: "Kinniya",
    bio: "Professional services..."
  }
```

### **bookings** Collection
```javascript
bookings/{bookingId}
  {
    customerId: "user-uid",
    customerName: "John Doe",
    customerEmail: "user@example.com",
    customerPhone: "+1234567890",
    serviceId: "service-id",
    serviceName: "Haircut",
    staffId: "staff-id",
    staffName: "Jane Smith",
    date: "2026-02-15",
    time: "10:00 AM",
    status: "pending" | "confirmed" | "completed" | "cancelled",
    totalPrice: 50,
    createdAt: timestamp
  }
```

### **services** Collection
```javascript
services/{serviceId}
  {
    name: "Haircut",
    description: "Professional haircut service",
    price: 50,
    duration: "30 min",
    category: "Hair",
    imageUrl: "https://...",
    createdAt: timestamp
  }
```

---

## ⚠️ Common Errors & Solutions

### Error: "Missing or insufficient permissions"
**Cause:** Security rules are blocking the operation
**Solution:** 
- Check if user is authenticated
- Verify user has correct role
- Ensure security rules are published

### Error: "PERMISSION_DENIED"
**Cause:** User trying to access data they don't have permission for
**Solution:**
- Verify user role in Firestore
- Check authentication state
- Review security rules

---

## 🚨 NEVER DO THIS:

### ❌ Bad Security Rules (Allow All - INSECURE!)
```javascript
// DON'T USE THIS - YOUR DATA WILL BE COMPROMISED!
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ❌ DANGEROUS!
    }
  }
}
```

### ❌ Storing Passwords in Firestore
```javascript
// ❌ NEVER DO THIS!
db.collection('users').doc(userId).set({
  email: email,
  password: password  // ❌ SECURITY RISK!
});
```

### ✅ Correct Way (Use Firebase Auth)
```javascript
// ✅ Passwords handled by Firebase Auth
auth.createUserWithEmailAndPassword(email, password);

// ✅ Only profile data in Firestore
db.collection('users').doc(userId).set({
  email: email,
  name: name,
  role: 'customer'
  // NO PASSWORD!
});
```

---

## 📝 Checklist

Before going live, verify:

- [ ] Security rules are published in Firebase Console
- [ ] Test authentication works (signup/login)
- [ ] Test role-based access (customer vs owner)
- [ ] No passwords stored in Firestore
- [ ] Users cannot access other users' data
- [ ] Guests can view public content
- [ ] Owners can manage salon data

---

## 🎯 Summary

| Data | Stored Where | Access Control |
|------|--------------|----------------|
| **Email & Password** | Firebase Auth | Automatic encryption |
| **User Profile** | Firestore `/users` | User + Role-based |
| **Bookings** | Firestore `/bookings` | Owner of booking + Salon owners |
| **Services** | Firestore `/services` | Public read, Owner write |
| **Gallery** | Firestore `/gallery` | Public read, Owner write |

---

**✅ Your data is now secure!** 🔐

Users' passwords are NEVER stored in your database - they're encrypted and managed by Firebase Authentication.
