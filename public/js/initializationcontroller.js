// Code for initializing the app

// global variables shared across scripts
var city = "";
var latitude = "";
var longitude = "";
var geolatitude = "";
var geolongitude = "";
var gps_coords = false;
var vehicle_id = "";
var vehicle_marker = "";
var geocode_marker = "";
var map = "";
var resetButton = false;
var videoExists = true;

const constraints = (window.constraints = {
  audio: false,
  video: {
    facingMode: {
      exact: "environment",
    },
  },
});
const socket = io();

// detect client OS -- https://stackoverflow.com/a/21742107/1328232
/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
}

// This disables the click on the navbar elements -
// navigation is purely handled by the back and continue buttons
$(document).ready(function () {
  $(".nav li.disabled a").click(function () {
    return false;
  });
});

$("body").on("click", ".disabled", function (e) {
  e.preventDefault();
  return false;
});

var populateInfractions = function (infractions) {
  $("#infraction_list").empty();
  infractions.forEach((infraction) => {
    // create the infraction description checkbox element
    $infraction_description = $("<label/>")
      .addClass("btn btn-block active light-background darktext")
      .append(
        $("<input/>")
          .attr("id", "infraction_" + infraction.infractiontype_id)
          .attr("type", "checkbox")
          .attr("name", "infraction_" + infraction.infractiontype_id)
          .attr("autocomplete", "off")
      )
      .append(infraction.infraction_description);
    $infraction_description.appendTo("#infraction_list");
  });

  $('[data-toggle="buttons"] .btn').on("click", function () {
    // toggle style
    // $(this).removeClass('light-background');
    $(this).toggleClass("blue-background light-background active");

    // toggle checkbox
    var $chk = $(this).find("[type=checkbox]");
    $chk.prop("checked", !$chk.prop("checked"));

    return false;
  });

  // getCompanies();
};

var gotoClassification = function () {
  $("#li_location").addClass("disabled");
  $("#li_location").find("a").removeClass("navbar-active");
  $("#li_location").find("a").addClass("donetext");
  $("#li_location").find("a").removeClass("active");
  // make the classification nav active
  $("#li_classification").find("a").addClass("navbar-active");
  $("#li_classification").removeClass("disabled");
  $("#li_classification")
    .find("a[data-toggle]")
    .each(function () {
      $(this).attr("data-toggle", "tab");
    });
  $('a[href="#tab_classification"]').tab("show");
};

var populateCompanies = function (companies) {
  $("#company_list").empty();
  if (companies.length > 0) {
    companies.forEach((company) => {
      // create the company name html element
      $company_name = $("<label/>")
        .addClass("btn active light-background darktext margin-company")
        .append(
          $("<input/>")
            .attr("id", "company_" + company.micromobilityservice_id)
            .attr("type", "radio")
            .attr("name", "company_" + company.micromobilityservice_id)
            .attr("autocomplete", "off")
        )
        .append(
          $("<img/>")
            .attr("src", "data:image/png;base64, " + company.vehicle_image)
            .attr("width", "80px")
            .attr("height", "80px")
        )
        .append(company.company_name);

      // append the element to the company-name list
      $company_name.appendTo("#company_list");
    });
  } else {
  }
  $('[data-toggle="radiobuttons"] .btn').on("click", function () {
    // toggle style
    // $(this).removeClass('light-background');
    $(this).addClass("dark-border");
    $(this).siblings().removeClass("dark-border");
    // $('[data-toggle="radiobuttons"]').find(label)
    // toggle checkbox
    var $chk = $(this).find("input:radio");
    $chk.prop("checked", true);
    $("input:radio").not($chk).prop("checked", false);

    return false;
  });
  gotoClassification();
};

var getCompanies = function () {
  socket.on("cityCompanies", function (data) {
    console.log(data);
    var companies = data.companies;
    if (companies.length > 0) {
      window.performance.mark("before_populateCompanies");
      populateCompanies(companies);
      window.performance.mark("after_populateCompanies");
      window.performance.measure(
        "get_populateCompanies_exec",
        "before_populateCompanies",
        "after_populateCompanies"
      );
    } else {
      // $('#company_div').empty();
      // $('#company_div').append(
      //     $('<p/>')
      //         .addClass('light-background text-danger')
      //         .html('No companies found in this region. Maybe allow GPS location access and refresh page.')
      // )
      // gotoClassification();
      if (!alert("Error: No companies found."))
        window.location.href = "./html/error_noinfractions_company.html";
    }
  });
};

var getInfractions = function () {
  socket.on("cityInfractions", function (data) {
    console.log(data);
    var infractions = data.infractions;
    if (infractions.length > 0) {
      window.performance.mark("before_populateInfractions");
      populateInfractions(infractions);
      window.performance.mark("after_populateInfractions");
      window.performance.measure(
        "get_populateInfractions_exec",
        "before_populateInfractions",
        "after_populateInfractions"
      );
    } else {
      // $('#infraction_div').removeClass('low-opacity');
      // $('#infraction_div').addClass('high-opacity');
      // $('#infraction_div').empty();
      // $('#infraction_div').append(
      //     $('<p/>')
      //         .addClass('light-background text-danger')
      //         .html('No infractions found in this region. Maybe allow GPS location access and refresh page.')
      // )
      if (!alert("Error: No infractions found."))
        window.location.href = "./html/error_noinfractions_company.html";
    }
  });
};

// Get the city in which this app is opened
// TODO: change this to work in non-city jusrisdictions like
//         unincorporated King County and UW
var getCity = function () {
  if (latitude != "" && longitude != "") {
    socket.emit("location_sent", {
      lng: longitude,
      lat: latitude,
    });

    socket.on("cityName", function (data) {
      if (data.cityName.length == 1) {
        city = data.cityName[0].cityname;
        // DIsplay the city name on the UI
        $("#city_name")
          .empty()
          .append("<p>" + city + "</p>");
        // Get the companies and infractions for the city in question
        window.performance.mark("before_getInfractions");
        // getInfractions();
        socket.on("cityInfractions", function (data) {
          console.log(data);
          var infractions = data.infractions;
          if (infractions.length > 0) {
            window.performance.mark("before_populateInfractions");
            populateInfractions(infractions);
            window.performance.mark("after_populateInfractions");
            window.performance.measure(
              "get_populateInfractions_exec",
              "before_populateInfractions",
              "after_populateInfractions"
            );
          } else {
            // $('#infraction_div').removeClass('low-opacity');
            // $('#infraction_div').addClass('high-opacity');
            // $('#infraction_div').empty();
            // $('#infraction_div').append(
            //     $('<p/>')
            //         .addClass('light-background text-danger')
            //         .html('No infractions found in this region. Maybe allow GPS location access and refresh page.')
            // )
            if (!alert("Error: No infractions found."))
              window.location.href = "./html/error_noinfractions_company.html";
          }
        });
        window.performance.mark("after_getInfractions");
        window.performance.measure(
          "get_getInfractions_exec",
          "before_getInfractions",
          "after_getInfractions"
        );
        window.performance.mark("before_getCompanies");
        // getCompanies();
        socket.on("cityCompanies", function (data) {
          console.log(data);
          var companies = data.companies;
          if (companies.length > 0) {
            window.performance.mark("before_populateCompanies");
            populateCompanies(companies);
            window.performance.mark("after_populateCompanies");
            window.performance.measure(
              "get_populateCompanies_exec",
              "before_populateCompanies",
              "after_populateCompanies"
            );
          } else {
            // $('#company_div').empty();
            // $('#company_div').append(
            //     $('<p/>')
            //         .addClass('light-background text-danger')
            //         .html('No companies found in this region. Maybe allow GPS location access and refresh page.')
            // )
            // gotoClassification();
            if (!alert("Error: No companies found."))
              window.location.href = "./html/error_noinfractions_company.html";
          }
        });
        window.performance.mark("after_getCompanies");
        window.performance.measure(
          "get_getCompanies_exec",
          "before_getCompanies",
          "after_getCompanies"
        );
      } else if (data.cityName.length > 1) {
        if (!alert("Error: Multiple jurisdictions detected."))
          window.location.href = "./html/error_multicity.html";
      } else if (data.cityName.length == 0) {
        if (!alert("Error: No jurisdictions detected."))
          window.location.href = "./html/error_nocity.html";
      }
    });
  }
};

function handleGPSError(err) {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      if (!alert("User denied the request for Geolocation."))
        window.location.href = "./html/error_gps.html";
      break;
    case err.POSITION_UNAVAILABLE:
      if (!alert("Location information is unavailable."))
        window.location.href = "./html/error_gps.html";
      break;
    case err.TIMEOUT:
      if (!alert("The request to get user location timed out."))
        window.location.href = "./html/error_gps.html";
      break;
    case err.UNKNOWN_ERROR:
      if (!alert("An unknown error occurred."))
        window.location.href = "./html/error_gps.html";
      break;
  }
}

function getApproxLocation() {
  fetch("https://ipapi.co/json/")
    .then(function (response) {
      response.json().then((jsonData) => {
        console.log(jsonData);
        latitude = jsonData.latitude;
        longitude = jsonData.longitude;
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

// Using promises to ensure this part executes before map is drawn
// From here: https://stackoverflow.com/a/55698897/1328232
let getLocation = new Promise(function (resolve, reject) {
  var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    var crd = pos.coords;

    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    geolatitude = crd.latitude;
    geolongitude = crd.longitude;
    latitude = crd.latitude;
    longitude = crd.longitude;
    gps_coords = true;
    resolve();
    // alert(`Latitude : ${crd.latitude}` + `, Longitude: ${crd.longitude}`)
    // ipLookUp()
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);

    // handleGPSError(err);

    // ipLookUp()
    resolve();
    // alert(`ERROR(${err.code}): ${err.message}`);
  }

  if ("geolocation" in navigator) {
    // Todo: figure out why the promise is called first
    navigator.geolocation.getCurrentPosition(success, error, options);
  } else {
    // geolocation is not supported
    // get your location some other way
    // if (!alert("geolocation is not enabled on this browser"))
    //   window.location.href = "./html/error_gps.html";
    // console.log('geolocation is not enabled on this browser')
    // alert('geolocation is not enabled on this browser')
    // ipLookUp()
  }
});

// Original ES6 Class— https://github.com/tobinbradley/mapbox-gl-pitch-toggle-control
// export default class PitchToggle {
class PitchToggle {
  constructor({ bearing = -20, pitch = 70, minpitchzoom = null }) {
    this._bearing = bearing;
    this._pitch = pitch;
    this._minpitchzoom = minpitchzoom;
  }

  onAdd(map) {
    this._map = map;
    let _this = this;

    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
    this._btn.type = "button";
    this._btn["aria-label"] = "Toggle Pitch";
    this._btn.onclick = function () {
      if (map.getPitch() === 0) {
        let options = { pitch: _this._pitch, bearing: _this._bearing };
        if (_this._minpitchzoom && map.getZoom() > _this._minpitchzoom) {
          options.zoom = _this._minpitchzoom;
        }
        map.easeTo(options);
        _this._btn.className =
          "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-2d";
      } else {
        map.easeTo({ pitch: 0, bearing: 0 });
        _this._btn.className =
          "mapboxgl-ctrl-icon mapboxgl-ctrl-pitchtoggle-3d";
      }
    };

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

/* Idea from Stack Overflow https://stackoverflow.com/a/51683226  */
class MapboxGLButtonControl {
  constructor({ className = "", title = "", eventHandler = evtHndlr }) {
    this._className = className;
    this._title = title;
    this._eventHandler = eventHandler;
  }

  onAdd(map) {
    this._btn = document.createElement("button");
    this._btn.className = "mapboxgl-ctrl-icon" + " " + this._className;
    this._btn.type = "button";
    this._btn.title = this._title;
    this._btn.onclick = this._eventHandler;

    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this._container.appendChild(this._btn);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

function reposition_marker(
  temp,
  markerlng = geolongitude,
  markerlat = geolatitude
) {
  // alert("clicked")
  vehicle_marker.setLngLat([parseFloat(markerlng), parseFloat(markerlat)]);
  map.flyTo({
    center: [parseFloat(markerlng), parseFloat(markerlat)],
  });
  latitude = parseFloat(markerlat);
  longitude = parseFloat(markerlng);
}

// Map
async function drawMap() {
  
  let result = await getLocation;
  if (isNaN(parseFloat(latitude)) && isNaN(parseFloat(longitude))) {
    const response = await Promise.resolve($.get("https://ipapi.co/json/"));
    geolatitude = response.latitude;
    geolongitude = response.longitude;
    latitude = geolatitude;
    longitude = geolongitude;
  }
  // getAddress();
  console.log(geolatitude, geolongitude);
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2hpbnRhbnAiLCJhIjoiY2ppYXU1anVuMThqazNwcDB2cGtneDdkYyJ9.TL6RTyRRFCbvJWyFa4P0Ow";
  // var coordinates = document.getElementById('coordinates');
  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/satellite-streets-v11/",
    center: [geolongitude, geolatitude],
    zoom: gps_coords ? 18 : 10,
  });

  /* Instantiate new controls with custom event handlers */
  // geocoder is a separate service with its own pricing scheme
  var mapGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: false,
  });

  map.addControl(mapGeocoder);

  mapGeocoder.on("result", (e) => {
    // alert("result selected");

    reposition_marker(this, e.result.center[0], e.result.center[1]);
    // mapGeocoder.getProximity().latitude
  });

  const ctrlPoint = new MapboxGLButtonControl({
    className: "mapbox-gl-reposition_marker",
    title: "Reposition Marker",
    eventHandler: reposition_marker,
  });

  // Add zoom and rotation controls to the map.
  map.addControl(new mapboxgl.NavigationControl());

  map.addControl(
    new PitchToggle({ minpitchzoom: gps_coords ? 18 : 10 }),
    "top-left"
  );
  map.addControl(ctrlPoint, "top-left");
  // create the popup
  var popup = new mapboxgl.Popup({
    offset: 30,
    closeOnClick: false,
    closeButton: false,
  }).setText("Move the marker to wheel location.");

  // create a HTML element for each feature
  var el = document.createElement("div");
  el.className = "marker";

  vehicle_marker = new mapboxgl.Marker(el, {
    draggable: true,
  })
    .setLngLat([geolongitude, geolatitude])
    .setPopup(popup)
    .addTo(map)
    .togglePopup();

  function onDragEnd() {
    var lngLat = vehicle_marker.getLngLat();
    // Set the new lat, lng based on the post drag location
    longitude = lngLat.lng;
    latitude = lngLat.lat;
    console.log(`New coordinates are: (${latitude}, ${longitude})`);
  }

  vehicle_marker.on("dragend", onDragEnd);
}

function resetButtonClickListener() {
  $("#result").text("");
  $("#reset_btn").remove();
  $("#result").after(
    $("<video/>")
      .attr({
        id: "video",
      })
      .addClass("d-flex align-items-center mx-auto")
  );
  videoExists = true;
  enableQRCodeReader();
  resetButton = false;
}

var enableQRCodeReader = function () {
  window.performance.mark("start_qrcodeLoad");
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader.getVideoInputDevices().then((videoInputDevices) => {
    console.log(videoInputDevices);

    codeReader
      .decodeFromConstraints(constraints, "video", (result, err) => {
        window.performance.mark("start_decodeFromConstraints");
        if (result) {
          vehicle_id = result.text;
          console.log(result);
          document.getElementById("result").textContent = vehicle_id;
          codeReader.stopContinuousDecode();
          if (videoExists) {
            $("#video").remove();
            videoExists = false;
          }
          if (!resetButton) {
            $("#result").append(
              $("<input/>").attr({
                type: "button",
                id: "reset_btn",
                value: "Reset",
                onclick: "resetButtonClickListener()",
              })
            );
            resetButton = true;
          }
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
          console.error(err);
          document.getElementById("result").textContent = err;
        }
        window.performance.mark("end_decodeFromConstraints");
        window.performance.measure(
          "get_decodeFromConstraints_exec",
          "start_decodeFromConstraints",
          "end_decodeFromConstraints"
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });
  window.performance.mark("end_qrcodeLoad");
  window.performance.measure(
    "get_qrcodeLoad_exec",
    "start_qrcodeLoad",
    "end_qrcodeLoad"
  );
};

var socketSubmit = function () {
  window.performance.mark("start_socketSubmit");
  socket.emit("case_report", {
    case_data: {
      imageId: imageId,
      location: [longitude, latitude],
      infraction_ids: infraction_ids,
      micromobilityservice_id: micromobilityservice_id,
      vehicle_id: vehicle_id,
      city: city,
    },
  });
  window.performance.mark("end_socketSubmit");
  window.performance.measure(
    "get_socketSubmit_exec",
    "start_socketSubmit",
    "end_socketSubmit"
  );
  window.location.href = "./html/thanks.html";
};

window.performance.mark("before_drawMap");
drawMap();
window.performance.mark("after_drawMap");
window.performance.measure(
  "get_drawMap_exec",
  "before_drawMap",
  "after_drawMap"
);
