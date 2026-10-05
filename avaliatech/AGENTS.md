# AGENTS.md

# AvaliaTech - Agent Guide

## Objetivo

Este arquivo complementa as Instruções do Projeto.

Não substitui as instruções do ChatGPT.

Seu objetivo é orientar agentes que trabalham diretamente no repositório (Codex, ChatGPT Agent, Claude Code, Gemini CLI, etc.).

---

# Fluxo obrigatório

Antes de modificar qualquer arquivo:

1. Analise toda a estrutura do projeto.
2. Identifique dependências.
3. Localize implementações relacionadas.
4. Leia os arquivos necessários.
5. Somente depois comece a alterar o código.

Nunca implemente imediatamente.

---

# Alterações

Sempre faça alterações pequenas.

Evite modificar muitos arquivos na mesma tarefa.

Cada mudança deve resolver apenas um problema ou implementar apenas uma funcionalidade.

---

# Reutilização

Antes de criar:

- componentes
- hooks
- services
- utilitários
- tipos
- páginas
- APIs

verifique se já existe algo semelhante.

Nunca duplique código.

---

# Arquitetura

Respeite a arquitetura existente.

Não altere:

- estrutura de pastas
- convenções
- rotas
- contratos da API

sem necessidade.

Caso considere uma mudança melhor, explique antes.

---

# Código

Priorizar:

- legibilidade
- simplicidade
- reutilização
- TypeScript forte

Evitar:

- any
- código morto
- duplicação
- funções muito grandes
- componentes gigantes

---

# Segurança

Nunca remover:

- autenticação
- autorização
- validações
- sanitização
- tratamento de erros

Sempre preservar o comportamento existente.

---

# Banco de Dados

Nunca modificar migrations antigas.

Sempre criar novas migrations.

Nunca apagar tabelas automaticamente.

Nunca alterar schemas existentes sem analisar impactos.

---

# Dependências

Antes de instalar uma biblioteca:

Verifique se já existe outra dependência capaz de resolver o problema.

Evite adicionar novas dependências sem necessidade.

---

# Refatoração

Não refatore código apenas por preferência.

Primeiro resolva o problema solicitado.

Depois proponha melhorias opcionais.

---

# Antes de excluir código

Confirme que:

- não existe importação
- não existe referência
- não existe uso indireto

Nunca remova código apenas porque parece não estar sendo utilizado.

---

# Testes

Após cada alteração:

- verificar erros de TypeScript
- verificar erros de build
- verificar imports quebrados
- verificar rotas afetadas

Não finalizar uma tarefa deixando erros conhecidos.

---

# Resposta esperada

Antes de implementar:

- explique rapidamente o plano.

Depois da implementação:

- liste os arquivos alterados;
- explique o motivo de cada alteração;
- informe riscos ou impactos;
- sugira próximos passos quando fizer sentido.

---

# Regra principal

Sempre preservar a estabilidade do projeto.

Alterar apenas o necessário.

Se houver dúvida sobre uma decisão arquitetural, pergunte antes de prosseguir.