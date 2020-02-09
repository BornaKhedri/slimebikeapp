// Code for controlling the map display 

// Get Location

var latitude = '';
var longitude = '';
 // Using promises to ensure this part executes before map is drawn
 // From here: https://stackoverflow.com/a/55698897/1328232
let get_location = new Promise(function (resolve, reject) {
    function ipLookUp() {
        $.ajax('https://ipapi.co/json')
            .then(
                function success(response) {
                    console.log('User\'s Location Data is ', response);
                    console.log('User\'s Country', response.country);
                    // alert(`From IP Latitude : ${response.latitude}` + `, Longitude: ${response.longitude}`)
                    latitude = response.latitude;
                    longitude = response.longitude;
                    resolve();
                },

                function fail(data, status) {
                    console.log('Request failed.  Returned status of',
                        status);
                    alert('Request failed.  Returned status of',
                        status);
                }
            );
    }
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
        resolve();
        // alert(`Latitude : ${crd.latitude}` + `, Longitude: ${crd.longitude}`)
        // ipLookUp()
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        ipLookUp()
        // alert(`ERROR(${err.code}): ${err.message}`);

    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
        // geolocation is not supported
        // get your location some other way
        console.log('geolocation is not enabled on this browser')
        // alert('geolocation is not enabled on this browser')
        ipLookUp()
    }
    
});

// Map
async function draw_map() {

    let result = await get_location;

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

draw_map()