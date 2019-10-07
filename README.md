# MEETAPP - BACKEND

![1](https://img.shields.io/badge/11.14.0-NodeJS-green?style=flat-square&logo=node.js)
![2](https://img.shields.io/badge/1.38.0-Visual%20Studio%20Code-orange?style=flat-square&logo=visual-studio-code)
![3](https://img.shields.io/badge/1.17.3-Yarn-lightblue?style=flat-square&logo=yarn)

> Desafio final do bootcamp da RocketSeat.

Essa aplicação será utilizada para se inscrever em meetups e de criar meetups. Essa aplicação é a API utilizada para que a aplicação WEB e MOBILE possam consumir as informações.
A versão WEB será utilizada para gerenciar meetups e a versão MOBILE será utilizada para se inscrever em meetups.

## Install

    yarn

## Run

    yarn dev

## What I Used

- NodeJS (Express)
- Sequelize ORM
- Nodemailer (Handlerbars)
- Redis
- Multer (Upload de Arquivos)
- Json Web Tokens (Autenticação)
- Yup (Validação de Campos)

## My Setup DEV

- Editor Config
- ESLint
- Prettier

## Docker

    docker run --name meetapp -e MYSQL_ROOT_PASSWORD=docker -d mysql:tag

## Database

- É necessário criar o banco de dados como nome `meetapp`.
- Para criar as tabelas na base de dados criada anteriormente execute o seguinte comando:

      yarn sequelize db:migrate

## Enviroment Variables

O arquivo de configuração se encontra na raiz do projeto com o nome de `.env`.

- Para executar o servidor da aplicação certifique-se de configurar as variáveis de ambiente que são usadas no **envio de e-mail**, credenciais para acesso ao **banco de dados** e **Redis**.

      # DATABASE

      DB_DRIVER=postgres
      DB_HOST=localhost
      DB_PORT=3306
      DB_USER=postgres
      DB_PASS=docker
      DB_NAME=meetapp

      # MAIL

      MAIL_HOST=smtp.mailtrap.io
      MAIL_PORT=2525
      MAIL_USER=
      MAIL_PASS=

## Routes

### `/sessions`

| ****Verb**** | **URL**      | **Action** | **Route Name** |
| ------------ | ------------ | ---------- | -------------- |
| POST         | `/sessions/` | store      | sessions.store |


### `/meetups`

| **Verb** | **URL**             | **Action** | **Route Name** |
| -------- | ------------------- | ---------- | -------------- |
| GET      | `/meetups`          | index      | meetups.index  |
| GET      | `/meetups/{meetup}` | show       | meetups.show   |
| POST     | `/meetups/`         | store      | meetups.store  |
| PUT      | `/meetups/{meetup}` | update     | meetups.update |
| DELETE   | `/meetups/{meetup}` | update     | meetups.delete |

### `/users`

| **Verb** | **URL**   | **Action** | **Route Name** |
| -------- | --------- | ---------- | -------------- |
| POST     | `/users/` | store      | users.store    |
| PUT      | `/users/` | update     | users.update   |

### `/subscriptions`

| **Verb** | **URL**                | **Action** | **Route Name**      | **Params**           |
| -------- | ---------------------- | ---------- | ------------------- | -------------------- |
| GET      | `/subscriptions/:type` | index      | subscriptions.index | (subscribers, owner) |
| POST     | `/subscriptions/`      | store      | subscriptions.store | ---                  |
