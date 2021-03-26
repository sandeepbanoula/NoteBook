require("dotenv").config()
const express = require("express");
const db = require('./database/db');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
var _ = require("lodash");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "NoteBook are use to keep secrets.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser((req, user, cb) => {

  db.query(`SELECT * FROM user WHERE google_id = ?`, [user.google_id], (err, rows) => {
    if (err) {
      console.log(err);
      return cb(null, err);
    }
    cb(null, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/notebook"
},

  function (accessToken, refreshToken, profile, cb) {

    let sql = `SELECT * FROM user WHERE google_id = ?`;
    db.query(sql, profile.id, (err, result) => {
      console.log(result);
      if (err) {
        return cb(err);
      } else if (result.length) {
        console.log(result);
        console.log("hello");
        return cb(null, result);
      }
      else {

        let newUser = {
          google_id: profile.id,
          google_name: profile.displayName
        };
        console.log(newUser);
        let sql = `INSERT INTO user SET ?`;
        let query = db.query(sql,
          newUser, (err, rows) => {
            if (err) {
              console.log(err);
            }

            return cb(null, result);
          })
      }
    });
  }
));

var routes = require("./routes/api/routes");

app.use('/', routes);

app.listen(3000, () => {
  console.log("Server is up and running in port 3000");
})
