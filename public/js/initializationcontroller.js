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
        
         <div class="form-check abc-checkbox">
  <input class="form-check-input" type="radio" name="${companies[i].company_id}" id="${companies[i].company_id}" checked/>


    <label for="${companies[i].company_id}" class="form-check-label">
      ${companies[i].company_name}
    </label>

</div>    
            
        `).appendTo("#company_list");
    }

}

function populateInfractions() {

    for (let i = 0; i < infractions.length; i++) {
        $(`                                 
 <div class="form-check abc-checkbox">
  <input class="form-check-input" type="checkbox" name="${infractions[i].infractiontype_id}" id="${infractions[i].infractiontype_id}" />


    <label for="${infractions[i].infractiontype_id}" class="form-check-label">
      ${infractions[i].infraction_description}
    </label>

</div>
                            `).appendTo("#infraction_list");
    }

}
// getCity()