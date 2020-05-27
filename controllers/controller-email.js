// this is a controller for email service
const logger = require('./../utils/logger');
const emailModel = require('./../models/model-email');

// sample controller using transaction
module.exports.sendEmail = async (case_data, mispark_id) => {
    try {
        // get the report
        let report_result = await emailModel.getReport(mispark_id);
        // extract the relevant key from the object
        report_result_arr = report_result.rows;
        let infraction_result = await emailModel.getInfractions(mispark_id);
        infraction_result_arr = infraction_result.rows;
        var report =
        {
            summary: '',
            infractions: ''
        }
        report.summary = report_result_arr[0]
        report.infractions = infraction_result_arr

        // convert object to string and make it render well in HTML.
        // body = JSON.stringify(report)
        body = JSON.stringify( report, null, '&nbsp;' ).split( '\n' ).join( '<br>' );
        // get the emails for the relevant ms_ids
        let email_result = await emailModel.getEmails(case_data.micromobilityservice_ids, case_data.city);
        email_result_arr = email_result.rows;
        // make the data URI from image base64 encoded string 
        let attachment = "data:image/png;base64, " + case_data.img;
        // foreach email in the array, send the same body and attachment
        var email_response_ids = [];
        const results = email_result_arr.map(async (email) => {
            var send_email_result = await emailModel.sendEmail(email, body, attachment);
            email_response_ids.push(send_email_result.response);
        });
        // return when all emails are sent 
        Promise.all(results).then(() => {
            logger.info("Email(s) sent: " + email_response_ids);
            return email_response_ids
        });
        
    } catch (error) {
        logger.error(`sendEmail error in controller: ${error.message}`);
        return error;
    }
}