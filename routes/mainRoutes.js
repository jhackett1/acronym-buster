const express = require('express');
const mainRouter = express.Router();

module.exports = function () {

  mainRouter.route('/')
    .get(function (req, res) {
      res.render('index');
    });

  return mainRouter;
};
