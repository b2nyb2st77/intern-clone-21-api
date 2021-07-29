const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();
const number = require("../core/number_string");
const time = require("../core/calculate_time");

module.exports = {
    findCars: (order, location, startTime, endTime, callback) => {
        const start = time.calculateMillisecondsOfTime(startTime);
        const end = time.calculateMillisecondsOfTime(endTime);
        const [day, hour] =  time.calculateDayAndHourForPrice(start, end);
        const [today_date, today_day] = time.calculateDayAndDateOfToday();
        const weekdays = [1, 2, 3, 4, 5];
        
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
                FROM rentcar_status rs, car c, affiliate a, price p, location l
                WHERE rs.rs_c_index = c.c_index
                      AND rs.rs_a_index = a.a_index
                      AND a.a_l_index = l.l_index
                      AND (l.l_name = '${location}'
                           OR l.l_subname = '${location}')
                      AND p.p_rs_index = rs.rs_index
                      AND p.p_type = CASE
                                         WHEN (SELECT COUNT(*)
                                               FROM peak_season ps 
                                               WHERE ps.ps_a_index = a.a_index 
                                                     AND '${today_date}' >= ps.ps_start_date 
                                                     AND '${today_date}' <= ps.ps_end_date) > 0
                                         THEN 'peakseason'
                                         ELSE `;

        if (!~weekdays.indexOf(today_day)) sql += `'weekend'`;
        else sql +=  `'weekdays'`;
  
        sql += `
                                     END 
                      AND rs.rs_index NOT IN (SELECT distinct rr.rr_rs_index
                                              FROM rentcar_status rs, rentcar_reservation rr
                                              WHERE rs.rs_index = rr.rr_rs_index
                                                    AND rr.rr_cancel_or_not = 'n'
                                                    AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}')
                                                          OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}'))) `;

        if (order === 'type') {
            sql += `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV'), c.c_name, a.a_name ASC`;
        }
        else if (order === 'price') {
            sql += `ORDER BY c.c_name, a.a_name, car_price`;
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
                                  AND (l.l_name = '${location}'
                                       OR l.l_subname = '${location}')
                                  AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}')
                                        OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}'))
                            GROUP BY a.a_name) AS S;`;
                            
        const sql2 = `SELECT COUNT(*) count
                      FROM rentcar_status rs, car c, affiliate a, rentcar_reservation rr, location l
                      WHERE c.c_name = '${carName}'
                            AND rs.rs_c_index = c.c_index
                            AND rs.rs_a_index = a.a_index
                            AND rs.rs_index = rr.rr_rs_index
                            AND a.a_l_index = l.l_index
                            AND rr.rr_cancel_or_not = 'n'
                            AND (l.l_name = '${location}'
                                 OR l.l_subname = '${location}')
                            AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}')
                                  OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}'));`;

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