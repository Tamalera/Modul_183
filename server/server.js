//npm modules
const express = require('express');
const uuid = require('uuid/v4')
const session = require('express-session')
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const axios = require('axios');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'dev_DB'
});

axios({
  url: 'localhost:3000',
  maxContentLength: 2000,
}).catch((error) => {
  error.request.res.destroy();
});

// create the server
const app = express();

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
  genid: (req) => {
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// create routes
app.get('/', (req, res) => {
  if(req.session){
    res.sendFile(path.join(__dirname + '/login.html'));
  }
})

app.get('/auth', (req, res) => {
  if(req.session){
    if(req.session.loggedin){
      res.sendFile(path.join(__dirname + '/memberZone.html'));
    }
    else {
    console.log("User: " + req.session.email + " wanted to get here.");
    res.sendFile(path.join(__dirname + '/errorPage.html'));
  }
  }
})

app.get('/logout', (req, res) => {
  if (req.session) {
    if (req.session.email) {
      console.log("User: " + req.session.email + " logged out.");
    // undo session
    req.session.loggedin = false;
    req.session.email = '';
    req.session.destroy();
    res.redirect('/');
  } else {
      console.log("Unknown user wanted to log out");
      res.sendFile(path.join(__dirname + '/errorPage.html'));
    }
  }
})


app.post('/login', (request, response) => {
  let username = request.body.email;
  let password = request.body.password;

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailOk = re.test(String(username).toLowerCase())

  if (username && emailOk) {
    let sql = "SELECT * FROM ?? WHERE ?? = ?";
    const inserts = ['testUsers', 'email', username];
    sql = mysql.format(sql, inserts);
    connection.query(sql, function(error, results, fields) {
      if (results.length > 0) {
        if (bcrypt.compareSync(password, results[0].password)) {
          request.session.loggedin = true;
          request.session.email = username;
          console.log("User: " + username + " logged in.");
          response.redirect('/auth');
        } else {
        console.log("User: " + username + " used wrong credentials.");
        response.send('Incorrect Username and/or Password!');
      }
      } else {
        console.log("No user found in DB with: " + username);
        response.send('Incorrect Username and/or Password!');
      }     
      response.end();
    });
  } else {
    console.log("Incomplete credentials used");
    response.send('Please enter Username and Password!');
    response.end();
  }
})

// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})