from flask import Blueprint, jsonify, request, send_file
from utils import get_db_connection, token_required
import io
from datetime import datetime

notes = Blueprint('notes', __name__)

@notes.route('/upload', methods=['POST'])
@token_required
def upload_note():
    """
    Upload a new note with PDF content.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format (multipart/form-data):
    - title: Title of the note
    - description: Description of the note (optional)
    - pdf_file: PDF file to upload
    
    Success Response (201):
    {
        "success": true,
        "message": "Note uploaded successfully",
        "note_id": 1,
        "points_earned": 100
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Missing required fields or invalid PDF"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    if 'pdf_file' not in request.files:
        return jsonify({"success": False, "message": "No PDF file provided"}), 400
        
    pdf_file = request.files['pdf_file']
    if pdf_file.filename == '' or not pdf_file.filename.lower().endswith('.pdf'):
        return jsonify({"success": False, "message": "Invalid or no PDF file provided"}), 400
    
    title = request.form.get('title')
    description = request.form.get('description')
    
    if not title:
        return jsonify({"success": False, "message": "Title is required"}), 400
    
    pdf_content = pdf_file.read()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Insert the note
        cursor.execute('''
            INSERT INTO notes (user_id, title, description, pdf_content)
            VALUES (?, ?, ?, ?)
        ''', (user_id, title, description, pdf_content))
        
        note_id = cursor.lastrowid
        
        # Award points to the user
        cursor.execute('''
            UPDATE users
            SET exp = exp + 100
            WHERE id = ?
        ''', (user_id,))
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Note uploaded successfully",
            "note_id": note_id,
            "points_earned": 100
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Upload failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/user/<int:user_id>', methods=['GET'])
@token_required
def get_user_notes(user_id):
    """
    Get all notes uploaded by a specific user.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 2,
        "notes": [
            {
                "id": 1,
                "title": "Note Title",
                "description": "Note Description",
                "upvote_count": 5,
                "downvote_count": 1,
                "created_at": "2024-03-20T10:00:00"
            },
            ...
        ]
    }
    """
    token_data = request.token_data
    
    # Check if user is requesting their own notes or if admin is requesting
    if token_data['user_id'] != user_id and token_data['role'] != 'admin':
        return jsonify({"success": False, "message": "Unauthorized access"}), 403
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, title, description, upvote_count, downvote_count, created_at
            FROM notes
            WHERE user_id = ?
            ORDER BY created_at DESC
        ''', (user_id,))
        notes = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(notes),
            "notes": [dict(note) for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch notes: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/all', methods=['GET'])
@token_required
def get_all_notes():
    """
    Get all notes with their basic information.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "total_count": 2,
        "notes": [
            {
                "id": 1,
                "user_id": 1,
                "username": "johndoe",
                "title": "Note Title",
                "description": "Note Description",
                "upvote_count": 5,
                "downvote_count": 1,
                "created_at": "2024-03-20T10:00:00"
            },
            ...
        ]
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT n.id, n.user_id, u.username, n.title, n.description, 
                   n.upvote_count, n.downvote_count, n.created_at
            FROM notes n
            JOIN users u ON n.user_id = u.id
            ORDER BY n.created_at DESC
        ''')
        notes = cursor.fetchall()
        
        return jsonify({
            "success": True,
            "total_count": len(notes),
            "notes": [dict(note) for note in notes]
        }), 200
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Failed to fetch notes: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/download/<int:note_id>', methods=['GET'])
@token_required
def download_note(note_id):
    """
    Download a specific note's PDF content.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response:
    PDF file download
    
    Error Response (404):
    {
        "success": false,
        "message": "Note not found"
    }
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT title, pdf_content
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        return send_file(
            io.BytesIO(note['pdf_content']),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f"{note['title']}.pdf"
        )
        
    except Exception as e:
        return jsonify({"success": False, "message": f"Download failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/<int:note_id>', methods=['DELETE'])
@token_required
def delete_note(note_id):
    """
    Delete a specific note.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Success Response (200):
    {
        "success": true,
        "message": "Note deleted successfully"
    }
    
    Error Response (403):
    {
        "success": false,
        "message": "Unauthorized to delete this note"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user owns the note or is admin
        cursor.execute('SELECT user_id FROM notes WHERE id = ?', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
            
        if note['user_id'] != user_id and token_data['role'] != 'admin':
            return jsonify({"success": False, "message": "Unauthorized to delete this note"}), 403
        
        cursor.execute('DELETE FROM notes WHERE id = ?', (note_id,))
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Note deleted successfully"
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Delete failed: {str(e)}"}), 500
    finally:
        conn.close()

@notes.route('/<int:note_id>/vote', methods=['POST'])
@token_required
def vote_note(note_id):
    """
    Upvote or downvote a note.
    
    Headers Required:
    - Authorization: Bearer <jwt_token>
    
    Request Format:
    {
        "vote_type": "up" or "down"
    }
    
    Success Response (200):
    {
        "success": true,
        "message": "Vote recorded successfully",
        "upvote_count": 6,
        "downvote_count": 1
    }
    
    Error Response (400):
    {
        "success": false,
        "message": "Invalid vote type"
    }
    """
    token_data = request.token_data
    user_id = token_data['user_id']
    
    vote_type = request.json.get('vote_type')
    if vote_type not in ['up', 'down']:
        return jsonify({"success": False, "message": "Invalid vote type"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if note exists
        cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
        note = cursor.fetchone()
        
        if not note:
            return jsonify({"success": False, "message": "Note not found"}), 404
        
        # Update vote count
        if vote_type == 'up':
            cursor.execute('''
                UPDATE notes
                SET upvote_count = upvote_count + 1
                WHERE id = ?
            ''', (note_id,))
        else:
            cursor.execute('''
                UPDATE notes
                SET downvote_count = downvote_count + 1
                WHERE id = ?
            ''', (note_id,))
        
        # Get updated vote counts
        cursor.execute('''
            SELECT upvote_count, downvote_count
            FROM notes
            WHERE id = ?
        ''', (note_id,))
        updated_note = cursor.fetchone()
        
        conn.commit()
        
        return jsonify({
            "success": True,
            "message": "Vote recorded successfully",
            "upvote_count": updated_note['upvote_count'],
            "downvote_count": updated_note['downvote_count']
        }), 200
        
    except Exception as e:
        conn.rollback()
        return jsonify({"success": False, "message": f"Voting failed: {str(e)}"}), 500
    finally:
        conn.close()
