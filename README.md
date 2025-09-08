# My Delivery Service

## What is being used
- Express REST API
- Sequelize (MS SQL)
- JWT token for auth validations
- Swagger docs at `/docs`.
- SQL DDL in `migrations/ddl.sql`.
- Dockerfile and docker-compose.yml.

Server runs on `http://localhost:3000` 

## Quick start (local)
1. set values at .env
2. I ran into some trouble with the docker to create the `delivery_db`. It does not run the `initdb` image automatically so it has to be run manually before running the node js app. 
3. I used Docker Desktop to run the images so :
    a. first, the `mssql` image needs to run (run when the docker launches)
    b. second, run the `initdb` image. It will create the `delivery_db`
    c. third, run the `nodeapp` image for the table migrations

## Design
- Using the sequelize package as ORM for the tables.
- using transaction and row locking to prevent race conditions.


## Cloud / Deployment
- Use managed MS SQL using cloud services such as Azure SQL / AWS RDS for SQL Server
- Secrets should be stored also in cloud under secrets managment like GCP Secret Manager. For this test purpose,  we will use the env file
- For caching issues we can use REDIS or MongoDB.
- Github for CI CD operatins
- We can use ECS / AKS for Docker images.

