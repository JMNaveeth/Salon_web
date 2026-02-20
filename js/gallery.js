// Gallery Filtering and Animations
document.addEventListener('DOMContentLoaded', function() {
    updateGalleryHeader(); // Update header if filtering by owner
    updateGalleryStats(); // Update stats first
    loadCustomerPhotos(); // Load customer photos
    initGalleryFilter();
    initGalleryAnimations();
    enforceOwnerVisibility();
    // initCursor(); // DISABLED - using normal cursor
    animateStats();
    initParallax();
});

// Get owner filter from URL if present
function getOwnerFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    // Support both ?ownerId=... and ?owner=... for backwards compatibility
    return urlParams.get('ownerId') || urlParams.get('owner');
}

// Hide or show owner-only controls depending on signed-in user
function enforceOwnerVisibility() {
    const ownerFilter = getOwnerFilter();

    // Elements with class 'owner-only' are shown only to the owner of this page
    function updateVisibility(user) {
        const isOwner = user && ownerFilter && user.uid === ownerFilter;

        document.querySelectorAll('.owner-only').forEach(el => {
            el.style.display = isOwner ? '' : 'none';
        });

        // Hide any admin links that point to admin.html for visitors
        document.querySelectorAll('a[href="admin.html"]').forEach(a => {
            if (!isOwner) a.style.display = 'none';
        });
    }

    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(user => {
            updateVisibility(user);
        });
    } else {
        // If auth not available, hide owner-only controls by default
        updateVisibility(null);
    }
}

// Update gallery header when viewing specific owner's gallery
async function updateGalleryHeader() {
    const ownerFilter = getOwnerFilter();
    if (!ownerFilter) return;
    
    try {
        // Get owner details from Firebase
        const ownerDoc = await db.collection('users').doc(ownerFilter).get();
        
        if (ownerDoc.exists) {
            const owner = ownerDoc.data();
            const badge = document.getElementById('galleryOwnerBadge');
            const title = document.getElementById('galleryTitle');
            const subtitle = document.getElementById('gallerySubtitle');
            
            const locationDisplay = owner.area && owner.district 
                ? `${owner.area}, ${owner.district}` 
                : owner.location || 'our salon';
            
            if (badge) {
                badge.textContent = owner.businessName || owner.name;
                badge.style.background = 'var(--gradient)';
                badge.style.color = 'white';
            }
            if (title) {
                title.innerHTML = `${owner.businessName || owner.name}'s <span class="highlight">Gallery</span>`;
            }
            if (subtitle) {
                subtitle.textContent = `View our work and transformations at ${locationDisplay}`;
            }
        }
    } catch (error) {
        console.error('Error loading owner details:', error);
    }
}

// Update gallery statistics based on real data from Firebase
async function updateGalleryStats() {
    try {
        const ownerFilter = getOwnerFilter();
        
        // Build query based on owner filter
        let query = db.collection('gallery');
        
        if (ownerFilter) {
            query = query.where('ownerId', '==', ownerFilter);
        }
        
        const snapshot = await query.get();
        const customerPhotos = [];

        snapshot.forEach(doc => {
            customerPhotos.push(doc.data());
        });

        const totalPhotosEl = document.getElementById('totalPhotos');
        if (totalPhotosEl) {
            totalPhotosEl.textContent = customerPhotos.length;
        }

        // Count unique categories
        const categories = new Set(customerPhotos.map(photo => photo.category));
        const totalCategoriesEl = document.getElementById('totalCategories');
        if (totalCategoriesEl) {
            totalCategoriesEl.textContent = categories.size || 0;
        }
        
        console.log('✅ Gallery stats updated:', filteredPhotos.length, 'photos');
    } catch (error) {
        console.error('Error updating gallery stats:', error);
    }
}

// Load customer photos from Firebase
async function loadCustomerPhotos() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    try {
        // Show loading state
        galleryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px;"><i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: var(--primary-color);"></i><p style="margin-top: 20px; color: var(--text-light);">Loading gallery...</p></div>';
        
        const ownerFilter = getOwnerFilter();
        
        // Build query based on owner filter
        let query = db.collection('gallery');
        
        if (ownerFilter) {
            query = query.where('ownerId', '==', ownerFilter);
        }
        
        const snapshot = await query.get();
        const customerPhotos = [];

        snapshot.forEach(doc => {
            customerPhotos.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('✅ Loaded', customerPhotos.length, 'photos from Firebase');

        if (customerPhotos.length > 0) {
            console.log('Loading customer photos:', customerPhotos.length, ownerFilter ? '(filtered by owner)' : '');

            customerPhotos.forEach(photo => {
                const galleryItem = document.createElement('div');
                galleryItem.className = `gallery-item ${photo.category}`;
                
                // Determine media type
                const isVideo = photo.mediaType === 'video' || (photo.image && String(photo.image).match(/\.(mp4|webm|ogg)$/i));
                const mediaUrl = photo.image || photo.imageData || photo.imageDataUrl || '';
                
                // Get category display name
                const categoryNames = {
                    'hair': 'Hair Services',
                    'facial': 'Facial Services',
                    'special': 'Wedding/Fashion',
                    'others': 'Other Services'
                };
                const categoryDisplay = categoryNames[photo.category] || photo.category;
                
                galleryItem.innerHTML = `
                    <div class="gallery-card enhanced">
                        ${isVideo ? 
                            `<video src="${mediaUrl}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" muted loop playsinline></video>
                            <div class="video-indicator">
                                <i class="fas fa-play-circle"></i>
                            </div>` :
                            `<img src="${mediaUrl}" alt="${photo.name || photo.title}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;" />`
                        }
                        <div class="gallery-gradient-overlay"></div>
                        <div class="gallery-card-header">
                            <div class="media-type-badge ${isVideo ? 'video' : 'photo'}">
                                <i class="fas fa-${isVideo ? 'video' : 'image'}"></i>
                            </div>
                        </div>
                        <div class="gallery-card-footer">
                            <div class="customer-info-compact">
                                <div class="customer-avatar-small">
                                    <i class="fas fa-user-circle"></i>
                                </div>
                                <div class="customer-details">
                                    <h4 class="customer-name">${photo.name || photo.title}</h4>
                                    <p class="customer-desc">${photo.description || 'Our valued customer'}</p>
                                </div>
                            </div>
                            <div class="work-badge-small">
                                <i class="fas fa-crown"></i>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add video hover play functionality
                if (isVideo) {
                    const videoElement = galleryItem.querySelector('video');
                    const card = galleryItem.querySelector('.gallery-card');
                    
                    card.addEventListener('mouseenter', () => {
                        videoElement.play().catch(err => console.log('Video play failed:', err));
                    });
                    
                    card.addEventListener('mouseleave', () => {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    });
                }
                
                galleryGrid.appendChild(galleryItem);
            });
        } else {
            // Show empty state message
            galleryGrid.innerHTML = `
                <div class="empty-gallery-message">
                    <div class="empty-icon">
                        <i class="fas fa-images"></i>
                    </div>
                    <h3>No Photos Yet</h3>
                    <p>The gallery is waiting to be filled with amazing customer transformations!</p>
                    <div class="empty-actions">
                        <a href="admin.html" class="btn-primary">
                            <i class="fas fa-user-shield"></i>
                            <span>Shop Owner? Add Photos</span>
                        </a>
                        <a href="services.html" class="btn-secondary">
                            <i class="fas fa-concierge-bell"></i>
                            <span>View Our Services</span>
                        </a>
                    </div>
                </div>
            `;
            console.log('No customer photos found');
        }
    } catch (error) {
        console.error('Error loading customer photos:', error);
        galleryGrid.innerHTML = `
            <div class="empty-gallery-message">
                <div class="empty-icon error">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Error Loading Gallery</h3>
                <p>Something went wrong. Please refresh the page or contact support.</p>
            </div>
        `;
    }
}

// Initialize Gallery Filter
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Get all gallery items dynamically (including customer photos)
            const galleryItems = document.querySelectorAll('.gallery-item');

            // Filter gallery items with animation
            galleryItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    setTimeout(() => {
                        item.classList.remove('hidden');
                    }, 100);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// Initialize Gallery Animations
function initGalleryAnimations() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    // Observe gallery items for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });

    galleryCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    // Add click animation
    galleryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('gallery-btn')) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    });
}

// Custom Cursor
function initCursor() {
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursor.classList.add('cursor');
    cursorFollower.classList.add('cursor-follower');
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
        const distX = mouseX - followerX;
        const distY = mouseY - followerY;
        
        followerX += distX * 0.1;
        followerY += distY * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .gallery-card, .filter-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.replace(/[0-9]/g, '');
                
                let current = 0;
                const increment = number / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        target.textContent = number + suffix;
                        clearInterval(timer);
                    } else {
                        target.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
                
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Parallax effect on hero shapes
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.hero-shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.2);
            const currentTransform = shape.style.transform || '';
            shape.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}
