// ========== TOGGLE ADD BOOK FORM ==========
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all "Add Book" buttons
    const addBookButtons = document.querySelectorAll('.toggle-add-book');
    
    addBookButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const categoryId = this.dataset.category;
            const form = document.getElementById('add-form-' + categoryId);
            
            if (form) {
                form.classList.toggle('show');
            }
        });
    });
    
    // ========== EDIT BOOK - POPULATE MODAL ==========
    const editBtns = document.querySelectorAll('.edit-book-btn');
    
    editBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('editTitle').value = this.dataset.title || '';
            document.getElementById('editDescription').value = this.dataset.description || '';
            document.getElementById('editPrice').value = this.dataset.price || '';
            document.getElementById('editStock').value = this.dataset.stock || '';
            
            const form = document.getElementById('editBookForm');
            if (form) {
                form.action = '/edit_book/' + this.dataset.category + '/' + this.dataset.book;
            }
        });
    });
    
    // ========== EDIT CATEGORY - POPULATE MODAL ==========
    const catEditBtns = document.querySelectorAll('.edit-category-btn');
    
    catEditBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.getElementById('editCategoryName').value = this.dataset.name || '';
            const form = document.getElementById('editCategoryForm');
            if (form) {
                form.action = '/edit_category/' + this.dataset.id;
            }
        });
    });
    
    // ========== SMOOTH SCROLL TO CATEGORY (without localStorage) ==========
    // Check URL hash on load
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        }
    }
});