const multer = require("multer");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads");
  },
  filename: (req, file, cb) => {

    var ext = file.originalname.substr(file.originalname.lastIndexOf("."));
    cb(null, file.fieldname+'-'+Date.now()+ext);
  },
});

module.exports = store = multer({ storage: storage, fileFilter: imageFilter });