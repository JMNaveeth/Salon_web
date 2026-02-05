// ===================================
// AUTOMATED REMINDER SERVICE
// Professional reminder system for bookings
// ===================================

class ReminderService {
    constructor() {
        this.reminderIntervals = {
            '48h': 48 * 60 * 60 * 1000,  // 48 hours in ms
            '24h': 24 * 60 * 60 * 1000,  // 24 hours in ms
            '2h': 2 * 60 * 60 * 1000     // 2 hours in ms
        };
        
        this.checkInterval = 5 * 60 * 1000; // Check every 5 minutes
        this.isRunning = false;
        
        // Email service configuration (EmailJS)
        this.emailConfig = {
            serviceId: 'YOUR_EMAILJS_SERVICE_ID',  // Replace with your EmailJS service ID
            templateId: 'YOUR_TEMPLATE_ID',         // Replace with your template ID
            publicKey: 'YOUR_PUBLIC_KEY'            // Replace with your public key
        };
        
        // SMS service configuration (Twilio)
        this.smsConfig = {
            accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
            authToken: 'YOUR_TWILIO_AUTH_TOKEN',
            fromNumber: 'YOUR_TWILIO_PHONE_NUMBER'
        };
        
        // WhatsApp configuration (Twilio WhatsApp)
        this.whatsappConfig = {
            enabled: true,
            fromNumber: 'whatsapp:+14155238886' // Twilio WhatsApp sandbox
        };
    }
    
    // Start the reminder service
    start() {
        if (this.isRunning) {
            console.log('Reminder service already running');
            return;
        }
        
        console.log('🔔 Starting Automated Reminder Service...');
        this.isRunning = true;
        
        // Initial check
        this.checkAndSendReminders();
        
        // Schedule periodic checks
        this.intervalId = setInterval(() => {
            this.checkAndSendReminders();
        }, this.checkInterval);
        
        console.log('✅ Reminder service started successfully');
    }
    
    // Stop the reminder service
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.isRunning = false;
            console.log('🛑 Reminder service stopped');
        }
    }
    
    // Main function to check bookings and send reminders
    async checkAndSendReminders() {
        const bookings = Storage.get('bookings', []);
        const now = new Date().getTime();
        
        console.log(`🔍 Checking ${bookings.length} bookings for reminders...`);
        
        for (const booking of bookings) {
            // Only process confirmed or pending bookings
            if (booking.status !== 'confirmed' && booking.status !== 'pending') {
                continue;
            }
            
            const appointmentTime = new Date(`${booking.date}T${booking.time}`).getTime();
            const timeUntilAppointment = appointmentTime - now;
            
            // Skip past appointments
            if (timeUntilAppointment < 0) {
                continue;
            }
            
            // Initialize reminders tracking if not exists
            if (!booking.reminders) {
                booking.reminders = {
                    '48h': { sent: false, sentAt: null },
                    '24h': { sent: false, sentAt: null },
                    '2h': { sent: false, sentAt: null }
                };
            }
            
            // Check and send 48-hour reminder
            if (!booking.reminders['48h'].sent && 
                timeUntilAppointment <= this.reminderIntervals['48h'] && 
                timeUntilAppointment > this.reminderIntervals['24h']) {
                await this.sendReminder(booking, '48h');
            }
            
            // Check and send 24-hour reminder
            if (!booking.reminders['24h'].sent && 
                timeUntilAppointment <= this.reminderIntervals['24h'] && 
                timeUntilAppointment > this.reminderIntervals['2h']) {
                await this.sendReminder(booking, '24h');
            }
            
            // Check and send 2-hour reminder
            if (!booking.reminders['2h'].sent && 
                timeUntilAppointment <= this.reminderIntervals['2h'] && 
                timeUntilAppointment > 0) {
                await this.sendReminder(booking, '2h');
            }
        }
        
        // Save updated bookings
        Storage.set('bookings', bookings);
    }
    
    // Send reminder through all channels
    async sendReminder(booking, reminderType) {
        console.log(`📧 Sending ${reminderType} reminder for booking ${booking.id}`);
        
        const reminderData = this.getReminderMessage(booking, reminderType);
        
        try {
            // Send email reminder
            await this.sendEmailReminder(booking, reminderData);
            
            // Send SMS reminder
            await this.sendSMSReminder(booking, reminderData);
            
            // Send WhatsApp reminder
            await this.sendWhatsAppReminder(booking, reminderData);
            
            // Mark as sent
            booking.reminders[reminderType].sent = true;
            booking.reminders[reminderType].sentAt = new Date().toISOString();
            
            console.log(`✅ ${reminderType} reminder sent successfully for ${booking.id}`);
            
            // Show notification to admin
            this.showAdminNotification(booking, reminderType);
            
        } catch (error) {
            console.error(`❌ Error sending ${reminderType} reminder:`, error);
        }
    }
    
    // Get reminder message based on type
    getReminderMessage(booking, reminderType) {
        const appointmentDate = new Date(`${booking.date}T${booking.time}`);
        const formattedDate = appointmentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = this.formatTime(booking.time);
        
        const messages = {
            '48h': {
                subject: 'Reminder: Your appointment is in 2 days',
                body: `Hi ${booking.firstName},\n\nThis is a friendly reminder that your appointment is coming up in 2 days!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${formattedTime}\n💇 Service: ${booking.service}\n👤 Staff: ${booking.staff}\n\nSee you soon!\n\nJK Salon`,
                sms: `Hi ${booking.firstName}! Reminder: Your ${booking.service} appointment is in 2 days on ${formattedDate} at ${formattedTime}. JK Salon`
            },
            '24h': {
                subject: 'Reminder: Your appointment is tomorrow',
                body: `Hi ${booking.firstName},\n\nYour appointment is tomorrow!\n\n📅 Date: ${formattedDate}\n⏰ Time: ${formattedTime}\n💇 Service: ${booking.service}\n👤 Staff: ${booking.staff}\n📍 Location: JK Salon, 123 Beauty Street\n\nLooking forward to seeing you!\n\nJK Salon`,
                sms: `Hi ${booking.firstName}! Your ${booking.service} appointment is TOMORROW at ${formattedTime}. See you at JK Salon! Reply CONFIRM to confirm.`
            },
            '2h': {
                subject: 'Reminder: Your appointment is starting soon',
                body: `Hi ${booking.firstName},\n\nYour appointment is starting in 2 hours!\n\n⏰ Time: ${formattedTime}\n💇 Service: ${booking.service}\n👤 Staff: ${booking.staff}\n📍 Location: JK Salon, 123 Beauty Street\n\nPlease arrive 5 minutes early. See you soon!\n\nJK Salon`,
                sms: `Hi ${booking.firstName}! Your appointment starts in 2 hours at ${formattedTime}. Please arrive 5 min early. JK Salon`
            }
        };
        
        return messages[reminderType];
    }
    
    // Send email reminder using EmailJS
    async sendEmailReminder(booking, reminderData) {
        // Using EmailJS for email delivery (free tier: 200 emails/month)
        // Sign up at https://www.emailjs.com/
        
        const templateParams = {
            to_email: booking.email,
            to_name: `${booking.firstName} ${booking.lastName}`,
            subject: reminderData.subject,
            message: reminderData.body,
            booking_id: booking.id,
            service: booking.service,
            date: booking.date,
            time: booking.time,
            staff: booking.staff
        };
        
        try {
            // For production, initialize EmailJS and send
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(
                    this.emailConfig.serviceId,
                    this.emailConfig.templateId,
                    templateParams,
                    this.emailConfig.publicKey
                );
                console.log('📧 Email sent:', response.status);
            } else {
                console.log('📧 Email would be sent to:', booking.email);
                console.log('Subject:', reminderData.subject);
            }
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }
    
    // Send SMS reminder using Twilio
    async sendSMSReminder(booking, reminderData) {
        // Using Twilio for SMS (reliable, pay-as-you-go)
        // Sign up at https://www.twilio.com/
        
        try {
            // In production, this would make an API call to your backend
            // which then calls Twilio API (keep credentials secure on server)
            
            const smsData = {
                to: booking.phone,
                from: this.smsConfig.fromNumber,
                body: reminderData.sms
            };
            
            // Simulated API call
            console.log('📱 SMS would be sent to:', booking.phone);
            console.log('Message:', reminderData.sms);
            
            // In production:
            // const response = await fetch('/api/send-sms', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(smsData)
            // });
            
        } catch (error) {
            console.error('SMS sending error:', error);
            // Don't throw - continue with other channels
        }
    }
    
    // Send WhatsApp reminder using Twilio WhatsApp API
    async sendWhatsAppReminder(booking, reminderData) {
        if (!this.whatsappConfig.enabled) return;
        
        try {
            const whatsappData = {
                to: `whatsapp:${booking.phone}`,
                from: this.whatsappConfig.fromNumber,
                body: reminderData.sms
            };
            
            console.log('💬 WhatsApp would be sent to:', booking.phone);
            console.log('Message:', reminderData.sms);
            
            // In production:
            // const response = await fetch('/api/send-whatsapp', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(whatsappData)
            // });
            
        } catch (error) {
            console.error('WhatsApp sending error:', error);
            // Don't throw - continue with other channels
        }
    }
    
    // Format time to 12-hour format
    formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${hour12}:${minutes} ${period}`;
    }
    
    // Show notification to admin dashboard
    showAdminNotification(booking, reminderType) {
        const notification = {
            id: Date.now(),
            type: 'reminder_sent',
            booking: booking,
            reminderType: reminderType,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        const notifications = Storage.get('notifications', []);
        notifications.unshift(notification);
        Storage.set('notifications', notifications);
        
        // Trigger storage event for real-time updates
        window.dispatchEvent(new Event('storage'));
    }
    
    // Get reminder statistics
    getStatistics() {
        const bookings = Storage.get('bookings', []);
        const stats = {
            totalBookings: bookings.length,
            reminders48h: 0,
            reminders24h: 0,
            reminders2h: 0,
            upcomingReminders: 0
        };
        
        const now = new Date().getTime();
        
        bookings.forEach(booking => {
            if (booking.reminders) {
                if (booking.reminders['48h'].sent) stats.reminders48h++;
                if (booking.reminders['24h'].sent) stats.reminders24h++;
                if (booking.reminders['2h'].sent) stats.reminders2h++;
            }
            
            const appointmentTime = new Date(`${booking.date}T${booking.time}`).getTime();
            if (appointmentTime > now && (booking.status === 'confirmed' || booking.status === 'pending')) {
                stats.upcomingReminders++;
            }
        });
        
        return stats;
    }
}

// Create global reminder service instance
const reminderService = new ReminderService();

// Auto-start when page loads (for dashboard/admin)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        reminderService.start();
    });
} else {
    reminderService.start();
}

// Expose for manual control
window.reminderService = reminderService;
