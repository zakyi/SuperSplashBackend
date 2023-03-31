var express = require("express");
var sizeOf = require("image-size");
var mysql = require("mysql");
var fs = require("fs");

//改为IPv6
const ROOT_URL = "https://[2001:da8:215:3c02:ac9e:f2f:d82b:d4f9]:443";

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
  console.log("headers = " + JSON.stringify(req.headers)); // 包含了各种header，包括x-forwarded-for(如果被代理过的话)
  console.log("x-forwarded-for = " + req.header("x-forwarded-for")); // 各阶段ip的CSV, 最左侧的是原始ip
  console.log("ips = " + JSON.stringify(req.ips)); // 相当于(req.header('x-forwarded-for') || '').split(',')
  console.log("ip = " + req.ip); // 同req.connection.remoteAddress, 但是格式要好一些
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
