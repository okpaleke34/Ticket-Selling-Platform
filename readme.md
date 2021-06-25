# Description

The task is to create an api server for a ticket selling platform.

## Backend

docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

To run the docker build of the app in a development environment run

```bash
 docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Else while in production environment run

```bash
 docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

The production build it does not require to install the dev dependencies

In a case where docker is not in need the app can be start on the local computer by running the command below to start the client and server app

```bash
 npm start
```

Or run only the command below to start only the server

```bash
 npm server
```

To start the mocha functional testing run the command

```bash
 npm test
```

The URL of the swagger api documentations is at
[http://localhost:4000/api-docs/](http://localhost:4000/api-docs/)

**Important**
Please set the details of .env file to make sure the app is connected to a database and able to send emails

## Frontend

The task only ask for the client side of the project as optional but i added it as a gui version of consuming the API.
I used Context API in react which is not needed for a small project with few components but the instruction explained that i should make the app scalable.

Since this is not mandated for the task i tried to save some time by not creating a docker image for the react app and not writing the test code.

It can be luanch separately while inside the folder with the command

```bash
    npm start
```

**Credits**
Front end template: https://colorlib.com/wp/template/colorlib-booking-16/
