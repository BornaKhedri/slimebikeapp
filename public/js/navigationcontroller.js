// Code related to managing navigation around the app

// TODO: Ensure that clicking on the navbar does not allow going to the next stage 
//          unless the page has been completely filled. One shortcut is make the 
//          tab links in-active until they have been traversed. 

var infraction_ids = [];
var micromobilityservice_id = '';

$(function () {
    var $tabs = $('#nav_tabs li');
    $classification_li = $('#li_classification');
    $location_li = $('#li_location');
    $identification_li = $('#li_identification');
    // This function is called when continue button on the "classification" is clicked
    $('#location_continue').click(function (e) {
        e.preventDefault();

        // get an handle for the next tab (location -> classification)
        var next_tab = $('a[href="#tab_classification"]');

        if (next_tab.length > 0) {
            if (latitude != "" && longitude != "") {

                // make the location nav inactive, and 
                $location_li.addClass('disabled');
                $location_li.find('a').removeClass("navbar-active");
                $location_li.find('a').addClass("donetext");
                $location_li.find('a').removeClass("active");
                // make the classification nav active
                $classification_li.find('a').addClass("navbar-active");
                $classification_li.removeClass("disabled");
                $classification_li.find('a[data-toggle]').each(function () {
                    $(this).attr("data-toggle", "tab");
                });
                // show the next tab
                next_tab.tab('show');


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

        if (next_tab.length > 0) {
            if ($("input[type='checkbox']:checked").length > 0 && $("input[type='radio']:checked").length) {
                // Atleast one of the checkbox is clicked and radio buttons are clicked
                $('#classification_continue_warning').html('');

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
                    micromobilityservice_id = ($(this)[0].id).substring(8)

                });
                next_tab.tab('show');
                enableQRCodeReader();
            }
            else if ($("input[type='radio']:checked").length && $("input[type='checkbox']:checked").length == 0) {
                $('#classification_continue_warning').html('Please select a parking infraction from the list above before continuing');
            } else if ($("input[type='checkbox']:checked").length > 0 && $("input[type='radio']:checked").length == 0) {
                $('#classification_continue_warning').html('Please select a company from the list above before continuing');
            } else {
                $('#classification_continue_warning').html('Please select a company and an infraction from the list above before continuing');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });

    $('#classification_back').click(function (e) {
        e.preventDefault();
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
    });

    $('#identification_back').click(function (e) {
        e.preventDefault();
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

