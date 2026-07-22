from flask import Flask, render_template, request, redirect, url_for, session, flash
import json
import os
import uuid
from datetime import datetime

class Book_Shop:
    USERS_FILE = None
    BOOKS_FILE = None

    def __init__(self, USERS_FILE, BOOKS_FILE):
        self.USERS_FILE = USERS_FILE
        self.BOOKS_FILE = BOOKS_FILE

    def load_users(self):
        """Load users from JSON file"""
        if not os.path.exists(self.USERS_FILE):
            return []
        try:
            with open(self.USERS_FILE, "r") as f:
                return json.load(f)
        except:
            return []

    def save_users(self,users):
        """Save users to JSON file"""
        with open(self.USERS_FILE, "w") as f:
            json.dump(users, f, indent=4)

    def load_books(self):
        """Load books from JSON file"""
        if not os.path.exists(self.BOOKS_FILE):
            return []
        try:
            with open(self.BOOKS_FILE, "r") as f:
                data = json.load(f)
                return data.get("categories", [])
        except:
            return []

    def save_books(self,categories):
        """Save books to JSON file"""
        with open(self.BOOKS_FILE, "w") as f:
            json.dump({"categories": categories}, f, indent=4)
