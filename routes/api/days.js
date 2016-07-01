var express = require('express');
var daysRouter = express.Router();
var Day = require('../../models/day');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');


// Get all days
daysRouter.get('/api/days', function(req,res,next){
	Day.findAll({})
	.then(function(days){
		res.send(days);
	})
});

// Get a day
daysRouter.get('/api/days/:index', function(req,res,next){
	var dayIndex = req.params.index;
	Day.findOne({
		where: {
			number: dayIndex
		},
		include: [Hotel, Restaurant, Activity]
	})
	.then(function(day){
		console.log("Data for the day:", day);
		res.send(day);
	})
	.catch(next);
});

// Delete a day
daysRouter.delete('/api/days/:index', function(req,res,next){
	var dayIndex = req.params.index;
	Day.destroy({
		where: {
			number: dayIndex
		}
	})
	.catch(next);
});


// Adding a day
daysRouter.post('/api/days/', function(req,res,next){
	Day.max('number')
	.then(function(maxDayIndex){
		var number = maxDayIndex + 1;
		return Day.create({
			number: number
		})
	})
	.then(function(newDay){
		res.send(newDay);
	})
	.catch(next);
});


// Change a day's hotels, restaurants, and activities
daysRouter.post('/api/days/:index/hotels', function(req,res,next){
	var dayIndex = req.params.index;
	var hotelId = req.body.hotelId;
	Day.findOne({
		where: {
			number: dayIndex
		}
	})
	.then(function(day){
		return day.update({
			hotelId: hotelId
		});
	})
	.then(function(updatedDay){
		res.send(updatedDay);
	})
	.catch(next);
});

daysRouter.post('/api/days/:index/restaurants', function(req,res,next){
	var dayIndex = req.params.index;
	var restaurantId = req.body.restaurantId;
	var dayProm = Day.findOne({
		where: {
			number: dayIndex
		}
	});
	var restProm = Restaurant.findOne({
		where: {
			id: restaurantId
		}
	});
	Promise.all([dayProm,restProm])
	.spread(function(day,restaurant){
			day.addRestaurant(restaurant);
	})
	.then(function(updatedDay){
		res.send(updatedDay);
	})
	.catch(next);
});

daysRouter.post('/api/days/:index/activities', function(req,res,next){
	var dayIndex = req.params.index;
	var activityId = req.body.activityId;
	var dayProm = Day.findOne({
		where: {
			number: dayIndex
		}
	});
	var actProm = Activity.findOne({
		where: {
			id: activityId
		}
	});
	Promise.all([dayProm,actProm])
	.spread(function(day,activity){
			day.addActivity(activity);
	})
	.then(function(updatedDay){
		res.send(updatedDay);
	})
	.catch(next);
});




module.exports = daysRouter;
