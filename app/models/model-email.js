const logger = require('../utils/logger');
const emailUtil = require('../utils/emailUtil');
const dbUtil = require('../utils/dbUtil')

/* 
 * get Emails
 * @return 
 */
module.exports.getEmails = async (ms_ids, city) => {
    // if the city does not have a city_id, then consider it 'Generic'
    let get_email_sql = `select micromobility_city_contact_email email 
                            from micromobility_city_xref 
                            where micromobilityservice_id = ANY($1) 
                                and city_id = 
                                (select coalesce ((select city_id 
                                                    from city_info 
                                                    where city = $2), 
                                                  (select city_id 
                                                    from city_info 
                                                    where city = 'Generic')));`;
    let get_email_data = [ms_ids, city];

    try {
        get_email_result = await dbUtil.sqlToDB(get_email_sql, get_email_data);
        // email_result_arr = email_result.rows;
        return get_email_result;
    } catch (error) {
        logger.error(`getEmails error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getReport = async (mispark_id) => {
    let report_sql = `select
                            mr.mispark_id,
                            string_agg(distinct mc.company_name, ', ') as company_name,
                            string_agg(distinct mt.micromobility_typename, ', ') as type,
                            mr.report_datetime,
                            MAX(it.infraction_severity) as severity,
                            round(cast(ST_X(mr.report_location::geometry) as numeric), 4) as longitude,
                            round(cast(ST_Y(mr.report_location::geometry) as numeric), 4) as latitude,
                            mr.report_uid,
                            ci.city
                        from misparking_report mr
                        JOIN micromobility_services ms
                        ON ms.micromobilityservice_id =  ANY(mr.micromobilityservice_ids)
                        JOIN micromobility_type mt
                        ON mt.micromobilitytype_id = ms.micromobilitytype_id
                        JOIN micromobility_company mc
                        ON mt.company_id = mc.company_id
                        JOIN misparking_report_infraction_xref mx
                        ON mr.mispark_id = mx.mispark_id
                        JOIN infraction_type it
                        ON mx.infractiontype_id = it.infractiontype_id
                        JOIN city_info ci
                        ON mr.city_id = ci.city_id
                        WHERE mr.mispark_id = $1
                        GROUP BY mr.mispark_id, ci.city;
                    `;
    let report_data = [mispark_id];

    try {
        report_result = await dbUtil.sqlToDB(report_sql, report_data);
        return report_result;
    } catch (error) {
        logger.error(`getReport error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getInfractions = async (mispark_id) => {
    let infractions_sql = `select
                                infraction_description,
                                infraction_severity
                            from infraction_type
                            where infractiontype_id IN
                                (select
                                    infractiontype_id
                                from misparking_report_infraction_xref mx
                                where mx.mispark_id = $1
                            )
                            ORDER BY infraction_severity DESC `
    let infraction_data = [mispark_id];

    try {
        infraction_result = await dbUtil.sqlToDB(infractions_sql, infraction_data);
        return infraction_result;
    } catch (error) {
        logger.error(`getInfractions error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.sendEmail = async (email, body, attachment) => {
    try {
        var send_email_result = await emailUtil.sendEmail(email, body, attachment);
        return send_email_result;
    } catch (error) {
        logger.error(`sendEmail error in model: ${error.message}`);
        throw new Error(error.message);
    }
}