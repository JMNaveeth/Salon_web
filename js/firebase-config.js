// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
    apiKey: "YOUR-API-KEY-HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firebase services
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

console.log('🔥 Firebase initialized successfully!');

// Enable offline persistence (data works offline)
db.enablePersistence()
    .catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('⚠️ Persistence failed: Multiple tabs open');
        } else if (err.code === 'unimplemented') {
            console.warn('⚠️ Persistence not supported in this browser');
        }
    });
