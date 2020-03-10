// Code for initializing the app

// global variables shared across scripts
var city = '';
var companies = [];
var infractions = [];

// Get the city in which this app is opened 
// TODO: change this to work in non-city jusrisdictions like 
//         unincorporated King County and UW
function getCity() {
    $.get('https://ipapi.co/json/', function (data) {
        console.log(data)

        city = data.city;
        if (city != '' && socket != null) {

            socket.emit('city_sensed', {
                'city': city
            });
        }

        // Get the companies and infractions for the city in question 
        getCompanies()
        getInfractions()

        // Change the app state from intial to classification
        slimeBikeService.send('PERMITTING');
    });
}

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
        $company_name = $('<div/>')
            .addClass("form-check abc-checkbox")
            .append(
                $('<input/>')
                    .attr("id", 'company_' + company.company_id)
                    .attr("type", "radio")
                    .attr("name", 'company_' + company.company_id)
                    .attr('checked', true)
                    .addClass("form-check-input"))
            .append(
                $('<label/>')
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
                $('<input/>')
                    .attr("id", 'infraction_' + infraction.infractiontype_id)
                    .attr("type", "checkbox")
                    .attr("name", 'infraction_' + infraction.infractiontype_id)
                    .addClass("form-check-input"))
            .append(
                $('<label/>')
                    .attr("for", 'infraction_' + infraction.infractiontype_id)
                    .addClass("form-check-label")
                    .text(infraction.infraction_description));
                
        $infraction_description.appendTo('#infraction_list');
    });

}
