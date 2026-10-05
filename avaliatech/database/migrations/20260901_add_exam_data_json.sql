-- Adds support for storing the exact generated exam payload in JSON format.
-- Run once on databases created before this field was introduced.
ALTER TABLE provas
  ADD COLUMN dados_json LONGTEXT NULL AFTER valor_avaliacao;
