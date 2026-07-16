from flask import Flask, render_template, request, redirect, url_for, session
import json
import os

app = Flask(__name__)
app.secret_key = "mysecretkeyishidden"  

DATABASE = "Database/users.json"


def load_users():
    if not os.path.exists(DATABASE):
        return []

    with open(DATABASE, "r") as file:
        return json.load(file)



def save_users(users):
    with open(DATABASE, "w") as file:
        json.dump(users, file, indent=4)



@app.route("/")
def home_redirect():
    return redirect(url_for("home"))





@app.route("/home")
def home():
    return render_template("home.html")



@app.route("/admin")
def admin_dashboard():

    if "username" not in session:
        return redirect(url_for("login"))

    if session.get("role") != "admin":
        return redirect(url_for("home"))

    return render_template("admin.html")



@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        users = load_users()

        # Check if email already exists
        for user in users:
            if user["email"] == email:
                return "Email already exists!"

        users.append({
            "username": username,
            "email": email,
            "password": password,
            "role": "customer"      # Default role
        })

        save_users(users)

        return redirect(url_for("login"))

    return render_template("register.html")



@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        users = load_users()

        for user in users:

            if user["email"] == email and user["password"] == password:

                # Save user information
                session["username"] = user["username"]
                session["email"] = user["email"]
                session["role"] = user["role"]

                # Redirect according to role
                if user["role"] == "admin":
                    return redirect(url_for("admin_dashboard"))

                return redirect(url_for("home"))

        return "Invalid email or password."

    return render_template("login.html")



@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))



@app.route("/about")
def about():
    return render_template("about.html")



@app.route("/policies")
def policies():
    return render_template("policies.html")



@app.route("/category/<name>")
def category(name):
    return render_template("category.html", category=name)



@app.route("/cart")
def cart():

    if "username" not in session:
        return redirect(url_for("login"))

    return render_template("cart.html")



@app.route("/search")
def search():
    return render_template("search.html")


if __name__ == "__main__":
    app.run(debug=True)