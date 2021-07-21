const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    findCars: (order, type, location, startTime, endTime, callback) => {
        let sql = `SELECT c.*, a.*, rs.rs_price 
                   FROM rentcar_status rs, car c, affiliate a 
                   WHERE rs.rs_c_index = c.c_index
                         AND rs.rs_a_index = a.a_index
                         AND rs.rs_index NOT IN (SELECT rs.rs_index
                                                 FROM rentcar_status rs, car c, affiliate a, rentcar_reservation rr, location l
                                                 WHERE rs.rs_c_index = c.c_index
                                                       AND rs.rs_a_index = a.a_index
                                                       AND rs.rs_index = rr.rr_rs_index
                                                       AND a.a_l_index = l.l_index
                                                       AND rr.rr_cancel_or_not = 'n'
                                                       AND l.l_name = '${location}'
                                                       AND ((rr.rr_start_time <= '${endTime}' AND rr.rr_end_time >= '${endTime}')
                                                             OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${startTime}'))
                                                )`;

        if (order === 'type') {
            switch (type) {
                case '':
                    sql += `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
                    break;
                case null:
                    sql += `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
                    break;
                case 'elec':
                    sql += `AND c.c_fuel = '전기'
                            ORDER BY c.c_name ASC`;
                    break;
                case 'small':
                    sql += `AND c.c_type IN ('경형', '소형')
                            ORDER BY FIELD(c.c_type, '경형', '소형'), c.c_name ASC`;
                    break;
                case 'middle':
                    sql += `AND c.c_type = '준중형'
                            ORDER BY c.c_name ASC`;
                    break;
                case 'big':
                    sql += `AND c.c_type IN ('중형', '대형')
                            ORDER BY FIELD(c.c_type, '중형', '대형'), c.c_name ASC`;
                    break;
                case 'suv':
                    sql += `AND c.c_type = 'SUV'
                            ORDER BY c.c_name ASC`;
                    break;
                case 'rv':
                    sql += `AND c.c_type = 'RV'
                            ORDER BY c.c_name ASC`;
                    break;
                case 'import':
                    sql += `AND c.c_type = '수입'
                            ORDER BY c.c_name ASC`;
                    break;
                default:
                    break;
            }
        }
        else if (order === 'price') {
            const sql_price = `ORDER BY FIELD(c.c_name, (SELECT group_concat(S.name) 
                                                         FROM (SELECT c.c_name name
                                                               FROM rentcar_status rs, car c 
                                                               WHERE rs.rs_c_index = c.c_index`;

            switch (type) {
                case '':
                    sql += sql_price;
                    break;
                case null:
                    sql += sql_price;
                    break;
                case 'elec':
                    sql += ` AND c.c_fuel = '전기' `
                           + sql_price
                           + ` AND c.c_fuel = '전기' `;
                    break;
                case 'small':
                    sql += ` AND c.c_type IN ('경형', '소형') `
                            + sql_price
                            + ` AND c.c_type IN ('경형', '소형') `;
                    break;
                case 'middle':
                    sql += ` AND c.c_type = '준중형' `
                            + sql_price
                            + ` AND c.c_type = '준중형' `;
                    break;
                case 'big':
                    sql += ` AND c.c_type IN ('중형', '대형') `
                            + sql_price
                            + ` AND c.c_type IN ('중형', '대형') `;
                    break;
                case 'suv':
                    sql += ` AND c.c_type = 'SUV' `
                            + sql_price
                            + ` AND c.c_type = 'SUV' `;
                    break;
                case 'rv':
                    sql += ` AND c.c_type = 'RV' `
                            + sql_price
                            + ` AND c.c_type = 'RV' `;
                    break;
                case 'import':
                    sql += ` AND c.c_type = '수입' `
                            + sql_price
                            + ` AND c.c_type = '수입' `;
                    break;
                default:
                    break;
            }
            
            sql +=  `GROUP BY c.c_name
                     ORDER BY min(rs.rs_price) ASC
                     ) AS S)), rs.rs_price ASC`;
        }

        return connection.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });

    },
    // 마감된 차량의 업체 개수, 차량 개수 찾기
    findReservedCar: (carName, location, startTime, endTime, callback) => {
        const sql1 = `SELECT COUNT(S.name) number_of_affiliate
                      FROM (SELECT a.a_name name
                            FROM rentcar_status rs, car c, affiliate a, rentcar_reservation rr, location l
                            WHERE c.c_name = '${carName}'
                                  AND rs.rs_c_index = c.c_index
                                  AND rs.rs_a_index = a.a_index
                                  AND rs.rs_index = rr.rr_rs_index
                                  AND a.a_l_index = l.l_index
                                  AND rr.rr_cancel_or_not = 'n'
                                  AND l.l_name = '${location}'
                                  AND ((rr.rr_start_time <= '${endTime}' AND rr.rr_end_time >= '${endTime}')
                                        OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${startTime}'))
                            GROUP BY a.a_name) AS S;`;
                            
        const sql2 = `SELECT COUNT(*) number_of_car
                      FROM rentcar_status rs, car c, affiliate a, rentcar_reservation rr, location l
                      WHERE c.c_name = '${carName}'
                            AND rs.rs_c_index = c.c_index
                            AND rs.rs_a_index = a.a_index
                            AND rs.rs_index = rr.rr_rs_index
                            AND a.a_l_index = l.l_index
                            AND rr.rr_cancel_or_not = 'n'
                            AND l.l_name = '${location}'
                            AND ((rr.rr_start_time <= '${endTime}' AND rr.rr_end_time >= '${endTime}')
                                  OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${startTime}'));`;

        return connection.query(sql1 + sql2, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    findOneCar: (index, callback) => {
        const sql = `SELECT * 
                     FROM car 
                     WHERE c_index = ?`;

        return connection.query(sql, index, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
};