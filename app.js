require("dotenv").config()
const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Database Connection

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_DATABASE,
//   port: process.env.DB_PORT
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "notebook_manager",
  port: 3306
});

//Create Connection
db.connect(function(err) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Database is up and running");
  }
});


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

app.use(session({
  secret: "NoteBook are use to keep secrets.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser((req, user, cb) => {

  db.query("SELECT * FROM user WHERE google_id = ?", [user.google_id], (err, rows) => {
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
    
    let sql="SELECT * FROM user WHERE google_id = ?";
          db.query(sql, profile.id, (err, user) => {
            console.log(user);
              if (err) {
                  return cb(err);
              } else if (user.length) {
                   return cb(null, user);
               } 
              else {
                console.log(profile.id);
                let newUser = {
                  google_id: profile.id,
                  google_name: profile.displayName
                };
                let sql="INSERT INTO user SET ?";
                  let query= db.query(sql,
                      newUser, (err, rows) => {
                          if (err) {
                              console.log(err);
                          }

                          return cb(null, newUser);
                      })
              }
          });
  }
));

var routes = require("./routes/api/routes");

app.use('/', routes);

app.listen(3000,()=>{
  console.log("Server is up and running in port 3000");
})
