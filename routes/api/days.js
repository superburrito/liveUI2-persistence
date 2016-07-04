var express = require('express');
var daysRouter = express.Router();
var Day = require('../../models/day');
var Hotel = require('../../models/hotel');
var Restaurant = require('../../models/restaurant');
var Activity = require('../../models/activity');
var Place = require('../../models/place');
var Promise = require('bluebird');

// Loading all days
daysRouter.get('/api/days', function(req,res,next){
	Day.findAll({
		order: 'number ASC'
	})
	.then(function(days){
		if(days.length === 0){
			Day.create({
				number: 1
			})
			.then(function(createdDay){
				res.send([createdDay]);
			});
		}else{
			res.send(days);
		}
	})
});
// Loading a day
daysRouter.get('/api/days/:dayNum', function(req,res,next){
	var dayNum = req.params.dayNum;
	Day.findOne({
		where: {
			number: dayNum
		},
		include: [Hotel, Restaurant, Activity],
		order: 'number ASC'
	})
	.then(function(day){
		res.send(day);
	})
	.catch(next);
});
// Adding a day
daysRouter.post('/api/days/', function(req,res,next){
	Day.max('number')
	.then(function(maxDayNum){
		var number = maxDayNum + 1;
	 		return Day.create({
			number: number
		})
	})
	.then(function(newDay){
		res.send(newDay);
	})
	.catch(next);
});
// Deleting a day
daysRouter.delete('/api/days/:dayNum', function(req,res,next){
	var dayNum = req.params.dayNum;
	var subsequentDaysProm = Day.findAll({
		where: {
			number: {
				$gt: dayNum
			}
		}
	})
	.then(function(subsequentDays){
		subsequentDays.forEach(function(day){
			console.log('Subsequent Day' + day.number + 'number decremented');
			day.update({
				number: day.number - 1
			});
		});
	})
	.then(function(){
		return Day.destroy({
			where: {
				number: dayNum
			}
		});
	})
	.then(function(deletedDay){
		console.log('Deleted Day is: ' + deletedDay);
	})
	.then(function(){
		res.end();
	})
	.catch(next);
});

// Adding hotels, restaurants and activities to a day
daysRouter.post('/api/days/:dayNum/hotels/:hotelId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var hotelId = req.params.hotelId;
	Day.findOne({
		where: {
			number: dayNum
		}
	})
	.then(function(day){
		day.update({
			hotelId: hotelId
		});
		return Hotel.findOne({
			where: {
				id: hotelId
			}
		});
	})
	.then(function(hotel){
		console.log('Server: Added hotel placeid is:' + hotel.placeId);
		res.send(hotel);
	})
	.catch(next);
});

daysRouter.post('/api/days/:dayNum/restaurants/:restaurantId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var restaurantId = req.params.restaurantId;
	var dayProm = Day.findOne({
		where: {
			number: dayNum
		}
	});
	var restProm = Restaurant.findOne({
		where: {
			id: restaurantId
		}
	});
	Promise.all([dayProm,restProm])
	.spread(function(day,restaurant){
		return day.addRestaurant(restaurant);
	})
	.then(function(){
		return Restaurant.findOne({
			where:{
				id: restaurantId
			}
		});
	})
	.then(function(addedRestaurant){
		res.send(addedRestaurant);
	})
	.catch(next);
});

daysRouter.post('/api/days/:dayNum/activities/:activityId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var activityId = req.params.activityId;
	var dayProm = Day.findOne({
		where: {
			number: dayNum
		}
	});
	var actProm = Activity.findOne({
		where: {
			id: activityId
		}
	});
	Promise.all([dayProm,actProm])
	.spread(function(day,activity){
		return day.addActivity(activity);
	})
	.then(function(){
		return Activity.findOne({
			where:{
				id: activityId
			}
		});
	})
	.then(function(addedActivity){
		res.send(addedActivity);
	})
	.catch(next);
});


// Deleting hotels, restaurants, and activities from a day
daysRouter.delete('/api/days/:dayNum/restaurants/:restaurantId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var restaurantId = req.params.restaurantId;
	var dayProm = Day.findOne({
		where: {
			number: dayNum
		}
	});
	var restProm = Restaurant.findOne({
		where: {
			id: restaurantId
		}
	});
	Promise.all([dayProm,restProm])
	.spread(function(day,restaurant){
		return day.removeRestaurant(restaurant);
	})
	.then(function(updatedDay){
		res.end();
	})
	.catch(next);
});
daysRouter.delete('/api/days/:dayNum/activities/:activityId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var activityId = req.params.activityId;
	var dayProm = Day.findOne({
		where: {
			number: dayNum
		}
	});
	var actProm = Activity.findOne({
		where: {
			id: activityId
		}
	});
	Promise.all([dayProm,actProm])
	.spread(function(day,activity){
		console.log(activity.name + "removed from Day" + day.number);
		return day.removeActivity(activity);
	})
	.then(function(updatedDay){
		res.end();
	})
	.catch(next);
});
daysRouter.delete('/api/days/:dayNum/hotels/:hotelId', function(req,res,next){
	var dayNum = req.params.dayNum;
	var hotelId = req.params.hotelId;
	Day.findOne({
		where: {
			number: dayNum
		}
	})
	.then(function(day){
		return day.update({
			hotelId: null
		});
	})
	.then(function(updatedDay){
		res.end();
	})
	.catch(next);
});


daysRouter.post('/api/places/:placeId', function(req,res,next){
	var placeId = req.params.placeId;
	Place.findOne({
		where: {
			id: placeId
		}
	})
	.then(function(place){
		console.log('Coordinates returned are ' + place.location);
		res.send(place.location);
	})
	.catch(next);
});


module.exports = daysRouter;
