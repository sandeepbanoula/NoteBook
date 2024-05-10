const fs = require("fs");
const db = require("../../database/db");
const { createNotebookTransaction } = require("../repository/transactions");
const { createUserNotebook, selectUserNotebook, findCreateUserNotebook } = require("../repository/UserNotebookRepository");
const { selectNotebookByCode, createOwnerNotebook } = require("../repository/NotebookRepository");

// Home route
exports.home = (req, res) => {
  res.render('home');
}

// Signup Route
exports.signup = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("dashboard");
  } else {
    res.render('signup');
  }
}

// Login Route
exports.login = (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("dashboard");
  } else {
    res.render("login");
  }
}

// Signout Route
exports.signout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/login");
}

// Dashboard Route
exports.dashboard = (req, res) => {
  if (req.isAuthenticated()) {
    selectUserNotebook(req.user[0].id, true)
      .then((items) => {
        res.render("dashboard", { result: items, user: req.user[0], message: req.query });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/dashboard?err=There is some error while fetching Notebooks!")
      });
  } else {
    res.redirect("/login");
  }
}

// Assignment board Route
exports.assignment = (req, res) => {
  if (req.isAuthenticated()) {
    let sql;
    if (req.user[0].view === "asStudent") {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id WHERE (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP;`;
    } else {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id;`;
      //sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id ORDER BY a.end_dt;`;
    }
    let query = db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("assignmentBoard", { result: result, user: req.user[0], message: req.query });
      }
    });
  } else {
    res.redirect("/login");
  }
}

// Subject wise assignment board Route
exports.subjectassignment = (req, res) => {
  if (req.isAuthenticated()) {
    let sql;
    let subid = req.params.subjectid;
    if (req.user[0].view === "asStudent") {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id WHERE (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP AND s.id=?;`;
    } else {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id AND s.id=?;`;
      //sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id ORDER BY a.end_dt;`;
    }
    let query = db.query(sql, subid, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.render("assignmentBoard", { result: result, user: req.user[0], message: req.query });
      }
    });
  } else {
    res.redirect("/login");
  }
}

// Individual assignment route
exports.viewassignment = (req, res) => {
  if (req.isAuthenticated()) {

    let assignmentid = req.params.assignmentid;
    let sql;

    if (req.user[0].view === "asStudent") {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id WHERE a.id = ? AND (a.end_dt>=CURRENT_TIMESTAMP OR a.end_dt="0000-00-00 00:00:00") AND a.start_dt<=CURRENT_TIMESTAMP;`;
    } else {
      sql = `SELECT a.*, s.name, s.color FROM nb_assignments AS a JOIN nb_notebooks AS s ON a.subject = s.id WHERE a.id = ?;`;
    }

    let query = db.query(sql, assignmentid, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length) {
        if (req.user[0].view !== "asStudent") {
          sql = `SELECT DISTINCT user.id,user.name, sub.submitted, sub.assignment_id, fd.status, fd.marks_obtained FROM nb_submissions AS sub LEFT JOIN nb_feedbacks AS fd ON sub.assignment_id = fd.assignment_id RIGHT JOIN nb_users AS user ON sub.user_id = user.id AND sub.assignment_id = ?;`;
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

// delete assignment route
exports.deleteassignment = (req, res) => {
  if (req.isAuthenticated()) {
    let assignmentid = req.params.assignmentid;
    let sql;
    sql = `SELECT assignor from nb_assignments where id=?`;
    db.query(sql, assignmentid, (err, result) => {
      if (err) {
        let msg = "Internal server error!"
        res.status(500).json({ msg: msg });;
      } else if (result.length > 0) {
        if (req.user[0].view == "asAdmin" || req.user[0].id == result[0].assignor) {
          sql = `Delete from nb_assignments where id=?`;
          db.query(sql, assignmentid, (err, result1) => {
            if (err) {
              let msg = "Internal server error!"
              res.status(500).json({ msg: msg });
            } else {
              res.status(202).json({ msg: "Assignment successfully deleted." });
            }
          });
        } else {
          let msg = "Permission denied."
          res.status(401).json({ msg: msg });
        }
      } else {
        let msg = "There is some problem.";
        res.status(500).json({ msg: msg });
      }
    });
  } else {
    res.redirect("/login");
  }
}

// add assignment route
exports.addassignment = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {
      let sql = `SELECT * FROM nb_notebooks`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log(err);
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

// create notebook
exports.createNotebook = (req, res) => {
  if (req.isAuthenticated()) {
    const nbName = req.body.nbName;
    const nbColor = req.body.nbColor;
    const nbOwner = req.user[0].id;
    createOwnerNotebook(nbName, nbColor, nbOwner)
      .then((item) => {
        console.log(item);
        res.redirect("/assignment?succ=" + nbName + " notebook created.");
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/assignment?err=There is some error!");
      });
  } else {
    res.redirect("/login");
  }
}

//join notebook
exports.joinNotebook = (req, res) => {
  if (req.isAuthenticated()) {
    const nbCode = req.body.nbCode;
    const nb = selectNotebookByCode(["id"], nbCode, true)
      .then((item) => {
        console.log(item);
        if (item == undefined || item.length == 0) {
          res.redirect("/assignment?err=Notebook not found!");
        } else {
          findCreateUserNotebook(req.user[0].id, item[0].id, "student", null, true)
            .then(([userNotebook, created]) => {
              if (created) {
                res.redirect("/assignment?succ=Notebook joined.");
              } else {
                res.redirect("/assignment?err=You have already joined the Notebook!");
              }
            })
            .catch((err) => {
              console.log(err);
              res.redirect("/assignment?err=There is some error!");
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/assignment?err=There is some error!");
      });
    // console.log(nb);

  }
}

// view student submitted assignment route
exports.viewsubmissions = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {

      let assignmentid = req.params.assignmentid;
      let userid = req.params.userid;

      let sql = `SELECT s.*, a.topic, a.body, a.max_marks FROM nb_submissions AS s join nb_assignments AS a ON s.assignment_id = a.id where s.assignment_id = ? AND s.user_id = ?;`;

      db.query(sql, [assignmentid, userid], (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
          res.render("submission", { result: result, user: req.user[0] });
        } else {
          res.redirect("/assignment");
        }
      });
    } else {
      res.redirect("/assignment");
    }
  } else {
    res.redirect("/login");
  }
}

// settings page route
exports.settings = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user[0].view === "asAdmin") {
      let sql = `SELECT * FROM nb_users WHERE id != ? ORDER BY name ;`;
      db.query(sql, req.user[0].id, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          sql = `SELECT * FROM nb_notebooks ORDER BY name;`;
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
      const assignor = req.user[0].id;
      const topic = req.body.topic;
      const body = req.body.assignmentBody;
      const max_marks = req.body.max_marks;
      const start_dt = req.body.start_dt;
      const end_dt = req.body.end_dt;
      const newAssignment = {
        subject: subject,
        assignor: assignor,
        topic: topic,
        body: body,
        max_marks: max_marks,
        start_dt: start_dt,
        end_dt: end_dt
      };

      let sql = `INSERT INTO nb_assignments SET ?`;
      let query = db.query(sql,
        newAssignment, (err, rows) => {
          if (err) {
            console.log(err);
            res.redirect("/assignment?err=" + "There is some error while adding assignment!");
          } else {
            res.redirect("/assignment?succ=" + "Assignment added successfully.");
          }

        })
    } else {
      res.redirect("/assignment")
    }
  } else {
    res.redirect("/login");
  }

}

// submit feedback post router
exports.submitfeedback = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user[0].view !== "asStudent") {
      const user_id = req.params.userid;
      const assignment_id = req.params.assignmentid;
      const marks_obtained = req.body.obt_marks;
      const feedback = req.body.feedback;
      const status = req.body.submit === 'accept' ? true : false;

      const newFeedback = {
        user_id: user_id,
        assignment_id: assignment_id,
        marks_obtained: marks_obtained,
        feedback: feedback,
        status: status
      };

      let sql = `INSERT INTO nb_feedbacks SET ?`;
      let query = db.query(sql,
        newFeedback, (err, rows) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/assignment/view/" + assignment_id);
          }

        });
    } else {
      res.redirect("/assignment");
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
exports.editroles = (req, res) => {
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
      let sql = `INSERT INTO nb_notebooks (id, name, color) VALUES (?,?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color);`;

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
  console.log(files);

  if (!files) {
    const error = new Error('Please choose files');
    error.httpStatusCode = 400;
    return next(error)
  }

  // convert images into base64 encoding
  let imgArray = files.map((file) => {
    // let img = fs.readFileSync(file.path)

    // return encode_image = img.toString('base64')
    return encode_image = file.buffer.toString('base64')
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
    .then(() => { res.redirect("/assignment") })
    .catch(err => {
      res.json(err);
    })
}