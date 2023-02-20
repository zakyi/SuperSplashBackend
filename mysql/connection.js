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
