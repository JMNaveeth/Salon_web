// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

const firebaseConfig = {
     apiKey: "AIzaSyCXCLiHUDToywotKDlyMIGOFj3nghFyjFI",
  authDomain: "luxe-salon.firebaseapp.com",
  projectId: "luxe-salon",
  storageBucket: "luxe-salon.firebasestorage.app",
  messagingSenderId: "116922070530",
  appId: "1:116922070530:web:a718c640d924c0903f591b"
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
