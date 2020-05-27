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
module.exports.getCompanies = async (lng, lat) => {
    let sql = `select ms.micromobilityservice_id, mt.vehicle_image, mc.company_name from micromobility_type mt
	join micromobility_company mc on mc.company_id = mt.company_id
	join micromobility_services ms on mt.micromobilitytype_id = ms.micromobilitytype_id
		where micromobilityservice_id IN (select micromobilityservice_id from micromobility_city_xref 
                            where city_id = (select COALESCE (
                                (select city_id from city_info where city = 
                                    (select coalesce(
                                        (select cityname from wa_city_shape 
                                            where ST_Within(ST_SetSRID(ST_MakePoint($1, $2), 4326), geom)), 
                                        'Generic'))), 
                                (select city_id from city_info where city = 'Generic'))));`;
    let data = [lng, lat];
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        logger.error(`getCompanies error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getCity = async (lng, lat) => {
    let sql = `select coalesce(
                    (select cityname from wa_city_shape 
                        where ST_Within(ST_SetSRID(ST_MakePoint($1, $2), 4326), geom)), 
                    'Generic') as cityname;`;
    let data = [lng, lat];
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        logger.error(`getCity error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.getInfractions = async (lng, lat) => {
    let sql = `select infraction_description, infractiontype_id, infraction_severity from infraction_type 
    where infractiontype_id IN (select infractiontype_id from infraction_city_xref 
        where city_id IN (select COALESCE (
            (select city_id from city_info where city = 
                (select coalesce(
                    (select cityname from wa_city_shape 
                        where ST_Within(ST_SetSRID(ST_MakePoint($1, $2), 4326), geom)), 
                    'Generic'))), 
            (select city_id from city_info where city = 'Generic')))) order by infraction_severity DESC;`;
    let data = [lng, lat];
    try {
        result = await dbUtil.sqlToDB(sql, data);
        return result;
    } catch (error) {
        logger.error(`getInfractions error in model: ${error.message}`);
        throw new Error(error.message);
    }
}

module.exports.insertReport = async (report) => {
    let datetime = new Date();
    let client = await dbUtil.getTransaction();
    // todo: fix the insert query to use 'data' to prevent SQL injection
    let sql = `with mispark_report as (insert into misparking_report (micromobilityservice_ids, report_datetime, 
        report_location, report_image, report_uid, notes, city_id) values ($1, 
                    $2, ST_SetSRID(ST_MakePoint($3, $4), 4326), $5, 
                    $6, $7, (select city_id from city_info where city = $8)) returning mispark_id)
                        insert into misparking_report_infraction_xref (infractiontype_id, mispark_id) 
                            values `;
    
    // The values for the insert tuples need to be dynamically generated
    let values_infraction_ids = '';
    let datai = [];
    for(let i = 0; i < report.infraction_ids.length; i++) {
        var j = '$' + (9 + i); //dynamically generate the parameterized query placeholder
        datai.push(parseInt(report.infraction_ids[i]));
        values_infraction_ids = values_infraction_ids + `(${j}, (select mispark_id from mispark_report)), `;
    }
    // Trim the last commna (,) as the insert tuples needs to end with comma
    values_infraction_ids = values_infraction_ids.slice(0, -2);

    sql = sql + values_infraction_ids + " returning mispark_id;";
    
    let data = [report.micromobilityservice_ids.map(Number), datetime, report.location[0], report.location[1], report.img, report.vehicle_id, report.notes, report.city];
    data = data.concat(datai);
    // console.log(datai);
    // console.log(data);
    try {
        result = await dbUtil.sqlExecSingleRow(client, sql, data);
        // result = await dbUtil.sqlToDB(sql, data);
        await dbUtil.commit(client);
        return result;
    } catch (error) {
        logger.error(`insertReport error in model: ${error.message}`);
        await dbUtil.rollback(client);
        throw new Error(error.message);
    }
}