// Firebase Database Helper - Replaces localStorage with Firebase Firestore
// This file handles all database operations for your salon website

const FirebaseDB = {
    // ===== SHOP OWNERS =====
    
    /**
     * Register a new shop owner
     * @param {Object} ownerData - Owner information (name, businessName, location, etc.)
     * @param {string} email - Email address
     * @param {string} password - Password (will be encrypted by Firebase)
     */
    async registerShopOwner(ownerData, email, password) {
        try {
            // Create Firebase Auth account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Save owner data to Firestore
            const ownerDoc = {
                ...ownerData,
                uid: user.uid,
                email: email,
                role: 'owner',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('shopOwners').doc(user.uid).set(ownerDoc);
            
            console.log('✅ Shop owner registered:', user.uid);
            return { success: true, userId: user.uid, data: ownerDoc };
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    },
    
    /**
     * Login shop owner
     */
    async loginShopOwner(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Get owner data from Firestore
            const ownerDoc = await db.collection('shopOwners').doc(user.uid).get();
            
            if (!ownerDoc.exists) {
                throw new Error('Owner profile not found');
            }
            
            const ownerData = ownerDoc.data();
            console.log('✅ Shop owner logged in:', user.uid);
            
            return {
                success: true,
                user: user,
                data: ownerData
            };
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },
    
    /**
     * Get all shop owners (for homepage salon listing)
     */
    async getAllShopOwners() {
        try {
            const snapshot = await db.collection('shopOwners')
                .orderBy('createdAt', 'desc')
                .get();
            
            const owners = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`📋 Retrieved ${owners.length} shop owners`);
            return owners;
        } catch (error) {
            console.error('❌ Error getting shop owners:', error);
            return [];
        }
    },
    
    /**
     * Get shop owner by email
     */
    async getShopOwnerByEmail(email) {
        try {
            const snapshot = await db.collection('shopOwners')
                .where('email', '==', email)
                .limit(1)
                .get();
            
            if (snapshot.empty) {
                return null;
            }
            
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            console.error('❌ Error getting shop owner:', error);
            return null;
        }
    },
    
    // ===== SERVICES =====
    
    /**
     * Add a new service
     */
    async addService(serviceData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');
            
            const service = {
                ...serviceData,
                ownerId: user.uid,
                ownerEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const docRef = await db.collection('services').add(service);
            console.log('✅ Service added:', docRef.id);
            
            return { success: true, id: docRef.id, ...service };
        } catch (error) {
            console.error('❌ Error adding service:', error);
            throw error;
        }
    },
    
    /**
     * Get services (optionally filtered by owner email)
     */
    async getServices(ownerEmail = null) {
        try {
            let query = db.collection('services');
            
            if (ownerEmail) {
                query = query.where('ownerEmail', '==', ownerEmail);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            
            const services = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`📋 Retrieved ${services.length} services`);
            return services;
        } catch (error) {
            console.error('❌ Error getting services:', error);
            return [];
        }
    },
    
    /**
     * Update a service
     */
    async updateService(serviceId, updatedData) {
        try {
            await db.collection('services').doc(serviceId).update({
                ...updatedData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Service updated:', serviceId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error updating service:', error);
            throw error;
        }
    },
    
    /**
     * Delete a service
     */
    async deleteService(serviceId) {
        try {
            await db.collection('services').doc(serviceId).delete();
            console.log('✅ Service deleted:', serviceId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error deleting service:', error);
            throw error;
        }
    },
    
    // ===== STAFF =====
    
    /**
     * Add staff member
     */
    async addStaff(staffData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');
            
            const staff = {
                ...staffData,
                ownerId: user.uid,
                ownerEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const docRef = await db.collection('staff').add(staff);
            console.log('✅ Staff added:', docRef.id);
            
            return { success: true, id: docRef.id, ...staff };
        } catch (error) {
            console.error('❌ Error adding staff:', error);
            throw error;
        }
    },
    
    /**
     * Get staff (filtered by owner)
     */
    async getStaff(ownerEmail) {
        try {
            let query = db.collection('staff');
            
            if (ownerEmail) {
                query = query.where('ownerEmail', '==', ownerEmail);
            }
            
            const snapshot = await query.get();
            const staff = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`📋 Retrieved ${staff.length} staff members`);
            return staff;
        } catch (error) {
            console.error('❌ Error getting staff:', error);
            return [];
        }
    },
    
    // ===== CUSTOMER PHOTOS =====
    
    /**
     * Upload image/video to Firebase Storage
     */
    async uploadMedia(base64Data, fileName, mediaType) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');
            
            // Convert base64 to blob
            const blob = this.base64ToBlob(base64Data);
            
            // Create storage reference
            const storageRef = storage.ref();
            const fileRef = storageRef.child(`${user.uid}/${mediaType}/${Date.now()}_${fileName}`);
            
            // Upload file
            console.log('⬆️ Uploading media...');
            const snapshot = await fileRef.put(blob);
            
            // Get download URL
            const downloadURL = await snapshot.ref.getDownloadURL();
            console.log('✅ Media uploaded:', downloadURL);
            
            return downloadURL;
        } catch (error) {
            console.error('❌ Error uploading media:', error);
            throw error;
        }
    },
    
    /**
     * Add customer photo/video
     */
    async addCustomerPhoto(photoData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');
            
            // Upload image to Cloud Storage
            const imageUrl = await this.uploadMedia(
                photoData.image,
                photoData.name,
                photoData.mediaType || 'photos'
            );
            
            // Save photo metadata to Firestore
            const photo = {
                name: photoData.name,
                category: photoData.category,
                description: photoData.description,
                imageUrl: imageUrl,
                mediaType: photoData.mediaType || 'image',
                ownerId: user.uid,
                ownerEmail: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const docRef = await db.collection('customerPhotos').add(photo);
            console.log('✅ Customer photo added:', docRef.id);
            
            return { success: true, id: docRef.id, ...photo };
        } catch (error) {
            console.error('❌ Error adding customer photo:', error);
            throw error;
        }
    },
    
    /**
     * Get customer photos (optionally filtered by owner)
     */
    async getCustomerPhotos(ownerEmail = null) {
        try {
            let query = db.collection('customerPhotos');
            
            if (ownerEmail) {
                query = query.where('ownerEmail', '==', ownerEmail);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            
            const photos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`📋 Retrieved ${photos.length} customer photos`);
            return photos;
        } catch (error) {
            console.error('❌ Error getting customer photos:', error);
            return [];
        }
    },
    
    /**
     * Delete customer photo
     */
    async deleteCustomerPhoto(photoId, imageUrl) {
        try {
            // Delete from Firestore
            await db.collection('customerPhotos').doc(photoId).delete();
            
            // Delete from Storage
            if (imageUrl && imageUrl.includes('firebase')) {
                const imageRef = storage.refFromURL(imageUrl);
                await imageRef.delete();
            }
            
            console.log('✅ Customer photo deleted:', photoId);
            return { success: true };
        } catch (error) {
            console.error('❌ Error deleting customer photo:', error);
            throw error;
        }
    },
    
    // ===== ACTIVITIES =====
    
    /**
     * Add activity log
     */
    async addActivity(icon, message) {
        try {
            const user = auth.currentUser;
            if (!user) return;
            
            const activity = {
                icon: icon,
                message: message,
                ownerId: user.uid,
                ownerEmail: user.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('activities').add(activity);
            console.log('✅ Activity logged');
        } catch (error) {
            console.error('❌ Error adding activity:', error);
        }
    },
    
    /**
     * Get activities (filtered by owner)
     */
    async getActivities(ownerEmail, limit = 10) {
        try {
            const snapshot = await db.collection('activities')
                .where('ownerEmail', '==', ownerEmail)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            const activities = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return activities;
        } catch (error) {
            console.error('❌ Error getting activities:', error);
            return [];
        }
    },
    
    // ===== BOOKINGS =====
    
    /**
     * Add booking
     */
    async addBooking(bookingData) {
        try {
            const booking = {
                ...bookingData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: bookingData.status || 'pending'
            };
            
            const docRef = await db.collection('bookings').add(booking);
            console.log('✅ Booking added:', docRef.id);
            
            return { success: true, id: docRef.id, ...booking };
        } catch (error) {
            console.error('❌ Error adding booking:', error);
            throw error;
        }
    },
    
    /**
     * Get bookings (filtered by owner or customer)
     */
    async getBookings(filterBy = null, filterValue = null) {
        try {
            let query = db.collection('bookings');
            
            if (filterBy && filterValue) {
                query = query.where(filterBy, '==', filterValue);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            
            const bookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            console.log(`📋 Retrieved ${bookings.length} bookings`);
            return bookings;
        } catch (error) {
            console.error('❌ Error getting bookings:', error);
            return [];
        }
    },
    
    // ===== CUSTOMERS =====
    
    /**
     * Register customer
     */
    async registerCustomer(customerData, email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            const customer = {
                ...customerData,
                uid: user.uid,
                email: email,
                role: 'customer',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('customers').doc(user.uid).set(customer);
            console.log('✅ Customer registered:', user.uid);
            
            return { success: true, userId: user.uid, data: customer };
        } catch (error) {
            console.error('❌ Registration error:', error);
            throw error;
        }
    },
    
    /**
     * Login customer
     */
    async loginCustomer(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            const customerDoc = await db.collection('customers').doc(user.uid).get();
            
            if (!customerDoc.exists) {
                throw new Error('Customer profile not found');
            }
            
            console.log('✅ Customer logged in:', user.uid);
            return { success: true, user: user, data: customerDoc.data() };
        } catch (error) {
            console.error('❌ Login error:', error);
            throw error;
        }
    },
    
    // ===== AUTHENTICATION HELPERS =====
    
    /**
     * Get currently logged in user
     */
    getCurrentUser() {
        return auth.currentUser;
    },
    
    /**
     * Listen to auth state changes
     */
    onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    },
    
    /**
     * Logout
     */
    async logout() {
        try {
            await auth.signOut();
            console.log('✅ User logged out');
            return { success: true };
        } catch (error) {
            console.error('❌ Logout error:', error);
            throw error;
        }
    },
    
    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Convert base64 to Blob for upload
     */
    base64ToBlob(base64Data) {
        const parts = base64Data.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        
        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        
        return new Blob([uInt8Array], { type: contentType });
    },
    
    /**
     * Real-time listener for new bookings (for shop owners)
     */
    listenToNewBookings(ownerEmail, callback) {
        return db.collection('bookings')
            .where('salonOwnerEmail', '==', ownerEmail)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        callback({
                            type: 'new',
                            data: { id: change.doc.id, ...change.doc.data() }
                        });
                    }
                });
            });
    }
};

// Export for use in other files
window.FirebaseDB = FirebaseDB;
console.log('✅ Firebase Database Helper loaded');
