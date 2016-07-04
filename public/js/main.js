$(function interfaceLoader(){

  /* global $ mapModule setupModule hotels restaurants activities */

  /*** LOAD "MODULES" ***/
  var currentMap = mapModule.currentMap;
  // Markers, an empty array
  var markers = mapModule.markers;
  // drawMarker, a function that takes (type, coords, id)
  var drawMarker = mapModule.drawMarker;
  // removeMarker, a function that takes (type, id)
  var removeMarker = mapModule.removeMarker;



  var currentDay = $.get('/api/days/1');
  $('#day-title span').text('Day 1');

  /*** HOTEL-ADDING ***/
  $('#hotel-button').on('click', function(){
    var hotelName = $('#hotel-choices option:selected').text();
    var hotelId = $('#hotel-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/hotels/' + hotelId)
    .then(function(addedHotel){
      $('#iti-hotel-list')
      .empty()
      .append('<div class="itinerary-item">' +
              '<span class="title">' + hotelName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
              hotelId + '">x</button>' +
              '</div>');
      console.log('Hotel for currentDay has been changed. Data is now', currentDay);
      $.post('/api/places/' + addedHotel.placeId)
      .then(function(coordinates){
        drawMarker('hotel', coordinates, hotelId);
      });
    });
  });
  /*** HOTEL-REMOVING ***/
  $('#iti-hotel-list').on('click', 
    '.btn.btn-xs.btn-danger.remove.btn-circle', function(){ 
    var button = $(this);
    var spanLabel = $(this).prev();
    var hotelId = $(this).data('id');
    console.log("Hotel id is", hotelId);
    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + currentDay.number + '/restaurants/' + hotelId
    })
    .then(function(){
      button.remove();
      spanLabel.remove();
      removeMarker('hotel', hotelId);
    });
  });

  /*** RESTAURANT-ADDING ***/
  $('#restaurant-button').on('click', function(){
    var restaurantName = $('#restaurant-choices option:selected').text();
    var restaurantId = $('#restaurant-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/restaurants/' + restaurantId)
    .then(function(addedRestaurant){
      $('#iti-restaurant-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + restaurantName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
              restaurantId + '">x</button>' +
              '</div>');
      console.log('Restaurants for currentDay have been changed.');
      $.post('/api/places/' + addedRestaurant.placeId)
      .then(function(coordinates){
        drawMarker('restaurant', coordinates, restaurantId);
      });
    });
  });
  /*** RESTAURANT-REMOVING ***/
  $('#iti-restaurant-list').on('click', 
    '.btn.btn-xs.btn-danger.remove.btn-circle', function(){ 
    var button = $(this);
    var spanLabel = $(this).prev();
    var restaurantId = $(this).data('id');
    console.log("Restaurant id is", restaurantId);
    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + currentDay.number + '/restaurants/' + restaurantId
    })
    .then(function(){
      button.remove();
      spanLabel.remove();
      removeMarker('restaurant', restaurantId);
    });
  });


  /*** ACTIVITY-ADDING ***/
  $('#activity-button').on('click', function(){
    var activityName = $('#activity-choices option:selected').text();
    var activityId = $('#activity-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/activities/' + activityId)
    .then(function(addedActivity){
      $('#iti-activity-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + activityName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
              activityId + '">x</button>' +
              '</div>');
      console.log('Activities for currentDay have been changed.');
      $.post('/api/places/' + addedActivity.placeId)
      .then(function(coordinates){
        drawMarker('activity', coordinates, activityId);
      });
    });
  });
  /*** ACTIVITY-REMOVING ***/
  $('#iti-activity-list').on('click', 
    '.btn.btn-xs.btn-danger.remove.btn-circle', function(){ 
    var button = $(this);
    var spanLabel = $(this).prev();
    var activityId = $(this).data('id');
    console.log("Activity id is", activityId);
    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + currentDay.number + '/activities/' + activityId
    })
    .then(function(){
      button.remove();
      spanLabel.remove();
      removeMarker('activity', activityId);
    });
  }); 


  /**** DAY-ADDING ***/
  $('.panel-heading').on('click', '#day-add', function(){
    $.post('/api/days')
    .then(function(newDay){
      console.log("Adding a new day: " + newDay);
      $('.day-buttons')
      .append('<button class="btn btn-circle day-btn different-day">' + 
              newDay.number + '</button>');
    });
  });


  /*** HELPER FOR SWITCH/REMOVE ***/
  function renderIti(dayData){
    currentDay = dayData;
    console.log("post-delete current day is", currentDay);
    $('#day-title span').text('Day ' + dayData.number);
    // If item exists, add to itinerary
    if(dayData.hotel){
      $('#iti-hotel-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + dayData.hotel.name + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
              dayData.id + '">x</button>' +
              '</div>');  
      $.post('/api/places/' + dayData.hotel.placeId)
      .then(function(coordinates){
        drawMarker('hotel', coordinates, dayData.hotel.id);
      });
    }
    dayData.restaurants.forEach(function (resObj){
      $('#iti-restaurant-list')
      .append('<div class="itinerary-item">' +
            '<span class="title">' + resObj.name + '</span>' +
            '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
            resObj.id + '">x</button>' +
            '</div>');
      $.post('/api/places/' + resObj.placeId)
      .then(function(coordinates){
        drawMarker('restaurant', coordinates, resObj.id);
      });
    });
    dayData.activities.forEach(function (actObj){
      $('#iti-activity-list')
      .append('<div class="itinerary-item">' +
            '<span class="title">' + actObj.name + '</span>' +
            '<button class="btn btn-xs btn-danger remove btn-circle" data-id="' +
            actObj.id + '">x</button>' +
            '</div>');
      $.post('/api/places/' + actObj.placeId)
      .then(function(coordinates){
        drawMarker('activity', coordinates, actObj.id);
      });
    });
  }

  /**** SWITCHING DAYS***/
  $('.day-buttons').on('click', '.btn.btn-circle.day-btn.different-day', function(){
    // Destroying, un-highlight previous day
    $('.current-day').removeClass('current-day').addClass('different-day');
    // Clear itinerary for each section
    $('#iti-hotel-list').empty();
    $('#iti-restaurant-list').empty();
    $('#iti-activity-list').empty();
    // Clear markers
    markers.forEach(function(marker){
      marker.setMap(null);
    });
    // Rendering itinerary
    var currentDayButton = $(this);
    currentDayButton.removeClass('different-day').addClass('current-day');
    // Change selected day
    $.get('api/days/' + parseInt(currentDayButton.text()))
    .then(renderIti);
  });


  /*** REMOVING DAYS ***/
  $('.btn.btn-xs.btn-danger.remove.btn-circle').on('click', function(){
    // Count number of day buttons left, including + button
    var numberOfDayButtons = $('.day-buttons').children().length;
    if(numberOfDayButtons <= 2) return alert('Cannot delete last day!');
    // Unhighlight current button, mark new button to be highlighted
    var delDayNum = parseInt($('.current-day').text());
    var newCurrentDayNum;
    if(delDayNum + 1 == numberOfDayButtons){
      newCurrentDayNum = delDayNum - 1;
    }else{
      newCurrentDayNum = delDayNum;
    }
    $('.currentDay').remove();
    $('.day-buttons').empty();
    $('#iti-hotel-list').empty();
    $('#iti-restaurant-list').empty();
    $('#iti-activity-list').empty();
    // Delete the current day, update subsequent dayNums
    $.ajax({
      method: 'DELETE',
      url: '/api/days/' + delDayNum
    })
    // Reload days
    .then(function(){
      $.get('/api/days')  
      .then(function(days){
        $('.day-buttons').append(
          '<button class="btn btn-circle day-btn" id="day-add">+</button>');
        days.forEach(function(day){
          if(day.number === newCurrentDayNum){
            $('.day-buttons').append(
            '<button class="btn btn-circle day-btn current-day">' +
             day.number + '</button>');
          }else{
            $('.day-buttons').append(
            '<button class="btn btn-circle day-btn different-day">' +
             day.number + '</button>');
          }            
        });
      });
    })
    .then(function(){
      console.log("post-delete currentday num is", newCurrentDayNum); 
      $.get('api/days/' + newCurrentDayNum)
      .then(renderIti);
    });
  });


});