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

/* POST users listing. */
router.post("/verifyUser", (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  connection.query("select * from privatedata", [], (err, result) => {
    try {
      const decode = jwt.verify(token, result[0].secretKey);
      console.log(decode);
      res.status(200).send({ userData: decode, token });
    } catch (err) {
      res.status(400).send({ message: " Token invalid " });
    }
  });
});

const checkEmailExistPromise = (email) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from users where email=?`,
      [email],
      (err, result) => {
        if (err) reject(new Error({ code: 500, error: "Error with sql" }));
        else if (result.length === 0)
          reject(new Error({ code: 400, error: "Email does not exist" }));
        else resolve("OK");
      }
    );
  });
};

const checkPasswordCorrect = (email, password) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from users where email=? and password=?`,
      [email, password],
      (err, result) => {
        if (err) reject(new Error({ code: 500, error: "Error with sql" }));
        else if (result.length === 0)
          reject(new Error({ code: 400, error: "Incorrect password" }));
        else {
          const { userName, email } = result[0];
          resolve({ userName, email });
        }
      }
    );
  });
};

const addUserData = ({ userName, email }) => {
  return new Promise((resolve, reject) => {
    const user = {
      userName,
      email,
      //TODO//
      // likes: [],
      // collections: [],
      ////////
      token: "",
    };
    resolve(user);
  });
};

const addUserLikes = (user) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from likes where userEmail=?",
      [user.email],
      (err, result) => {
        if (err) reject(new Error({ code: 500, error: "Error with sql" }));
        else if (result.length === 0) resolve(user);
        else {
          /**result
           * [
              RowDataPacket {
                id: 1,
                imageId: 'wallpaper/011.jpg',
                userEmail: 'zhyi@gmail.com'
              },
              RowDataPacket {
                id: 2,
                imageId: 'wallpaper/009.jpg',
                userEmail: 'zhyi@gmail.com'
              },
              RowDataPacket {
                id: 3,
                imageId: 'wallpaper/010.jpg',
                userEmail: 'zhyi@gmail.com'
              },
              RowDataPacket {
                id: 4,
                imageId: 'wallpaper/023.jpg',
                userEmail: 'zhyi@gmail.com'
              },
              RowDataPacket {
                id: 5,
                imageId: 'wallpaper/026.jpg',
                userEmail: 'zhyi@gmail.com'
              }
            ]
           */
          user.likes = result.map((RowDataPacket) => {
            return RowDataPacket.imageId;
          });
          resolve(user);
        }
      }
    );
  });
};

const addUserCollections = (user) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "select * from collections where userEmail=?",
      [user.email],
      (err, result) => {
        if (err) reject(new Error({ code: 500, error: "Error with sql" }));
        else if (result.length === 0) resolve(user);
        else {
          user.collections = result.map((RowDataPacket) => {
            return RowDataPacket.imageId;
          });
          resolve(user);
        }
      }
    );
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
        },
        secretKey,
        {
          expiresIn: "2d",
        }
      );
      user.token = token;
      console.log(token);
      resolve(user);
    });
  });
};

router.post("/loginUser", function (req, res, next) {
  checkEmailExistPromise(req.body.email)
    .then(() => {
      return checkPasswordCorrect(req.body.email, req.body.password);
    })
    .then(({ userName, email }) => {
      return addUserData({ userName, email });
    })
    .then((user) => {
      return addUserLikes(user);
    })
    .then((user) => {
      return addUserCollections(user);
    })
    .then((user) => {
      return signUserData(user);
    })
    .then((user) => {
      console.log(user);
      res.status(200).send(user);
    })
    .catch((err) => console.log(err));
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
        connection.query(
          `insert into users (email, password, userName) values (?, ?, ?)`,
          [req.body.email.toLowerCase(), req.body.password, req.body.userName],
          (err, result) => {
            if (err) {
              res.status(500).send("Server error");
            } else {
              res.send({ message: "Register success, enjoy!" });
            }
          }
        );
      }
    }
  );
});

module.exports = router;
