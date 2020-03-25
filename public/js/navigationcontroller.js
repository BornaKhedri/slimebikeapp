// Code related to managing navigation around the app

// TODO: Ensure that clicking on the navbar does not allow going to the next stage 
//          unless the page has been completely filled. One shortcut is make the 
//          tab links in-active until they have been traversed. 

var infraction_ids = [];
var company_ids = [];

$(function() {
    var $tabs = $('#nav_tabs li');
    $classfication_li = $('#li_classification');
    $location_li = $('#li_location');
    $identification_li = $('#li_identification');
    // This function is called when continue button on the "classification" is clicked
    $('#classification_continue').click(function(e) {
        e.preventDefault();
        $classfication_li.addClass('disabled');
        $classfication_li.find('a').removeClass("navbar-active");
        $classfication_li.find('a').addClass("donetext");
        $classfication_li.find('a').removeClass("active");
        $location_li.removeClass("disabled");
        $location_li.find('a').addClass("navbar-active");
        $location_li.find('a[data-toggle]').each(function () {
            $(this).attr("data-toggle", "tab");
        });
        // $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
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
                // slimeBikeService.send('IMAGING');
                // next_tab.trigger('click');
                next_tab.tab('show');
                window.performance.mark('before_drawMap');
                drawMap();
                window.performance.mark('after_drawMap');
                window.performance.measure('get_drawMap_exec', 'before_drawMap', 'after_drawMap');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
    // This function is called when continue button on the "location" is clicked
    $('#location_continue').click(function(e) {
        e.preventDefault();
        $location_li.addClass('disabled');
        $location_li.find('a').removeClass("navbar-active");
        $location_li.find('a').addClass("donetext");
        $location_li.find('a').removeClass("active");
        $identification_li.find('a').addClass("navbar-active");
        $identification_li.removeClass("disabled");
        $identification_li.find('a[data-toggle]').each(function () {
            $(this).attr("data-toggle", "tab");
        });
        var next_tab = $('a[href="#tab_identification"]');
        console.log(next_tab);
        if (next_tab.length > 0) {
            if (latitude != "" && longitude != "") {
                // next_tab.trigger('click');
                next_tab.tab('show');
                // slimeBikeService.send('PINPOINTING');
            }
        }
        else {
            $('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
});