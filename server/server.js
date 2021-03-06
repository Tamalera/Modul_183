// npm modules
const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { check } = require('express-validator/check');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Needed for encryption of PW
// eslint-disable-next-line no-unused-vars
const saltRounds = 10;

// TODO: Get mysql connection in different file
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'dev_DB'
});

const options = {
  // eslint-disable-next-line no-unused-vars
  genid: req => uuid(), // use UUIDs for session IDs
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: 'my.connect.sid'
};

// create the server
const app = express();

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session(options));
app.use(cookieParser());
app.use(csrf());

app.use(passport.initialize());
app.use(passport.session());

// create routes
app.get('/', (req, res) => {
  // Initially set password:
  /*
  bcrypt.hash('password', saltRounds).then(function(hash) {
    connection.query("UPDATE testUsers SET password = hash WHERE email='test@test.com';");
  });
  */
  if (req.session) {
    res.cookie('csrfToken', req.csrfToken());
    res.sendFile(path.join(`${__dirname}/login.html`));
  }
});

app.get('/auth', (req, res) => {
  if (req.session) {
    if (req.session.loggedin) {
      res.sendFile(path.join(`${__dirname}/memberZone.html`));
    }
    else {
      console.log(`User: ${req.session.email} wanted to get here.`);
      res.sendFile(path.join(`${__dirname}/errorPage.html`));
    }
  }
});

app.get('/logout', (req, res) => {
  if (req.session) {
    if (req.session.email) {
      console.log(`User: ${req.session.email} logged out.`);
      // undo session
      req.session.loggedin = false;
      req.session.email = '';
      req.session.destroy();
      req.logout();
      res.clearCookie(options.name);
      res.redirect('/');
    }
    else {
      console.log('Unknown user wanted to log out');
      res.sendFile(path.join(`${__dirname}/errorPage.html`));
    }
  }
});


app.post('/login', [
  check('email').isEmail().trim().escape()
    .stripLow(),
  check('password').trim().escape().stripLow()
],
(request, response) => {
  const username = request.body.email;
  const { password } = request.body;

  // Source: https://stackoverflow.com/questions/38091894/regular-expression-for-email-not-working
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailOk = re.test(String(username).toLowerCase());

  if (username && emailOk) {
    let sql = 'SELECT * FROM ?? WHERE ?? = ?';
    const inserts = ['testUsers', 'email', username];
    sql = mysql.format(sql, inserts);
    connection.query(sql, (error, results) => {
      if (results.length > 0) {
        if (bcrypt.compareSync(password, results[0].password)) {
          request.session.loggedin = true;
          request.session.email = username;
          console.log(`User: ${username} logged in.`);
          response.redirect('/auth');
        }
        else {
          console.log(`User: ${username} used wrong credentials.`);
          response.sendFile(path.join(`${__dirname}/errorPage.html`));
        }
      }
      else {
        console.log(`No user found in DB with: ${username}`);
        response.sendFile(path.join(`${__dirname}/errorPage.html`));
      }
      response.end();
    });
  }
  else {
    console.log('Incomplete credentials used');
    response.sendFile(path.join(`${__dirname}/errorPage.html`));
    response.end();
  }
});

// tell the server what port to listen on
// For SSL use: https://hackernoon.com/set-up-ssl-in-nodejs-and-express-using-openssl-f2529eab5bb
app.listen(3000, () => {
  console.log('Listening on localhost:3000');
});

module.exports = app;
