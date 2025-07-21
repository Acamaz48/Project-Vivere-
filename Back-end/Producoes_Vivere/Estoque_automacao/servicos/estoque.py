import mysql.connector
from modelos.movimento import Movimento
from modelos.equipamentos import Equipamento
from datetime import datetime
from tabulate import tabulate
from contextlib import contextmanager

class EstoqueService:
    def __init__(self):
        # Dados da conexão mantidos aqui
        self.db_config = {
            'host': '127.0.0.1',
            'user': 'root',
            'password': 'Art_@2002',
            'database': 'vivere_estoque'
        }

    @contextmanager
    def _get_connection(self):
        conn = mysql.connector.connect(**self.db_config)
        try:
            yield conn
        finally:
            conn.close()

    def registrar_movimento(self, nome_material, tipo, quantidade):
        with self._get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            try:
                cursor.execute("SELECT material, quantidade FROM inventario WHERE material = %s", (nome_material,))
                equipamento = cursor.fetchone()
                if not equipamento:
                    raise ValueError("Equipamento não encontrado.")

                quantidade = int(quantidade)
                if tipo not in ["entrada", "saida"]:
                    raise ValueError("Tipo inválido.")

                if tipo == "saida" and equipamento['quantidade'] < quantidade:
                    raise ValueError("Quantidade insuficiente para saída.")

                nova_quantidade = equipamento['quantidade'] + quantidade if tipo == "entrada" else equipamento['quantidade'] - quantidade

                cursor.execute(
                    "UPDATE inventario SET quantidade = %s WHERE material = %s",
                    (nova_quantidade, nome_material)
                )

                horario = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                cursor.execute(
                    "INSERT INTO movimentos (material, tipo, quantidade, horario) VALUES (%s, %s, %s, %s)",
                    (nome_material, tipo, quantidade, horario)
                )
                conn.commit()
            finally:
                cursor.close()

    def mostrar_disponiveis(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT material, categoria, quantidade FROM inventario WHERE quantidade > 0")
                dados = cursor.fetchall()
                if not dados:
                    print("Nenhum material disponível.")
                    return
                print(tabulate(dados, headers=["Material", "Categoria", "Quantidade"], tablefmt="fancy_grid", stralign="center"))
            finally:
                cursor.close()

    def listar_movimentacoes(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT material, tipo, quantidade, horario FROM movimentos")
                dados = cursor.fetchall()
                if not dados:
                    print("Nenhuma movimentação registrada.")
                    return
                print(tabulate(dados, headers=["Material", "Tipo", "Quantidade", "Horário"], tablefmt="fancy_grid", stralign="center"))
            finally:
                cursor.close()

    def adicionar_equipamento(self, nome_material, quantidade, categoria=""):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT COUNT(*) FROM inventario WHERE material = %s", (nome_material,))
                if cursor.fetchone()[0] > 0:
                    raise ValueError("Equipamento já existe.")
                cursor.execute(
                    "INSERT INTO inventario (material, categoria, quantidade) VALUES (%s, %s, %s)",
                    (nome_material, categoria, quantidade)
                )
                conn.commit()
            finally:
                cursor.close()

    def remover_equipamento(self, nome_material):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("DELETE FROM inventario WHERE material = %s", (nome_material,))
                conn.commit()
            finally:
                cursor.close()

    def buscar_equipamento(self, nome_material):
        with self._get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            try:
                cursor.execute("SELECT material, quantidade FROM inventario WHERE material = %s", (nome_material,))
                row = cursor.fetchone()
                return {"material": row["material"], "quantidade": row["quantidade"]} if row else None
            finally:
                cursor.close()

    def listar_equipamentos(self):
        with self._get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            try:
                cursor.execute("SELECT material, categoria, quantidade FROM inventario")
                return cursor.fetchall()
            finally:
                cursor.close()

    def listar_por_categoria(self, nome_categoria):
        with self._get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            try:
                cursor.execute(
                    "SELECT material, quantidade FROM inventario WHERE categoria = %s AND quantidade > 0",
                    (nome_categoria,)
                )
                return cursor.fetchall()
            finally:
                cursor.close()

    def listar_categorias(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT DISTINCT categoria FROM inventario")
                return [row[0] for row in cursor.fetchall()]
            finally:
                cursor.close()

    def limpar_estoque(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("DELETE FROM inventario")
                cursor.execute("DELETE FROM movimentos")
                conn.commit()
            finally:
                cursor.close()

    def verificar_estoque(self, nome_material):
        equipamento = self.buscar_equipamento(nome_material)
        return equipamento is not None and equipamento['quantidade'] > 0

    def calcular_total_estoque(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT SUM(quantidade) FROM inventario")
                total = cursor.fetchone()[0]
                return total or 0
            finally:
                cursor.close()

    def calcular_total_movimentos(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT COUNT(*) FROM movimentos")
                total = cursor.fetchone()[0]
                return total or 0
            finally:
                cursor.close()

    # 🔽 MÉTODOS PARA API

    def obter_inventario(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT material, categoria, quantidade FROM inventario")
                rows = cursor.fetchall()
                return [{"material": r[0], "categoria": r[1], "quantidade": r[2]} for r in rows]
            finally:
                cursor.close()

    def obter_movimentacoes(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute("SELECT material, tipo, quantidade, horario FROM movimentos")
                rows = cursor.fetchall()
                return [{"material": r[0], "tipo": r[1], "quantidade": r[2], "horario": r[3].strftime("%Y-%m-%d %H:%M:%S")} for r in rows]
            finally:
                cursor.close()

    def obter_materiais_por_categoria(self, categoria):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(
                    "SELECT material, quantidade FROM inventario WHERE categoria = %s AND quantidade > 0",
                    (categoria,)
                )
                rows = cursor.fetchall()
                return [{"material": r[0], "quantidade": r[1]} for r in rows]
            finally:
                cursor.close()
