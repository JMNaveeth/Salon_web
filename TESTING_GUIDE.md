# 🧪 Admin Panel Testing Guide

## Quick Start Test

### Open the Admin Panel
1. Open `admin.html` in your browser
2. The dashboard should load with statistics

---

## ✅ Test Scenarios

### Test 1: Add a Service
1. Click the **"Add Service"** quick action button (top of dashboard)
2. A modal should appear with a form
3. Fill in the details:
   - **Service Name**: "Premium Hair Styling"
   - **Category**: "Hair Care"
   - **Price**: 75
   - **Duration**: 90
   - **Description**: "Complete hair styling with consultation"
4. Click **"Save Service"**
5. ✅ Expected Results:
   - Modal closes automatically
   - Green toast notification appears: "✓ Service 'Premium Hair Styling' added successfully!"
   - Statistics update
   - Service appears in "Add Service" section when navigated
   - Activity feed shows "New service added"

---

### Test 2: Add a Staff Member
1. Click the **"Add Staff"** quick action button
2. Modal opens with staff form
3. Fill in:
   - **First Name**: "Emma"
   - **Last Name**: "Wilson"
   - **Email**: "emma.wilson@kinniyasalon.com"
   - **Phone**: "+1 (555) 123-4567"
   - **Specialty**: "Hair Specialist"
   - **Bio**: "10 years of experience in hair styling and coloring"
4. Click **"Save Staff Member"**
5. ✅ Expected Results:
   - Modal closes
   - Green toast: "✓ Staff member 'Emma Wilson' added successfully!"
   - Activity feed shows new staff addition
   - Staff appears in "Add Staff" section

---

### Test 3: Upload Customer Photo
1. Click the **"Add Photo"** quick action button
2. Modal opens with photo upload form
3. Fill in:
   - **Customer Name**: "Sarah Johnson"
   - **Photo Title**: "Bridal Hair Styling"
   - **Category**: "Hair"
   - **Description**: "Beautiful updo for wedding day"
   - **Photo**: Select an image from your computer
4. Image preview should appear below
5. Click **"Upload Photo"**
6. ✅ Expected Results:
   - Modal closes
   - Green toast: "✓ Photo uploaded successfully! Visible in gallery."
   - Photo appears in "Recent Customer Photos" on dashboard (bottom)
   - Activity feed shows "New customer photo uploaded"
   - Photo visible in public gallery page (`gallery.html`)

---

### Test 4: Create Test Booking
1. Click the **"New Booking"** quick action button
2. ✅ Expected Results:
   - Green toast: "Test booking created!"
   - "Today's Bookings" stat increases
   - "Upcoming Bookings" stat increases
   - Activity feed shows new booking
   - Booking appears in "Manage Bookings" section

---

### Test 5: Manage Booking
1. Navigate to **"Manage Bookings"** from sidebar
2. You should see a table with bookings
3. Click the **eye icon** (👁️) on any booking to view details
4. Click the **check icon** (✅) to complete a booking
   - Status changes to "Completed"
   - Revenue stat updates
5. Click the **X icon** (❌) to cancel a booking
   - Status changes to "Cancelled"
   - Stats update accordingly

---

### Test 6: Modal Interactions
1. Open any modal (Service/Staff/Photo)
2. Click outside the modal (on the dark backdrop)
3. ✅ Expected: Modal closes
4. Open modal again
5. Click the "×" close button
6. ✅ Expected: Modal closes and form resets

---

### Test 7: Navigation
1. Click different sidebar links:
   - Dashboard
   - Manage Bookings
   - Add Service
   - Add Staff
   - Add Customer Photo
   - Settings
2. ✅ Expected:
   - Active link highlights in gold
   - Content section changes smoothly
   - Scroll position resets to top

---

### Test 8: Data Export/Import
1. Open browser console (F12)
2. Type: `exportData()`
3. ✅ Expected:
   - JSON file downloads
   - Toast notification confirms export
   - Filename includes date
4. Type: `importData()`
5. Select the downloaded JSON file
6. Confirm the dialog
7. ✅ Expected:
   - Data restored
   - All sections refresh
   - Toast confirms success

---

### Test 9: Recent Uploads Display
1. Upload 2-3 customer photos (Test 3)
2. Go to **Dashboard**
3. Scroll down to "Recent Customer Photos"
4. ✅ Expected:
   - Latest photos appear in grid
   - Maximum 6 photos shown
   - Hover effect on images (slight zoom)
   - Customer name and title visible on hover

---

### Test 10: Toast Notifications
1. Perform various actions:
   - Add service (success toast - green)
   - Add staff (success toast - green)
   - Upload photo (success toast - green)
   - Try to submit empty form (error toast - red)
2. ✅ Expected:
   - Toasts appear top-right
   - Slide in from right
   - Auto-dismiss after 4 seconds
   - Slide out animation
   - Color-coded by type
   - Icon matches type

---

## 🐛 Common Issues & Solutions

### Issue 1: Modal doesn't open
**Solution**: Check browser console for errors. Ensure `admin.js` is loaded.

### Issue 2: Photos don't appear
**Solution**: localStorage might be full. Try exporting data, clearing storage, and importing back.

### Issue 3: Statistics show 0
**Solution**: Create test bookings using the "New Booking" button.

### Issue 4: Toasts don't appear
**Solution**: Check if browser blocks notifications. Check console for JavaScript errors.

---

## 🎮 Advanced Testing

### Console Commands:
```javascript
// Check admin status
checkAdminStatus()

// Navigate manually
testNavigation('dashboard')

// View storage
Storage.get('bookings', [])
Storage.get('services', [])
Storage.get('staff', [])
Storage.get('customerPhotos', [])

// Clear all data
Storage.clear()

// Create test booking
createTestBooking()

// Export data
exportData()

// Import data
importData()
```

---

## 📊 Expected Data Flow

```
Action → Validation → Storage → UI Update → Activity Log → Toast
```

### Example: Adding a Service
1. User clicks "Add Service" → Modal opens
2. User fills form → Client-side validation
3. User clicks "Save" → Data saved to localStorage
4. Grid refreshes → Service card appears
5. Activity logged → Feed updates
6. Toast shown → "✓ Service added successfully!"
7. Stats recalculate → Dashboard updates

---

## ✅ Checklist

### Visual Tests:
- [ ] All modals open and close properly
- [ ] Toasts appear and auto-dismiss
- [ ] Hover effects work on buttons/cards
- [ ] Sidebar highlights active section
- [ ] Stats display correctly
- [ ] Activity feed updates
- [ ] Recent photos show in dashboard
- [ ] Forms reset after submission

### Functional Tests:
- [ ] Services can be added
- [ ] Staff can be added
- [ ] Photos can be uploaded
- [ ] Bookings can be managed
- [ ] Data persists after page reload
- [ ] Export creates JSON file
- [ ] Import restores data
- [ ] Navigation works smoothly

### Responsive Tests:
- [ ] Mobile view (320px - 767px)
- [ ] Tablet view (768px - 1023px)
- [ ] Desktop view (1024px+)
- [ ] Sidebar collapses on mobile
- [ ] Modals fit on small screens

---

## 🎯 Success Criteria

✅ **All tests pass**: The admin panel is production-ready!

🎉 **Result**: A professional, modal-based admin system that matches your sketch requirements perfectly!

---

## 📝 Notes

- All data is stored in **localStorage** (browser storage)
- Photos are stored as **base64** encoded strings
- Maximum localStorage size is typically **5-10MB**
- For production, consider backend integration
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)

---

## 🚀 Next Steps

After testing successfully:
1. Add more services for your salon
2. Add your staff members
3. Upload real customer photos
4. Start managing bookings
5. Consider backend integration for production use

---

**Happy Testing! 🎉**
