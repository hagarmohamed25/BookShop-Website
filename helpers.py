def get_next_id(items):
    """Get the next available ID for categories"""
    if not items:
        return 1
    max_id = 0
    for item in items:
        if item.get("id", 0) > max_id:
            max_id = item["id"]
    return max_id + 1

def get_next_book_id(book_shop_app):
    """Get the next available book ID across ALL categories"""
    categories = book_shop_app.load_books()
    max_id = 0
    for cat in categories:
        for book in cat.get("books", []):
            if book.get("id", 0) > max_id:
                max_id = book["id"]
    return max_id + 1

def find_category(category_id, book_shop_app):
    """Find a category by ID"""
    categories = book_shop_app.load_books()
    for cat in categories:
        if cat["id"] == category_id:
            return cat
    return None

def find_book_by_id(book_id, book_shop_app):
    """Find a book by ID across all categories"""
    categories = book_shop_app.load_books()
    for cat in categories:
        for book in cat.get("books", []):
            if book["id"] == book_id:
                return book, cat
    return None, None

# ========== CHECK FOR DUPLICATE BOOK ==========
def is_book_duplicate(title, book_shop_app, exclude_book_id=None):
    """
    Check if a book with the same title already exists.
    Returns: (is_duplicate, category_name)
    
    Parameters:
    - title: The book title to check
    - book_shop_app: The Book_Shop instance
    - exclude_book_id: Optional book ID to exclude (for editing)
    """
    categories = book_shop_app.load_books()
    for category in categories:
        for book in category.get("books", []):
            # If exclude_book_id is provided, skip that book (for editing)
            if exclude_book_id is not None and book["id"] == exclude_book_id:
                continue
            if book["title"].lower() == title.lower():
                return True, category["name"]
    return False, None