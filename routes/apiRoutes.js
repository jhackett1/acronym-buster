var express = require('express');
var apiRouter = express.Router();
const MongoClient = require('mongodb').MongoClient;
const expressValidator = require('express-validator');

module.exports = function (mongoUrl) {

  // Get all acronyms held in the DB
  apiRouter.route('/acronyms/all')
    .get(function (req, res) {
      MongoClient.connect(mongoUrl, function (err, db) {
        var collection = db.collection('acronyms');
        collection.find().toArray(function (err, results) {
          res.send(results);
        });
      });
    });

  // Get ten random records to fuel a quiz
  apiRouter.route('/acronyms/random')
    .get(function (req, res) {
      MongoClient.connect(mongoUrl, function (err, db) {
        var collection = db.collection('acronyms');
        collection.aggregate([{ $sample: { size: 10 } }]).toArray(function (err, results) {
          res.send(results);
        });
      });
    });

  // Get all leaderboard records
  apiRouter.route('/leaderboard')
    .get(function (req, res) {
      MongoClient.connect(mongoUrl, function (err, db) {
        var collection = db.collection('leaderboard');
        collection.find().toArray(function (err, results) {
          res.send(results);
        });
      });
    });

  // Add a new hiscore to the leaderboard
  apiRouter.route('/leaderboard/new')
    .post(function (req, res) {
      // Data validation
      req.checkBody('player', "Player can't be blank").notEmpty();
      req.checkBody('score', "Score needs to be a number").isInt();
      var valErrors = req.validationErrors();
      // If errors, stop and send errors to client, else continue
      if (valErrors) {
        res.json(valErrors)
        return;
      } else {
        // Create an object to hold the new score
        var newScore = {
          player: req.body.player,
          score: req.body.score
        };
        MongoClient.connect(mongoUrl, function (err, db) {
          var collection = db.collection('leaderboard');
          // Insert the new hiscore into the database
          collection.insert(newScore, function (err, result) {
            console.log(result);
            res.redirect('/');
          });
        });
      };
    });

  // Fallback route for malformed endpoint requests
  apiRouter.route('*')
    .get(function (req, res) {
      res.json({
        success: 0,
        message: 'Invalid API route',
      });
    });

  return apiRouter;
};
