//Materialize Parallax, submit effect function.
$(document).ready(function () {
  $('.parallax').parallax();
  $('select').material_select();
  $("#submit").on("click", validateInputs);
});

// Global variables and prototypes declared
var map;
var reviews = [];
//-- Define radius function
if (typeof (Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  }
}
//-- Define degrees function
if (typeof (Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function () {
    return this * (180 / Math.PI);
  }
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

function validateInputs(event) {
  event.preventDefault();
  let badInputCheck = false;
  let address_twoA = $("#address_twoA").val().trim();
  let address_twoB = $("#address_twoB").val().trim();
  let newPElem_ZipA = $("<p class=\"zip redText\">");
  let newPElem_ZipB = $("<p class=\"zip redText\">");
  let newPElem_StateA = $("<p class=\"state redText\">");
  let newPElem_StateB = $("<p class=\"state redText\">");
  let newPElem_Radius = $("<p class=\"radius redText\">");
  let inputsRequired = {
    address_oneA: $("#address_oneA").val().trim(),
    cityA: $("#cityA").val().trim(),
    stateA: $("#stateA").val().trim(),
    zipcodeA: $("#zipcodeA").val().trim(),
    address_oneB: $("#address_oneB").val().trim(),
    cityB: $("#cityB").val().trim(),
    stateB: $("#stateB").val().trim(),
    zipcodeB: $("#zipcodeB").val().trim(),
    radius: $("#radius").val().trim()
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
  $(newPElem_Radius).text("You must enter a whole integer number, no decimals or letters.")

  // Testing the required inputs to make sure they all have data. ie, are not empty
  $(Object.keys(inputsRequired)).each(function (index, value) {
    let newPElem = $("<p class=\"empty redText\">");
    $(newPElem).text("You cannot leave this field empty");
    if (!inputsRequired[value]) {
      $("#" + value).addClass("inputError");
      if ($("#" + value).siblings(".empty").length === 0) {
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

  // Testing if radius is a whole number
  if (!Number.isInteger(Number(inputsRequired.radius))) {
    if ($("#radius").siblings(".radius").length === 0) {
      $("#radius").parent().append(newPElem_Radius);
    }
    badInputCheck = true;
  } else {
    if ($("#radius").siblings(".radius")) {
      $("#radius").siblings(".radius").remove();
    }
  }

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

function geoCodeAddresses(addresses) {
  let geocoder = new google.maps.Geocoder();
  let latlongs = [];
  $(addresses).each(function (index, value) {
    geocoder.geocode({
      'address': value
    }, function (results, status) {
      if (status === "OK") {
        latlongs.push([results[0].geometry.location.lat(), results[0].geometry.location.lng()]);
        if (latlongs.length === addresses.length) {
          midPointCalc(latlongs);
        }
      } else {
        // ****************need to make this a modal or something other than an alert. i guess we don't HAVE to have it, but it's a good UX****************
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  })
}

function midPointCalc(latlongs) {
  let midPoint;
  let lat1 = latlongs[0][0];
  let lng1 = latlongs[0][1];
  let lat2 = latlongs[1][0];
  let lng2 = latlongs[1][1];

  //-- Longitude difference
  let dLng = (lng2 - lng1).toRad();

  //-- Convert to radians
  lat1 = lat1.toRad();
  lat2 = lat2.toRad();
  lng1 = lng1.toRad();
  let bX = Math.cos(lat2) * Math.cos(dLng);
  let bY = Math.cos(lat2) * Math.sin(dLng);
  let lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
  let lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

  //-- Return result
  midPoint = {
    lat: lat3.toDeg(),
    lng: lng3.toDeg()
  }
  console.log("midpoint: ", midPoint);
  zomatoCall(midPoint);
}

function zomatoCall(midPoint) {
  let cuisine = $("#cuisine").val();
  let radiusInput = $("#radius").val().trim();
  let queryURL;

  // converting miles input to meters as required by api call
  radiusInput = radiusInput * 1609.344;

  if (cuisine) {
    queryURL = "https://developers.zomato.com/api/v2.1/search?lat=" + midPoint.lat + "&lon=" + midPoint.lng + "&cuisines=" + cuisine + "&radius=" + radiusInput + "&sort=real_distance&apikey=8b2f1efc94c42842b627309b15cae91b";
  } else {
    queryURL = "https://developers.zomato.com/api/v2.1/search?lat=" + midPoint.lat + "&lon=" + midPoint.lng + "&radius=" + radiusInput + "&sort=real_distance&apikey=8b2f1efc94c42842b627309b15cae91b";
  }

  $.ajax({
    url: queryURL,
    method: "GET",
    data: radiusInput
  }).then(function (response) {
    let markers = [];
    let sorted = response.restaurants.slice(0);
    sorted.sort(function (a, b) {
      return b.restaurant.user_rating.aggregate_rating - a.restaurant.user_rating.aggregate_rating
    })

    for (var i = 0; i < 5; i++) {
      markers.push([sorted[i].restaurant.name, sorted[i].restaurant.location.latitude, sorted[i].restaurant.location.longitude, sorted[i].restaurant.location.address, sorted[i].restaurant.phone_numbers, sorted[i].restaurant.url, sorted[i].restaurant.user_rating.aggregate_rating])
      reviews.push(sorted[i].restaurant.all_reviews.reviews);
    }
    console.log("response: ", response);
    console.log("sorted resp: ", sorted);
    console.log(markers);
    console.log(reviews);
    midPointMap(midPoint, markers, radiusInput);
    createRestaurantTable(markers);
  })
}

function midPointMap(midPoint, markers, radiusInput) {
  map.setCenter(midPoint);
  let bounds = new google.maps.LatLngBounds();
  let radius = new google.maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.4,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.15,
    map: map,
    center: midPoint,
    radius: radiusInput
  });

  // Display multiple markers on a map
  let infoWindow = new google.maps.InfoWindow(),
    marker, i;

  // Loop through our array of markers & place each one on the map  
  for (i = 0; i < markers.length; i++) {
    let infoWindowContent = "<div class=\"info_content\">" + "<h6>" + markers[i][0] + "</h6>" + "<p class=\"infoWindowContentMargin\">" + markers[i][3] + "</p>" + "<p class=\"infoWindowContentMargin\">" + markers[i][4] + "</p>" + "<p class=\"infoWindowContentMargin\"><a href=" + markers[i][5] + " target=\"_blank\" alt=\"Zomato's Restaurant URL\">Zomato's \"" + markers[i][0] + "\" Page</a></p></div>";
    let position = new google.maps.LatLng(markers[i][1], markers[i][2]);
    bounds.extend(position);
    let marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i][0]
    });

    // Allow each marker to have an info window
    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infoWindow.setContent(infoWindowContent);
        infoWindow.open(map, marker);
      }
    })(marker, i));
  }
  // Automatically center the map fitting all markers on the screen 
  map.fitBounds(radius.getBounds(), 0);
}

function createRestaurantTable(markers) {
  let restaurants = markers;
  let newOptionTableElem = $("<table>");
  let newOptionTableHeadElem = $("<thead>");
  let newOptionTableHeadRowElem = $("<tr>");
  let newOptionTableHeaderNameElem = $("<th>");
  let newOptionTableHeaderRatingElem = $("<th>");
  let newOptionTableHeaderAddressElem = $("<th>");
  let newOptionTableHeaderWebsiteElem = $("<th>");
  let newReviewTableElem = $("<table>");

  $("#restaurants").text("");
  $(newOptionTableHeaderNameElem).text("Name");
  $(newOptionTableHeaderRatingElem).text("Rating");
  $(newOptionTableHeaderAddressElem).text("Address");
  $(newOptionTableHeaderWebsiteElem).text("Website");
  $("#restaurants").append(newOptionTableElem);
  $(newOptionTableElem).append(newOptionTableHeadElem);
  $(newOptionTableHeadElem).append(newOptionTableHeadRowElem);
  $(newOptionTableHeadRowElem).append(newOptionTableHeaderNameElem);
  $(newOptionTableHeadRowElem).append(newOptionTableHeaderRatingElem);
  $(newOptionTableHeadRowElem).append(newOptionTableHeaderAddressElem);
  $(newOptionTableHeadRowElem).append(newOptionTableHeaderWebsiteElem);

  $(restaurants).each(function (index, value) {
    let newRestaurantRowElem = $("<tr>");
    let newRestaurantNameElem = $("<td>");
    let newRestaurantRatingElem = $("<td>");
    let newRestaurantAddressElem = $("<td>");
    let newAddressAnchorElem = $("<a>");
    let newRestaurantWebsiteElem = $("<td>");
    let newWebsiteAnchorElem = $("<a>");
    let tempRestaurantAddress = markers[index][3];
    let modRestaurantAddress = tempRestaurantAddress.replace(/\s/g, "+");

    $(newRestaurantNameElem).text(markers[index][0]);
    $(newRestaurantRatingElem).text(markers[index][6]);
    $(newAddressAnchorElem).attr({
      href: "https://google.com/maps/search/" + modRestaurantAddress + "?hl=en",
      target: "_blank",
      alt: "Search Google Maps for this Address"
    });
    $(newAddressAnchorElem).text(markers[index][3]);
    $(newWebsiteAnchorElem).attr({
      href: markers[index][5],
      target: "_blank",
      alt: "Zomato's " + markers[index][0] + " Page"
    });
    $(newWebsiteAnchorElem).text(markers[index][0]);
    $(newRestaurantAddressElem).append(newAddressAnchorElem);
    $(newRestaurantWebsiteElem).append(newWebsiteAnchorElem);

    $(newRestaurantRowElem).append(newRestaurantNameElem);
    $(newRestaurantRowElem).append(newRestaurantRatingElem);
    $(newRestaurantRowElem).append(newRestaurantAddressElem);
    $(newRestaurantRowElem).append(newRestaurantWebsiteElem);
    $(newOptionTableElem).append(newRestaurantRowElem);
  })
}