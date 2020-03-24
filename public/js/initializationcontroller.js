// Code for initializing the app

// global variables shared across scripts
var city = '';
var companies = [];
var infractions = [];

var latitude = '';
var longitude = '';
var gps_coords = false;
const socket = io();

$(document).ready(function() {
    $(".nav li.disabled a").click(function() {
      return false;
    });
 });
 
// Get the city in which this app is opened 
// TODO: change this to work in non-city jusrisdictions like 
//         unincorporated King County and UW
function getCity() {
    jQuery.get('https://ipapi.co/json/', function (data) {
        console.log(data)

        city = data.city;
        if(gps_coords == false) {
            latitude = data.latitude;
            longitude = data.longitude;
        }

        console.log("coordinates from IP API");
        console.log(`Latitude : ${latitude}`);
        console.log(`Longitude: ${longitude}`);
        if (city != '' && socket != null) {

            socket.emit('city_sensed', {
                'city': city
            });
        }

        // Get the companies and infractions for the city in question 
        getCompanies()
        getInfractions()

        // Change the app state from intial to classification
        // slimeBikeService.send('PERMITTING');
    });
}

getCity()

function getCompanies() {
    socket.on('cityCompanies', function (data) {
        console.log(data);
        companies = data.companies;
        populateCompanies();
    });
}

function getInfractions() {
    socket.on('cityInfractions', function (data) {
        console.log(data);
        infractions = data.infractions;
        populateInfractions();
    });
}

function populateCompanies() {

    companies.forEach((company) => {
        // create the company name html element
        $company_name = jQuery('<div/>')
            .addClass("form-check abc-checkbox")
            .append(
                jQuery('<input/>')
                    .attr("id", 'company_' + company.company_id)
                    .attr("type", "radio")
                    .attr("name", 'company_' + company.company_id)
                    .attr('checked', true)
                    .addClass("form-check-input"))
            .append(
                jQuery('<label/>')
                    .attr("for", 'company_' + company.company_id)
                    .addClass("form-check-label")
                    .text(company.company_name));
        // append the element to the company-name list
        $company_name.appendTo('#company_list');
    });
}

function populateInfractions() {

    infractions.forEach((infraction) => {
        // create the infraction description checkbox element
        $infraction_description = $('<div/>')
            .addClass("form-check abc-checkbox")
            .append(
                jQuery('<input/>')
                    .attr("id", 'infraction_' + infraction.infractiontype_id)
                    .attr("type", "checkbox")
                    .attr("name", 'infraction_' + infraction.infractiontype_id)
                    .addClass("form-check-input"))
            .append(
                jQuery('<label/>')
                    .attr("for", 'infraction_' + infraction.infractiontype_id)
                    .addClass("form-check-label")
                    .text(infraction.infraction_description));
                
        $infraction_description.appendTo('#infraction_list');
    });

}


// Get Location
function ipLookUp() {
    jQuery.ajax('https://ipapi.co/json')
        .then(
            function success(response) {
                console.log('User\'s Location Data is ', response);
                console.log('User\'s Country', response.country);
                // alert(`From IP Latitude : ${response.latitude}` + `, Longitude: ${response.longitude}`)
                latitude = response.latitude;
                longitude = response.longitude;
                city = response.city;
                return (0);
                // resolve();
            },

            function fail(data, status) {
                console.log('Request failed.  Returned status of',
                    status);
                alert('Request failed.  Returned status of',
                    status);
            }
        );
}

// Using promises to ensure this part executes before map is drawn
// From here: https://stackoverflow.com/a/55698897/1328232
let get_location = new Promise(function (resolve, reject) {

    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;

        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);
        console.log(`More or less ${crd.accuracy} meters.`);
        latitude = crd.latitude;
        longitude = crd.longitude;
        gps_coords = true;
        resolve();
        // alert(`Latitude : ${crd.latitude}` + `, Longitude: ${crd.longitude}`)
        // ipLookUp()
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        // ipLookUp()
        resolve();
        // alert(`ERROR(${err.code}): ${err.message}`);

    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        // geolocation is not supported
        // get your location some other way
        console.log('geolocation is not enabled on this browser')
        // alert('geolocation is not enabled on this browser')
        // ipLookUp()
    }

});

// Map
async function draw_map() {

    let result = await get_location;
    
    // getAddress();
    console.log(latitude, longitude)
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hpbnRhbnAiLCJhIjoiY2ppYXU1anVuMThqazNwcDB2cGtneDdkYyJ9.TL6RTyRRFCbvJWyFa4P0Ow';
    // var coordinates = document.getElementById('coordinates');
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 13
    });

    var marker = new mapboxgl.Marker({
        draggable: true
    })
        .setLngLat([longitude, latitude])
        .addTo(map);

    function onDragEnd() {
        var lngLat = marker.getLngLat();
        // Set the new lat, lng based on the post drag location
        longitude = lngLat.lng;
        latitude = lngLat.lat;
        console.log(`New coordinates are: (${latitude}, ${longitude})`);

    }

    marker.on('dragend', onDragEnd);
}

var socket_submit = function() {

    socket.emit('case_report', {
      case_data: {
        img: dataURL, 
        location: [longitude, latitude], 
        infraction_ids: infraction_ids, 
        company_ids: company_ids, 
        vehicle_id: vehicle_id, 
        city: city
      }
    });
  
    window.location.href = "./html/thanks.html";
  }