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

        if (result == null || result.length !== 0) {
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

const signUserData = (user) => {
  return new Promise((resolve, reject) => {
    connection.query("select * from privatedata", [], (err, result) => {
      secretKey = result[0].secretKey;
      token = jwt.sign(
        {
          email: user.email,
          userName: user.email,
          likes: user.likes.toString(),
          collections: user.collections.toString(),
        },
        secretKey,
        {
          expiresIn: "2d",
        }
      );
      user.token = token;
      resolve(user);
    });
  });
};

const addUserAction = (user, imageId, type) => {
  const newUser = {
    email: user.email,
    userName: user.email,
    likes: user.likes.length === 0 ? [] : user.likes.split(","),
    collections:
      user.collections.length === 0 ? [] : user.collections.split(","),
  };

  if (type === "likes") {
    newUser.likes.push(imageId);
  }
  if (type === "collections") {
    newUser.collections.push(imageId);
  }
  return newUser;
};

router.post("/", async (req, res, next) => {
  /**   req.body
   * {
        imageId: 'wallpaper/001.jpg',
        userEmail: 'zhyi@gmail.com',
        type: 'collections'
   * }   
   */
  const token = req.headers.authorization.split(" ")[1];

  try {
    let user = await verifyUserToken(token);
    await handleAction(req.body.imageId, req.body.userEmail, req.body.type);
    user = addUserAction(user, req.body.imageId, req.body.type);
    const newUser = await signUserData(user);
    console.log(newUser);
    res.status(200).send(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
