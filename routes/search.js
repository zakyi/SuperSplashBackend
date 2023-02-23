var express = require("express");
var sizeOf = require("image-size");
var router = express.Router();
var fs = require("fs");
const ROOT_URL = "http://10.128.138.178:3005";

/* GET home page. */
router.get("/anime", function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/anime`);
  //   console.log(readDir);
  const images = {
    results: readDir.map((dir) => {
      return {
        id: `anime/${dir}`,
        path: `${ROOT_URL}/images/anime/${dir}`,
        width: sizeOf(`./public/images/anime/${dir}`).width,
        height: sizeOf(`./public/images/anime/${dir}`).height,
      };
    }),
  };
  res.send(images);
});

router.get("/culture", function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/culture`);
  //   console.log(readDir);
  const images = {
    results: readDir.map((dir) => {
      return {
        id: `culture/${dir}`,
        path: `${ROOT_URL}/images/culture/${dir}`,
        width: sizeOf(`./public/images/culture/${dir}`).width,
        height: sizeOf(`./public/images/culture/${dir}`).height,
      };
    }),
  };

  res.send(images);
});

router.get("/nature", function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/nature`);
  //   console.log(readDir);
  const images = {
    results: readDir.map((dir) => {
      return {
        id: `nature/${dir}`,
        path: `${ROOT_URL}/images/nature/${dir}`,
        width: sizeOf(`./public/images/nature/${dir}`).width,
        height: sizeOf(`./public/images/nature/${dir}`).height,
      };
    }),
  };

  res.send(images);
});

router.get("/wallpaper", function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/wallpaper`);
  //   console.log(readDir);
  const images = {
    results: readDir.map((dir) => {
      return {
        id: `wallpaper/${dir}`,
        path: `${ROOT_URL}/images/wallpaper/${dir}`,
        width: sizeOf(`./public/images/wallpaper/${dir}`).width,
        height: sizeOf(`./public/images/wallpaper/${dir}`).height,
      };
    }),
  };

  res.send(images);
});

module.exports = router;
