const express = require('express');
const db = require('../../database/db');
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
  if (req.isAuthenticated()) {
    res.redirect("dashboard");
  } else {
    res.render('signup');
  }
})

// define the login page route
router.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("dashboard");
  } else {
    res.render("login");
  }
})

//defines the dashboard route
// router.get('/dashboard', function (req, res) {

//   if(req.isAuthenticated()){
//   res.render("dashboard");
//   }else{
//     res.redirect("/login");
//   }
// });

//defines the dashboard route
router.get('/dashboard', function (req, res) {

  if (req.isAuthenticated()) {

    let sql = `SELECT * FROM assignment`;
    let query = db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("dashboard", { result: result });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// defines assignment specific route
router.get("/assignment/:assignmentid", function (req, res) {

  if (req.isAuthenticated()) {

    let assignmentid = req.params.assignmentid;

    let sql = `SELECT * from assignment where id = ?`;

    let query = db.query(sql, assignmentid, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("assignment", { result: result[0] });

      }
    })
  } else {
    res.redirect("/login");
  }

});

//route for adding assignment for teacher
router.post("/addAssignment", function (req, res) {

  const subject = req.body.subject;
  const topic = req.body.topic;
  const assignment = req.body.assignment;
  const newAssignment = {
    subject: subject,
    topic: topic,
    assignment: assignment
  };

  let sql = `INSERT INTO assignment SET ?`;
  let query = db.query(sql,
    newAssignment, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/dashboard");
      }

    })
})


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
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

router.get("/teacher/addAssignment", function (req, res) {
  if(req.isAuthenticated()){
  res.render("addAssignment");
  }else{
    res.redirect("/login");
  }
})

module.exports = router
