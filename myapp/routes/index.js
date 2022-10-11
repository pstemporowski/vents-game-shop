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
  con.query("SELECT * FROM user_info LIMIT 5", function (err, userList) {
    if(err) throw err;

    con.query("SELECT * FROM game_info LIMIT 5", function (err, gameList) {
      if(err) throw err;
      res.render('index', { title: 'Express', users: userList, games: gameList});
    });
  });
  
});

router.get('/users', function(req, res, next) {
  con.query('SELECT * FROM user_info', function (err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }

    res.render('listUsers', {users: result});
  });
});

router.get('/games', function(req, res, next) {
  con.query('SELECT * FROM game_info', function (err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }

    res.render('listGames', {games: result});
  });
});

router.get('/users/:userId', function(req, res, next) {
  let userId = req.params.userId;
  let commentsList = {};
  let singleUser;
  con.query('SELECT * FROM users WHERE user_id = ' + userId, function (err, result) {
    if(err) throw err;

    singleUser = result[0];

    if(!singleUser){
      res.status(404).send("User nicht gefunden");
    }

    con.query('SELECT * FROM user_comments WHERE user_ID = ' + userId, function(err, resComments) {

      if(err) {
        res.status(404).send('Problem mit der Datenbank ist aufgetreten');
        throw err;
      }
      commentsList = resComments;
      res.render('singleUser', { title: 'Express', user: result[0], comments: commentsList});
    }); 
      
    
    
  });
});

router.get('/games/:gameId', function(req, res, next) {
  let gameId = req.params.gameId;
  let singleGame = {};
  con.query('SELECT * FROM games_info WHERE game_id = ' + gameId, function (err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }
    
    singleGame = result[0];

    if(!singleGame)
      res.status(404).send('Game not found'); 

    res.render('singleGame', { title: 'Express', game: singleGame});
  });
});

router.post('/addGame', function(req, res, next) {
  con.query('INSERT INTO games (title, price, picture, studio_id, FSK, description)' +
   ' VALUES ("' + req.body.title + '",' + req.body.price + ',"'
    +req.body.picture+ '",' + req.body.studio_id +
    ',' + req.body.FSK + ',"' + req.body.description + '")', function(err, result) {
      if(err) {
        res.status(404).send('Problem mit der Datenbank ist aufgetreten');
        throw err;
      }

      res.send("Added");
    });  
});


router.put('/editGame/:gameID', function(req, res, next) {
  var game = req.params.gameID;
  con.query('UPDATE games ' + 
  'SET title ="' +req.body.title + '",'+
  'price =' + req.body.price + ',' +
  'picture ="' + req.body.picture + '",' +
  'fsk =' + req.body.FSK + ',' +
  'description ="' +req.body.description + '"' +
  'WHERE game_id=' + game
  , function(err, result) {
      if(err) {
        res.status(404).send('Problem mit der Datenbank ist aufgetreten');
        throw err;
      }

      res.send("Edited");
    });  
});


router.delete('/deleteGame/:gameID', function(req, res, next) {
  var game = req.params.gameID;

  con.query( 'DELETE FROM games WHERE game_id =' + game, function(err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }
    
    res.send(game);
  });
});

router.delete('/deleteUser/:userID', function(req, res, next) {
  var user = req.params.userID;

  con.query( 'DELETE FROM users WHERE user_id =' + user, function(err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }
    res.send(user);
  });
});

router.delete('/deleteComment/:commentID', function(req, res, next) {
  var comment = req.params.commentID;

  con.query( 'DELETE FROM comments WHERE user_id =' + comment, function(err, result) {
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }

    res.send(comment);
  });
});


router.get('/db/all', function(req, res, next) {
  
  res.send(mysqlResult)
});

module.exports = router;
