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
window.toggleDescription = toggleDescription;