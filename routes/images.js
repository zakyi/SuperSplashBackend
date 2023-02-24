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

const verifyUserToken = (token) => {
  return new Promise((resolve, reject) => {
    connection.query("select * from privatedata", [], (err, result) => {
      try {
        const decode = jwt.verify(token, result[0].secretKey);
        if (decode.exp * 1000 < Date.now()) reject(new Error("Token expired"));
        resolve(decode);
      } catch (err) {
        reject(new Error("Token not valid"));
      }
    });
  });
};

const getComments = (imageId) => {
  //   console.log(`select from comments where imageId=${imageId}`);
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from comments where imageId=?`,
      [imageId],
      (err, result) => {
        if (err) reject(err.message);
        resolve(result);
      }
    );
  });
};

const insertComment = (imageId, userId, comment) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `insert into comments (imageId, userEmail, content) values (?, ?, ?)`,
      [imageId, userId, comment],
      (err, result) => {
        if (err) reject(err.message);
        resolve(result);
      }
    );
  });
};

router.post("/comments", async (req, res, next) => {
  if (req.body.type === "get") {
    try {
      const result = await getComments(req.body.imageId);
      console.log(result);
      res.status(200).send(result);
    } catch (err) {
      console.log(err);
    }
  } else if (req.body.type === "comment") {
    try {
      const token = req.headers.authorization.split(" ")[1];
      await verifyUserToken(token);
      const result = await insertComment(
        req.body.imageId,
        req.body.userId,
        req.body.comment
      );
      res
        .status(200)
        .send({ comment: req.body.comment, userId: req.body.userId });
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
