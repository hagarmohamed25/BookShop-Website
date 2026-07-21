from flask import Flask, render_template, request, redirect, url_for, session, flash
import json
import os
import uuid
from datetime import datetime

app = Flask(__name__)
app.secret_key = "bookshop_secret_key"

# File paths
USERS_FILE = "database/users.json"
BOOKS_FILE = "database/books.json"
UPLOAD_FOLDER = "static/uploads"

# Create folders if they don't exist
os.makedirs("database", exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =====================
# FILE HANDLING FUNCTIONS
# =====================

def load_users():
    """Load users from JSON file"""
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def load_books():
    """Load books from JSON file"""
    if not os.path.exists(BOOKS_FILE):
        return []
    try:
        with open(BOOKS_FILE, "r") as f:
            data = json.load(f)
            return data.get("categories", [])
    except:
        return []

def save_books(categories):
    """Save books to JSON file"""
    with open(BOOKS_FILE, "w") as f:
        json.dump({"categories": categories}, f, indent=4)


# =====================
# HELPER FUNCTIONS
# =====================

def get_next_id(items):
    """Get the next available ID for categories"""
    if not items:
        return 1
    max_id = 0
    for item in items:
        if item.get("id", 0) > max_id:
            max_id = item["id"]
    return max_id + 1

def get_next_book_id():
    """Get the next available book ID across ALL categories"""
    categories = load_books()
    max_id = 0
    for cat in categories:
        for book in cat.get("books", []):
            if book.get("id", 0) > max_id:
                max_id = book["id"]
    return max_id + 1

def find_category(category_id):
    """Find a category by ID"""
    categories = load_books()
    for cat in categories:
        if cat["id"] == category_id:
            return cat
    return None

def find_book_by_id(book_id):
    """Find a book by ID across all categories"""
    categories = load_books()
    for cat in categories:
        for book in cat.get("books", []):
            if book["id"] == book_id:
                return book, cat
    return None, None


# =====================
# ROUTES
# =====================

@app.route("/")
def index():
    return redirect(url_for("home"))

@app.route("/home")
def home():
    categories = load_books()
    return render_template("home.html", categories=categories)


# =====================
# REGISTER
# =====================

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")
        confirm = request.form.get("confirm_password", "")

        # Validation
        if len(password) < 6:
            return render_template("register.html", error="Your password should be more than 6 digits!")

        if password != confirm:
            return render_template("register.html", error="Passwords do not match!")

        users = load_users()
        
        # Check if email exists
        for user in users:
            if user["email"] == email:
                return render_template("register.html", error="Email already exists!")

        # Add new user
        users.append({
            "username": username,
            "email": email,
            "password": password,
            "role": "customer",
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M")
        })
        save_users(users)
        
        flash("Registration successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")


# =====================
# LOGIN
# =====================

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip()
        password = request.form.get("password", "")

        users = load_users()
        
        for user in users:
            if user["email"] == email and user["password"] == password:
                session["username"] = user["username"]
                session["email"] = user["email"]
                session["role"] = user["role"]
                
                flash(f"Welcome {user['username']}!", "success")
                return redirect(url_for("home"))

        return render_template("login.html", error="Invalid email or password!")

    return render_template("login.html")


# =====================
# LOGOUT
# =====================

@app.route("/logout")
def logout():
    session.clear()
    flash("Logged out successfully!", "info")
    return redirect(url_for("home"))


# =====================
# DASHBOARD
# =====================

@app.route("/dashboard")
def dashboard():
    if "username" not in session:
        #flash("Please login first!", "warning")
        return redirect(url_for("login"))
    
    if session.get("role") != "admin":
        flash("Admin access only!", "danger")
        return redirect(url_for("home"))
    
    categories = load_books()
    return render_template("dashboard.html", categories=categories)


# =====================
# CART
# =====================

# =====================
# CART
# =====================

@app.route("/cart", methods=["GET", "POST"])
def cart():
    if "username" not in session:
        flash("Please login first!", "warning")
        return redirect(url_for("login"))
    
    # Admin cannot use cart
    if session.get("role") == "admin":
        flash("Admin cannot use cart!", "warning")
        return redirect(url_for("home"))
    
    # Handle order submission
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        phone = request.form.get("phone", "").strip()
        address = request.form.get("address", "").strip()
        
        # ========== VALIDATION ==========
        errors = []
        
        # Validate name
        if not name:
            errors.append("Full name is required!")
        elif len(name) < 3:
            errors.append("Name must be at least 3 characters!")
        
        # Validate phone (must be 11 digits)
        if not phone:
            errors.append("Phone number is required!")
        elif not phone.isdigit():
            errors.append("Phone number must contain only numbers!")
        elif len(phone) != 11:
            errors.append("Phone number must be exactly 11 digits!")
        
        # Validate address
        if not address:
            errors.append("Address is required!")
        elif len(address) < 5:
            errors.append("Address must be at least 5 characters!")
        
        # If there are errors, show them
        if errors:
            for error in errors:
                flash(error, "warning")
            return redirect(url_for("cart"))
        
        # Clear the cart after successful order
        session["cart"] = {}
        flash("Order placed successfully!", "success")
        return render_template("cart.html", order_placed=True)
    
    # GET request - show cart
    cart_items = session.get("cart", {})
    cart_books = []
    total = 0
    
    categories = load_books()
    for book_id, qty in cart_items.items():
        book_found, category = find_book_by_id(int(book_id))
        if book_found:
            book_copy = book_found.copy()
            book_copy["quantity"] = qty
            book_copy["category"] = category["name"] if category else "Unknown"
            cart_books.append(book_copy)
            total += book_found["price"] * qty
    
    return render_template("cart.html", cart_books=cart_books, total=total)


# =====================
# ADD TO CART
# =====================

@app.route("/add_to_cart/<int:book_id>", methods=["POST"])
def add_to_cart(book_id):
    if "username" not in session:
        #flash("Please login first!", "warning")
        return redirect(url_for("login"))
    
    if session.get("role") == "admin":
        flash("Admin cannot add to cart!", "warning")
        return redirect(url_for("home"))
    
    qty = int(request.form.get("quantity", 1))
    
    # Find book using helper function
    book_found, category = find_book_by_id(book_id)
    
    if not book_found:
        flash("Book not found!", "danger")
        return redirect(url_for("home"))
    
    # Check if enough stock
    if qty > book_found["stock"]:
        flash(f"Sorry, only {book_found['stock']} items available in stock!", "warning")
        return redirect(url_for("home"))
    
    # Get current cart
    cart = session.get("cart", {})
    current_qty = cart.get(str(book_id), 0)
    
    # Check if adding more would exceed stock
    if current_qty + qty > book_found["stock"]:
        flash(f"You already have {current_qty} in cart. Only {book_found['stock']} available!", "warning")
        return redirect(url_for("home"))
    
    # Add to cart
    cart[str(book_id)] = current_qty + qty
    session["cart"] = cart
    
    flash("Added to cart!", "success")
    return redirect(url_for("home"))


# =====================
# REMOVE FROM CART
# =====================

@app.route("/remove_from_cart/<int:book_id>", methods=["POST"])
def remove_from_cart(book_id):
    cart = session.get("cart", {})
    cart.pop(str(book_id), None)
    session["cart"] = cart
    flash("Removed from cart!", "info")
    return redirect(url_for("cart"))


# =====================
# UPDATE CART
# =====================

@app.route("/update_cart/<int:book_id>", methods=["POST"])
def update_cart(book_id):
    qty = int(request.form.get("quantity", 0))
    
    # Find book using helper function
    book_found, category = find_book_by_id(book_id)
    
    cart = session.get("cart", {})
    
    if qty <= 0:
        cart.pop(str(book_id), None)
        session["cart"] = cart
        return redirect(url_for("cart"))
    
    # Check stock
    if book_found and qty > book_found["stock"]:
        flash(f"Sorry, only {book_found['stock']} items available!", "warning")
        return redirect(url_for("cart"))
    
    cart[str(book_id)] = qty
    session["cart"] = cart
    return redirect(url_for("cart"))


# =====================
# ADMIN - ADD CATEGORY
# =====================

@app.route("/add_category", methods=["POST"])
def add_category():
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    name = request.form.get("category_name", "").strip()
    if not name:
        flash("Category name is required!", "warning")
        return redirect(url_for("dashboard"))
    
    categories = load_books()
    
    # Check if category exists
    for cat in categories:
        if cat["name"].lower() == name.lower():
            flash("Category already exists!", "warning")
            return redirect(url_for("dashboard"))
    
    categories.append({
        "id": get_next_id(categories),
        "name": name,
        "books": []
    })
    save_books(categories)
    flash("Category added successfully!", "success")
    return redirect(url_for("dashboard"))


# =====================
# ADMIN - DELETE CATEGORY
# =====================

@app.route("/delete_category/<int:category_id>", methods=["POST"])
def delete_category(category_id):
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    categories = load_books()
    categories = [cat for cat in categories if cat["id"] != category_id]
    save_books(categories)
    flash("Category deleted!", "success")
    return redirect(url_for("dashboard"))


# =====================
# ADMIN - EDIT CATEGORY
# =====================

@app.route("/edit_category/<int:category_id>", methods=["POST"])
def edit_category(category_id):
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    name = request.form.get("category_name", "").strip()
    if not name:
        flash("Category name is required!", "warning")
        return redirect(url_for("dashboard"))
    
    categories = load_books()
    for cat in categories:
        if cat["id"] == category_id:
            cat["name"] = name
            break
    save_books(categories)
    flash("Category updated!", "success")
    return redirect(url_for("dashboard"))


# =====================
# ADMIN - ADD BOOK
# =====================

@app.route("/add_book/<int:category_id>", methods=["POST"])
def add_book(category_id):
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    cat = find_category(category_id)
    if not cat:
        flash("Category not found!", "danger")
        return redirect(url_for("dashboard"))
    
    title = request.form.get("title", "").strip()
    desc = request.form.get("description", "").strip()
    
    if not title or not desc:
        flash("Title and description are required!", "warning")
        return redirect(url_for("dashboard"))
    
    try:
        price = float(request.form.get("price", 0))
        stock = int(request.form.get("stock", 0))
    except ValueError:
        flash("Invalid price or stock value!", "warning")
        return redirect(url_for("dashboard"))
    
    # Handle image
    image = request.files.get("image")
    filename = "default_book.png"
    
    if image and image.filename:
        ext = os.path.splitext(image.filename)[1].lower()
        if ext in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
            filename = str(uuid.uuid4()) + ext
            image.save(os.path.join(UPLOAD_FOLDER, filename))
    
    categories = load_books()
    for c in categories:
        if c["id"] == category_id:
            # Use unique book ID across all categories
            c["books"].append({
                "id": get_next_book_id(),
                "title": title,
                "description": desc,
                "price": price,
                "stock": stock,
                "image": filename
            })
            break
    
    save_books(categories)
    flash("Book added successfully!", "success")
    return redirect(url_for("dashboard"))


# =====================
# ADMIN - EDIT BOOK
# =====================

@app.route("/edit_book/<int:category_id>/<int:book_id>", methods=["POST"])
def edit_book(category_id, book_id):
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    title = request.form.get("title", "").strip()
    desc = request.form.get("description", "").strip()
    
    if not title or not desc:
        flash("Title and description are required!", "warning")
        return redirect(url_for("dashboard"))
    
    try:
        price = float(request.form.get("price", 0))
        stock = int(request.form.get("stock", 0))
    except ValueError:
        flash("Invalid price or stock value!", "warning")
        return redirect(url_for("dashboard"))
    
    categories = load_books()
    
    for cat in categories:
        if cat["id"] == category_id:
            for book in cat["books"]:
                if book["id"] == book_id:
                    book["title"] = title
                    book["description"] = desc
                    book["price"] = price
                    book["stock"] = stock
                    
                    # Handle image
                    image = request.files.get("image")
                    if image and image.filename:
                        ext = os.path.splitext(image.filename)[1].lower()
                        if ext in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
                            # Delete old image if not default
                            if book["image"] != "default_book.png":
                                old_path = os.path.join(UPLOAD_FOLDER, book["image"])
                                if os.path.exists(old_path):
                                    os.remove(old_path)
                            
                            filename = str(uuid.uuid4()) + ext
                            image.save(os.path.join(UPLOAD_FOLDER, filename))
                            book["image"] = filename
                    
                    save_books(categories)
                    flash("Book updated!", "success")
                    return redirect(url_for("dashboard"))
    
    flash("Book not found!", "danger")
    return redirect(url_for("dashboard"))


# =====================
# ADMIN - DELETE BOOK
# =====================

@app.route("/delete_book/<int:category_id>/<int:book_id>", methods=["POST"])
def delete_book(category_id, book_id):
    if session.get("role") != "admin":
        flash("Admin only!", "danger")
        return redirect(url_for("home"))
    
    categories = load_books()
    
    for cat in categories:
        if cat["id"] == category_id:
            for i, book in enumerate(cat["books"]):
                if book["id"] == book_id:
                    # Delete image
                    if book["image"] != "default_book.png":
                        img_path = os.path.join(UPLOAD_FOLDER, book["image"])
                        if os.path.exists(img_path):
                            os.remove(img_path)
                    
                    del cat["books"][i]
                    save_books(categories)
                    flash("Book deleted!", "success")
                    return redirect(url_for("dashboard"))
    
    flash("Book not found!", "danger")
    return redirect(url_for("dashboard"))


# =====================
# SEARCH
# =====================

@app.route("/search")
def search():
    keyword = request.args.get("q", "").strip().lower()
    categories = load_books()
    results = []
    
    if keyword:
        for cat in categories:
            for book in cat.get("books", []):
                if keyword in book["title"].lower() or keyword in book["description"].lower():
                    results.append({"book": book, "category": cat["name"]})
    
    return render_template("search.html", books=results, keyword=keyword)


# =====================
# RUN APP
# =====================

if __name__ == "__main__":
    app.run(debug=True)