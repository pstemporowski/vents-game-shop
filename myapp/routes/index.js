var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Database--1",
  database: "vents_gameshop"
});

con.connect(function (err) {
  if(err) throw err;
  console.log("Connected");
});



/* GET home page. */
router.get('/', function(req, res, next) {
  var mysqlResult 
  con.query("SELECT * FROM user", function (err, result) {
    if(err) throw err;
    mysqlResult = result;
  });
  res.render('index', { title: 'Express', users: mysqlResult});
});


router.get('/db/all', function(req, res, next) {
  con.query("SELECT * FROM actor", function (err, result) {
    if(err) throw err;
    mysqlResult = result;
  });
  res.send(mysqlResult)
});
module.exports = router;
