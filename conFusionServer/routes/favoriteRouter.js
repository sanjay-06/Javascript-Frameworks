const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Favorites = require('../models/favorites');
const User = require('../models/users');

var authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((Favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    else {
      Favorites.findOne({user: mongoose.Types.ObjectId(user._id)}, (err, favorite) => {
        if (err) {
          return done(err, false);
        }
        else {
          Favorites.findOneAndUpdate(
              {user: mongoose.Types.ObjectId(user._id)},
              {$addToSet: { dishes: req.body._id } },
              {upsert: true,  returnNewDocument: true}
          )
          .then((user_favorite) => {

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(user_favorite);
          }, (err) => next(err))
          .catch((err) => next(err));

        }
      })
    }
  })

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    else {
      Favorites.remove({user: mongoose.Types.ObjectId(user._id)})
      .then((resp) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(resp);
      }, (err) => next(err))
      .catch((err) => next(err));
    }
  })
});

favoriteRouter.route('/:dishId')
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    else {
      Favorites.findOne({user: mongoose.Types.ObjectId(user._id)}, (err, favorite) => {
        if (err) {
          return done(err, false);
        }
        else {
          Favorites.findOneAndUpdate(
              {user: mongoose.Types.ObjectId(user._id)},
              {$addToSet: { dishes: req.params.dishId } },
              {upsert: true,  returnNewDocument: true}
          )
          .then((user_favorite) => {

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(user_favorite);
          }, (err) => next(err))
          .catch((err) => next(err));

        }
      })
    }
  })

})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  Favorites.update({user: mongoose.Types.ObjectId(req.user._id)}, { $pull: {dishes: req.params.dishId } } )
  .then((resp) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = favoriteRouter;
