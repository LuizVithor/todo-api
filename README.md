
# To-Do List API

## Visão Geral do Projeto

Este projeto é uma API de Lista de Tarefas construída usando Express e SQLite. Ele fornece endpoints para gerenciar tarefas e autenticação de usuários. Além disso, incorpora o Swagger para documentação da API.

## Funcionalidades

- Registro e autenticação de usuários
- Operações CRUD para tarefas
- Documentação Swagger para fácil exploração da API

## Pré-requisitos

- Node.js
- npm

## Instalação

1. Clone o repositório:

```bash
git clone [https://github.com/seuusuario/todos-express-sqlite.git](https://github.com/LuizVithor/todo-api.git)
cd todos-express-sqlite
```

2. Instale as dependências:

```bash
npm install
```

## Executando a Aplicação

Inicie a aplicação:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`.

## Endpoints da API

### Autenticação

- **Registrar Usuário**
  - **POST** `/auth/register`
  - Corpo da Requisição: `{ "name": "string", "password": "string", "image": "string" }`

- **Login do Usuário**
  - **POST** `/auth/login`
  - Corpo da Requisição: `{ "name": "string", "password": "string" }`

### Tarefas

- **Obter Todas as Tarefas**
  - **GET** `/tasks`
  - Resposta: `{ "todos": [ { "id": "number", "title": "string", "completed": "boolean", "url": "string" } ] }`

- **Obter Tarefas Ativas**
  - **GET** `/tasks/active`
  - Resposta: `{ "todos": [ { "id": "number", "title": "string", "completed": "boolean", "url": "string" } ] }`

- **Obter Tarefas Completas**
  - **GET** `/tasks/completed`
  - Resposta: `{ "todos": [ { "id": "number", "title": "string", "completed": "boolean", "url": "string" } ] }`

- **Criar Tarefa**
  - **POST** `/tasks`
  - Corpo da Requisição: `{ "title": "string", "completed": "boolean" }`

- **Atualizar Status da Tarefa**
  - **PATCH** `/tasks/:id`
  - Parâmetro da Requisição: `id`
  - Resposta: `{ "message": "string", "id": "number", "completed": "boolean" }`

## Middleware e Segurança

- JWT é usado para proteger os endpoints. Certifique-se de passar o token no cabeçalho `Authorization`.
- A chave secreta para o JWT está definida no `app.js`.

## Documentação Swagger

A documentação Swagger está disponível em `http://localhost:3000/api-docs`.

## Estrutura do Diretório

```
todos-express-sqlite/
│
├── app.js
├── auth.js
├── db.js
├── index.js
├── package.json
├── package-lock.json
├── swagger.js
├── swagger-autogen.js
├── swagger_output.json
└── .gitignore
```

## Desenvolvimento

Para desenvolvimento, você pode usar o `nodemon` para reiniciar o servidor automaticamente ao fazer alterações:

```bash
npm install -g nodemon
nodemon start
```

## Contribuindo

Sinta-se à vontade para enviar issues ou pull requests. Para mudanças significativas, por favor, abra uma issue primeiro para discutir o que você gostaria de alterar.

## Contato

Para qualquer dúvida, entre em contato pelo e-mail [luizvithorprofissional@gmail.com](mailto:luizvithorprofissional@gmail.com).
