var express = require("express");
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get("/anime", function (req, res, next) {
  console.log(req.query.amount);
  let readDir = fs.readdirSync(`./public/images/anime`);
  //   console.log(readDir);
  const images = {
    results: readDir.map((dir) => {
      return {
        id: `anime/${dir}`,
        path: `http://localhost:3005/images/anime/${dir}`,
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
        path: `http://localhost:3005/images/culture/${dir}`,
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
        path: `http://localhost:3005/images/nature/${dir}`,
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
        path: `http://localhost:3005/images/wallpaper/${dir}`,
      };
    }),
  };

  res.send(images);
});

module.exports = router;
