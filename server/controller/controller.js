const fs = require("fs");
const db = require('../../database/db');

// Home route
exports.home = (req, res) => {
  res.render('home');
}

// Signup Route
exports.signup = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("assignment");
  } else {
    res.render('signup');
  }
}

// Login Route
exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("assignment");
  } else {
    res.render("login");
  }
}

// Signout Route
exports.signout = (req, res) => {
  req.logout();
  res.redirect("/login");
}

// Dashboard Route
exports.dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("dashboard", { user: req.user[0] });
  } else {
    res.redirect("login");
  }
}

// Assignment board Route
exports.assignment = (req, res) => {
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
}

// Individual assignment route
exports.viewassignment = (req,res) => {
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
}

// add assignment route
exports.addassignment = (req, res) => {
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
}

// view student submitted assignment route
exports.viewsubmissions = (req,res) => {
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
}

// settings page route
exports.settings = (req,res) => {
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
}

// about us route
exports.about = (req, res) => {
  res.send('About Us')
}

// add assigments post route
exports.addassignmentpost = (req, res) => {

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
  
}

// edit profile post route
exports.editprofile = (req, res) => {
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
}

// edit roles post routes
exports.editroles = (req, res) =>{
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
}

// edit subjects post routes
exports.editsubjects = (req, res) => {
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
}

//Image Upload Route
exports.uploads = (req, res, next) => {

  const files = req.files;

  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error)
  }

  // convert images into base64 encoding
  let imgArray = files.map((file) => {
    let img = fs.readFileSync(file.path)

    return encode_image = img.toString('base64')
  })

  let result = imgArray.map((src, index) => {

    // create object to store data in the collection
    let finalImg = {
      assignment_id: req.body.assignmentId,
      user_id: req.user[0].id,
      subject: req.body.subject,
      imageName: files[index].originalname,
      imageType: files[index].mimetype,
      imageBase64: src,
      comments: req.body.comment
    }

    if (req.isAuthenticated()) {
      let sql = `INSERT INTO nb_submissions SET ?`;
      db.query(sql, finalImg, (err, rows) => {
        if (err) {
          console.log(err);
        } 
      })
    } else {
      res.redirect("/login");
    }

  });
    // res.redirect("/dashboard");
    Promise.all(result)
        .then( ()=>{ res.redirect("/assignment") })
        .catch(err =>{
            res.json(err);
        })
}