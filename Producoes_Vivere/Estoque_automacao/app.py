from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS


app = Flask(__name__)

# Configurar CORS para aceitar requisições do front-end
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:8080",
    "http://192.168.15.21:8080",
    "http://192.168.84.5:8080",
])

def get_db_connection():
    return mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='Art_@2002',
        database='vivere_estoque'
    )

@app.route('/')
def home():
    return "Servidor Flask rodando! Acesse /api/logs para ver os logs."

# --------------------- LOGS ---------------------

@app.route('/api/logs', methods=['GET'])
def listar_logs():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT l.id, l.acao, l.descricao, l.rota_afetada, l.data_hora, u.nome AS usuario
        FROM logs l
        JOIN usuarios u ON u.id = l.usuario_id
        ORDER BY l.data_hora DESC
    """)
    logs = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(logs)

# --------------------- INVENTÁRIO ---------------------

@app.route('/api/inventario', methods=['GET', 'POST'])
def inventario():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT id, categoria, material, quantidade FROM inventario")
        inventario = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(inventario)

    elif request.method == 'POST':
        dados = request.get_json()
        categoria = dados.get('categoria')
        material = dados.get('material')
        quantidade = dados.get('quantidade')

        if not (categoria and material and isinstance(quantidade, int)):
            cursor.close()
            conn.close()
            return jsonify({"error": "Dados inválidos"}), 400

        try:
            cursor.execute(
                "INSERT INTO inventario (categoria, material, quantidade) VALUES (%s, %s, %s)",
                (categoria, material, quantidade)
            )
            conn.commit()
            novo_id = cursor.lastrowid
            cursor.close()
            conn.close()
            return jsonify({
                "id": novo_id,
                "categoria": categoria,
                "material": material,
                "quantidade": quantidade
            }), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({"error": str(e)}), 500

# --------------------- MATERIAIS ---------------------

@app.route('/api/materiais', methods=['GET'])
def listar_materiais():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("SELECT DISTINCT material AS nome_item, categoria FROM inventario WHERE material IS NOT NULL")
        materiais = cursor.fetchall()
        for idx, item in enumerate(materiais):
            item["id"] = idx + 1
    except Exception as e:
        materiais = [{"id": 0, "nome_item": "Erro ao buscar", "categoria": str(e)}]

    cursor.close()
    conn.close()
    return jsonify(materiais)

# --------------------- NOVA ROTA: ALOCAÇÕES POR DEPÓSITO ---------------------

@app.route('/api/alocacoes/deposito/<int:deposito_id>', methods=['GET'])
def alocacoes_por_deposito(deposito_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT material, quantidade, data_alocacao, observacao
            FROM alocacoes
            WHERE deposito = %s
            ORDER BY data_alocacao DESC
        """, (deposito_id,))
        alocacoes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(alocacoes)
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# --------------------- DEPÓSITOS ---------------------

@app.route('/api/depositos', methods=['GET', 'POST'])
def depositos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT COUNT(*) AS total FROM depositos")
        total = cursor.fetchone()['total']
        if total == 0:
            exemplos = [
                ("Depósito Maricá Centro", "Rua Projetada, Centro - Maricá"),
                ("Depósito Maricá Itaipuaçu", "Av. Um, Itaipuaçu - Maricá")
            ]
            for nome, endereco in exemplos:
                cursor.execute("INSERT INTO depositos (nome, endereco) VALUES (%s, %s)", (nome, endereco))
            conn.commit()
        cursor.execute("SELECT id, nome AS nome_deposito, endereco FROM depositos")
        dados = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(dados)

    elif request.method == 'POST':
        dados = request.get_json()
        nome = dados.get('nome_deposito')
        endereco = dados.get('endereco')

        if not (nome and endereco):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        try:
            cursor.execute("INSERT INTO depositos (nome, endereco) VALUES (%s, %s)", (nome, endereco))
            conn.commit()
            novo_id = cursor.lastrowid
            cursor.close()
            conn.close()
            return jsonify({'id': novo_id, 'nome_deposito': nome, 'endereco': endereco}), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500

@app.route('/api/depositos/<int:deposito_id>', methods=['PUT'])
def atualizar_deposito(deposito_id):
    dados = request.get_json()
    nome = dados.get('nome_deposito')
    endereco = dados.get('endereco')

    if not (nome and endereco):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE depositos SET nome=%s, endereco=%s WHERE id=%s
        """, (nome, endereco, deposito_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'id': deposito_id, 'nome_deposito': nome, 'endereco': endereco})
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# --------------------- EVENTOS ---------------------

@app.route('/api/eventos', methods=['GET', 'POST'])
def eventos():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT COUNT(*) AS total FROM eventos")
        total = cursor.fetchone()['total']
        if total == 0:
            cursor.execute("SELECT material FROM inventario LIMIT 3")
            materiais = [row['material'] for row in cursor.fetchall()]
            exemplos = [
                ("Montagem Palco", "Cliente A", "Confirmado", "2025-08-01", "2025-08-05"),
                ("Feira Exposição", "Cliente B", "Pendente", "2025-09-10", "2025-09-12"),
                ("Show Maricá", "Cliente C", "Concluído", "2025-07-15", "2025-07-16")
            ]
            for i, (nome, cliente, status, inicio, fim) in enumerate(exemplos):
                material = materiais[i % len(materiais)] if materiais else "Treliça Q30"
                cursor.execute("""
                    INSERT INTO eventos (nome_evento, cliente, status, data_inicio, data_fim)
                    VALUES (%s, %s, %s, %s, %s)
                """, (f"{nome} com {material}", cliente, status, inicio, fim))
            conn.commit()
        cursor.execute("SELECT id, nome_evento, cliente, status, data_inicio, data_fim FROM eventos")
        eventos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(eventos)

    elif request.method == 'POST':
        dados = request.get_json()
        nome_evento = dados.get('nome_evento')
        cliente = dados.get('cliente')
        status = dados.get('status', 'Confirmado')
        data_inicio = dados.get('data_inicio')
        data_fim = dados.get('data_fim')

        if not (nome_evento and cliente and data_inicio and data_fim):
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        try:
            cursor.execute("""
                INSERT INTO eventos (nome_evento, cliente, status, data_inicio, data_fim)
                VALUES (%s, %s, %s, %s, %s)
            """, (nome_evento, cliente, status, data_inicio, data_fim))
            conn.commit()
            novo_id = cursor.lastrowid
            cursor.close()
            conn.close()
            return jsonify({
                'id': novo_id,
                'nome_evento': nome_evento,
                'cliente': cliente,
                'status': status,
                'data_inicio': data_inicio,
                'data_fim': data_fim
            }), 201
        except Exception as e:
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500

@app.route('/api/eventos/<int:evento_id>', methods=['PUT'])
def atualizar_evento(evento_id):
    dados = request.get_json()
    nome_evento = dados.get('nome_evento')
    cliente = dados.get('cliente')
    status = dados.get('status')
    data_inicio = dados.get('data_inicio')
    data_fim = dados.get('data_fim')

    if not (nome_evento and cliente and status and data_inicio and data_fim):
        return jsonify({'error': 'Campos obrigatórios faltando'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE eventos SET nome_evento=%s, cliente=%s, status=%s, data_inicio=%s, data_fim=%s
            WHERE id=%s
        """, (nome_evento, cliente, status, data_inicio, data_fim, evento_id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({
            'id': evento_id,
            'nome_evento': nome_evento,
            'cliente': cliente,
            'status': status,
            'data_inicio': data_inicio,
            'data_fim': data_fim
        })
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500

# --------------------- ESTOQUE ---------------------

@app.route('/api/estoque', methods=['GET', 'POST'])
def gerenciar_estoque():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("SELECT id, material, categoria, quantidade FROM inventario ORDER BY categoria")
        estoque = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(estoque)

    elif request.method == 'POST':
        dados = request.get_json()
        material_id = dados.get('material_id')
        quantidade = dados.get('quantidade')
        observacao = dados.get('observacao', '')

        if not (material_id and isinstance(quantidade, int) and quantidade > 0):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Dados inválidos. Informe material_id (str) e quantidade (> 0).'}), 400

        try:
            cursor.execute("SELECT id, material FROM inventario WHERE id = %s", (material_id,))
            material = cursor.fetchone()
            if not material:
                cursor.close()
                conn.close()
                return jsonify({'error': 'Material não encontrado'}), 404

            cursor.execute("UPDATE inventario SET quantidade = quantidade + %s WHERE id = %s", (quantidade, material_id))

            cursor.execute("""
                INSERT INTO logs_estoque (acao, material, quantidade, observacao, data)
                VALUES (%s, %s, %s, %s, NOW())
            """, ('entrada', material['material'], quantidade, observacao))

            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({
                'message': 'Estoque atualizado com sucesso',
                'material_id': material_id,
                'material': material['material'],
                'quantidade_adicionada': quantidade
            }), 200

        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500

# --------------------- ALOCAÇÕES ---------------------

@app.route('/api/alocacoes', methods=['GET', 'POST'])
def alocacoes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'GET':
        cursor.execute("""
            SELECT a.id, a.material, d.nome AS deposito, a.quantidade, a.data_alocacao, a.observacao
            FROM alocacoes a
            JOIN depositos d ON a.deposito = d.id
            ORDER BY a.data_alocacao DESC
        """)
        alocacoes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(alocacoes)

    elif request.method == 'POST':
        dados = request.get_json()
        material = dados.get('material')
        quantidade = dados.get('quantidade')
        observacao = dados.get('observacao', '')

        if not (material and isinstance(quantidade, int) and quantidade > 0):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Dados inválidos'}), 400

        try:
            # IDs fixos dos depósitos (ajuste se forem diferentes no banco)
            id_marica = 1
            id_itaipuacu = 2

            qtd_marica = int(quantidade * 0.7)
            qtd_itaipuacu = quantidade - qtd_marica

            # Inserir Maricá Centro
            cursor.execute("""
                INSERT INTO alocacoes (material, deposito, quantidade, observacao)
                VALUES (%s, %s, %s, %s)
            """, (material, id_marica, qtd_marica, observacao + " (70%)"))

            # Inserir Itaipuaçu
            cursor.execute("""
                INSERT INTO alocacoes (material, deposito, quantidade, observacao)
                VALUES (%s, %s, %s, %s)
            """, (material, id_itaipuacu, qtd_itaipuacu, observacao + " (30%)"))

            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({
                "message": "Alocação dividida entre os depósitos com sucesso.",
                "material": material,
                "quantidade_total": quantidade,
                "divisao": {
                    "marica_centro": qtd_marica,
                    "itaipuacu": qtd_itaipuacu
                }
            }), 201
        except Exception as e:
            conn.rollback()
            cursor.close()
            conn.close()
            return jsonify({'error': str(e)}), 500


@app.route('/api/alocacoes/<int:alocacao_id>', methods=['PUT'])
def atualizar_alocacao(alocacao_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    dados = request.get_json()

    novo_deposito = dados.get('deposito')
    nova_quantidade = dados.get('quantidade')
    nova_obs = dados.get('observacao', '')

    if not (novo_deposito and isinstance(nova_quantidade, int) and nova_quantidade > 0):
        return jsonify({'error': 'Dados inválidos'}), 400

    try:
        cursor.execute("SELECT * FROM alocacoes WHERE id = %s", (alocacao_id,))
        existente = cursor.fetchone()

        if not existente:
            cursor.close()
            conn.close()
            return jsonify({'error': 'Alocação não encontrada'}), 404

        cursor.execute("""
            UPDATE alocacoes SET deposito=%s, quantidade=%s, observacao=%s
            WHERE id=%s
        """, (novo_deposito, nova_quantidade, nova_obs, alocacao_id))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Alocação atualizada com sucesso",
            "id": alocacao_id,
            "material": existente["material"],
            "novo_deposito": novo_deposito,
            "quantidade": nova_quantidade,
            "observacao": nova_obs
        }), 200

    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        return jsonify({'error': str(e)}), 500



# --------------------- USUÁRIOS ---------------------
@app.route('/api/usuarios', methods=['GET', 'POST', 'DELETE'])
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
        perfil = data.get('perfil', 'Comum')  # <- Alterado de tipo para perfil

        if not all([nome, email, senha]):
            cursor.close()
            conn.close()
            return jsonify({'error': 'Campos obrigatórios faltando'}), 400

        try:
            cursor.execute("""
                INSERT INTO usuarios (nome, email, senha, perfil)
                VALUES (%s, %s, %s, %s)
            """, (nome, email, senha, perfil))  # <- Atualizado para usar perfil
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


from servicos.estoque import EstoqueService

def main():
    estoque = EstoqueService()
    # Interface de terminal (opcional)

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        app.run(host="0.0.0.0", port=5000, debug=True)
    else:
        main()
