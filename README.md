# Aticurando

Aplicação web para conectar alunos a oportunidades de formação artística. O sistema possui áreas para estudantes e administradores, com autenticação e acesso conforme o perfil do usuário.

## Funcionalidades

- **Alunos:** consultar turmas disponíveis, realizar matrículas e acessar o perfil.
- **Administradores:** acompanhar indicadores de cursos, turmas e matrículas, além de gerenciar cursos, turmas, matrículas e usuários.
- **Autenticação:** login, cadastro e recuperação ou redefinição de senha.

## Tecnologias

- React 19 e TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios

## Requisitos

- Node.js e npm
- API do Aticurando em execução

Por padrão, o frontend faz requisições para `http://localhost:3002/aticurando/v1`. Essa URL está definida em `src/services/api.ts`; ajuste-a nesse arquivo caso sua API esteja em outro endereço.

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para abrir no navegador.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Verifica os tipos TypeScript e gera a versão de produção em `dist/`. |
| `npm run preview` | Serve localmente a versão de produção gerada. |
| `npm run lint` | Executa o ESLint. |

## Estrutura do projeto

```text
src/
  components/  Componentes reutilizáveis e layouts
  contexts/    Contextos da aplicação, incluindo autenticação
  pages/       Páginas agrupadas por funcionalidade
  routes/      Rotas públicas e protegidas
  services/    Comunicação com a API
  types/       Tipos TypeScript
  utils/       Funções utilitárias
```
