// Code related to managing navigation around the app

// TODO: Ensure that clicking on the navbar does not allow going to the next stage 
//          unless the page has been completely filled. One shortcut is make the 
//          tab links in-active until they have been traversed. 

var infraction_ids = [];
var company_ids = [];

jQuery(function() {
    var $tabs = jQuery('#nav_tabs li');
    // This function is called when continue button on the "classification" is clicked
    jQuery('#classification_continue').click(function(e) {
        e.preventDefault();
        $tabs.filter('.active').next('li').removeClass("disabled");
        $tabs.filter('.active').next('li').find('a[data-toggle]').each(function () {
            jQuery(this).attr("data-toggle", "tab");
        });
        // $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
        // Select the 'a' element of the "location" tab
        var next_tab = jQuery(
            'a[href="#tab_location"]'); //$('.nav-tabs > .active').next('li').find('a');
        // console.log(next_tab);
        // If a location tab 'a' is found, then trigger its click event
        if (next_tab.length > 0) {
            if (jQuery("input[type='checkbox']:checked").length > 0 && jQuery("input[type='radio']:checked").length) {
                // Atleast one of the checkbox is clicked and radio buttons are clicked

                jQuery('#infraction_list input:checked').each(function() {
                    var infraction_id = (jQuery(this).parent().children().eq(0)[0].id).substring(11);
                    infraction_ids.push(infraction_id);
                });

                jQuery('#company_list input:checked').each(function() {
                    var company_id = (jQuery(this)[0].id).substring(8)
                    company_ids.push(company_id);
                });
                // slimeBikeService.send('IMAGING');
                // next_tab.trigger('click');
                $tabs.filter('.active').next('li').find('a[data-toggle="tab"]').tab('show');
                draw_map();
            }
        }
        else {
            jQuery('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
    // This function is called when continue button on the "location" is clicked
    jQuery('#location_continue').click(function(e) {
        e.preventDefault();
        $ident_li = jQuery('#li_identification')
        $ident_li.removeClass("disabled");
        $ident_li.find('a[data-toggle]').each(function () {
            jQuery(this).attr("data-toggle", "tab");
        });
        var next_tab = jQuery('a[href="#tab_identification"]');
        console.log(next_tab);
        if (next_tab.length > 0) {
            if (latitude != "" && longitude != "") {
                // next_tab.trigger('click');
                next_tab.tab('show');
                // slimeBikeService.send('PINPOINTING');
            }
        }
        else {
            jQuery('.nav-tabs li:eq(0) a').trigger('click');
        }
    });
});