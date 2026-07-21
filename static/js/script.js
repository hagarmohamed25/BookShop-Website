// ========== LOCALSTORAGE - USER DATA ==========
const USER_KEY = 'bookshop_user';

// ========== SAVE USER DATA TO LOCALSTORAGE ==========
function saveUserToLocalStorage(username, email, role) {
    const userData = {
        username: username,
        email: email,
        role: role,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    console.log('User saved to localStorage:', userData);
}

// ========== GET USER DATA FROM LOCALSTORAGE ==========
function getUserFromLocalStorage() {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// ========== CLEAR USER DATA FROM LOCALSTORAGE ==========
function clearUserFromLocalStorage() {
    localStorage.removeItem(USER_KEY);
    console.log('User removed from localStorage');
}

// ========== CHECK IF USER IS LOGGED IN (from localStorage) ==========
function isUserLoggedIn() {
    const user = getUserFromLocalStorage();
    return user !== null;
}

// ========== QUANTITY CONTROL WITH STOCK LIMIT ==========
function changeQty(bookId, change, maxStock) {
    const qtySpan = document.getElementById('qty' + bookId);
    const qtyInput = document.getElementById('qty_input' + bookId);
    
    if (!qtySpan || !qtyInput) return;
    
    let current = parseInt(qtySpan.textContent) || 1;
    current += change;
    
    // Don't go below 1
    if (current < 1) current = 1;
    
    // Don't exceed stock
    if (maxStock && current > maxStock) {
        current = maxStock;
        // Show warning to user
        alert(`Only ${maxStock} items available in stock!`);
    }
    
    qtySpan.textContent = current;
    qtyInput.value = current;
}

// ========== VALIDATE QUANTITY BEFORE SUBMIT ==========
function validateQuantity(bookId, maxStock) {
    const qtyInput = document.getElementById('qty_input' + bookId);
    if (!qtyInput) return true;
    
    const qty = parseInt(qtyInput.value) || 1;
    
    if (qty > maxStock) {
        alert(`You can only add up to ${maxStock} items. You entered ${qty}.`);
        return false;
    }
    
    return true;
}

// ========== EXPOSE FUNCTIONS ==========
window.changeQty = changeQty;
window.validateQuantity = validateQuantity;

