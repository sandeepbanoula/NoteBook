const db = require('../../database/db');

exports.firstrun = (req, res) => {
    function run() {
        sql = `CREATE TABLE nb_assignments (
            id int(11) NOT NULL AUTO_INCREMENT,
                subject int(11) NOT NULL,
                assignor int(11) NOT NULL,
                    topic varchar(250) NOT NULL,
                        body text NOT NULL,
                            max_marks int(3),
                            start_dt datetime NOT NULL DEFAULT current_timestamp(),
                                end_dt datetime NOT NULL,
                                    PRIMARY KEY(id)
    ) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
        });

        sql = `CREATE TABLE nb_subjects (
            id int(11) NOT NULL AUTO_INCREMENT,
                name varchar(30) NOT NULL,
                    color varchar(8) NOT NULL,
                        PRIMARY KEY(id)
          ) ENGINE = InnoDB AUTO_INCREMENT = 7 DEFAULT CHARSET = utf8mb4`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
        });

        sql = `CREATE TABLE nb_submissions (
            id int(11) NOT NULL AUTO_INCREMENT,
                assignment_id int(11) NOT NULL,
                    user_id int(11) NOT NULL,
                        subject int(11) NOT NULL,
                            imageName varchar(150) NOT NULL,
                                imageType varchar(50) NOT NULL,
                                    imageBase64 longblob NOT NULL,
                                        submitted datetime NOT NULL DEFAULT current_timestamp(),
                                            comments varchar(30) NOT NULL,
                                                PRIMARY KEY(id),
                                                 KEY assignment_id (assignment_id),
  CONSTRAINT nb_submissions_ibfk_1 FOREIGN KEY (assignment_id) REFERENCES nb_assignments (id) ON DELETE CASCADE ON UPDATE NO ACTION
          ) ENGINE = InnoDB AUTO_INCREMENT = 10 DEFAULT CHARSET = utf8mb4`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
        });

        sql = `CREATE TABLE nb_feedbacks (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_id int(11) NOT NULL,
  assignment_id int(11) NOT NULL,
  marks_obtained int(3) NOT NULL,
  feedback varchar(150) NOT NULL,
  status tinyint(1) NOT NULL,
  PRIMARY KEY (id),
  KEY assignment_id (assignment_id),
  CONSTRAINT nb_feedbacks_ibfk_1 FOREIGN KEY (assignment_id) REFERENCES nb_assignments (id) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
        });

        sql = `CREATE TABLE nb_users (
            id int(11) NOT NULL AUTO_INCREMENT,
                email varchar(100) NOT NULL,
                    name varchar(250) NOT NULL,
                        g_id varchar(255) NOT NULL,
                            view varchar(100) NOT NULL,
                            password varchar(50),
                                pic varchar(2083) NOT NULL,
                                    registered datetime NOT NULL DEFAULT current_timestamp(),
                                        PRIMARY KEY(id)
          ) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
        });
    }

    sql = 'select * from nb_users';
    db.query(sql, (err, result) => {
        if (err) {
            run();
        } else {
            res.send("You are already done with first step;");
        }
    });
}