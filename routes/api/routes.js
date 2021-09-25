const express = require('express');
const db = require('../../database/db');
const passport = require('passport');
const controller = require('../../server/controller/controller');
const store = require('../../server/middleware/upload');

const router = express.Router();

// Home page Route
router.get("/", controller.home);

// define the signup page route
router.get('/signup', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("assignment");
  } else {
    res.render('signup');
  }
});

// define the login page route
router.get('/login', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect("assignment");
  } else {
    res.render("login");
  }
});

//start route to create tables
router.get("/settings", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user[0].view === "asAdmin") {
      let sql = `SELECT * FROM nb_users WHERE id != ? ORDER BY name ;`;
      db.query(sql, req.user[0].id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          sql = `SELECT * FROM nb_subjects ORDER BY name;`;
          db.query(sql, (err, subjects) => {
            if (err) {
              console.log(err);
            } else {
              res.render("settings", { user: req.user[0], result: result, subjects: subjects });
            }
          });
        }
      });
    } else {
      res.render("settings", { user: req.user[0] });
    }
  } else {
    res.redirect("login");
  }

});

router.get('/dashboard', function (req, res) {
  if (req.isAuthenticated()) {
    res.render("dashboard", { user: req.user[0] });
  } else {
    res.redirect("login");
  }
});

//defines the dashboard route
router.get('/assignment', function (req, res) {

  if (req.isAuthenticated()) {
    let sql;
    if (req.user[0].view === "asStudent") {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id WHERE (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP;`;
    } else {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id;`;
      //sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id ORDER BY a.end_dt;`;
    }
    let query = db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("assignmentBoard", { result: result, user: req.user[0] });
      }
    });
  } else {
    res.redirect("/login");
  }
});

// defines assignment specific route
router.get("/assignment/view/:assignmentid", function (req, res) {

  if (req.isAuthenticated()) {

    let assignmentid = req.params.assignmentid;
    let sql;

    if(req.user[0].view === "asStudent"){
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id WHERE a.id = ? AND (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP;`;
    }else{
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_subjects AS s ON a.subject = s.id WHERE a.id = ?;`; 
    }

    let query = db.query(sql, assignmentid, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length) {
        if (req.user[0].view !== "asStudent") {
          sql = `SELECT DISTINCT(sub.user_id),user.name, sub.submitted, sub.assignment_id FROM nb_submissions AS sub JOIN nb_users AS user WHERE sub.user_id = user.id AND assignment_id = ?;`;
          db.query(sql, assignmentid, (err, submissions) => {
            if (err) {
              console.log(err);
            } else {
              res.render("assignment", { result: result[0], user: req.user[0], sub: submissions });
            }
          });
        } else {
          res.render("assignment", { result: result[0], user: req.user[0] });
        }
      } else {
        res.redirect("/assignment");
      }
    })
  } else {
    res.redirect("/login");
  }

});

//route for adding assignment for teacher
router.post("/assignment/add", function (req, res) {

  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {
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
            res.redirect("/assignment");
          }

        })
    } else {
      res.redirect("/assignment")
    }
  } else {
    res.redirect("/login");
  }
});


//define the logout page route
router.get('/signout', function (req, res) {
  req.logout();
  res.redirect("/login");
})

// define the about route
router.get('/about', function (req, res) {
  res.send('About Us')
})

router.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }));

router.get('/auth/google/notebook', passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/assignment');
  });

router.get("/assignment/add", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {
      let sql = `SELECT * FROM nb_subjects`;
      db.query(sql, (err, result) => {
        if (err) {
          throw (err);
        } else {
          res.render("addAssignment", { user: req.user[0], subjects: result });
        }
      });
    } else {
      res.redirect("/assignment");
    }
  } else {
    res.redirect("/login");
  }
});

// defines assignment specific route
router.get("/assignment/view/:assignmentid/:userid", function (req, res) {

  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {

      let assignmentid = req.params.assignmentid;
      let userid = req.params.userid;

      let sql = `SELECT * FROM nb_submissions where assignment_id = ? AND user_id = ?;`;

      db.query(sql, [assignmentid, userid], (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
         
          res.render("submission", { result: result, user: req.user[0] });
        } else {
          res.redirect("/assignment");
        }
      })
    } else {
      res.redirect("/assignment");
    }
  } else {
    res.redirect("/login");
  }

});

// post routes for settings page

router.post("/edit/profile", function (req, res) {
  if (req.isAuthenticated()) {
    let name = req.body.username;
    let sql = `UPDATE nb_users SET name = ? WHERE id = ?`;
    db.query(sql, [name, req.user[0].id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/signout");
      }
    });
  } else {
    res.redirect("/login");
  }
});

router.post("/edit/roles", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user[0].view === "asAdmin") {
      let roles = req.body;
      let sql = `UPDATE nb_users SET view = ? WHERE id = ?`;

      for (var key in roles) {
        let query = db.query(sql, [roles[key], key], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }
      res.redirect("/settings");
    } else {
      res.redirect("/assignment");
    }

  } else {
    res.redirect("/login");
  }

});

router.post("/edit/subjects", function (req, res) {
  if (req.isAuthenticated()) {
    if (req.user[0].view === "asAdmin") {
      let subjectid = req.body.id;
      let subjectname = req.body.name;
      let subjectcolor = req.body.color;
      let sql = `INSERT INTO nb_subjects (id, name, color) VALUES (?,?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color);`;

      for (var i = 0; i < subjectname.length; i++) {
        db.query(sql, [subjectid[i], subjectname[i], subjectcolor[i]], (err, result) => {
          if (err) {
            console.log(err);
          }
        });
      }

      res.redirect("/settings");
    } else {
      res.redirect("/assignment");
    }

  } else {
    res.redirect("/login");
  }

});

module.exports = router;
