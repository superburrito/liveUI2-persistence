  /* global $ */

$(function setup (){
  // Load day buttons
  $.get('/api/days', function(days){
    console.log(days);
    days.forEach(function(day){
      console.log('Loading Day ' + day.number + 'to Day-Button Panel');
      $('.day-buttons').append(
        '<button class="btn btn-circle day-btn different-day">' +
         day.number + '</button>');
    });
  });

});
