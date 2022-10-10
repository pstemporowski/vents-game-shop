var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const { compile } = require('pug');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Database--1",
  database: "vents_gameshop"
});
var mysqlResult;
con.connect(function (err) {
  if(err) throw err;
  console.log("Connected");
});



/* GET home page. */
router.get('/', function(req, res, next) {
  con.query("SELECT * FROM user", function (err, result) {
    if(err) throw err;
    mysqlResult = result;
  });
  res.render('index', { title: 'Express', users: mysqlResult});
});

router.get('/users/:userId', function(req, res, next) {
  let userId = req.params.userId;
  let singleUser = {};
  con.query('SELECT * FROM user WHERE user_id = ' + userId, function (err, result) {
    if(err) throw err;
    res.render('singleUser', { title: 'Express', user: result[0]});
  });
});

router.get('/games/:gameId', function(req, res, next) {
  let gameId = req.params.gameId;
  let singleUser = {};
  con.query('SELECT * FROM game WHERE game_id = ' + gameId, function (err, result) {
    if(err) throw err;
    res.render('singleGame', { title: 'Express', game: result[0]});
  });
});

router.post('/game', function(req, res, next) {
  con.query('INSERT INTO games (title, price, picture, studio_id, price, FSK, description)' +
   'VALUES ("' + req.body.params.title + '","' + req.body.params.price + '","'
    +req.body.params.picture+ '","' + req.body.params.studio_id + '","' + req.body.price +
    '","' + req.body.params.FSK + '","' + req.body.params.description + '")');
});

async function getData() {
  mysqlResult = await con.query("SELECT * FROM user", function (err, result) {
    if(err) throw err;
    mysqlResult = result;
  });
}
router.get('/db/all', function(req, res, next) {
  
  res.send(mysqlResult)
});
module.exports = router;
