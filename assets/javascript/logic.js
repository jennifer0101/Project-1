//Parallax effect function.
$(document).ready(function () {
  $('.parallax').parallax();
});

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


function midPointMap(markers) {
  jQuery(function ($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "//maps.googleapis.com/maps/api/js?sensor=false&callback=initialize";
    document.body.appendChild(script);
  });



}

function placeholderMap(markers) {
  // The location of middle of the USA
  var midUSA = {
    lat: 39.8283,
    lng: -98.5795
  };
  // The map, centered at midUSA
  var map;
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    mapTypeId: 'roadmap',
    zoom: 3.5,
    center: midUSA
  };

  map = new google.maps.Map(document.getElementById("map-container"), mapOptions);

  // Info Window Content       *********************OUT of CURRENT SCOPE********************
  //   var infoWindowContent = [
  //       ['<div class="info_content">' +
  //  '<h3>London Eye</h3>' +
  //  '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' + '</div>'],
  //   
  //  ];

  // Display multiple markers on a map       *********************OUT of CURRENT SCOPE********************
  //  var infoWindow = new google.maps.InfoWindow(), marker, i;

  // Loop through our array of markers & place each one on the map  
  //  for (i = 0; i < markers.length; i++) {
  //    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
  //    bounds.extend(position);
  //    marker = new google.maps.Marker({
  //      position: position,
  //      map: map,
  //      title: markers[i][0]
  //    });

  // Allow each marker to have an info window           *********************OUT of CURRENT SCOPE********************
  //       google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //           return function() {
  //               infoWindow.setContent(infoWindowContent[i][0]);
  //               infoWindow.open(map, marker);
  //           }
  //       })(marker, i));

  // Automatically center the map fitting all markers on the screen
  //   map.fitBounds(bounds);
  //  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  //  var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
  //    this.setZoom(14);
  //    google.maps.event.removeListener(boundsListener);
  //  });
}