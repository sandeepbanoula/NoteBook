const express = require('express');
const passport = require('passport');

const router = express.Router();

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })
// define the home page route
router.get('/', function (req, res) {
  res.render('home');
})

// define the signup page route
router.get('/signup', function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("dashboard");
  }else{
    res.render('signup');
  }
})

// define the login page route
router.get('/login', function (req, res) {
  if(req.isAuthenticated()){
    res.redirect("dashboard");
  }else{
    res.render("login");
  }
})

//defines the dashboard route
router.get('/dashboard', function (req, res) {

  if(req.isAuthenticated()){
    res.render("dashboard");
  }else{
    res.redirect("/login");
  }
});

//define the logout page route
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect("/");
})

// define the about route
router.get('/about', function (req, res) {
  res.send('About Us')
})

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/auth/google/notebook', passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/dashboard');
});

module.exports = router
