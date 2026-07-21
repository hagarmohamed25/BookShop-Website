import json
import os

BOOKS_FILE = "database/books.json"
USERS_FILE = "database/users.json"


def get_books():
    if not os.path.exists(BOOKS_FILE):
        return {"categories": []}

    with open(BOOKS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_books(data):
    with open(BOOKS_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)



def get_users():
    if not os.path.exists(USERS_FILE):
        return []

    with open(USERS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_users(users):
    with open(USERS_FILE, "w", encoding="utf-8") as file:
        json.dump(users, file, indent=4)