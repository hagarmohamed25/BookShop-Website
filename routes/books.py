from flask import render_template
from app import app
from models import get_books

@app.route("/")
@app.route("/home")
def home():

    data = get_books()

    return render_template(
        "home.html",
        categories=data["categories"]
    )

@app.route("/search")
def search():

    return render_template("search.html")

@app.route("/cart")
def cart():

    return render_template("cart.html")

