from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient
from authlib.integrations.flask_client import OAuth 
import requests
import json
import urllib
import urllib.parse as up
from flask import Flask, render_template, url_for, redirect, flash, request, jsonify, session
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError, Email, DataRequired, EqualTo
import re
# from flask_bcrypt import Bcrypt
import os
import secrets
from dotenv import load_dotenv
import binascii
import bcrypt
import psycopg2
from flask_cors import CORS
from flask_wtf.csrf import generate_csrf
import unittest



app = Flask(__name__)
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.secret_key = os.environ.get('SECRET_KEY')

db = SQLAlchemy(app)

# SQL Queries for Search endpounts
SEARCH_QUERY = "SELECT * FROM Equipment WHERE name ILIKE %s OR description ILIKE %s"
AVAILABLE_ITEMS_QUERY = "SELECT * FROM Equipment WHERE available = true"
UNAVAILABLE_ITEMS_QUERY = "SELECT * FROM Equipment WHERE available = false"


# Database table for user
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)


CORS(app) # Allow all origins for development; restrict in production

# PostgreSQL connection settings
db_connection_settings = {
    "dbname": "fcfcgjwl",
    "user": "fcfcgjwl",
    "password": "Eb5MNeBN-fJlmTipRgqaC-c0tzO3gM5r",
    "host": "bubble.db.elephantsql.com",
    "port": "5432",
}



# TDD Testing for Production Code


def execute_database_query(query, params=None):
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_connection_settings)
        cursor = conn.cursor()
        if params is not None:
            cursor.execute(query, params)
        else:
            cursor.execute(query)
        # Fetch all rows and store them in a list of dictionaries
        columns = [desc[0] for desc in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
        print("Running")
        cursor.close()
        conn.close()
        print(data)
        return data
      
    except Exception as e:
        return None, str(e)
    
query = "SELECT * FROM Equipment WHERE name ILIKE %s OR description ILIKE %s"
params = ("Boots", "Boots")

execute_database_query(query, params)

# class TestExecuteDatabaseQuery(unittest.TestCase):
#       def test_execute_database_query_error(self):
#         # This test case expects an error to be raised
#         query = "SELECT * FROM non_existent_table;"
#         with self.assertRaises(Exception):
#             execute_database_query(query)


if __name__ == '__main__':
    unittest.main()
