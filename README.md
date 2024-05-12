 
# e-commerce-crafters-bn :muscle:
This repository contains the backend application of an e-commerce website developed by Andela Team Crafters
[![GitHub](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com)

- Table of content
   - [Project Overview](#project-overview)
    - [Technology used](#technology-used)
  - [Using the project](#using-the-project)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Contribution](#contribution)
    - [Documentation](#documentation)
    - [Deployed\_link:](#deployed_link)
  - [Licensing](#licensing)
### 1. Project Overview

In our project we developed an ecommerce application which is a platform where buyers and sellers meet to interact. Each Seller will be able to register, post their products, and fully manage their stock. Buyers will be able to see all the products on the platform, add and remove products to their shopping carts, and buy from any seller where they will be able to pay via the platform.

### 2. Technology used 

* Node.js: ![Node.js](https://img.shields.io/badge/-Node.js-000000?style=flat&logo=node.js)
  
* Express: ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB&style=for-the-badge)
  
* Postgres Database: [![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue)](https://www.postgresql.org/)
  
* Sequelize ORM: [![Sequelize](https://img.shields.io/badge/ORM-Sequelize-orange)](https://sequelize.org/)
  
* Testing by Jest:[![Jest](https://img.shields.io/badge/testing-Jest-red)](https://jestjs.io/)


## 3.Using the project

  For those who are interested to use it locally,he/she is required the following:

### * Prerequisites

- Node.js
- Packages
- Postgres database
- Git

### *Installation

1. Clone the repository from github https://github.com/atlp-rwanda/e-commerce-crafters-bn.git
2. Run `npm install` to install all package dependencies
3. Copy the environment configuration:
    `cp .env.example .env`
     you can update the values of .env file with yours.
3. To run migrations into Postgres use the following command:
   `npx sequelize-cli db:migrate`
    `sequelize-cli`: This refers to the Sequelize Command Line Interface (CLI), which provides commands for interacting with Sequelize, including creating migrations, models, seeders, and running migrations.
4. To run seeders into Postgres use the following command:
   `npx sequelize-cli db:seed:all`
5. Run the project using this command `npm start`
6. running test by `npm test`

## 4.Contribution

To contribute to this project:

1. Clone the repository
2. Create your own branch to avoid direct pushing to main brach without creating pullrequest and get reviewed.

- feature(ft): `git checkout -b ft-name-of-the-feature-bn-TrelloId`
- chore(ch): `git checkout -b ch-name-of-the-chore-bn-TrelloId `
- bug(bd): `git checkout -b bg-name-of-the-bug-bn-TrelloId `


1. Then you can commit any changes you made by: `git commit -m "your commit message"`
2. Push your changes to the branch you created `git push origin your-new-branch-name`
3. create a pull request and wait for review from other collabolators
###  5.Documentation 
![Swagger Badge](https://img.shields.io/badge/Swagger-85EA2D?logo=swagger&logoColor=000&style=for-the-badge)
The following are steps to create your api documentation:
- Navigate to the location `src/docs`.
Create a `.yaml` file.
- Write your documentation in the file.
 No need to set up Swagger-related things in `server.ts` again. <br>:warning:
 You must know that YAML strictly follows indentation
### Deployed_link:
## 6.Licensing
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for detail.


