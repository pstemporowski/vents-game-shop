var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Database--1",
  database: "sakila"
});
var mysqlResult; 

con.connect(function (err) {
  if(err) throw err;
  console.log("Connected");
});

con.query("SELECT * FROM actor", function (err, result) {
  if(err) throw err;
  mysqlResult = result;
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/db/all', function(req, res, next) {
  res.send(mysqlResult)
});
module.exports = router;
