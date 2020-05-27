// Code related to managing navigation around the app

// TODO: Ensure that clicking on the navbar does not allow going to the next stage 
//          unless the page has been completely filled. One shortcut is make the 
//          tab links in-active until they have been traversed. 
// import Bowser from "bowser";
const browser = bowser.getParser(window.navigator.userAgent);
var infraction_ids = [];
var micromobilityservice_ids = [];
var tb_exists = false;

$(function () {
    var $tabs = $('#nav_tabs li');
    $classification_li = $('#li_classification');
    $location_li = $('#li_location');
    $identification_li = $('#li_identification');
    // This function is called when continue button on the "classification" is clicked
    $('#location_continue').click(async function (e) {
        e.preventDefault();

        // get an handle for the next tab (location -> classification)
        var next_tab = $('a[href="#tab_classification"]');

        if (next_tab.length > 0) {
            if (latitude != "" && longitude != "") {
                window.location.hash  = "classification";
                window.performance.mark('before_getCity');
                await getCity();
                window.performance.mark('after_getCity');
                window.performance.measure('get_getCity_exec', 'before_getCity', 'after_getCity');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
    // This function is called when continue button on the "location" is clicked
    $('#classification_continue').click(function (e) {
        e.preventDefault();
        // reset the infraction ids array, as it gets refilled when we continue
        infraction_ids = []
        var next_tab = $('a[href="#tab_identification"]');
        var $infractions = $( "input[name*='infraction']:checked");
        var $companies = $("input[name*='company']:checked");

        if (next_tab.length > 0) {
            if ($infractions.length > 0 && $companies.length) {
                // Atleast one of the checkbox is clicked and radio buttons are clicked
                $('#classification_continue_warning').html('');
                window.location.hash  = "identification";
                $classification_li.addClass('disabled');
                $classification_li.find('a').removeClass("navbar-active");
                $classification_li.find('a').addClass("donetext");
                $classification_li.find('a').removeClass("active");
                $identification_li.find('a').addClass("navbar-active");
                $identification_li.removeClass("disabled");
                $identification_li.find('a[data-toggle]').each(function () {
                    $(this).attr("data-toggle", "tab");
                });

                $('#infraction_list input:checked').each(function () {

                    var infraction_id = ($(this).parent().children().eq(0)[0].id).substring(11);
                    infraction_ids.push(infraction_id);
                });

                $('#company_list input:checked').each(function () {
                    var micromobilityservice_id = ($(this)[0].id).substring(8)
                    micromobilityservice_ids.push(micromobilityservice_id);

                });
                next_tab.tab('show');

                var agentOS = getMobileOperatingSystem();
                console.log(agentOS)
                console.log(browser.getBrowser()['name'])
                // try for iOS chrome (agentOS == 'iOS' && browser.getBrowser()['name'] == 'Chrome') ||
                if((agentOS == 'Android') || ((agentOS == 'iOS') && browser.getBrowser()['name'] == 'Safari')) {
                    enableQRCodeReader();
                } else {
                    if(!tb_exists) {
                        $('#qrlead').html("Optionally, please enter the vehicle's QR code")
                        $('#video').remove();
                        $('#result').after($("<br/>"),
                            $("<input/>")
                                .attr("id", "id_tb")
                                .attr("type", "textbox")
                        )
                        tb_exists = true;

                    }
                    $('#id_tb').keyup(function(){
                        $('#result').text($(this).val());
                        vehicle_id = result.textContent;
                    });
                }
                
            }
            else if ($companies.length && $infractions.length == 0) {
                $('html,body').animate({
                    scrollTop: $("#classification_continue_warning").offset().top
                 });
                $('#classification_continue_warning').html('Please select a parking infraction from the list above before continuing');
            } else if ($infractions.length > 0 && $companies.length == 0) {
                $('html,body').animate({
                    scrollTop: $("#classification_continue_warning").offset().top
                 });
                $('#classification_continue_warning').html('Please select a company from the list above before continuing');
            } else {
                $('html,body').animate({
                    scrollTop: $("#classification_continue_warning").offset().top
                 });
                $('#classification_continue_warning').html('Please select a company and an infraction from the list above before continuing');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });

    $('#classification_back').click(function (e) {
        e.preventDefault();
        window.location.hash  = "location";
        $classification_li.addClass('disabled');
        $classification_li.find('a').removeClass("navbar-active");
        $classification_li.find('a').addClass("donetext");
        $classification_li.find('a').removeClass("active");
        $location_li.removeClass("disabled");
        $location_li.find('a').addClass("navbar-active");
        $location_li.find('a[data-toggle]').each(function () {
            $(this).attr("data-toggle", "tab");
        });

        $('a[href="#tab_location"]').tab('show');
        map.resize();
    });

    $('#identification_back').click(function (e) {
        e.preventDefault();
        window.location.hash  = "classification";
        $identification_li.addClass('disabled');
        $identification_li.find('a').removeClass("navbar-active");
        $identification_li.find('a').addClass("donetext");
        $identification_li.find('a').removeClass("active");
        $classification_li.removeClass("disabled");
        $classification_li.find('a').addClass("navbar-active");
        $classification_li.find('a[data-toggle]').each(function () {
            $(this).attr("data-toggle", "tab");
        });

        $('a[href="#tab_classification"]').tab('show');
    });
});