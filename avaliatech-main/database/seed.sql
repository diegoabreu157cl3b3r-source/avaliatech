USE avaliatech;

-- Seed opcional.
-- Primeiro crie um professor pela tela de cadastro do sistema.
-- Se o usuário com id = 1 existir, os exemplos abaixo serão inseridos.
-- Se ele não existir, o arquivo pode ser importado sem quebrar foreign keys.

INSERT INTO questoes
(usuario_id, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade)
SELECT 1, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, correta, disciplina, assunto, dificuldade
FROM (
  SELECT 'Qual comando cria um novo projeto Next.js?' pergunta, 'npx create-next-app@latest' alternativa_a, 'npm start next' alternativa_b, 'node create next' alternativa_c, 'tsc next init' alternativa_d, 'A' correta, 'Programação Web' disciplina, 'Next.js' assunto, 'Fácil' dificuldade
  UNION ALL SELECT 'Qual arquivo representa uma rota no App Router?', 'route.ts', 'api.js', 'server.ts', 'index.api', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual diretiva transforma um componente em Client Component?', 'use client', 'client on', 'next client', 'react client', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual classe Tailwind aplica display flex?', 'flex', 'display-flex', 'd-flex', 'fx', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual propriedade do React identifica itens em listas?', 'key', 'idList', 'indexOf', 'mapKey', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual hook gerencia estado em componentes React?', 'useState', 'useRouter', 'useParams', 'useMemo', 'A', 'Programação Web', 'Next.js', 'Fácil'o
  UNION ALL SELECT 'Qual método percorre um array retornando outro array?', 'map', 'filter', 'find', 'reduceTo', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual método filtra itens de um array?', 'filter', 'map', 'push', 'join', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual tipo representa texto em TypeScript?', 'string', 'text', 'charlist', 'varchar', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual recurso do TypeScript define contrato para objetos?', 'interface', 'layout', 'schema html', 'component', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual arquivo representa uma rota no App Router?', 'route.ts', 'api.js', 'server.ts', 'index.api', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual diretiva transforma um componente em Client Component?', 'use client', 'client on', 'next client', 'react client', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual classe Tailwind aplica display flex?', 'flex', 'display-flex', 'd-flex', 'fx', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual propriedade do React identifica itens em listas?', 'key', 'idList', 'indexOf', 'mapKey', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual hook gerencia estado em componentes React?', 'useState', 'useRouter', 'useParams', 'useMemo', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual método percorre um array retornando outro array?', 'map', 'filter', 'find', 'reduceTo', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual método filtra itens de um array?', 'filter', 'map', 'push', 'join', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual tipo representa texto em TypeScript?', 'string', 'text', 'charlist', 'varchar', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual recurso do TypeScript define contrato para objetos?', 'interface', 'layout', 'schema html', 'component', 'A', 'Programação Web', 'Next.js', 'Fácil'
UNION ALL SELECT 'Qual arquivo representa uma rota no App Router?', 'route.ts', 'api.js', 'server.ts', 'index.api', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual diretiva transforma um componente em Client Component?', 'use client', 'client on', 'next client', 'react client', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual classe Tailwind aplica display flex?', 'flex', 'display-flex', 'd-flex', 'fx', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual propriedade do React identifica itens em listas?', 'key', 'idList', 'indexOf', 'mapKey', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual hook gerencia estado em componentes React?', 'useState', 'useRouter', 'useParams', 'useMemo', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual método percorre um array retornando outro array?', 'map', 'filter', 'find', 'reduceTo', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual método filtra itens de um array?', 'filter', 'map', 'push', 'join', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual tipo representa texto em TypeScript?', 'string', 'text', 'charlist', 'varchar', 'A', 'Programação Web', 'Next.js', 'Fácil'
  UNION ALL SELECT 'Qual recurso do TypeScript define contrato para objetos?', 'interface', 'layout', 'schema html', 'component', 'A', 'Programação Web', 'Next.js', 'Fácil'

) AS exemplos
WHERE EXISTS (SELECT 1 FROM usuarios WHERE id = 1);
