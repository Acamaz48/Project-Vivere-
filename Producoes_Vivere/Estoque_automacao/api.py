from flask import Flask, jsonify, request
from flask_cors import CORS
from servicos.estoque import EstoqueService

app = Flask(__name__)

# Configurar CORS para aceitar requisições do front-end (modifique os hosts conforme sua rede)
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:8080",
    "http://192.168.15.21:8080",
    "http://192.168.84.5:8080",
])

estoque = EstoqueService()

@app.route("/api/inventario", methods=["GET"])
def listar_inventario():
    inventario = estoque.obter_inventario()
    return jsonify(inventario)

@app.route("/api/categorias", methods=["GET"])
def listar_categorias():
    categorias = estoque.listar_categorias()
    return jsonify(categorias)

@app.route("/api/materiais/<categoria>", methods=["GET"])
def listar_por_categoria(categoria):
    materiais = estoque.obter_materiais_por_categoria(categoria)
    return jsonify(materiais)

@app.route("/api/movimentos", methods=["GET"])
def listar_movimentos():
    movimentos = estoque.obter_movimentacoes()
    return jsonify(movimentos)

@app.route("/api/movimentos", methods=["POST"])
def registrar_movimento():
    data = request.json
    nome = data.get("nome")
    tipo = data.get("tipo")
    quantidade = data.get("quantidade")

    if not all([nome, tipo, quantidade]):
        return jsonify({"erro": "Dados incompletos"}), 400

    try:
        estoque.registrar_movimento(nome, tipo, int(quantidade))
        return jsonify({"mensagem": "Movimento registrado com sucesso!"})
    except Exception as e:
        return jsonify({"erro": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
