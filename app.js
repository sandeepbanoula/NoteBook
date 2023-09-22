require("dotenv").config()
const express = require("express");
const db = require('./database/db');
const ejs = require("ejs");
const session = require("express-session");
var _ = require("lodash");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));
// app.use(express.static('public'));

app.use(session({
  secret: process.env.APP_SESSIONS_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser((req, user, cb) => {

  db.query(`SELECT * FROM nb_users WHERE g_id = ?`, [user.google_id], (err, rows) => {
    if (err) {
      console.log(err);
      return cb(null, err);
    }
    cb(null, user);
  });
});

passport.use(new LocalStrategy(
  function (username, password, cb) {
    let sql = `SELECT * FROM nb_users WHERE g_id = ?`;
    db.query(sql, username, (err, result) => {
      if (err) {
        return cb(err);
      } else if (result.length) {
        if (result[0].password != password) {
          console.log("Wrong Password!!!");
          return cb(null, false);
        }
        return cb(null, result);
      } else {
        console.log("User Not Found!! Use Demo logins or signup as student via Google!");
        return cb(null, false);
      }
    });
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},

  function (accessToken, refreshToken, profile, cb) {

    let sql = `SELECT * FROM nb_users WHERE g_id = ?`;
    db.query(sql, profile.id, (err, result) => {
      if (err) {
        return cb(err);
      } else if (result.length) {
        return cb(null, result);
      }
      else {
        let user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          g_id: profile.id,
          pic: profile.photos[0].value,
          view: "asStudent"
        };
        let sql = `INSERT INTO nb_users SET ?`;
        let query = db.query(sql,
          user, (err, rows) => {
            if (err) {
              console.log(err);
            }
            return cb(null, [user]);
          })
      }
    });
  }
));

const routes = require("./routes/api/routes");

app.use('/', routes);

app.listen(port, () => console.log(`Server is up and running in port ${port}`));