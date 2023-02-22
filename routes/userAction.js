var express = require("express");
var mysql = require("mysql");
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

const generateSql = (table, type) => {
  if (type === "select")
    return `select * from ${table} where imageId=? and userEmail=?`;
  else if (type === "insert")
    return `insert into ${table} (imageId, userEmail) values (?, ?)`;
};

const handleAction = async (imageId, userEmail, table) => {
  const selectPromise = () => {
    return new Promise((resolve, reject) => {
      const selectSql = generateSql(table, "select");
      connection.query(selectSql, [imageId, userEmail], (err, result) => {
        if (err) {
          console.log(err);
          reject(new Error("Sql error"));
        }

        if (result.length !== 0) {
          console.log(result.length);
          reject(new Error(`Already in ${table}`));
        }

        resolve("OK");
      });
    });
  };

  const insertPromise = () => {
    return new Promise((resolve, reject) => {
      const insertSql = generateSql(table, "insert");

      connection.query(insertSql, [imageId, userEmail], (err, result) => {
        if (err) {
          reject(new Error("Sql error"));
        }

        resolve(`${table} OK`);
      });
    });
  };

  try {
    await selectPromise();
    return await insertPromise();
  } catch (err) {
    return Promise.reject(err.message);
  }
};

router.post("/", (req, res, next) => {
  console.log(req.body);
  /**   req.body
   * {
        imageId: 'wallpaper/001.jpg',
        userEmail: 'zhyi@gmail.com',
        type: 'collections'
   * }   
   */

  handleAction(req.body.imageId, req.body.userEmail, req.body.type)
    .then((message) => {
      console.log({ message });
      res.status(200).send({ message });
    })
    .catch((err) => {
      res.status(400).send({ message: err });
    });
});

module.exports = router;
