// Gallery page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery functionality
    initGalleryFilters();
    initGalleryModal();
});

// Gallery Filtering
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                    // Trigger AOS animation refresh
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Gallery Modal
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openGalleryModal(index);
        });
    });
}

function openGalleryModal(startIndex) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = startIndex;

    // Create modal HTML
    const modalHTML = `
        <div id="galleryModal" class="gallery-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="gallery-modal-image">
                        <img id="modalImage" src="" alt="">
                        <div class="image-navigation">
                            <button class="nav-btn prev-btn" id="prevBtn">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="nav-btn next-btn" id="nextBtn">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                    <div class="gallery-modal-info">
                        <h3 id="modalTitle"></h3>
                        <p id="modalDescription"></p>
                        <div class="modal-meta">
                            <span class="category" id="modalCategory"></span>
                            <span class="image-counter" id="imageCounter"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const imageCounter = document.getElementById('imageCounter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeBtn = modal.querySelector('.modal-close');

    // Show modal with animation
    setTimeout(() => modal.classList.add('show'), 10);

    // Update modal content
    updateModalContent(currentIndex);

    function updateModalContent(index) {
        const item = galleryItems[index];
        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        const title = overlay.querySelector('h4').textContent;
        const description = overlay.querySelector('p').textContent;
        const category = getCategoryName(item.classList);

        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalCategory.textContent = category;
        imageCounter.textContent = `${index + 1} of ${galleryItems.length}`;
    }

    function getCategoryName(classList) {
        if (classList.contains('hair')) return 'Hair Styling';
        if (classList.contains('bridal')) return 'Bridal';
        if (classList.contains('facial')) return 'Facials';
        if (classList.contains('spa')) return 'Spa Treatments';
        return 'Gallery';
    }

    // Navigation functions
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
        updateModalContent(currentIndex);
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryItems.length;
        updateModalContent(currentIndex);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    // Event listeners
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('show')) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                showPrevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNextImage();
                break;
            case 'Escape':
                e.preventDefault();
                closeModal();
                break;
        }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    modal.addEventListener('touchstart', function(e) {
        startX = e.changedTouches[0].screenX;
    });

    modal.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        if (startX - endX > swipeThreshold) {
            showNextImage(); // Swipe left
        } else if (endX - startX > swipeThreshold) {
            showPrevImage(); // Swipe right
        }
    }
}

// Gallery statistics and animations
function initGalleryStats() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const categories = {
        hair: 0,
        bridal: 0,
        facial: 0,
        spa: 0
    };

    galleryItems.forEach(item => {
        if (item.classList.contains('hair')) categories.hair++;
        if (item.classList.contains('bridal')) categories.bridal++;
        if (item.classList.contains('facial')) categories.facial++;
        if (item.classList.contains('spa')) categories.spa++;
    });

    // Store stats for potential use
    window.galleryStats = {
        total: galleryItems.length,
        categories: categories
    };
}

// Lazy loading for gallery images
function initLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Gallery search functionality (optional enhancement)
function initGallerySearch() {
    // Could be added for searching through gallery items
    // For now, just the filtering is implemented
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initGalleryStats();
    initLazyLoading();
    initGallerySearch();
});

// Gallery hover effects
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const overlay = item.querySelector('.gallery-overlay');

        item.addEventListener('mouseenter', function() {
            overlay.style.opacity = '1';
        });

        item.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
        });
    });
});
