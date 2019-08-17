//Parallax effect function.
$(document).ready(function () {
  $('.parallax').parallax();

  var latTest = 44.976537;
  var longTest = -93.224576;
  var queryURL = "https://developers.zomato.com/api/v2.1/search?count=5&lat=" + latTest + "&lon=" + longTest + "&radius=4023.36&sort=real_distance&apikey=8b2f1efc94c42842b627309b15cae91b";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    var markers = [];
    var restaurantCount = response.restaurants.length;
    for (var i = 0; i < restaurantCount; i++) {
      markers.push([response.restaurants[i].restaurant.name, response.restaurants[i].restaurant.location.latitude, response.restaurants[i].restaurant.location.longitude])
    }
   // initMap(markers);
    console.log(response)
    console.log(markers);
  })


  function initMap() {
    // The location of midPoint
    var midPoint = {lat: -25.344, lng: 131.036};
    // The map, centered at midPoint
    var map = new google.maps.Map(
        $("#map-container"), {zoom: 12, center: midPoint});
    // The marker, positioned at midPoint
    var marker = new google.maps.Marker({position: midPoint, map: map});
  }
  google.maps.event.addDomListener(window, 'load', initialise);


});