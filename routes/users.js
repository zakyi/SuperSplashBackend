var express = require("express");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "981213",
  database: "supersplash",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("You are now connected");
});

var router = express.Router();

/* POST users listing. */
router.post("/loginUser", function (req, res, next) {
  connection.query(
    `select * from users where email=?`,
    [req.body.email],
    (err, result) => {
      if (err) {
        res.statusCode = 400;
        res.send({ error: "Error with sql" });
      } else {
        if (result.length === 0) {
          res.statusCode = 400;
          res.send({ error: "Email does not exist" });
        } else {
          connection.query(
            `select * from users where email=? and password=?`,
            [req.body.email, req.body.password],
            (err, result) => {
              console.log([req.body.email, req.body.password]);
              if (err) {
                res.statusCode = 400;
                res.send({ error: "Error with sql" });
              } else {
                if (result.length === 0) {
                  res.statusCode = 400;
                  res.send({ error: "Incorrect password" });
                } else {
                  res.send({ message: "Login success, enjoy!" });
                }
              }
            }
          );
        }
      }
    }
  );
});

router.post("/addUser", function (req, res, next) {
  console.log("add user");
  console.log([req.body.email, req.body.password, req.body.userName]);
  connection.query(
    `insert into users (email, password, userName) values (?, ?, ?)`,
    [req.body.email, req.body.password, req.body.userName],
    (err, result) => {
      if (err && err.code === "ER_DUP_ENTRY") {
        // res.set({ "Content-Type": "text/plain" });
        res.statusCode = 400;
        res.send({ error: "Email already exists" });
      } else {
        res.send({ message: "Register success, enjoy!" });
      }
    }
  );
});

module.exports = router;
