userEmail = document.getElementById("email")
loginButton = document.getElementById("login-btn")

loginButton.addEventListener("click", function() {
    const email = userEmail.value; // Get the value of an input field with the id userEmail
    localStorage.setItem("email", email); // Save the email address in the browser's localStorage with the key "email"
    console.log("saved", localStorage.getItem("email"))
});

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

// ========== VALIDATE EMAIL ==========
function isValidEmail(email) {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
}

// ========== TOGGLE DESCRIPTION ==========
function toggleDescription(bookId) {
    const desc = document.getElementById('desc-' + bookId);
    if (!desc) return;
    
    const wrapper = desc.parentElement;
    const btn = wrapper.querySelector('.read-more-btn');
    if (!btn) return;
    
    if (desc.classList.contains('collapsed')) {
        desc.classList.remove('collapsed');
        btn.textContent = 'Read less';
    } else {
        desc.classList.add('collapsed');
        btn.textContent = 'Read more';
    }
}

// ========== QUANTITY CONTROL WITH STOCK LIMIT ==========
function changeQty(bookId, change, maxStock) {
    const qtySpan = document.getElementById('qty' + bookId);
    const qtyInput = document.getElementById('qty_input' + bookId);
    
    if (!qtySpan || !qtyInput) return;
    
    let current = parseInt(qtySpan.textContent) || 1;
    current += change;
    
    if (current < 1) current = 1;
    
    if (maxStock && current > maxStock) {
        current = maxStock;
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
window.saveUserToLocalStorage = saveUserToLocalStorage;
window.getUserFromLocalStorage = getUserFromLocalStorage;
window.clearUserFromLocalStorage = clearUserFromLocalStorage;
window.isUserLoggedIn = isUserLoggedIn;
window.isValidEmail = isValidEmail;
window.toggleDescription = toggleDescription;

// ========== CART FORM VALIDATION ==========
function setupCartValidation() {
    const form = document.getElementById('orderForm');
    if (!form) return;

    // Get all form elements
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const addressInput = document.getElementById('fullAddress');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const addressError = document.getElementById('addressError');

    // Egyptian phone pattern
    const phonePattern = /^01[0125][0-9]{8}$/;

    // Validate Name
    function validateName() {
        if (!nameInput) return false;
        const value = nameInput.value.trim();
        if (value.length < 3 && value.length > 0) {
            nameInput.classList.add('is-invalid');
            nameInput.classList.remove('is-valid');
            if (nameError) nameError.classList.add('show');
            return false;
        } else if (value.length >= 3) {
            nameInput.classList.remove('is-invalid');
            nameInput.classList.add('is-valid');
            if (nameError) nameError.classList.remove('show');
            return true;
        }
        return false;
    }

    // Validate Phone
    function validatePhone() {
        if (!phoneInput) return false;
        const value = phoneInput.value.trim();
        
        if (value.length > 0 && !/^\d+$/.test(value)) {
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
            if (phoneError) {
                phoneError.textContent = 'Numbers only allowed!';
                phoneError.classList.add('show');
            }
            return false;
        } else if (value.length > 0 && value.length !== 11) {
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
            if (phoneError) {
                phoneError.textContent = 'Phone must be exactly 11 digits!';
                phoneError.classList.add('show');
            }
            return false;
        } else if (value.length === 11 && !phonePattern.test(value)) {
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
            if (phoneError) {
                phoneError.textContent = 'Enter a valid Egyptian number (010, 011, 012, or 015 followed by 8 digits)';
                phoneError.classList.add('show');
            }
            return false;
        } else if (value.length === 11 && phonePattern.test(value)) {
            phoneInput.classList.remove('is-invalid');
            phoneInput.classList.add('is-valid');
            if (phoneError) phoneError.classList.remove('show');
            return true;
        }
        return false;
    }

    // Validate Address
    function validateAddress() {
        if (!addressInput) return false;
        const value = addressInput.value.trim();
        if (value.length < 5 && value.length > 0) {
            addressInput.classList.add('is-invalid');
            addressInput.classList.remove('is-valid');
            if (addressError) addressError.classList.add('show');
            return false;
        } else if (value.length >= 5) {
            addressInput.classList.remove('is-invalid');
            addressInput.classList.add('is-valid');
            if (addressError) addressError.classList.remove('show');
            return true;
        }
        return false;
    }

    // Real-time validation
    if (nameInput) nameInput.addEventListener('input', validateName);
    if (phoneInput) phoneInput.addEventListener('input', validatePhone);
    if (addressInput) addressInput.addEventListener('input', validateAddress);

    // Phone: Only numbers
    if (phoneInput) {
        phoneInput.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/^\d$/.test(char)) {
                e.preventDefault();
                phoneInput.classList.add('is-invalid');
                phoneInput.classList.remove('is-valid');
                if (phoneError) {
                    phoneError.textContent = 'Numbers only allowed!';
                    phoneError.classList.add('show');
                }
            }
        });
    }

    // Phone: Auto-format (remove non-digits)
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '');
        });
    }

    // Form submit validation
    form.addEventListener('submit', function(e) {
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isAddressValid = validateAddress();

        if (!isNameValid || !isPhoneValid || !isAddressValid) {
            e.preventDefault();
            
            if (!isNameValid && nameInput && nameInput.value.trim() === '') {
                nameInput.classList.add('is-invalid');
                if (nameError) {
                    nameError.textContent = 'Full name is required!';
                    nameError.classList.add('show');
                }
            }
            if (!isPhoneValid && phoneInput && phoneInput.value.trim() === '') {
                phoneInput.classList.add('is-invalid');
                if (phoneError) {
                    phoneError.textContent = 'Phone number is required!';
                    phoneError.classList.add('show');
                }
            }
            if (!isAddressValid && addressInput && addressInput.value.trim() === '') {
                addressInput.classList.add('is-invalid');
                if (addressError) {
                    addressError.textContent = 'Address is required!';
                    addressError.classList.add('show');
                }
            }
            
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    // Clear validation on focus
    if (nameInput) {
        nameInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.classList.remove('is-invalid');
                if (nameError) nameError.classList.remove('show');
            }
        });
    }
    if (phoneInput) {
        phoneInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.classList.remove('is-invalid');
                if (phoneError) phoneError.classList.remove('show');
            }
        });
    }
    if (addressInput) {
        addressInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.classList.remove('is-invalid');
                if (addressError) addressError.classList.remove('show');
            }
        });
    }
}

// Load user from localStorage on cart page
function setupCartUser() {
    const user = getUserFromLocalStorage();
    if (user) {
        const usernameSpan = document.getElementById('cartUsername');
        if (usernameSpan) {
            usernameSpan.textContent = user.username;
        }
    }
}

// Clear localStorage on logout
function setupCartLogout() {
    const logoutBtn = document.getElementById('cartLogout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            clearUserFromLocalStorage();
        });
    }
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    setupCartUser();
    setupCartLogout();
    setupCartValidation();
});

// ========== REGISTER FORM VALIDATION ==========
function setupRegisterValidation() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passInput = document.getElementById('pass');
    const confInput = document.getElementById('conf_pass');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');
    const passError = document.getElementById('passError');
    const confError = document.getElementById('confError');

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateUsername() {
        const value = usernameInput.value.trim();
        if (value.length < 2 && value.length > 0) {
            usernameInput.classList.add('is-invalid');
            usernameInput.classList.remove('is-valid');
            usernameError.classList.add('show');
            return false;
        } else if (value.length >= 2) {
            usernameInput.classList.remove('is-invalid');
            usernameInput.classList.add('is-valid');
            usernameError.classList.remove('show');
            return true;
        }
        return false;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (value.length > 0 && !emailPattern.test(value)) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            emailError.classList.add('show');
            return false;
        } else if (value.length > 0 && emailPattern.test(value)) {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
            emailError.classList.remove('show');
            return true;
        }
        return false;
    }

    function validatePassword() {
        const value = passInput.value;
        if (value.length < 6 && value.length > 0) {
            passInput.classList.add('is-invalid');
            passInput.classList.remove('is-valid');
            passError.classList.add('show');
            return false;
        } else if (value.length >= 6) {
            passInput.classList.remove('is-invalid');
            passInput.classList.add('is-valid');
            passError.classList.remove('show');
            return true;
        }
        return false;
    }

    function validateConfirm() {
        const pass = passInput.value;
        const conf = confInput.value;
        if (conf.length > 0 && conf !== pass) {
            confInput.classList.add('is-invalid');
            confInput.classList.remove('is-valid');
            confError.classList.add('show');
            return false;
        } else if (conf.length > 0 && conf === pass) {
            confInput.classList.remove('is-invalid');
            confInput.classList.add('is-valid');
            confError.classList.remove('show');
            return true;
        }
        return false;
    }

    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passInput.addEventListener('input', function() {
        validatePassword();
        if (confInput.value.length > 0) {
            validateConfirm();
        }
    });
    confInput.addEventListener('input', validateConfirm);

    form.addEventListener('submit', function(e) {
        const isUsernameValid = validateUsername();
        const isEmailValid = validateEmail();
        const isPassValid = validatePassword();
        const isConfValid = validateConfirm();

        if (!isUsernameValid || !isEmailValid || !isPassValid || !isConfValid) {
            e.preventDefault();
            
            if (usernameInput.value.trim() === '') {
                usernameInput.classList.add('is-invalid');
                usernameError.textContent = 'Name is required!';
                usernameError.classList.add('show');
            }
            if (emailInput.value.trim() === '') {
                emailInput.classList.add('is-invalid');
                emailError.textContent = 'Email is required!';
                emailError.classList.add('show');
            }
            if (passInput.value === '') {
                passInput.classList.add('is-invalid');
                passError.textContent = 'Password is required!';
                passError.classList.add('show');
            }
            if (confInput.value === '') {
                confInput.classList.add('is-invalid');
                confError.textContent = 'Please confirm your password!';
                confError.classList.add('show');
            }
            
            const firstError = document.querySelector('.is-invalid');
            if (firstError) {
                firstError.focus();
            }
        }
    });

    usernameInput.addEventListener('focus', function() {
        if (this.value.trim() === '') {
            this.classList.remove('is-invalid');
            usernameError.classList.remove('show');
            usernameError.textContent = 'Name must be at least 2 characters!';
        }
    });
    emailInput.addEventListener('focus', function() {
        if (this.value.trim() === '') {
            this.classList.remove('is-invalid');
            emailError.classList.remove('show');
            emailError.textContent = 'Please enter a valid email (e.g., name@domain.com)!';
        }
    });
    passInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.classList.remove('is-invalid');
            passError.classList.remove('show');
            passError.textContent = 'Your password should be more than 6 digits!';
        }
    });
    confInput.addEventListener('focus', function() {
        if (this.value === '') {
            this.classList.remove('is-invalid');
            confError.classList.remove('show');
            confError.textContent = 'Passwords do not match!';
        }
    });
}

// Initialize register validation
document.addEventListener('DOMContentLoaded', function() {
    setupRegisterValidation();
});