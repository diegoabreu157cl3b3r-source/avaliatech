-- Permite armazenar modos como 'Balanceada' e 'Personalizada' na dificuldade da prova
ALTER TABLE provas
  MODIFY COLUMN dificuldade VARCHAR(50) NOT NULL;
