from flask import Blueprint, render_template, url_for, request, jsonify, redirect, flash, session
# import db_connection_settings
import os
import psycopg2

# PostgreSQL database URL (replace with your ElephantSQL database URL)
DATABASE_URL = os.environ.get('DATABASE_URL')

# Function to establish a database connection
def connect_db():
    return psycopg2.connect(DATABASE_URL, sslmode='require')

db_connection_settings = {
    "dbname": "fcfcgjwl",
    "user": "fcfcgjwl",
    "password": "Eb5MNeBN-fJlmTipRgqaC-c0tzO3gM5r",
    "host": "bubble.db.elephantsql.com",
    "port": "5432",
}

auth = Blueprint('auth', __name__)

@auth.route('/')
def index():
    return render_template('login.html')

@auth.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    # Connect to the PostgreSQL database
    conn = connect_db()
    cursor = conn.cursor()

    # Retrieve user information from the database
    cursor.execute('SELECT * FROM "user" WHERE "email" = %s AND "password" = %s', (email, password))
    user = cursor.fetchone()

    if user:
        session['logged_in'] = True
        flash('Login successful!', 'success')
        return redirect(url_for('auth.dashboard'))
    else:
        flash('Login failed. Please try again.', 'danger')
        return redirect(url_for('auth.index'))
    
@auth.route('/dashboard')
def dashboard():
    if session.get('logged_in'):
        return render_template('dashboard.html')
    else:
        return redirect(url_for('auth.index'))

@auth.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('Logged out successfully.', 'info')
    return redirect(url_for('auth.index'))

@auth.route('/sign-up', methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        # Check if the username is already in use (you may want to improve this check)
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM "user" WHERE "email" = %s', (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            flash('Email already in use. Please choose another one.', 'danger')
        else:
            # Insert the new user into the database (you should hash the password in a real app)
            cursor.execute('INSERT INTO "user" (email, password) VALUES (%s, %s)', (email, password))
            conn.commit()
            conn.close()

            flash('Sign-up successful! You can now log in.', 'success')
            return redirect(url_for('auth.index'))

    return render_template('signup.html')

# @auth.route('/create_table')
# def create_table():
#     # Connect to the PostgreSQL database
#     conn = connect_db()
#     cursor = conn.cursor()

#     # Create the users table if it doesn't exist
#     create_table_query = """
#     CREATE TABLE IF NOT EXISTS users (
#         id serial PRIMARY KEY,
#         email VARCHAR(20) NOT NULL,
#         password VARCHAR(80) NOT NULL
#     );
#     """
#     cursor.execute(create_table_query)
#     conn.commit()
#     conn.close()

#     return 'User table created or already exists'