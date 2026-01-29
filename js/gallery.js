// Gallery Filtering and Animations
document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initGalleryAnimations();
    initCursor();
    animateStats();
    initParallax();
});

// Initialize Gallery Filter
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

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
