var express = require("express");
var mysql = require("mysql");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "981213",
  database: "supersplash",
});

var secretKey = "";

connection.connect((err) => {
  if (err) throw err;
  console.log("You are now connected");
});

var router = express.Router();

/* POST users listing. */
router.post("/verifyUser", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  connection.query("select * from privatedata", [], (err, result) => {
    try {
      const decode = jwt.verify(token, result[0].secretKey);
      res.status(200).send({ message: " Token valid " });
    } catch (err) {
      res.status(400).send({ message: " Token invalid " });
    }
  });
});

router.post("/loginUser", function (req, res, next) {
  connection.query(
    `select * from users where email=?`,
    [req.body.email],
    (err, result) => {
      if (err) res.status(500).send({ error: "Error with sql" });
      else {
        if (result.length === 0)
          res.status(400).send({ error: "Email does not exist" });
        else {
          connection.query(
            `select * from users where email=? and password=?`,
            [req.body.email, req.body.password],
            (err, result) => {
              if (err) res.status(400).send({ error: "Error with sql" });
              else {
                if (result.length === 0)
                  res.status(400).send({ error: "Incorrect password" });
                else {
                  //TODO: add likes and collections
                  const { userName, email } = result[0];
                  connection.query(
                    "select * from privatedata",
                    [],
                    (err, result) => {
                      secretKey = result[0].secretKey;
                      token = jwt.sign({ email, userName }, secretKey, {
                        expiresIn: "2d",
                      });
                      const user = {
                        userName,
                        email,
                        //TODO//
                        likes: [],
                        collections: [],
                        ////////
                        token: token,
                      };
                      res
                        .status(200)
                        .send({ message: "Login success, enjoy!", user });
                    }
                  );
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
  connection.query(
    "select * from users where email=?",
    [req.body.email.toLowerCase()],
    (err, result) => {
      if (err) {
        return res.status(500).send("Server error");
      } else if (result.length > 0) {
        return res.status(409).send("Email already exists");
      } else {
        connection.query("select * from privatedata", [], (err, result) => {
          const { secretKey } = result[0];
          token = jwt.sign(
            { email: req.body.email, userName: req.body.userName },
            secretKey,
            {
              expiresIn: "2d",
            }
          );
          connection.query(
            `insert into users (email, password, userName, token) values (?, ?, ?, ?)`,
            [
              req.body.email.toLowerCase(),
              req.body.password,
              req.body.userName,
              token,
            ],
            (err, result) => {
              if (err) {
                res.status(500).send("Server error");
              } else {
                res.send({ message: "Register success, enjoy!" });
              }
            }
          );
        });
      }
    }
  );
});

module.exports = router;
