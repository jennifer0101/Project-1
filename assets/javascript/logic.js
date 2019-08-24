//Parallax effect function.
$(document).ready(function () {
  $('.parallax').parallax();
  $("#submit").on("click", validateInputs);
});

var map;

function zomatoCall(midPoint) {
  let queryURL = "https://developers.zomato.com/api/v2.1/search?count=5&lat=" + midPoint.lat + "&lon=" + midPoint.lng + "&radius=4023.36&sort=real_distance&apikey=8b2f1efc94c42842b627309b15cae91b";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    let markers = [];
    let restaurantCount = response.restaurants.length;
    for (var i = 0; i < restaurantCount; i++) {
      markers.push([response.restaurants[i].restaurant.name, response.restaurants[i].restaurant.location.latitude, response.restaurants[i].restaurant.location.longitude])
    }
    console.log(response)
    console.log(markers);
    midPointMap(midPoint, markers);
  })
}

function geoCodeAddresses(addresses) {
  let geocoder = new google.maps.Geocoder();
  let latlongs = [];
  $(addresses).each(function (index, value) {
    geocoder.geocode({
      'address': value
    }, function (results, status) {
      if (status === "OK") {
        latlongs.push([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
      } else {
        // ****************need to make this a modal or something other than an alert. i guess we don't HAVE to have it, but it's a good UX****************
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  })
  console.log(latlongs);
  midPointCalc(latlongs);
}

function midPointCalc(latlongs) {
  let midPoint;
  let midPointTest = {
    lat: 44.976537,
    lng: -93.224576
  };
  // *********************make calculation here using latlongs argument that gets passed in*********************
  zomatoCall(midPointTest);
}

function initMap() {
  // The location of the midPoint of USA
  let midPointUSA = {
    lat: 39.8283,
    lng: -98.5795
  };

  // The map, centered at midPointUSA
  let mapOptions = {
    mapTypeId: 'roadmap',
    zoom: 3.5,
    center: midPointUSA
  };
  map = new google.maps.Map(document.getElementById("map-container"), mapOptions);
}

function midPointMap(midPoint, markers) {
  map.setCenter(midPoint);
  // map.setZooom(12);  <- likely not need with fitbounds function below
  let bounds = new google.maps.LatLngBounds();
  let radius = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.15,
    map: map,
    center: midPoint,
    radius: 4023.36
  });

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
  for (i = 0; i < markers.length; i++) {
    let position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i][0]
    });

    // Allow each marker to have an info window           *********************OUT of CURRENT SCOPE********************
    //       google.maps.event.addListener(marker, 'click', (function(marker, i) {
    //           return function() {
    //               infoWindow.setContent(infoWindowContent[i][0]);
    //               infoWindow.open(map, marker);
    //           }
    //       })(marker, i));

    // Automatically center the map fitting all markers on the screen
    map.fitBounds(bounds);
  }

  // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
  let boundsListener = google.maps.event.addListener((map), 'bounds_changed', function (event) {
    this.setZoom(12);
    google.maps.event.removeListener(boundsListener);
  });
}

function validateInputs(event) {
  event.preventDefault();
  let badInputCheck = false;
  let address_twoA = $("#address_twoA").val().trim();
  let address_twoB = $("#address_twoB").val().trim();
  let newPElem_ZipA = $("<p class=\"zip redText\">");
  let newPElem_ZipB = $("<p class=\"zip redText\">");
  let newPElem_StateA = $("<p class=\"state redText\">");
  let newPElem_StateB = $("<p class=\"state redText\">");
  let inputsRequired = {
    address_oneA: $("#address_oneA").val().trim(),
    cityA: $("#cityA").val().trim(),
    stateA: $("#stateA").val().trim(),
    zipcodeA: $("#zipcodeA").val().trim(),
    address_oneB: $("#address_oneB").val().trim(),
    cityB: $("#cityB").val().trim(),
    stateB: $("#stateB").val().trim(),
    zipcodeB: $("#zipcodeB").val().trim()
  }
  let lowerStateA = inputsRequired.stateA.toLowerCase();
  let lowerStateB = inputsRequired.stateB.toLowerCase();
  let fullAddressA;
  let fullAddressB;
  let addresses = [];

  $(newPElem_ZipA).text("Improper zipcode format, XXXXX or XXXXX-XXXX are acceptable.");
  $(newPElem_ZipB).text("Improper zipcode format, XXXXX or XXXXX-XXXX are acceptable.");
  $(newPElem_StateA).text("Improper state format, XX is acceptable.");
  $(newPElem_StateB).text("Improper state format, XX is acceptable.");

  $(Object.keys(inputsRequired)).each(function (index, value) {
    let newPElem = $("<p class=\"empty redText\">");
    $(newPElem).text("You cannot leave this field empty");
    if (!inputsRequired[value]) {
      $("#" + value).addClass("inputError");
      if ($("#" + value).siblings(".empty").length === 0) {
        $(newPElem).addClass("empty");
        $("#" + value).parent().append(newPElem);
      }
      badInputCheck = true;
    } else {
      if ($("#" + value).hasClass("inputError")) {
        $("#" + value).removeClass("inputError")
      }
      if ($("#" + value).siblings(".empty")) {
        $("#" + value).siblings(".empty").remove();
      }
    }
  })

  // Testing if ZipA is in proper format
  if (!/^\d{5}$|^\d{5}-\d{4}$/.test(inputsRequired.zipcodeA)) {
    if ($("#zipcodeA").siblings(".zip").length === 0) {
      $("#zipcodeA").parent().append(newPElem_ZipA);
    }
    badInputCheck = true;
  } else {
    if ($("#zipcodeA").siblings(".zip")) {
      $("#zipcodeA").siblings(".zip").remove();
    }
  }

  // Testing if ZipB is in proper format
  if (!/^\d{5}$|^\d{5}-\d{4}$/.test(inputsRequired.zipcodeB)) {
    if ($("#zipcodeB").siblings(".zip").length === 0) {
      $("#zipcodeB").parent().append(newPElem_ZipB);
    }
    badInputCheck = true;
  } else {
    if ($("#zipcodeB").siblings(".zip")) {
      $("#zipcodeB").siblings(".zip").remove();
    }
  }

  // Testing if StateA is in proper format
  if (!/^[a-z]{2}$/.test(lowerStateA)) {
    if ($("#stateA").siblings(".state").length === 0) {
      $("#stateA").parent().append(newPElem_StateA);
    }
    badInputCheck = true;
  } else {
    if ($("#stateA").siblings(".state")) {
      $("#stateA").siblings(".state").remove();
    }
  }

  // Testing if StateB is in proper format
  if (!/^[a-z]{2}$/.test(lowerStateB)) {
    if ($("#stateB").siblings(".state").length === 0) {
      $("#stateB").parent().append(newPElem_StateB);
    }
    badInputCheck = true;
  } else {
    if ($("#stateB").siblings(".state")) {
      $("#stateB").siblings(".state").remove();
    }
  }

  // If any inputs are deemed bad, this function returns false, else return full addresses and geocode them for lat/long
  if (badInputCheck) {
    return false
  } else {
    if (address_twoA) {
      fullAddressA = inputsRequired.address_oneA + ", " + address_twoA + ", " + inputsRequired.cityA + ", " + inputsRequired.stateA + " " + inputsRequired.zipcodeA;
    } else {
      fullAddressA = inputsRequired.address_oneA + ", " + inputsRequired.cityA + ", " + inputsRequired.stateA + " " + inputsRequired.zipcodeA;
    }
    if (address_twoB) {
      fullAddressB = inputsRequired.address_oneB + ", " + address_twoB + ", " + inputsRequired.cityB + ", " + inputsRequired.stateB + " " + inputsRequired.zipcodeB;
    } else {
      fullAddressB = inputsRequired.address_oneB + ", " + inputsRequired.cityB + ", " + inputsRequired.stateB + " " + inputsRequired.zipcodeB;
    }
    addresses.push(fullAddressA, fullAddressB);
    geoCodeAddresses(addresses);
  }
}