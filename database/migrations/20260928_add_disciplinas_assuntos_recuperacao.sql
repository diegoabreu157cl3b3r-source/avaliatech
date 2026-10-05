-- Migration: Add disciplinas, assuntos, and recuperacao_senha tables
-- Date: 2026-09-28

USE avaliatech;

-- 1. Tabela de Disciplinas vinculada ao usuário
CREATE TABLE IF NOT EXISTS disciplinas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_usuario_disciplina (usuario_id, nome),
  KEY idx_disciplinas_usuario (usuario_id),
  CONSTRAINT fk_disciplinas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabela de Assuntos vinculada à disciplina e ao usuário
CREATE TABLE IF NOT EXISTS assuntos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  disciplina_id INT UNSIGNED NOT NULL,
  usuario_id INT UNSIGNED NOT NULL,
  nome VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_disciplina_assunto (disciplina_id, nome),
  KEY idx_assuntos_disciplina (disciplina_id),
  KEY idx_assuntos_usuario (usuario_id),
  CONSTRAINT fk_assuntos_disciplina
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_assuntos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tabela de Recuperação de Senha com tokens seguros
CREATE TABLE IF NOT EXISTS recuperacao_senha (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expira_em DATETIME NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_recuperacao_usuario (usuario_id),
  KEY idx_recuperacao_token (token_hash),
  CONSTRAINT fk_recuperacao_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Migração de dados existentes em questoes para disciplinas e assuntos
INSERT IGNORE INTO disciplinas (usuario_id, nome)
SELECT DISTINCT usuario_id, TRIM(disciplina)
FROM questoes
WHERE disciplina IS NOT NULL AND TRIM(disciplina) != '';

INSERT IGNORE INTO assuntos (disciplina_id, usuario_id, nome)
SELECT DISTINCT d.id, q.usuario_id, TRIM(q.assunto)
FROM questoes q
JOIN disciplinas d ON d.usuario_id = q.usuario_id AND d.nome = TRIM(q.disciplina)
WHERE q.assunto IS NOT NULL AND TRIM(q.assunto) != '';

-- 5. Adicionar colunas disciplina_id e assunto_id na tabela questoes se não existirem
SET @dbname = DATABASE();
SET @tablename = 'questoes';

SET @col1_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = @dbname AND table_name = @tablename AND column_name = 'disciplina_id'
);

SET @sql1 = IF(@col1_exists = 0, 'ALTER TABLE questoes ADD COLUMN disciplina_id INT UNSIGNED NULL AFTER usuario_id;', 'SELECT 1;');
PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

SET @col2_exists = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = @dbname AND table_name = @tablename AND column_name = 'assunto_id'
);

SET @sql2 = IF(@col2_exists = 0, 'ALTER TABLE questoes ADD COLUMN assunto_id INT UNSIGNED NULL AFTER disciplina_id;', 'SELECT 1;');
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 6. Atualizar questoes com os IDs correspondentes
UPDATE questoes q
JOIN disciplinas d ON d.usuario_id = q.usuario_id AND d.nome = TRIM(q.disciplina)
SET q.disciplina_id = d.id
WHERE q.disciplina_id IS NULL;

UPDATE questoes q
JOIN assuntos a ON a.usuario_id = q.usuario_id AND a.disciplina_id = q.disciplina_id AND a.nome = TRIM(q.assunto)
SET q.assunto_id = a.id
WHERE q.assunto_id IS NULL;

