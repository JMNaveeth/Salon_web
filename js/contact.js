// Contact page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact functionality
    initContactForm();
    initFAQAccordion();
});

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate form
            if (validateContactForm(this)) {
                // Submit form
                submitContactForm(new FormData(this));
            }
        });
    }
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);

            // Additional validation
            switch (field.name) {
                case 'email':
                    if (!isValidEmail(field.value)) {
                        showFieldError(field, 'Please enter a valid email address');
                        isValid = false;
                    }
                    break;
                case 'phone':
                    if (field.value && !isValidPhone(field.value)) {
                        showFieldError(field, 'Please enter a valid phone number');
                        isValid = false;
                    }
                    break;
            }
        }
    });

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;

    field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function submitContactForm(formData) {
    // Create contact message object
    const contactMessage = {
        id: 'contact_' + Date.now(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString(),
        status: 'unread'
    };

    // Save to localStorage (in a real app, this would be sent to a server)
    const messages = Storage.get('contactMessages', []);
    messages.push(contactMessage);
    Storage.set('contactMessages', messages);

    // Show success message
    showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');

    // Reset form
    document.getElementById('contactForm').reset();

    // Handle newsletter subscription
    if (contactMessage.newsletter) {
        handleNewsletterSubscription(contactMessage.email);
    }
}

function handleNewsletterSubscription(email) {
    const subscribers = Storage.get('newsletterSubscribers', []);
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        Storage.set('newsletterSubscribers', subscribers);
    }
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Contact form enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Auto-format phone number
    const phoneInput = document.getElementById('contactPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');

            // Format as (XXX) XXX-XXXX
            if (value.length >= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            }

            e.target.value = value;
        });
    }

    // Subject change handler
    const subjectSelect = document.getElementById('contactSubject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            updateMessagePlaceholder(this.value);
        });
    }
});

function updateMessagePlaceholder(subject) {
    const messageTextarea = document.getElementById('contactMessage');
    const placeholders = {
        'appointment': 'Please specify the service you\'re interested in, preferred date/time, and any special requests...',
        'inquiry': 'What would you like to know about our services?',
        'feedback': 'We\'d love to hear your feedback! Please share your experience with us.',
        'complaint': 'We\'re sorry to hear you had a negative experience. Please provide details so we can make it right.',
        'partnership': 'Tell us about your partnership inquiry...',
        'other': 'Please provide details about your inquiry...'
    };

    if (messageTextarea && placeholders[subject]) {
        messageTextarea.placeholder = placeholders[subject];
    }
}

// Map integration (placeholder for now)
function initMap() {
    // In a real implementation, this would integrate with Google Maps API
    // For now, we'll just show a placeholder
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // Open Google Maps in new tab
            const address = encodeURIComponent('123 Beauty Street, Glamour City, GC 12345');
            window.open(`https://maps.google.com/maps?q=${address}`, '_blank');
        });
    }
}

// Social media links
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const platform = this.classList[1]; // facebook, instagram, etc.
            const urls = {
                facebook: 'https://facebook.com/jksalon',
                instagram: 'https://instagram.com/jksalon',
                twitter: 'https://twitter.com/jksalon',
                youtube: 'https://youtube.com/jksalon'
            };

            if (urls[platform]) {
                window.open(urls[platform], '_blank');
            } else {
                showMessage('Social media page coming soon!', 'info');
            }
        });
    });
}

// Business hours checking
function checkBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    let isOpen = false;
    let statusMessage = '';

    switch (day) {
        case 0: // Sunday
            isOpen = currentTime >= 600 && currentTime <= 960; // 10AM - 4PM
            statusMessage = isOpen ? 'Open until 4:00 PM' : 'Closed - Opens tomorrow at 10:00 AM';
            break;
        case 6: // Saturday
            isOpen = currentTime >= 480 && currentTime <= 1080; // 8AM - 6PM
            statusMessage = isOpen ? 'Open until 6:00 PM' : 'Closed - Opens tomorrow at 9:00 AM';
            break;
        default: // Monday - Friday
            isOpen = currentTime >= 540 && currentTime <= 1200; // 9AM - 8PM
            statusMessage = isOpen ? 'Open until 8:00 PM' : 'Closed - Opens tomorrow at 9:00 AM';
            break;
    }

    // Update status display if element exists
    const statusElement = document.querySelector('.business-status');
    if (statusElement) {
        statusElement.textContent = statusMessage;
        statusElement.className = `business-status ${isOpen ? 'open' : 'closed'}`;
    }

    return { isOpen, statusMessage };
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    initSocialLinks();
    checkBusinessHours();

    // Check business hours every minute
    setInterval(checkBusinessHours, 60000);
});

// Contact form success animation
function animateFormSuccess() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.style.animation = 'successPulse 0.6s ease-out';
        setTimeout(() => {
            form.style.animation = '';
        }, 600);
    }
}

// Add success animation CSS dynamically
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }

        .field-error {
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 5px;
        }

        .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            cursor: pointer;
            font-weight: normal;
        }

        .checkbox-label input[type="checkbox"] {
            margin: 0;
            width: 18px;
            height: 18px;
        }

        .checkmark {
            position: relative;
            top: 2px;
        }
    `;
    document.head.appendChild(style);
});
