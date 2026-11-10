# AvaliaTech

Sistema web fullstack para professores criarem banco de questões, gerarem provas automaticamente em duas versões e exportarem PDF com gabaritos independentes.

## Tecnologias

- Next.js App Router
- TypeScript
- Tailwind CSS
- API Routes / Route Handlers do Next.js
- PostgreSQL
- JWT com cookie `httpOnly`
- bcryptjs para hash de senha
- pdf-lib para geração de PDF no backend
- Zod para validação de entradas

## Funcionalidades entregues

- Cadastro de professor
- Login e logout
- Sessão persistida por cookie seguro
- Middleware de proteção de rotas privadas
- Controle de acesso por usuário: cada professor acessa somente suas próprias questões e provas
- Dashboard com estatísticas:
  - total de questões
  - total de disciplinas
  - total de assuntos
  - total de provas geradas
- CRUD completo de questões
- Filtros por disciplina, assunto e dificuldade
- Pesquisa textual
- Paginação
- Tabela responsiva
- Geração automática de prova sem seleção manual de questões
- Quantidades fixas: 10, 15, 20 ou 25 questões
- Validação de questões insuficientes
- Embaralhamento automático das alternativas
- Recalculo do gabarito após embaralhar alternativas
- Versão A com alternativas embaralhadas
- Versão B com questões e alternativas embaralhadas
- Gabarito independente para cada versão
- PDF com quatro páginas:
  1. Prova Versão A
  2. Gabarito Versão A
  3. Prova Versão B
  4. Gabarito Versão B
- Upload de logo PNG/JPG/JPEG
- Logo no cabeçalho do PDF
- Campos manuais no PDF: Nome, Escola e Turma
- Perfil do professor
- Atualização de nome e e-mail
- Alteração de senha
- Logo padrão da escola

## Estrutura de pastas

```txt
avaliatech/
├── app/
│   ├── api/
│   ├── (auth)/
│   ├── (private)/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── api/
├── components/
├── database/
│   ├── migrations/20261110_postgresql_initial.sql
│   └── seed_postgresql.sql
├── hooks/
├── lib/
├── middleware/
├── services/
├── types/
├── middleware.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Requisitos

- Node.js 20 ou superior
- PostgreSQL 16 ou superior
- npm

## Instalação

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

Crie o arquivo `.env.local` na raiz do projeto com base em `.env.example`:

```env
DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/avaliatech
JWT_SECRET=troque-por-uma-chave-forte-com-no-minimo-32-caracteres
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Importe o banco de dados

Crie um banco vazio e execute o schema PostgreSQL (com `psql` instalado):

```bash
createdb -h localhost -U postgres avaliatech
psql -h localhost -U postgres -d avaliatech -v ON_ERROR_STOP=1 -f database/migrations/20261110_postgresql_initial.sql
```

O schema inclui todas as funcionalidades e migrations anteriores, sem apagar tabelas. Execute uma única vez no destino vazio. Os arquivos `schema.sql`, `schema_aiven.sql`, `seed.sql` e as migrations anteriores a 20261110 são históricos do MySQL; não os execute no PostgreSQL.

### Convertendo os dados de um MySQL existente

1. Faça um backup do MySQL e interrompa gravações na aplicação durante a transferência.
2. Prepare o PostgreSQL vazio com o comando acima. Use uma conexão direta para a migração.
3. Configure `DATABASE_URL` (destino) e `MYSQL_SOURCE_URL=mysql://usuario:senha@host:3306/avaliatech` (origem) no `.env.local`, que não é versionado. Codifique caracteres especiais da senha na URL.
4. Execute `npm run db:migrate:mysql`. O script exige todas as tabelas históricas na origem, lê uma snapshot consistente e copia em lotes dentro de uma transação no destino. Recusa destinos com dados, confere contagens e ajusta as sequências. Não modifica o MySQL. IDs, hashes de senha, provas salvas e datas UTC são preservados.
5. Valide cadastro, confirmação de e-mail, login, recuperação de senha, disciplinas, questões, dashboard e geração/PDF de provas antes de liberar o acesso. Mantenha o backup e a origem para retorno se necessário. Remova `MYSQL_SOURCE_URL` do ambiente após a transferência.

O driver `mysql2` é uma dependência de desenvolvimento usada somente pelo importador. A aplicação usa `pg`. Em produção, configure TLS conforme o provedor (por exemplo `sslmode=verify-full` e a CA correspondente); a aplicação não desativa a validação de certificados.

As buscas textuais usam `ILIKE`, preservando buscas sem distinção entre maiúsculas e minúsculas. PostgreSQL distingue acentos e diferenças de caixa nas comparações por igualdade, ao contrário da collation MySQL antiga; revise cadastros legados com essas variações. E-mails, nomes de disciplinas e assuntos têm índices únicos adicionais sem distinção de caixa.

### 4. Rode o projeto

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000
```

### 5. Crie o primeiro professor

Acesse `/cadastro` e crie a conta inicial. A senha será salva com bcrypt, nunca em texto puro.

### 6. Seed opcional

Depois de criar o primeiro professor, você pode importar questões de exemplo:

```bash
psql -h localhost -U postgres -d avaliatech -v ON_ERROR_STOP=1 -f database/seed_postgresql.sql
```

O seed só insere questões se existir um usuário com `id = 1`.

## Rotas privadas

As rotas abaixo exigem autenticação:

- `/dashboard`
- `/questoes`
- `/gerar-prova`
- `/provas`
- `/perfil`

## Principais endpoints

### Autenticação

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Dashboard

- `GET /api/dashboard/stats`

### Questões

- `GET /api/questions`
- `POST /api/questions`
- `GET /api/questions/:id`
- `PUT /api/questions/:id`
- `DELETE /api/questions/:id`

### Provas

- `GET /api/exams`
- `POST /api/exams/generate`

### Perfil

- `GET /api/profile`
- `PUT /api/profile`

## Observações importantes

- O sistema usa `usuario_id` em todas as consultas de questões e provas.
- A API nunca retorna `senha_hash` para o frontend.
- O PDF é gerado no servidor.
- O upload da logo é convertido para Base64 e enviado para a API de geração do PDF.
- A logo padrão do perfil também é armazenada em Base64 para simplificar o uso acadêmico.
- Em produção, prefira armazenar imagens em storage externo, como S3, Cloudinary ou equivalente.

## Comandos úteis

```bash
npm run dev
npm run build
npm run start
npm run lint
```
