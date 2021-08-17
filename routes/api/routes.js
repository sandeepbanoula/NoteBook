const express = require('express');
const db = require('../../database/db');
const passport = require('passport');

const router = express.Router();

//start route to create tables
router.get('/start', function(req, res){
  let sql = `SELECT * FROM assignment`;
  let query = db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("dashboard", { result: result });
    }
  });
});

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
});

//defines the dashboard route
router.get('/dashboard', function (req, res) {

  if (req.isAuthenticated()) {

    let sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id WHERE (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP;`;
    let query = db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {   
            res.render("dashboard", { result: result, user: req.user[0] });
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

    let sql = `SELECT * from nb_assignments where id = ?`;

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
  const body = req.body.assignmentBody;
  const start_dt = req.body.start_dt;
  const end_dt = req.body.end_dt;
  const newAssignment = {
    subject: subject,
    topic: topic,
    body: body,
    start_dt: start_dt,
    end_dt: end_dt
  };

  let sql = `INSERT INTO nb_assignments SET ?`;
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

router.get("/addAssignment", function (req, res) {
  if(req.isAuthenticated()){
    let sql = `SELECT * FROM nb_subjects`;
    db.query(sql, (err, result) => {
      if(err){
        throw(err);
      }else{
        res.render("addAssignment", {user: req.user[0], subjects: result});
      }
    });
  }else{
    res.redirect("/login");
  }
})

module.exports = router;
