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

- Para executar o servidor da aplicação certifique-se de configurar as variáveis de ambiente que são usadas:

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
      MAIL_USER=d4c7991ae22312
      MAIL_PASS=49ba24e62e8dee
