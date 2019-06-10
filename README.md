# Server-Client-DB-Project with express.js and mysql

A school project for Modul 183.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

These things you need to install beforehand:

- [Node](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/get-npm)
- [mysql](https://wiki.ubuntuusers.de/MySQL/)

Clone this repo.

### Installing

Install packages of server:

```
cd Modul183/server
```
then
```
npm install
```

Fill database with data:

```
mysql -u root -p
```

Insert your root-password.

Fill database with data like in "createDatabase.sql"

!! Change Password in table to hashed one !!

### Run server
```
npm run dev:server
```

In browser: localhost:3000

### Static code analysis

Using eslint run:

```
npm run lint
```
### Testing

Run unit tests

```
npm run test
```