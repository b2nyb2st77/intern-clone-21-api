const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    findCars: (order, carType, location, startTime, endTime, callback) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const timeDiff = Math.ceil((end - start) / 3600000);
        
        const day = Math.floor(timeDiff / 24);
        const hour = timeDiff % 24;
        
        const today = new Date();   

        const t_year = today.getFullYear();
        const t_month = ('0' + (today.getMonth() + 1)).slice(-2);
        const t_day = ('0' + today.getDate()).slice(-2);

        const today_date = `${t_year}-${t_month}-${t_day}`;

        const today_day = today.getDay();
        
        let sql = `SELECT c.*, a.*, `;

        if (day >= 7) sql += `${day} * p.p_7_days `;
        else if (day == 5 || day == 6) sql += `${day} * p.p_5_or_6_days`;
        else if (day == 3 || day == 4) sql += `${day} * p.p_3_or_4_days`;
        else if (day == 1 || day == 2) sql += `${day} * p.p_1_or_2_days`;

        if (hour > 0) {
            sql += ` + 
            CASE
                WHEN p.p_12_hours != 0 AND ${hour} >= 12
                THEN
                    CASE
                        WHEN p.p_6_hours != 0 AND ${hour % 12} >= 6
                        THEN
                            CASE
                                WHEN ${hour % 12 % 6} > 0
                                THEN p.p_12_hours + p.p_6_hours + ${hour % 12 % 6} * p.p_1_hour
                                ELSE p.p_12_hours + p.p_6_hours
                            END
                        ELSE
                            CASE
                                WHEN ${hour % 12} > 0
                                THEN p.p_12_hours + ${hour % 12} * p.p_1_hour
                                ELSE p.p_12_hours
                            END
                    END
                ELSE
                    CASE
                        WHEN p.p_6_hours != 0 AND ${hour} >= 6
                        THEN
                            CASE
                                WHEN ${hour % 6} > 0
                                THEN ` + Math.floor(hour / 6) + ` * p.p_6_hours + ${hour % 6} * p.p_1_hour
                                ELSE ` + Math.floor(hour / 6) + ` * p.p_6_hours
                            END
                        ELSE ${hour} * p.p_1_hour
                    END
            END`;       
        }
        
        sql += ` AS car_price`;
    
        sql += `
                FROM rentcar_status rs, car c, affiliate a, price p
                WHERE rs.rs_c_index = c.c_index
                      AND rs.rs_a_index = a.a_index
                      AND p.p_rs_index = rs.rs_index
                      AND p.p_type = CASE
                                         WHEN (SELECT COUNT(*)
                                               FROM peak_season ps 
                                               WHERE ps.ps_a_index = a.a_index 
                                                     AND '${today_date}' >= ps.ps_start_date 
                                                     AND '${today_date}' <= ps.ps_end_date) > 0
                                         THEN 'peakseason'
                                         ELSE `;

        if (today_day === 0 || today_day === 6) sql += `'weekend'`;
        else sql +=  `'weekdays'`;
  
        sql += `
                                     END 
                      AND rs.rs_index NOT IN (SELECT rs.rs_index
                                              FROM rentcar_status rs, car c, affiliate a, rentcar_reservation rr, location l
                                              WHERE rs.rs_c_index = c.c_index
                                                    AND rs.rs_a_index = a.a_index
                                                    AND rs.rs_index = rr.rr_rs_index
                                                    AND a.a_l_index = l.l_index
                                                    AND rr.rr_cancel_or_not = 'n'
                                                    AND l.l_name = '${location}'
                                                    AND ((rr.rr_start_time <= '${endTime}' AND rr.rr_end_time >= '${endTime}')
                                                          OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${startTime}')))`;

        if (order === 'type') {
            switch (carType) {
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
                                                               WHERE rs.rs_c_index = c.c_index `;

            switch (carType) {
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
                     ORDER BY min(car_price) ASC
                     ) AS S)), car_price ASC`;
        }

        return connection.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    // 마감된 차량의 업체 개수, 차량 개수 찾기
    findReservedCar: (carName, location, startTime, endTime, callback) => {
        const sql1 = `SELECT COUNT(S.name) count
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
                            
        const sql2 = `SELECT COUNT(*) count
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
    }
 };