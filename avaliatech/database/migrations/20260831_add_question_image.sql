-- Adds support for the optional image attached to a question.
-- Run once on databases created before this field was introduced.
ALTER TABLE questoes
  ADD COLUMN imagem VARCHAR(255) NULL AFTER pergunta;
