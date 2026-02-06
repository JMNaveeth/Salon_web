// Booking system JavaScript functionality

// Payment configuration
const PLATFORM_FEE_PERCENTAGE = 0.10; // 10% platform fee for developer
let stripe, cardElement;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking system
    initBookingSteps();
    initServiceSelection();
    initDateSelection();
    initTimeSlots();
    initFormValidation();
    initBookingForm();
    initPaymentStep();

    // Load selected service if coming from services page
    loadSelectedService();
});

// Multi-step form navigation
function initBookingSteps() {
    const steps = document.querySelectorAll('.booking-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    let currentStep = 0;

    // Next step buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    steps[currentStep].classList.remove('active');
                    currentStep++;
                    steps[currentStep].classList.add('active');
                    updateStepIndicators();
                }
            }
        });
    });

    // Previous step buttons
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                steps[currentStep].classList.remove('active');
                currentStep--;
                steps[currentStep].classList.add('active');
                updateStepIndicators();
            }
        });
    });
}

function updateStepIndicators() {
    const stepNumbers = document.querySelectorAll('.step-number');
    stepNumbers.forEach((indicator, index) => {
        indicator.classList.toggle('active', index <= getCurrentStep());
    });
}

function getCurrentStep() {
    const activeStep = document.querySelector('.booking-step.active');
    return Array.from(activeStep.parentElement.children).indexOf(activeStep);
}

// Step validation
function validateCurrentStep(stepIndex) {
    switch (stepIndex) {
        case 0: // Service selection
            const service = document.getElementById('service').value;
            if (!service) {
                showMessage('Please select a service', 'error');
                return false;
            }
            return true;

        case 1: // Date and time
            const date = document.getElementById('date').value;
            const time = document.getElementById('selectedTime').value;
            if (!date) {
                showMessage('Please select a date', 'error');
                return false;
            }
            if (!time) {
                showMessage('Please select a time slot', 'error');
                return false;
            }
            return true;

        case 2: // Customer details
            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            
            if (!firstName || !lastName) {
                showMessage('Please enter your full name', 'error');
                return false;
            }
            if (!email || !validateEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return false;
            }
            if (!phone) {
                showMessage('Please enter your phone number', 'error');
                return false;
            }
            
            // Update payment step with customer details
            updatePaymentStep();
            return true;

        default:
            return true;
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Service selection
function initServiceSelection() {
    const serviceSelect = document.getElementById('service');
    const summaryService = document.getElementById('summaryService');
    const summaryServicePrice = document.getElementById('summaryServicePrice');
    const summaryPlatformFee = document.getElementById('summaryPlatformFee');
    const summaryPrice = document.getElementById('summaryPrice');

    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const serviceText = selectedOption.text.split(' - ')[0];
            const servicePrice = extractPriceFromService(this.value);
            const platformFee = calculatePlatformFee(servicePrice);
            const totalPrice = servicePrice + platformFee;

            if (summaryService) summaryService.textContent = serviceText;
            if (summaryServicePrice) summaryServicePrice.textContent = `$${servicePrice}`;
            if (summaryPlatformFee) summaryPlatformFee.textContent = `$${platformFee}`;
            if (summaryPrice) summaryPrice.textContent = `$${totalPrice}`;
        });
    }
}

function calculatePlatformFee(servicePrice) {
    return Math.round(servicePrice * PLATFORM_FEE_PERCENTAGE);
}

function updateStaffOptions(serviceName) {
    const staffSelect = document.getElementById('staff');
    const summaryStaff = document.getElementById('summaryStaff');

    if (staffSelect && summaryStaff) {
        // Clear existing options except "Any available"
        while (staffSelect.options.length > 1) {
            staffSelect.remove(1);
        }

        // Get all staff from localStorage
        const allStaff = Storage.get('staff', []);
        
        // Add all available staff to the dropdown
        allStaff.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.name;
            option.textContent = `${staff.name} (${staff.specialty})`;
            staffSelect.appendChild(option);
        });

        // Update staff selection handler
        staffSelect.addEventListener('change', function() {
            summaryStaff.textContent = this.value;
        });

        summaryStaff.textContent = 'Any available';
    }
}

function getServiceStaff(serviceName) {
    // Get all staff from localStorage
    const allStaff = Storage.get('staff', []);
    
    // Return all staff (or you can filter by specialty/service if needed)
    return allStaff.map(staff => ({
        name: staff.name,
        specialty: staff.specialty
    }));
}

// Date selection
function initDateSelection() {
    const dateInput = document.getElementById('date');
    const summaryDate = document.getElementById('summaryDate');

    if (dateInput) {
        // Set minimum date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.min = minDate;

        // Set maximum date to 30 days from now
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30);
        dateInput.max = maxDate.toISOString().split('T')[0];

        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const formattedDate = selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            summaryDate.textContent = formattedDate;
            updateTimeSlots(this.value);
        });
    }
}

// Time slots
function initTimeSlots() {
    // Initial time slots setup
    updateTimeSlots();
}

function updateTimeSlots(selectedDate = null) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedTimeInput = document.getElementById('selectedTime');

    if (!timeSlotsContainer) return;

    // Clear existing slots
    timeSlotsContainer.innerHTML = '';

    // Generate time slots (9 AM to 8 PM)
    const startHour = 9;
    const endHour = 20; // 8 PM
    const slotDuration = 60; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += slotDuration) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            const displayTime = formatTimeDisplay(hour, minute);

            const slotElement = document.createElement('div');
            slotElement.className = 'time-slot';
            slotElement.textContent = displayTime;
            slotElement.dataset.time = timeString;

            // Check availability
            const isAvailable = checkTimeSlotAvailability(selectedDate, timeString);
            if (!isAvailable) {
                slotElement.classList.add('unavailable');
                slotElement.title = 'This time slot is not available';
            } else {
                slotElement.addEventListener('click', function() {
                    selectTimeSlot(this, timeString);
                });
            }

            timeSlotsContainer.appendChild(slotElement);
        }
    }
}

function formatTimeDisplay(hour, minute) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function selectTimeSlot(slotElement, timeString) {
    // Remove previous selection
    const selectedSlots = document.querySelectorAll('.time-slot.selected');
    selectedSlots.forEach(slot => slot.classList.remove('selected'));

    // Select new slot
    slotElement.classList.add('selected');

    // Update hidden input and summary
    const selectedTimeInput = document.getElementById('selectedTime');
    const summaryTime = document.getElementById('summaryTime');

    selectedTimeInput.value = timeString;
    summaryTime.textContent = formatTimeDisplay(
        parseInt(timeString.split(':')[0]),
        parseInt(timeString.split(':')[1])
    );
}

function checkTimeSlotAvailability(date, time) {
    // Get existing bookings from localStorage
    const bookings = Storage.get('bookings', []);

    // Check if this time slot is already booked
    const isBooked = bookings.some(booking => {
        return booking.date === date && booking.time === time;
    });

    // For demo purposes, randomly mark some slots as unavailable
    // In a real app, this would check against actual bookings
    const randomUnavailable = Math.random() < 0.2; // 20% chance

    return !isBooked && !randomUnavailable;
}

// Staff selection
function initStaffSelection() {
    const staffSelect = document.getElementById('staff');
    const summaryStaff = document.getElementById('summaryStaff');

    if (staffSelect && summaryStaff) {
        staffSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            summaryStaff.textContent = selectedOption.textContent.split(' (')[0] || 'Any available';
        });
    }
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('bookingForm');

    if (form) {
        // Real-time validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (field.name) {
        case 'firstName':
        case 'lastName':
            if (!value) {
                isValid = false;
                errorMessage = 'This field is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Must be at least 2 characters';
            } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Only letters and spaces allowed';
            }
            break;

        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email';
            }
            break;

        case 'phone':
            if (!value) {
                isValid = false;
                errorMessage = 'Phone number is required';
            } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
            break;
    }

    // Update field styling
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && value);

    // Show/hide error message
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!isValid && errorMessage) {
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = errorMessage;
    } else if (errorElement) {
        errorElement.remove();
    }

    return isValid;
}

// Form submission
function initBookingForm() {
    const form = document.getElementById('bookingForm');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = document.getElementById('submitPayment');
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            
            // Disable submit button
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

            try {
                // Process payment if card method selected
                if (paymentMethod === 'card') {
                    const cardholderName = document.getElementById('cardholderName').value.trim();
                    
                    if (!cardholderName) {
                        showMessage('Please enter cardholder name', 'error');
                        submitButton.disabled = false;
                        submitButton.innerHTML = '<i class="fas fa-lock"></i> Complete Booking';
                        return;
                    }

                    // In a real implementation, you would create a payment intent on your server
                    // and then confirm the payment here
                    // For now, we'll simulate successful payment
                    const paymentResult = await simulatePayment();
                    
                    if (!paymentResult.success) {
                        showMessage('Payment failed. Please try again.', 'error');
                        submitButton.disabled = false;
                        submitButton.innerHTML = '<i class="fas fa-lock"></i> Complete Booking';
                        return;
                    }
                }

                // Submit booking
                submitBooking(new FormData(form), paymentMethod);
                
            } catch (error) {
                console.error('Booking error:', error);
                showMessage('An error occurred. Please try again.', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-lock"></i> Complete Booking';
            }
        });
    }
}

async function simulatePayment() {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, replace this with actual Stripe payment processing:
    // const {error, paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
    //     payment_method: {
    //         card: cardElement,
    //         billing_details: {name: cardholderName}
    //     }
    // });
    
    return { success: true, transactionId: 'TXN_' + Date.now() };
}

function submitBooking(formData, paymentMethod) {
    const servicePrice = extractPriceFromService(formData.get('service'));
    const platformFee = calculatePlatformFee(servicePrice);
    const totalPrice = servicePrice + platformFee;

    // Create booking object
    const booking = {
        id: generateBookingId(),
        service: formData.get('service'),
        staff: formData.get('staff') || 'Any available',
        date: formData.get('date'),
        time: formData.get('time'),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes'),
        status: 'pending',
        createdAt: new Date().toISOString(),
        payment: {
            method: paymentMethod,
            servicePrice: servicePrice,
            platformFee: platformFee,
            totalPrice: totalPrice,
            status: paymentMethod === 'card' ? 'paid' : 'pending',
            paidAt: paymentMethod === 'card' ? new Date().toISOString() : null
        },
        price: servicePrice // Keep for backward compatibility
    };

    // Save to localStorage
    const bookings = Storage.get('bookings', []);
    bookings.push(booking);
    Storage.set('bookings', bookings);

    // Trigger storage event for real-time updates
    window.dispatchEvent(new Event('storage'));

    // Show confirmation modal
    showConfirmationModal(booking);

    // Reset form
    document.getElementById('bookingForm').reset();
    resetBookingSummary();
    
    // Re-enable button
    const submitButton = document.getElementById('submitPayment');
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-lock"></i> Complete Booking';
}

function generateBookingId() {
    return 'JK' + Date.now().toString().slice(-8);
}

function extractPriceFromService(serviceName) {
    // Get the actual selected option to extract price from its text
    const serviceSelect = document.getElementById('service');
    if (!serviceSelect) return 0;
    
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    if (!selectedOption) return 0;
    
    // Extract price from option text (e.g., "Bridal Makeup - $150")
    const priceMatch = selectedOption.text.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 0;
}

// ===================================
// PAYMENT STEP FUNCTIONALITY
// ===================================

function initPaymentStep() {
    // Initialize Stripe (Replace with your actual publishable key)
    // For demo purposes, using test key - replace with your own
    stripe = Stripe('pk_test_51QhExHP8O4Z4P4Z4P4Z4P4Z4P4Z4P4Z4P4Z4P4Z4P4Z4P4Z4P'); // REPLACE THIS WITH YOUR STRIPE KEY
    
    // Create card element
    const elements = stripe.elements();
    cardElement = elements.create('card', {
        style: {
            base: {
                color: '#fff',
                fontFamily: '"Inter", sans-serif',
                fontSize: '16px',
                '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.4)'
                }
            },
            invalid: {
                color: '#ff4444',
                iconColor: '#ff4444'
            }
        }
    });
    
    cardElement.mount('#card-element');
    
    // Handle card errors
    cardElement.on('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });
    
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    const cardSection = document.getElementById('cardPaymentSection');
    const cashSection = document.getElementById('cashPaymentSection');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'card') {
                cardSection.style.display = 'block';
                cashSection.style.display = 'none';
            } else {
                cardSection.style.display = 'none';
                cashSection.style.display = 'block';
            }
        });
    });
}

function updatePaymentStep() {
    const servicePrice = extractPriceFromService(document.getElementById('service').value);
    const platformFee = calculatePlatformFee(servicePrice);
    const totalPrice = servicePrice + platformFee;
    
    // Update payment breakdown
    document.getElementById('paymentServiceCost').textContent = `$${servicePrice}`;
    document.getElementById('paymentPlatformFee').textContent = `$${platformFee}`;
    document.getElementById('paymentTotal').textContent = `$${totalPrice}`;
}

function showConfirmationModal(booking) {
    const modal = document.getElementById('confirmationModal');
    const confirmService = document.getElementById('confirmService');
    const confirmDate = document.getElementById('confirmDate');
    const confirmTime = document.getElementById('confirmTime');
    const bookingId = document.getElementById('bookingId');

    if (modal && confirmService && confirmDate && confirmTime && bookingId) {
        // Format date
        const dateObj = new Date(booking.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Format time
        const [hour, minute] = booking.time.split(':');
        const formattedTime = formatTimeDisplay(parseInt(hour), parseInt(minute));

        confirmService.textContent = booking.service.split(' - ')[0];
        confirmDate.textContent = formattedDate;
        confirmTime.textContent = formattedTime;
        bookingId.textContent = booking.id;

        modal.classList.add('show');
    }
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetBookingSummary() {
    document.getElementById('summaryService').textContent = 'Not selected';
    document.getElementById('summaryDate').textContent = 'Not selected';
    document.getElementById('summaryTime').textContent = 'Not selected';
    document.getElementById('summaryStaff').textContent = 'Any available';
    document.getElementById('summaryPrice').textContent = '$0';
}

// Load selected service from services page
function loadSelectedService() {
    const selectedService = Storage.get('selectedService');
    if (selectedService) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            // Find and select the matching option
            const options = serviceSelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].text.includes(selectedService)) {
                    serviceSelect.selectedIndex = i;
                    serviceSelect.dispatchEvent(new Event('change'));
                    break;
                }
            }
        }
        // Clear the stored service
        Storage.remove('selectedService');
    }
}

// Initialize staff selection
initStaffSelection();
