
-- AvaliaTech: verificação de e-mail
-- Migração compatível com contas já existentes.
-- Executar uma única vez no banco de produção.

ALTER TABLE usuarios
  ADD COLUMN email_verificado TINYINT(1) NOT NULL DEFAULT 1;

CREATE TABLE verificacoes_email (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario_id INT UNSIGNED NOT NULL,
  codigo_hash CHAR(64) NOT NULL,
  expira_em DATETIME NOT NULL,
  tentativas INT UNSIGNED NOT NULL DEFAULT 0,
  enviado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_verificacoes_email_usuario (usuario_id),
  KEY idx_verificacoes_email_expira (expira_em),
  CONSTRAINT fk_verificacoes_email_usuario
    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
