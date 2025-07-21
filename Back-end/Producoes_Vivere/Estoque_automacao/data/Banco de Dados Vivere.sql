USE vivere_estoque

CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(100),
    material VARCHAR(255) NOT NULL,
    quantidade INT DEFAULT 0,
    observacoes TEXT
);

SELECT * FROM inventario;

SELECT * FROM inventario
WHERE quantidade < 10
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%treliça%'
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%fechamento%'
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%MÃO FRANCESA%'
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%calha%'
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%parafuso%'
ORDER BY quantidade ASC;

SELECT * FROM inventario
WHERE material LIKE '%tenda%'
ORDER BY quantidade ASC;

SHOW CREATE TABLE materiais;


DROP TABLE IF EXISTS movimentos;
DELETE FROM movimentos LIMIT 10000;
SELECT COUNT(*) FROM movimentos;

SELECT material,categoria, quantidade FROM inventario;




CREATE TABLE movimentos (
    id_movimento INT AUTO_INCREMENT PRIMARY KEY,
    material VARCHAR(255) NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    horario DATETIME NOT NULL
);


CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT,
  acao VARCHAR(255),
  descricao TEXT,
  rota_afetada VARCHAR(255),
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
);


USE vivere_estoque;
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);
INSERT INTO usuarios (nome) VALUES ('Admin'), ('UsuarioTeste');
SELECT * FROM usuarios;
SHOW TABLES;
SELECT * FROM inventario LIMIT 5;
SELECT * FROM materiais LIMIT 5;
SELECT * FROM categorias LIMIT 5;


CREATE TABLE alocacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material VARCHAR(255) NOT NULL,
    deposito VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    data_alocacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT
);



CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_evento VARCHAR(255) NOT NULL,
    cliente VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Confirmado',
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL
);

CREATE TABLE depositos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL
);

SELECT * FROM inventario;
CREATE TABLE logs_estoque (
  id INT AUTO_INCREMENT PRIMARY KEY,
  acao VARCHAR(20),
  material VARCHAR(255),
  quantidade INT,
  observacao TEXT,
  data DATETIME
);
SELECT * FROM logs_estoque;
Show tables;
Select * FROM inventario;
SELECT * FROM usuarios;
SELECT * FROM alocacoes ORDER BY data_alocacao DESC;
ALTER TABLE alocacoes ADD COLUMN categoria VARCHAR(100);
DESC usuarios;
ALTER TABLE usuarios
ADD COLUMN email VARCHAR(100) NOT NULL,
ADD COLUMN senha VARCHAR(100) NOT NULL,
ADD COLUMN perfil VARCHAR(50) DEFAULT 'Comum';




