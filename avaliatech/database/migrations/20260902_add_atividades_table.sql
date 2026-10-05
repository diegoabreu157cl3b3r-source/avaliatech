-- Cria tabela de log de atividades recentes do professor
CREATE TABLE IF NOT EXISTS atividades (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  tipo ENUM('questao_criada', 'questao_editada', 'questao_excluida', 'prova_gerada', 'prova_excluida') NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_atividades_usuario (usuario_id, created_at DESC),
  CONSTRAINT fk_atividades_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
