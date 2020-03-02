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
            populateCompanies();

        });


        socket.on('cityInfractions', function (data) {
            console.log(data);
            infractions = data.infractions;
            populateInfractions();

        });
        slimeBikeService.send('PERMITTING');

    });
}

function populateCompanies() {
    for (let i = 0; i < companies.length; i++) {
        $(`
        <input type="radio" class="card-input-element form-check-input d-none" style="width: 100px;" name="${companies[i].company_id}" id="${companies[i].company_id}">
        <label for="${companies[i].company_id}"><div class="card card-body d-flex flex-row justify-content-between align-items-center">${companies[i].company_name}</div></label>
            
            
        `).appendTo("#company_list");
    }

}

function populateInfractions() {

    for (let i = 0; i < infractions.length; i++) {
        $(`                                 <input type="checkbox" class="card-input-element form-check-input d-none" autocomplete="off" \
        value="" id="${infractions[i].infractiontype_id}" name="${infractions[i].infractiontype_id}">
        <label for="${infractions[i].infractiontype_id}">
                                <div class="card card-body d-flex flex-row justify-content-between align-items-center">${infractions[i].infraction_description}</div> \
                                </label>
 \
                            `).appendTo("#infraction_list");
    }

}
// getCity()