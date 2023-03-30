var express = require("express");
var sizeOf = require("image-size");
var mysql = require("mysql");
var fs = require("fs");

const ROOT_URL = "http://10.28.227.147:3005";

var router = express.Router();

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

const getLikeCount = (imageId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      `select * from likes where imageId=?`,
      [imageId],
      (err, results) => {
        if (err) reject(err.message);
        resolve(results.length);
      }
    );
  });
};

/* GET home page. */
router.get("/anime", async function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/anime`);
  //   console.log(readDir);
  const images = {
    results: readDir.map(async (dir) => {
      let likeCount = 0;
      try {
        likeCount = await getLikeCount(`anime/${dir}`);
      } catch (err) {
        console.log(err);
      } finally {
        return {
          id: `anime/${dir}`,
          path: `${ROOT_URL}/images/anime/${dir}`,
          width: sizeOf(`./public/images/anime/${dir}`).width,
          height: sizeOf(`./public/images/anime/${dir}`).height,
          likeCount,
        };
      }
    }),
  };

  res.send({ results: await Promise.all(images.results) });
});

router.get("/culture", async function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/culture`);
  //   console.log(readDir);
  const images = {
    results: readDir.map(async (dir) => {
      let likeCount = 0;
      try {
        likeCount = await getLikeCount(`culture/${dir}`);
      } catch (err) {
        console.log(err);
      } finally {
        return {
          id: `culture/${dir}`,
          path: `${ROOT_URL}/images/culture/${dir}`,
          width: sizeOf(`./public/images/culture/${dir}`).width,
          height: sizeOf(`./public/images/culture/${dir}`).height,
          likeCount,
        };
      }
    }),
  };

  res.send({ results: await Promise.all(images.results) });
});

router.get("/nature", async function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/nature`);
  //   console.log(readDir);
  const images = {
    results: readDir.map(async (dir) => {
      let likeCount = 0;
      try {
        likeCount = await getLikeCount(`nature/${dir}`);
      } catch (err) {
        console.log(err);
      } finally {
        return {
          id: `nature/${dir}`,
          path: `${ROOT_URL}/images/nature/${dir}`,
          width: sizeOf(`./public/images/nature/${dir}`).width,
          height: sizeOf(`./public/images/nature/${dir}`).height,
          likeCount,
        };
      }
    }),
  };

  res.send({ results: await Promise.all(images.results) });
});

router.get("/wallpaper", async function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/wallpaper`);
  const images = {
    results: readDir.map(async (dir) => {
      let likeCount = 0;
      try {
        likeCount = await getLikeCount(`wallpaper/${dir}`);
      } catch (err) {
        console.log(err);
      } finally {
        return {
          id: `wallpaper/${dir}`,
          path: `${ROOT_URL}/images/wallpaper/${dir}`,
          width: sizeOf(`./public/images/wallpaper/${dir}`).width,
          height: sizeOf(`./public/images/wallpaper/${dir}`).height,
          likeCount,
        };
      }
    }),
  };

  res.send({ results: await Promise.all(images.results) });
});

module.exports = router;
