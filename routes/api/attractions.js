var express = require('express');
var apiRouter = express.Router();
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');

apiRouter.get('/api/hotels', function(req,res,next){
	Hotel.findAll({})
	.then(function(hotelsData){
		res.send(hotelsData);
	});
});

apiRouter.get('/api/restaurants', function(req,res,next){
	Restaurant.findAll({})
	.then(function(restaurantsData){
		res.send(restaurantsData);
	});
});

apiRouter.get('/api/activities', function(req,res,next){
  Activity.findAll({})
  .then(function(activitiesData){
		res.send(activitiesData);
	});
});

module.exports = apiRouter;


