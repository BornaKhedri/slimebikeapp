// Code for controlling the map display etc.

var city = '';
var companies = [];
var infractions = [];

function getCity() {
    $.get('https://ipapi.co/json/', function (data) {
        console.log(data)

        city = data.city;
        if (city != '' && socket != null) {

            socket.emit('city_sensed', {
                'city': city
            });

        }

        socket.on('cityCompanies', function (data) {
            console.log(data);
            companies = data.companies;

        });


        socket.on('cityInfractions', function (data) {
            console.log(data);
            infractions = data.infractions;

        });
        slimeBikeService.send('PERMITTING');

    });
}

function populateCompanies() {

}

function populateInfractions() {
    
}
// getCity()