const fs = require("fs");
const db = require('../../database/db');

// Home route
exports.home = (req, res) => {
  res.render('home');
}

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