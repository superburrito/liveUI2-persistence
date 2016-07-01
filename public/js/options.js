$.get('/api/hotels', function(hotels){
	hotels.forEach(function(hotel){
		$('#hotel-choices')
		.append('<option value="' + hotel.id + '">' +
             hotel.name + '</option>');
	});
});

$.get('/api/restaurants', function(restaurants){
	restaurants.forEach(function(restaurant){
		$('#restaurant-choices')
		.append('<option value="' + restaurant.id + '">' +
             restaurant.name + '</option>');
	});
});

$.get('/api/activities', function(activities){
	activities.forEach(function(activity){
		$('#activity-choices')
		.append('<option value="' + activity.id + '">' +
             activity.name + '</option>');
	});
});

