# app_usuarios.py
from flask import Blueprint, jsonify, request
from .database import get_db_connection  # ou ajuste o import conforme o local da função

usuarios_bp = Blueprint('usuarios', __name__)

@usuarios_bp.route('/api/usuarios', methods=['GET', 'POST', 'DELETE'])
def usuarios():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT id, nome, email, perfil FROM usuarios")
        dados = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(dados)

    elif request.method == 'POST':
        data = request.get_json()
        nome = data.get('nome')
        email = data.get('email')
        senha = data.get('senha')
        perfil = data.get('perfil', 'Comum')

        if not all([nome, email, senha]):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        try:
            cursor.execute("""
                INSERT INTO usuarios (nome, email, senha, perfil)
                VALUES (%s, %s, %s, %s)
            """, (nome, email, senha, perfil))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Usuário cadastrado com sucesso!'}), 201
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500

    elif request.method == 'DELETE':
        user_id = request.args.get('id')
        if not user_id:
            return jsonify({'error': 'ID não fornecido'}), 400
        try:
            cursor.execute("DELETE FROM usuarios WHERE id = %s", (user_id,))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({'message': 'Usuário removido com sucesso'}), 200
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500
