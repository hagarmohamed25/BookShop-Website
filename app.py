from flask import Flask, render_template, request, redirect, url_for
import json
import os

app = Flask(__name__)

DATABASE = "Database/users.json"


# to read users
def load_users():
    if not os.path.exists(DATABASE):
        return []

    with open(DATABASE, "r") as file:
        return json.load(file)


# to save users
def save_users(users):
    with open(DATABASE, "w") as file:
        json.dump(users, file, indent=4)


@app.route("/")
def home():
    return redirect(url_for("login"))


@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]

        users = load_users()

        # Check if the email exists
        for user in users:
            if user["email"] == email:
                return "Email already exists!"

        users.append({
            "username": username,
            "email": email,
            "password": password,
            "role": "customer"
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

        #to check if the email and password exist in database
        for user in users:
            print("Comparing with:", user["email"])

            if user["email"] == email and user["password"] == password:
                return f"Welcome {user['username']}!"

        return "Invalid email or password."
    return render_template("login.html")


if __name__ == "__main__":
    app.run(debug=True)