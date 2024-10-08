![Logo](https://sae.com.mx/wp-content/uploads/2024/03/logo_sae.svg)

# API Principal SAE

API REST Principal para el control de servicios en los proyectos internos de SAE

## Tech Stack

**Server:** AdonisJS, MySQL, Swagger Docs

**Node Version:** 20.13.1 LTS

## Installation

Install my-project with npm

```bash
  npm install
  npm run prepare
  node ace configure adonisjs-6-swagger
```

Create docs spec file

```bash
  mkdir docs
  touch docs/swagger.json
```

Generate projectunique key

```bash
  node ace generate:key
```

Run migrations and seeders (Create database with name "**db_sae**")

```bash
  node ace migration:run
  node ace db:seed
```

## Local Launching

To deploy this project run

```bash
  npm run dev
```

Inicia por defecto en localhost:3333
