const logger = require('../utils/logger');
const dbUtil = require('../utils/dbUtil');
const transactionSuccess = 'transaction success';

/* 
 * sample query using transactions
 * @return transaction success
 */
module.exports.sampleTransaction = async () => {
    let singleSql = "DELETE FROM TEST";
    let multiSql = "INSERT INTO TEST (testcolumn) VALUES ($1)";
    let singleData = [];
    let multiData = [
        ['node.js'],
        ['is'],
        ['fun']
    ];
    let client = await dbUtil.getTransaction();
    try {
        await dbUtil.sqlExecSingleRow(client, singleSql, singleData);
        await dbUtil.sqlExecMultipleRows(client, multiSql, multiData);
        await dbUtil.commit(client);
        return transactionSuccess;
    } catch (error) {
        logger.error(`sampleTransactionModel error: ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}


/* 
 * sample query
 * @return server time
 */
module.exports.getCompanies = async (city) => {
    let sql = `select company_id, company_name from micromobility_company 
                    where company_id IN (select company_id from micromobility_services 
                        where micromobilityservice_id IN (select micromobilityservice_id from micromobility_city_xref 
                            where city_id = (select city_id from city_info where city = '${city}'))); `;
    let data = [];
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports.getInfractions = async (city) => {
    let sql = `select infraction_description, infractiontype_id from infraction_type 
                    where infractiontype_id IN (select infractiontype_id from infraction_city_xref 
                        where city_id IN (select city_id from city_info where city = '${city}'));`;
    let data = [];
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports.insertReport = async (report) => {
    let datetime = new Date().toISOString();
    let client = await dbUtil.getTransaction();
    
    let sql = `with mispark_report as (insert into misparking_report (micromobilityservice_id, report_datetime, 
        report_location, report_image, report_uid) values ((select micromobilityservice_id from 
                micromobility_city_xref where city_id = (select city_id from city_info 
                    where city ='${report.city}') intersect select micromobilityservice_id from 
                    micromobility_services where company_id = ${parseInt(report.company_ids)}), 
                    '${datetime}', ST_SetSRID(ST_MakePoint(${report.location}),4326), '${report.img}', 
                    '${report.vehicle_id}') returning mispark_id)
                        insert into misparking_report_infraction_xref (infractiontype_id, mispark_id) 
                            values `;
    
    // The values for the insert tuples need to be dynamically generated
    let values_infraction_ids = '';
    for(let i = 0; i < report.infraction_ids.length; i++) {
        values_infraction_ids = values_infraction_ids + `(${parseInt(report.infraction_ids[i])}, (select mispark_id from mispark_report)), `;
    }
    // Trim the last commna (,) as the insert tuples needs to end with comma
    values_infraction_ids = values_infraction_ids.slice(0, -2);

    sql = sql + values_infraction_ids;
    
    let data = [];
    try {
        await dbUtil.sqlExecSingleRow(client, sql, data);
        // result = await dbUtil.sqlToDB(sql, data);
        await dbUtil.commit(client);
        return transactionSuccess;
    } catch (error) {
        logger.error(`sampleTransactionModel error: ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}