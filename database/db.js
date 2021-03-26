const mysql = require("mysql");

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
db.connect(function (err) {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Database is up and running");
    }
});


module.exports = db;