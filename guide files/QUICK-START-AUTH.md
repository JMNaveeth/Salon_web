# Quick Start Guide - Kinniya Salon Authentication System

## 🚀 How to Get Started

### Step 1: Open the Website
Open `auth.html` in your web browser. This is your entry point.

### Step 2: Choose Your Role

**Are you a Customer?**
- Click the "Customer" card (person icon)
- You can book appointments and view services

**Are you a Shop Owner?**
- Click the "Shop Owner" card (briefcase icon)
- You can manage your salon business

---

## 👤 For Customers

### First Time? Sign Up!
1. Click **"Sign Up"** link at the bottom
2. Enter your details:
   ```
   Name: Your Full Name
   Email: your.email@example.com
   Phone: +94 77 123 4567
   Password: ******** (min 6 characters)
   ```
3. Click **"Sign Up"** button
4. ✅ You're logged in! Redirected to home page

### Already Have an Account? Login!
1. Enter your email and password
2. Click **"Login"** button
3. ✅ Welcome back! Redirected to home page

### What You Can Do:
- 🏠 Browse salon information (Home page)
- 💇 View available services
- 📅 Book appointments with staff
- 📊 Check your bookings dashboard
- 🖼️ View salon gallery

---

## 🏪 For Shop Owners

### First Time? Sign Up!
1. Click **"Sign Up"** link at the bottom
2. Enter your details:
   ```
   Salon Name: Your Salon Name
   Email: salon@example.com
   Phone: +94 77 999 8888
   Password: ******** (min 6 characters)
   ```
3. Click **"Sign Up"** button
4. ✅ You're logged in! Redirected to admin panel

### Already Have an Account? Login!
1. Enter your email and password
2. Click **"Login"** button
3. ✅ Welcome back! Redirected to admin panel

### What You Can Do:
- ➕ Add new services
- 👥 Add staff members
- 📋 View all bookings
- 📸 Upload customer photos
- ⚙️ Manage salon settings

---

## 🔐 Important Security Notes

### Access Control
- ✅ Customers can only access customer pages
- ✅ Shop owners can only access admin panel
- ✅ Wrong role = Automatic redirect to correct page
- ✅ Not logged in = Redirect to login page

### Logout
Click the **"Logout"** button in the navigation bar anytime

---

## 🎯 Quick Navigation

### Customer Pages:
- `auth.html` → Login/Signup
- `index.html` → Home page
- `services.html` → Browse services
- `booking.html` → Book appointment
- `dashboard.html` → Your bookings
- `gallery.html` → Salon photos

### Owner Pages:
- `auth.html` → Login/Signup
- `admin.html` → Admin dashboard (ALL salon management)

---

## ⚡ Quick Tips

1. **First Time Users**: Always start with signup
2. **Returning Users**: Use login with your email/password
3. **Forgot Which Role?**: If you're a customer, you'll see "Customer" in the URL/page. If you're an owner, you'll see "Admin" in the page.
4. **Logout Required**: If you want to switch roles (unlikely in real use), logout first
5. **Data Persistence**: Your login stays active even if you close the browser

---

## 🐛 Common Issues & Solutions

### "Invalid email or password"
- Double-check your email and password
- Make sure you signed up with this email
- Try using the correct role (Customer vs Owner)

### "Access Denied"
- You're trying to access a page for a different role
- Customers: Use index.html, not admin.html
- Owners: Use admin.html, not customer pages

### Redirected to Login Page
- You're not logged in
- Click your role and login

### Can't See My Data
- Make sure you're logged in
- Check if you're using the correct role
- For owners: Staff you add will appear in booking page

---

## 📱 Mobile Friendly

The authentication system works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

---

## 🎨 Visual Guide

```
START HERE → auth.html
    ↓
    Choose Role
    ↓
┌─────────────┐         ┌──────────────┐
│  CUSTOMER   │         │  SHOP OWNER  │
│             │         │              │
│  Login or   │         │  Login or    │
│  Sign Up    │         │  Sign Up     │
└──────┬──────┘         └──────┬───────┘
       ↓                       ↓
   index.html              admin.html
   (Home Page)          (Admin Panel)
       ↓                       ↓
   Browse, Book            Manage Salon
   & Enjoy!                Business!
```

---

## ✅ Test It Out!

Try creating both types of accounts to see the difference:

**Test Customer Account:**
```
Name: Test Customer
Email: test.customer@salon.com
Phone: +94 77 111 2222
Password: test123
```

**Test Owner Account:**
```
Salon Name: My Test Salon
Email: test.owner@salon.com
Phone: +94 77 333 4444
Password: test123
```

---

## 📞 Need Help?

If you're stuck:
1. Read this guide again
2. Try logging out and back in
3. Clear your browser's localStorage (see AUTHENTICATION-GUIDE.md)
4. Check browser console for error messages

---

**Remember**: The system is designed to be simple and intuitive. When in doubt, just start at `auth.html` and follow the flow! 🎉
