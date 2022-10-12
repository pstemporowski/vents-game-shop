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
  con.query("SELECT * FROM user_info LIMIT 15", function (err, userList) {
    if(err) throw err;

    con.query("SELECT * FROM game_info LIMIT 15", function (err, gameList) {
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

router.get('/addGame', function(req, res, next) {
  res.render('createGame', {title: 'addGame'});
});

router.get('/users/:userId', function(req, res, next) {
  let userId = req.params.userId;
  let commentsList = {};
  let singleUser;
  con.query('CALL user_details(' + userId + ')', function (err, result) {
    if(err) throw err;

    singleUser = result[0][0];

    if(!singleUser){
      res.status(404).send("User nicht gefunden");
      return;
    }

    con.query('SELECT * FROM user_comments WHERE user_ID = ' + userId, function(err, resComments) {

      if(err) {
        res.status(404).send('Problem mit der Datenbank ist aufgetreten');
        throw err;
      }
      con.query('SELECT * FROM games_owned WHERE user_ID =' + userId, function(err, gamesList) {

        if(err) {
          res.status(404).send('Problem mit der Datenbank ist aufgetreten');
          throw err;
        }
      
        commentsList = resComments;
        res.render('singleUser', { title: 'Express', user: singleUser, comments: commentsList, games: gamesList});
      });
    }); 
      
    
    
  });
});

router.get('/games/:gameId', function(req, res, next) {
  let gameId = req.params.gameId;
  let singleGame = {};
  con.query('CALL game_details(' + gameId + ');' , function (err, result) {
    
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }
    
    singleGame = result[0][0];

    if(!singleGame) {
      res.status(404).send("GAME nicht gefunden");
      return;
    }

      con.query('SELECT * FROM game_comments WHERE game_id = ' + gameId, function (err, commentsList) {

        if(err) {
          res.status(404).send('Problem mit der Datenbank ist aufgetreten');
          throw err;
        }
        con.query('CALL like_info(' + gameId + ')', function (err, like_info) {
          console.log(like_info);
          if(err) {
            res.status(404).send('Problem mit der Datenbank ist aufgetreten');
            throw err;
          }
          res.render('singleGame', { title: 'Express', game: singleGame, comments: commentsList, info: like_info[0][0]});
        });
      });   
  });
});

router.post('/addGame', function(req, res, next) {
  console.log(req.body.fsk);
  con.query('INSERT INTO games (title, price, picture, studio_id, FSK, description)' +
   ' VALUES ("' + req.body.title + '",' + req.body.price + ',"'
    +req.body.picture+ '",' + req.body.studio_id +
    ',' + req.body.fsk + ',"' + req.body.description + '")', function(err, result) {
      if(err) {
        res.status(404).send(err);
        return;
      }

      res.send("Added");
    });  
});

router.get('/editGame/:gameID', function(req, res, next) {
  var gameId = req.params.gameID;
  var singleGame;
  con.query('select * from games where game_id=' + gameId + ';' , function (err, result) {
    
    if(err) {
      res.status(404).send('Problem mit der Datenbank ist aufgetreten');
      throw err;
    }

    singleGame = result[0];

    if(!singleGame)
      res.status(404).send('Game wurde nicht gefunden');

    res.render('editGame', {title:'Test', game: singleGame});
    
  });
});

router.put('/editGame/:gameID', function(req, res, next) {
  console.log('#im in');
  var game = req.params.gameID;
  con.query('UPDATE games ' + 
  'SET title ="' +req.body.title + '",'+
  'price =' + req.body.price + ',' +
  'picture ="' + req.body.picture + '",' +
  'fsk =' + req.body.fsk + ',' +
  'description ="' +req.body.description + '",' +
  'studio_id =' + req.body.studio_id + " " +
  'WHERE game_id=' + game
  , function(err, result) {
      if(err) {
        res.status(404).send(err);
        return;
      }

      res.send(game);
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

  con.query( 'DELETE FROM comments WHERE comment_id =' + comment, function(err, result) {
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
