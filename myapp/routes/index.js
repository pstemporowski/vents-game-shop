var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Database--1",
  database: "sakila"
});

con.connect(function (err) {
  if(err) throw err;
  console.log("Connected");
});

con.query("SELECT * FROM actor", function (err, result) {
  if(err) throw err;
  console.log(result);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
