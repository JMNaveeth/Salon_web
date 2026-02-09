# Firebase Setup Guide for Kinniya Salon

## Step 1: Create Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `Kinniya-Salon`
4. Disable Google Analytics (optional - you can enable later)
5. Click "Create project"

## Step 2: Enable Required Services

### Enable Authentication
1. In Firebase Console, click "Authentication" in left menu
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Enable "Email/Password"
5. Click "Save"

### Enable Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create database"
3. Choose "Start in production mode"
4. Select region: Choose closest to you (e.g., `us-central`)
5. Click "Enable"

### Enable Storage
1. Click "Storage" in left menu
2. Click "Get started"
3. Click "Next" (use default security rules for now)
4. Select same region as Firestore
5. Click "Done"

## Step 3: Get Your Firebase Configuration

1. Click gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>`
5. Enter app nickname: `Kinniya-Salon-Web`
6. DON'T check "Also set up Firebase Hosting"
7. Click "Register app"
8. **COPY the firebaseConfig object**

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA....",
  authDomain: "kinniya-salon.firebaseapp.com",
  projectId: "kinniya-salon",
  storageBucket: "kinniya-salon.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

9. **PASTE this into `js/firebase-config.js`** (replace the placeholder values)

## Step 4: Set Up Security Rules

### Firestore Rules
In Firebase Console > Firestore Database > Rules tab, paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Shop Owners - only owner can read/write their own data
    match /shopOwners/{userId} {
      allow read: if true; // Anyone can see shop owners (for homepage)
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Services - only owner can manage their services
    match /services/{serviceId} {
      allow read: if true; // Anyone can see services
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.ownerId == request.auth.uid;
    }
    
    // Staff - only owner can manage their staff
    match /staff/{staffId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.ownerId == request.auth.uid;
    }
    
    // Customer Photos - only owner can manage their photos
    match /customerPhotos/{photoId} {
      allow read: if true; // Anyone can see gallery
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.ownerId == request.auth.uid;
    }
    
    // Activities - only owner can read their activities
    match /activities/{activityId} {
      allow read: if request.auth != null && 
                    resource.data.ownerId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Bookings - customers and owners can read/write
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if true; // Anyone can book
      allow update, delete: if request.auth != null;
    }
    
    // Customers
    match /customers/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

### Storage Rules
In Firebase Console > Storage > Rules tab, paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User can only upload to their own folder
    match /{userId}/{allPaths=**} {
      allow read: if true; // Anyone can view images (for gallery)
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Click "Publish"

## Step 5: Add Firebase to Your HTML Files

Add these scripts BEFORE your closing `</body>` tag in ALL HTML files:

```html
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
    
    <!-- Your Firebase Config -->
    <script src="js/firebase-config.js"></script>
    <script src="js/firebase-helper.js"></script>
    
    <!-- Your other scripts -->
    <script src="js/main.js"></script>
    <script src="js/auth.js"></script>
</body>
</html>
```

## Step 6: Test Your Setup

Open your browser console (F12) and check for:
```
🔥 Firebase initialized successfully!
✅ Firebase Database Helper loaded
```

If you see these messages, congratulations! Firebase is connected! 🎉

## Step 7: Deploy Your Website (Optional)

### Using Firebase Hosting (FREE)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project folder
cd "C:\Users\NAVEETH\Desktop\Work related\Projects (CV)\Saloon_Kinniya"
firebase init

# Select:
# - Hosting
# - Use existing project: Kinniya-Salon
# - Public directory: . (current folder)
# - Single-page app: No
# - Don't overwrite any files

# Deploy
firebase deploy
```

Your website will be live at: `https://kinniya-salon.web.app`

## Troubleshooting

### Error: "Firebase is not defined"
- Make sure Firebase scripts are loaded BEFORE your custom scripts
- Check browser console for script loading errors

### Error: "Permission denied"
- Check Firestore Security Rules
- Make sure user is authenticated

### Error: "Storage upload failed"
- Check Storage Security Rules
- Check file size (max 50MB for videos)

### Error: "Network error"
- Check your internet connection
- Make sure Firebase project is active

## Need Help?

Contact Firebase Support or check:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com/
