$(function interfaceLoader(){

  /* global $ mapModule setupModule hotels restaurants activities */

  /*** LOAD "MODULES" ***/
  var currentMap = mapModule.currentMap;
  var markers = mapModule.markers;
  var drawMarker = mapModule.drawMarker;


  var currentDay = $.get('/api/days/1');

  /*** HELPERS ***/
  // REBUILD Helper for Day-switching and Day-removing

  /**** ADDING HOTELS ***/
  $('#hotel-button').on('click', function(){
    var hotelName = $('#hotel-choices option:selected').text();
    var hotelId = $('#hotel-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/hotels', {hotelId: hotelId})
    .done(function(){
      $('#iti-hotel-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + hotelName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
              '</div>');
      console.log('Hotel for currentDay has been changed. Data is now', currentDay);
    });
  });

  /*** ADDING RESTAURANTS ***/
  $('#restaurant-button').on('click', function(){
    var restaurantName = $('#restaurant-choices option:selected').text();
    var restaurantId = $('#restaurant-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/restaurants', {restaurantId: restaurantId})
    .done(function(){
      $('#iti-restaurant-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + restaurantName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
              '</div>');
      console.log('Restaurants for currentDay have been changed.');
    });
  });

  /*** ADDING ACTIVITIES ***/
  $('#activity-button').on('click', function(){
    var activityName = $('#activity-choices option:selected').text();
    var activityId = $('#activity-choices option:selected').val();
    $.post('/api/days/' + currentDay.number + '/activities', {activityId: activityId})
    .done(function(){
      $('#iti-activity-list')
      .append('<div class="itinerary-item">' +
              '<span class="title">' + activityName + '</span>' +
              '<button class="btn btn-xs btn-danger remove btn-circle">x</button>' +
              '</div>');
      console.log('Activities for currentDay have been changed.');
    });
  });


  /**** ADDING DAYS***/
  $('#day-add').on('click', function(){
    $.post('/api/days')
    .done(function(newDay){
      console.log("Adding a new day: " + newDay);
      $('.day-buttons')
      .append('<button class="btn btn-circle day-btn different-day">' + 
              newDay.number + '</button>');
    });
  });


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

    // Rebuilding, highlight newly selected day
    var currentDayButton = $(this);
    currentDayButton.removeClass('different-day').addClass('current-day');
    // Change selected day
    $.get('api/days/' + parseInt(currentDayButton.text()),
    function(dayData){
      console.log("Current Day changed to", dayData);
      currentDay = dayData;
      $('#day-title span').text('Day ' + dayData.number);
    });
  });



  /**** REMOVING DAYS***/
  $('.btn.btn-xs.btn-danger.remove.btn-circle').on('click', function(){
    // If last day left, break
    if (days.length <= 1) return alert('Last Day -- You cannot delete this!');

    // Else proceed
    // Unhighlight current button, mark new button to be highlighted
    var dayButtonToDelete = $('.current-day').removeClass('current-day');
    var dayButtonToSwitchTo;
    // If Deleted button is the last in the row
    if(currentDay.index < getLastDay().index){
      // Mark the new button we want to switch to
      dayButtonToSwitchTo = dayButtonToDelete.next();
      // Decrement indexes for all days with indexes larger than the day we are deleting
      days.forEach(function(day){
        if(day.index > currentDay.index) day.index--;
      });
      // Remove currentDay, but note its index beforehand
      var deletedIndex = currentDay.index; 
      days.splice(days.indexOf(currentDay),1);
      // Set new currentDay (which uses the index as what was just removed!)
      currentDay = findDayByIndex(deletedIndex);
      console.log('Days spliced, days is now', days);
      // Change labels
      dayButtonToDelete.nextUntil('#day-add').each(function(index){
        var dayLabel = parseInt($(this).text());
        $(this).text(dayLabel-1);
      });
    // Else if deleted button is the last in the row
    }else{
      dayButtonToSwitchTo = dayButtonToDelete.prev();
      days.pop();
      console.log('Days popped, days is now', days);
      currentDay = findDayByIndex(currentDay.index-1);
      // Change day title
      $('#day-title span').text('Day ' + currentDay.index);
    }
    
    // Re-organise buttons
    dayButtonToDelete.remove();
    dayButtonToSwitchTo.removeClass('different-day').addClass('current-day');

    // Destroy old
    $('#iti-hotel-list').empty();
    $('#iti-restaurant-list').empty();
    $('#iti-activity-list').empty();
    markers.forEach(function(marker){
      marker.setMap(null);
    });

    // Rebuild with new data
/*    console.log("rebuilding with", currentDay);
    currentDay.hotelArr.forEach(function(hotelId){
      rebuildHelper('hotel', hotelId, hotels);
    });
    currentDay.restaurantArr.forEach(function(restaurantId){
      rebuildHelper('restaurant', restaurantId, restaurants);
    });
    currentDay.activityArr.forEach(function(activityId){
      rebuildHelper('activity', activityId, activities);
    });*/
  });
});