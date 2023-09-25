from flask import Flask, render_template, url_for, redirect, flash, request, jsonify
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

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # Allow all origins for development; restrict in production

# PostgreSQL connection settings
db_connection_settings = {
    "dbname": "fcfcgjwl",
    "user": "fcfcgjwl",
    "password": "Eb5MNeBN-fJlmTipRgqaC-c0tzO3gM5r",
    "host": "bubble.db.elephantsql.com",
    "port": "5432",
}

secret_key = secrets.token_hex(16)  # Generate a 32-character (16 bytes) random hexadecimal string
app.config['SECRET_KEY'] = secret_key
print(app.config['SECRET_KEY'])
@app.route("/api/getEquipment", methods=["GET"])
def get_equipment():
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_connection_settings)
        cursor = conn.cursor()

        # Execute an SQL query to fetch equipment data
        cursor.execute("SELECT * FROM Equipment")  # Modify this query as needed

        # Fetch all rows and store them in a list of dictionaries
        columns = [desc[0] for desc in cursor.description]
        equipment_data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return jsonify(equipment_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/addEquipment", methods=["POST"])
def add_equipment():
    try:
        # Parse JSON data from the request
        data = request.get_json()
        print(data)
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_connection_settings)
        cursor = conn.cursor()

        # Insert data into the "Equipment" table (modify SQL statement to match your table schema)
        insert_sql = "INSERT INTO Equipment (name, description, status, price, owner) VALUES (%s, %s, %s, %s, %s)"

        cursor.execute(insert_sql, (data["name"], data["description"], data["status"], data["price"], data["owner"]))
        
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Equipment added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    print("User ID:", user_id)
    print(type(user_id))
    conn = psycopg2.connect(**db_connection_settings)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM "user" WHERE id = %s', (user_id,))
    user_info = cursor.fetchone()
    print(user_info)
    cursor.close()
    conn.close()
    user = None
    if user_info:
        db_password = user_info[2][2:].encode('utf-8')
        hashed_db_password = binascii.unhexlify(db_password)
        user = User(user_info[0], user_info[1], hashed_db_password)
        print(user)
        app.logger.info(f"Loaded user: {user}")
    return user
    
class User(UserMixin):
    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = password

# class User(db.Model, UserMixin):
#     id = db.Column(db.Integer, primary_key=True)
#     email = db.Column(db.String(20), nullable=False, unique=True)
#     password = db.Column(db.String(200), nullable=False)


class RegisterForm(FlaskForm):
    email = StringField(validators=[
                           InputRequired(), Length(min=4, max=20), Email(), DataRequired()], render_kw={"placeholder": "Email"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Register')

    def validate_email(self, email):
        if not re.match(r'^[a-zA-Z0-9.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$', email.data):
            raise ValidationError('Invalid email address.')
        
        conn = psycopg2.connect(**db_connection_settings)
        
        cursor = conn.cursor()
        cursor.execute('SELECT email FROM "user" WHERE email = %s', (email.data,))
        existing_user_email = cursor.fetchone()
        cursor.close()
        conn.close()
        if existing_user_email:
            flash('Email already in use. Please choose another one.', 'danger')
            raise ValidationError('That email already exists. Please choose a different one.')


class LoginForm(FlaskForm):
    email = StringField(validators=[
                           InputRequired(), Length(min=4, max=20), Email(), DataRequired()], render_kw={"placeholder": "Email"})

    password = PasswordField(validators=[
                             InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})

    submit = SubmitField('Login')


@app.route('/api/login', methods=['GET', 'POST'])
def login():
    try:
        conn = psycopg2.connect(**db_connection_settings)
        cursor = conn.cursor()
        form = LoginForm()

        if form.validate_on_submit():
            email = form.email.data
            password = form.password.data.encode('utf-8')
            print('Entered pass:', password)
            cursor.execute('SELECT * FROM "user" WHERE email = %s', (email,))
            user_data = cursor.fetchone()
            cursor.close()
            conn.close()
            if user_data:
                db_password = user_data[2][2:]
                print("Hex pass:", db_password)
                hashed_db_password = binascii.unhexlify(db_password)
                print("Unhexed pass:", hashed_db_password)
                if bcrypt.checkpw(password, hashed_db_password):
                    print(user_data[0])
                    print(type(user_data[0]))
                    user = User(user_data[0], email, db_password)
                    login_user(user)
                    flash('Login successful!', 'success')
                    return redirect(url_for('dashboard'))
                else:
                    flash('Login failed. Please try again.', 'danger')
            else:
                flash('Login failed. Please try again.', 'danger')
        else:
            print("Form validation failed")
            print(form.errors)  # Print form validation errors
        return jsonify({"message": "User validate unsuccessfully"}), 201
        # return render_template('flasklogin.html', form=form)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    return render_template('flaskdashboard.html')


@app.route('/api/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('login'))


@app.route('/api/register', methods=['GET', 'POST'])
def register():
    print("hello")
    try:
        # Connect to the PostgreSQL database
        conn = psycopg2.connect(**db_connection_settings)
        cursor = conn.cursor()
        form = RegisterForm()
        # csrf_token = generate_csrf()

        if form.validate_on_submit():
            email = form.email.data
            hashed_password = bcrypt.hashpw(
                form.password.data.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                'INSERT INTO "user" (email, password) VALUES (%s, %s)', (email, hashed_password))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"message": "User added successfully"}), 201
        else:
            print("Form validation failed")
            print(form.errors)  # Print form validation errors
        return jsonify({"message": "User validate unsuccessfully"},), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    '''conn = psycopg2.connect(**db_connection_settings)
    form = RegisterForm()
    if form.validate_on_submit():
        email = form.email.data
        hashed_password = bcrypt.hashpw(
            form.password.data.encode('utf-8'), bcrypt.gensalt())
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO "user" (email, password) VALUES (%s, %s)', (email, hashed_password))
        conn.commit()
        cursor.close()
        conn.close()
        flash('Sign-up successful! You can now log in.', 'success')
        return redirect(url_for('login'))'''


if __name__ == "__main__":
    app.run(debug=True)
