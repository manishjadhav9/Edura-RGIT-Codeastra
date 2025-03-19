from functools import wraps

from flask import request, jsonify, current_app
import jwt
import sqlite3

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({}), 200
            
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'message': 'Token is missing'}), 403
            
        # Handle Bearer token format
        token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else auth_header
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            conn = get_db_connection()
            try:
                cursor = conn.cursor()
                # Use case-insensitive table name and fetch by email instead of username
                cursor.execute("SELECT id, role, username FROM users WHERE email = ?", (data['email'],))
                user_info = cursor.fetchone()
                
                if not user_info:
                    return jsonify({'message': 'User not found'}), 404
                    
                # Update token data with user info
                data['user_id'] = user_info['id']
                data['role'] = user_info['role']
                data['username'] = user_info['username']
                request.token_data = data
                
                return f(*args, **kwargs)
            finally:
                conn.close()
                
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 403
            
    return decorated_function

