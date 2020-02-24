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
        $(`<input type="radio" class="btn btn-primary " style="width: 100px;" name="company" id="${companies[i].company_id}">${companies[i].company_name}</input>`).appendTo("#company_list");
    }

}

function populateInfractions() {

    for (let i = 0; i < infractions.length; i++) {
        $(`<div class="items "> \
                <div class="info-block block-info clearfix"> \
                    <div data-toggle="buttons" class="btn-group bizmoduleselect" style="width: 100%"> \
                        <label class="btn btn-light"> \
                            <div class="itemcontent"> \
                                <input type="checkbox" class="visually-hidden" autocomplete="off" \
                                    value="" id="${infractions[i].infractiontype_id}"> \
                                <h5>${infractions[i].infraction_description}</h5> \
                            </div> \
                        </label> \
                    </div> \
                </div> \
            </div>`).appendTo("#infraction_list");
    }

}
// getCity()