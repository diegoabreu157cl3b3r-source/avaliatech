-- Migration: Add targeted performance indexes for fast pagination, sorting, and exam generation
-- Date: 2026-09-28

USE avaliatech;

SET @dbname = DATABASE();

-- 1. Index em questoes(usuario_id, created_at DESC) para ordenação de paginação e consultas recentes
SET @idx1_exists = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = @dbname AND table_name = 'questoes' AND index_name = 'idx_questoes_usuario_created'
);
SET @sql1 = IF(@idx1_exists = 0, 'ALTER TABLE questoes ADD INDEX idx_questoes_usuario_created (usuario_id, created_at DESC);', 'SELECT 1;');
PREPARE stmt1 FROM @sql1;
EXECUTE stmt1;
DEALLOCATE PREPARE stmt1;

-- 2. Index em provas(usuario_id, created_at DESC) para paginação do histórico
SET @idx2_exists = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = @dbname AND table_name = 'provas' AND index_name = 'idx_provas_usuario_created'
);
SET @sql2 = IF(@idx2_exists = 0, 'ALTER TABLE provas ADD INDEX idx_provas_usuario_created (usuario_id, created_at DESC);', 'SELECT 1;');
PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- 3. Index em questoes(usuario_id, disciplina, dificuldade) para otimização de busca na geração de prova
SET @idx3_exists = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = @dbname AND table_name = 'questoes' AND index_name = 'idx_questoes_usuario_disc_dif'
);
SET @sql3 = IF(@idx3_exists = 0, 'ALTER TABLE questoes ADD INDEX idx_questoes_usuario_disc_dif (usuario_id, disciplina, dificuldade);', 'SELECT 1;');
PREPARE stmt3 FROM @sql3;
EXECUTE stmt3;
DEALLOCATE PREPARE stmt3;

