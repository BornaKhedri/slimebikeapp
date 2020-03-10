// Code related to managing navigation around the app

// TODO: Ensure that clicking on the navbar does not allow going to the next stage 
//          unless the page has been completely filled. One shortcut is make the 
//          tab links in-active until they have been traversed. 

var infraction_ids = [];
var company_ids = [];

$(function() {

    // This function is called when continue button on the "classification" is clicked
    $('#classification_continue').click(function(e) {
        e.preventDefault();
        // Select the 'a' element of the "location" tab
        var next_tab = $(
            'a[href="#tab_location"]'); //$('.nav-tabs > .active').next('li').find('a');
        // console.log(next_tab);
        // If a location tab 'a' is found, then trigger its click event
        if (next_tab.length > 0) {
            if ($("input[type='checkbox']:checked").length > 0 && $("input[type='radio']:checked").length) {
                // Atleast one of the checkbox is clicked and radio buttons are clicked

                $('#infraction_list input:checked').each(function() {
                    var infraction_id = ($(this).parent().children().eq(0)[0].id).substring(11);
                    infraction_ids.push(infraction_id);
                });

                $('#company_list input:checked').each(function() {
                    var company_id = ($(this)[0].id).substring(8)
                    company_ids.push(company_id);
                });
                slimeBikeService.send('IMAGING');
                next_tab.trigger('click');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
    // This function is called when continue button on the "location" is clicked
    $('#location_continue').click(function(e) {
        e.preventDefault();
        var next_tab = $('a[href="#tab_identification"]');
        console.log(next_tab);
        if (next_tab.length > 0) {
            if (latitude != "" && longitude != "") {
                next_tab.trigger('click');
                slimeBikeService.send('PINPOINTING');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
});