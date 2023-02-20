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
  console.log(req.body);
});

router.post("/addUser", function (req, res, next) {
  console.log("add user");
  console.log(req.body);
  connection.query(
    `insert into users (email, password) values (?, ?)`,
    [req.body.email, req.body.password],
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
