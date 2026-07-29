CREATE DATABASE IF NOT EXISTS avaliatech
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE avaliatech;

DROP TABLE IF EXISTS provas;
DROP TABLE IF EXISTS questoes;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  logo_base64 LONGTEXT NULL,
  logo_mime VARCHAR(50) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuarios_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE questoes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  pergunta TEXT NOT NULL,
  alternativa_a TEXT NOT NULL,
  alternativa_b TEXT NOT NULL,
  alternativa_c TEXT NOT NULL,
  alternativa_d TEXT NOT NULL,
  correta ENUM('A', 'B', 'C', 'D') NOT NULL,
  disciplina VARCHAR(120) NOT NULL,
  assunto VARCHAR(120) NOT NULL,
  dificuldade ENUM('Fácil', 'Média', 'Difícil') NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_questoes_usuario (usuario_id),
  KEY idx_questoes_filtros (usuario_id, disciplina, assunto, dificuldade),
  FULLTEXT KEY ft_questoes_busca (pergunta, disciplina, assunto),
  CONSTRAINT fk_questoes_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE provas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  escola VARCHAR(160) NOT NULL,
  professor VARCHAR(120) NOT NULL,
  disciplina VARCHAR(120) NOT NULL,
  assunto VARCHAR(120) NOT NULL,
  dificuldade ENUM('Fácil', 'Média', 'Difícil') NOT NULL,
  quantidade_questoes INT NOT NULL,
  versao VARCHAR(10) NOT NULL DEFAULT 'A/B',
  data_prova DATE NULL,
  valor_avaliacao VARCHAR(30) NULL,
  data_geracao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_provas_usuario (usuario_id),
  KEY idx_provas_filtros (usuario_id, disciplina, assunto, dificuldade),
  CONSTRAINT fk_provas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT ck_provas_quantidade
    CHECK (quantidade_questoes IN (10, 15, 20, 25))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
