require("dotenv").config()
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { selectAllUsers, findOrCreateUser } = require("./server/repository/UserRepository");

const app = express();
const port = process.env.PORT;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({
  extended: true
}));

app.use(session({
  secret: process.env.APP_SESSIONS_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((req, user, cb) => {
  console.log(user);
  selectAllUsers({ g_id: user[0].g_id }, true)
    .then(() => {
      cb(null, user)
    })
    .catch((err) => {
      console.log(err);
      return cb(null, err);
    });

});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
  function (accessToken, refreshToken, profile, cb) {
    const user = {
      email: profile.emails[0].value,
      name: profile.displayName,
      g_id: profile.id,
      pic: profile.photos[0].value,
      view: "asUser"
    };
    findOrCreateUser(profile.id, user, false)
      .then(([result, created]) => {
        console.log(created);
        if (!created) {
          return cb(null, [result]);
        } else {
          console.log(result)
          return cb(null, [result]);
        }
      })
      .catch((err) => {
        console.log(err);
        return cb(null, [result]);
      })
  }
));

const routes = require("./routes/api/routes");

app.use('/', routes);

app.listen(port, () => console.log(`Server is up and running in port ${port}. Open in browser: http://localhost:${port}/`));