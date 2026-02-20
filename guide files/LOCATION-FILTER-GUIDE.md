# 📍 Location-Based Shop Filter Implementation Guide

## ✅ What's Been Implemented

### **1. Location Data Structure**

```javascript
// Two districts with their areas
LOCATION_DATA = {
    'Trincomalee': [
        'Kinniya',
        'Trincomalee Town',
        'Nilaveli',
        'Kuchchaveli',
        'Mutur',
        'Kantale',
        'Gomarankadawala',
        'Seruwila',
        'Thampalakamam'
    ],
    'Batticaloa': [
        'Batticaloa Town',
        'Kaluwanchikudy',
        'Valachchenai',
        'Eravur',
        'Kattankudy',
        'Oddamavadi',
        'Chenkalady',
        'Vakarai',
        'Koralai Pattu'
    ]
}
```

### **2. Shop Owner Signup - Now Saves District & Area**

When shop owner signs up, they select:
- ✅ **District** (dropdown: Trincomalee or Batticaloa)
- ✅ **Area** (dropdown: populated based on selected district)

**Data Saved in Firebase:**
```javascript
{
    name: "Mike Ahmed",
    businessName: "Mike's Luxury Salon",
    district: "Trincomalee",        // ← NEW
    area: "Kinniya",                 // ← NEW
    location: "Kinniya, Trincomalee", // Combined for display
    role: "owner",
    email: "...",
    phone: "..."
}
```

### **3. Updated auth.html**

✅ Replaced single "Location" text input with:
- District dropdown
- Area dropdown (enabled after district selection)

---

## 🎯 How Customers Can Filter Shops

### **Method 1: Add Filter to Any Page (services.html, dashboard.html, index.html)**

Add this HTML wherever you want customers to filter shops:

```html
<!-- Location Filter Section -->
<div class="location-filter" style="background: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3>🔍 Find Salons Near You</h3>
    
    <div style="display: flex; gap: 15px; margin-top: 15px;">
        <div style="flex: 1;">
            <label>District</label>
            <select id="customerFilterDistrict" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                <option value="">All Districts</option>
            </select>
        </div>
        
        <div style="flex: 1;">
            <label>Area</label>
            <select id="customerFilterArea" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
                <option value="">All Areas</option>
            </select>
        </div>
        
        <div style="flex: 0.5;">
            <label>&nbsp;</label><br>
            <button onclick="searchShopsByLocation()" style="padding: 10px 25px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer;">
                Search
            </button>
        </div>
    </div>
    
    <!-- Results Display -->
    <div id="shopsResults" style="margin-top: 20px;">
        <!-- Search results will appear here -->
    </div>
</div>
```

### **Method 2: JavaScript to Search and Display Shops**

Add this to your page's JavaScript file (or in a `<script>` tag):

```javascript
// Search shops by selected location
async function searchShopsByLocation() {
    const district = document.getElementById('customerFilterDistrict').value;
    const area = document.getElementById('customerFilterArea').value;
    const resultsDiv = document.getElementById('shopsResults');
    
    // Show loading message
    resultsDiv.innerHTML = '<p>🔍 Searching shops...</p>';
    
    // Get shops from Firebase
    const shops = await AuthSystem.getShopsByLocation(district || null, area || null);
    
    // Display results
    if (shops.length === 0) {
        resultsDiv.innerHTML = '<p>No salons found in this location. Try a different area!</p>';
        return;
    }
    
    // Build HTML for shop cards
    let html = `<h4>Found ${shops.length} salon(s):</h4><div style="display: grid; gap: 15px;">`;
    
    shops.forEach(shop => {
        html += `
            <div class="shop-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 10px;">
                <h3>${shop.businessName}</h3>
                <p><strong>Owner:</strong> ${shop.name}</p>
                <p><strong>📍 Location:</strong> ${shop.area}, ${shop.district}</p>
                <p><strong>📞 Phone:</strong> ${shop.phone}</p>
                <p>${shop.bio || 'Professional salon services'}</p>
                <button onclick="viewShop('${shop.id}')" style="padding: 8px 20px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    View Services
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// View specific shop details
function viewShop(shopId) {
    // Redirect to services page with shop ID
    window.location.href = `services.html?shopId=${shopId}`;
}
```

---

## 🚀 Quick Implementation Examples

### **Example 1: Add to index.html (Homepage)**

```html
<!-- Add after the hero section -->
<section style="padding: 50px 20px; max-width: 1200px; margin: 0 auto;">
    <div class="location-filter" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="text-align: center; margin-bottom: 30px;">🔍 Find Salons in Your Area</h2>
        
        <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 200px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">District</label>
                <select id="customerFilterDistrict" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                    <option value="">All Districts</option>
                </select>
            </div>
            
            <div style="flex: 1; min-width: 200px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Area</label>
                <select id="customerFilterArea" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px;">
                    <option value="">All Areas</option>
                </select>
            </div>
            
            <div style="flex: 0; min-width: 150px;">
                <label style="display: block; margin-bottom: 8px;">&nbsp;</label>
                <button onclick="searchShopsByLocation()" style="width: 100%; padding: 12px 25px; background: #d4af37; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
                    Search 🔍
                </button>
            </div>
        </div>
        
        <div id="shopsResults"></div>
    </div>
</section>

<script>
async function searchShopsByLocation() {
    const district = document.getElementById('customerFilterDistrict').value;
    const area = document.getElementById('customerFilterArea').value;
    const resultsDiv = document.getElementById('shopsResults');
    
    resultsDiv.innerHTML = '<p style="text-align: center;">🔍 Searching...</p>';
    
    const shops = await AuthSystem.getShopsByLocation(district || null, area || null);
    
    if (shops.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; padding: 20px;">❌ No salons found in this location. Try a different area!</p>';
        return;
    }
    
    let html = `<h3 style="margin-top: 20px;">Found ${shops.length} salon(s):</h3><div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">`;
    
    shops.forEach(shop => {
        html += `
            <div style="border: 2px solid #e0e0e0; padding: 20px; border-radius: 12px; background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);">
                <h3 style="color: #d4af37; margin-bottom: 10px;">${shop.businessName}</h3>
                <p><strong>👤 Owner:</strong> ${shop.name}</p>
                <p><strong>📍 Location:</strong> ${shop.area}, ${shop.district}</p>
                <p><strong>📞 Phone:</strong> ${shop.phone}</p>
                <p style="color: #666; margin: 10px 0;">${shop.bio || 'Professional salon services'}</p>
                <button onclick="window.location.href='services.html?shopId=${shop.id}'" style="width: 100%; padding: 10px; background: #d4af37; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                    View Services →
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}
</script>
```

### **Example 2: Add to dashboard.html (Customer Dashboard)**

Add this section to show nearby salons:

```html
<div class="dashboard-section">
    <h2>🔍 Find Salons Near You</h2>
    
    <div class="filter-row" style="display: flex; gap: 15px; margin-bottom: 20px;">
        <select id="customerFilterDistrict" class="form-control">
            <option value="">All Districts</option>
        </select>
        
        <select id="customerFilterArea" class="form-control">
            <option value="">All Areas</option>
        </select>
        
        <button onclick="searchShopsByLocation()" class="btn btn-primary">Search</button>
    </div>
    
    <div id="shopsResults"></div>
</div>
```

---

## 📊 Firebase Query Examples

### **Get All Shops**
```javascript
const allShops = await AuthSystem.getShopsByLocation();
// Returns all shop owners
```

### **Get Shops in Trincomalee District**
```javascript
const trincomaleShops = await AuthSystem.getShopsByLocation('Trincomalee');
// Returns all shops in Trincomalee district (any area)
```

### **Get Shops in Kinniya Area Only**
```javascript
const kinniyaShops = await AuthSystem.getShopsByLocation('Trincomalee', 'Kinniya');
// Returns only shops in Kinniya, Trincomalee
```

### **Get Shops in Batticaloa Town**
```javascript
const batticaloaShops = await AuthSystem.getShopsByLocation('Batticaloa', 'Batticaloa Town');
// Returns only shops in Batticaloa Town
```

---

## 🎨 Available Functions (Exported in auth.js)

```javascript
AuthSystem.getDistricts()
// Returns: ['Trincomalee', 'Batticaloa']

AuthSystem.getAreasForDistrict('Trincomalee')
// Returns: ['Kinniya', 'Trincomalee Town', 'Nilaveli', ...]

AuthSystem.getShopsByLocation(district, area)
// Returns: Array of shop objects

AuthSystem.populateDistrictDropdown(selectElementId)
// Fills a <select> element with districts

AuthSystem.populateAreaDropdown(selectElementId, district)
// Fills a <select> element with areas for a district

AuthSystem.initLocationDropdowns()
// Automatically initializes all location dropdowns on page load

AuthSystem.LOCATION_DATA
// Direct access to location data object
```

---

## 🔥 Firestore Database Structure

```
📂 users (Collection)
│
├── 📄 user123 (Customer)
│   ├── name: "John Doe"
│   ├── role: "customer"
│   ├── email: "john@email.com"
│   └── ...
│
├── 📄 user456 (Shop Owner - Kinniya)
│   ├── name: "Ahmed"
│   ├── businessName: "Ahmed's Salon"
│   ├── district: "Trincomalee" ← Filterable
│   ├── area: "Kinniya"          ← Filterable
│   ├── location: "Kinniya, Trincomalee"
│   ├── role: "owner"
│   └── ...
│
└── 📄 user789 (Shop Owner - Batticaloa)
    ├── name: "Priya"
    ├── businessName: "Priya's Beauty Center"
    ├── district: "Batticaloa"   ← Filterable
    ├── area: "Batticaloa Town"  ← Filterable
    ├── location: "Batticaloa Town, Batticaloa"
    ├── role: "owner"
    └── ...
```

---

## ✅ Testing Steps

### **1. Test Shop Owner Signup**
- Open auth.html
- Click "Shop Owner Sign Up"
- Fill form and select:
  - District: Trincomalee
  - Area: Kinniya
- Sign up
- ✅ Check Firebase → users collection → your document should have `district` and `area` fields

### **2. Test Location Filter**
- Add the filter HTML to any page (index.html, dashboard.html)
- Select District: Trincomalee
- Area dropdown should populate with Trincomalee areas
- Select Area: Kinniya
- Click Search
- ✅ Should show only shops in Kinniya, Trincomalee

### **3. Test Different Combinations**
```javascript
// Test 1: All shops
await AuthSystem.getShopsByLocation()

// Test 2: All Trincomalee shops
await AuthSystem.getShopsByLocation('Trincomalee')

// Test 3: Only Kinniya shops
await AuthSystem.getShopsByLocation('Trincomalee', 'Kinniya')

// Test 4: Only Batticaloa Town shops
await AuthSystem.getShopsByLocation('Batticaloa', 'Batticaloa Town')
```

---

## 🎯 Summary

✅ **Shop owners** select district + area during signup  
✅ **Data saved** in Firebase with searchable fields  
✅ **Customers** can filter shops by district and/or area  
✅ **Functions available** to query shops by location  
✅ **Auto-populated dropdowns** for easy selection  

**Your salon location filtering system is ready to use!** 🎉
