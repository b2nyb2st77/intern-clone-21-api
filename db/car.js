const express = require("express");
const dayjs = require("dayjs");

const mysql = require("../db/mysql");

const connection = mysql.init();

module.exports = {
    findCarsAndPrices: (location, startTime, endTime, callback) => {
        const start_date = dayjs(startTime).format("YYYY-MM-DD");
        const start_time = dayjs(startTime).format("HH:mm:ss");
        const end_date = dayjs(endTime).format("YYYY-MM-DD");
        const end_time = dayjs(endTime).format("HH:mm:ss");

        const sql = `
        SELECT c.c_index, c.c_type, c.c_name, c.c_max_number_of_people, c.c_gear, c.c_number_of_load, c.c_number_of_door, c.c_air_conditioner_or_not, c.c_production_year, c.c_fuel,
               c.c_description, c.c_driver_age, a.a_index, a.a_name, a.a_info, a.a_number_of_reservation, a.a_grade, a.a_new_or_not, a.a_weekend, rs.rs_index, 
               p.p_rs_index, p.p_1_or_2_days, p.p_3_or_4_days, p.p_5_or_6_days, p.p_7_days, p.p_1_hour, p.p_6_hours, p.p_12_hours, p.p_type
        FROM rentcar_status rs
        INNER JOIN car c
        INNER JOIN affiliate a
        INNER JOIN location l
        INNER JOIN price p
        ON rs.rs_c_index = c.c_index
            AND rs.rs_a_index = a.a_index
            AND a.a_l_index = l.l_index
            AND p.p_rs_index = rs.rs_index
        WHERE (l.l_name = '${location}' OR l.l_subname = '${location}')
                AND '${start_time}' >=
                    CASE 
                    WHEN (SELECT COUNT(*) 
                          FROM affiliate_temporary_open_hour atoh 
                          WHERE a.a_index = atoh.atoh_a_index 
                                AND atoh.atoh_delete_or_not = 'n') > 0
                    THEN 
                        CASE 
                        WHEN (SELECT COUNT(*) 
                              FROM affiliate_temporary_open_hour atoh 
                              WHERE a.a_index = atoh.atoh_a_index
                                    AND '${start_date}' >= atoh.atoh_start_date
                                    AND '${start_date}' <= atoh.atoh_end_date
                                    AND atoh.atoh_delete_or_not = 'n') > 0
                        THEN (SELECT atoh.atoh_open_time
                              FROM affiliate_temporary_open_hour atoh 
                              WHERE a.a_index = atoh.atoh_a_index
                                    AND '${start_date}' >= atoh.atoh_start_date
                                    AND '${start_date}' <= atoh.atoh_end_date
                                    AND atoh.atoh_delete_or_not = 'n')
                        ELSE a.a_open_time 
                        END
                    ELSE a.a_open_time
                    END
                AND '${start_time}' <=
                    CASE 
                    WHEN (SELECT COUNT(*) 
                          FROM affiliate_temporary_open_hour atoh 
                          WHERE a.a_index = atoh.atoh_a_index 
                                AND atoh.atoh_delete_or_not = 'n') > 0
                    THEN 
                        CASE 
                        WHEN (SELECT COUNT(*) 
                              FROM affiliate_temporary_open_hour atoh 
                              WHERE a.a_index = atoh.atoh_a_index
                                    AND '${start_date}' >= atoh.atoh_start_date
                                    AND '${start_date}' <= atoh.atoh_end_date
                                    AND atoh.atoh_delete_or_not = 'n') > 0
                        THEN (SELECT atoh.atoh_close_time
                            FROM affiliate_temporary_open_hour atoh 
                            WHERE a.a_index = atoh.atoh_a_index
                                  AND '${start_date}' >= atoh.atoh_start_date
                                  AND '${start_date}' <= atoh.atoh_end_date
                                  AND atoh.atoh_delete_or_not = 'n')
                        ELSE a.a_close_time
                        END
                    ELSE a.a_close_time
                    END
                AND '${end_time}' >=
                    CASE 
                    WHEN (SELECT COUNT(*) 
                          FROM affiliate_temporary_open_hour atoh 
                          WHERE a.a_index = atoh.atoh_a_index 
                                AND atoh.atoh_delete_or_not = 'n') > 0
                    THEN 
                        CASE 
                        WHEN (SELECT COUNT(*) 
                              FROM affiliate_temporary_open_hour atoh 
                              WHERE a.a_index = atoh.atoh_a_index
                                    AND '${end_date}' >= atoh.atoh_start_date
                                    AND '${end_date}' <= atoh.atoh_end_date
                                    AND atoh.atoh_delete_or_not = 'n') > 0
                        THEN (SELECT atoh.atoh_open_time
                            FROM affiliate_temporary_open_hour atoh 
                            WHERE a.a_index = atoh.atoh_a_index
                                  AND '${end_date}' >= atoh.atoh_start_date
                                  AND '${end_date}' <= atoh.atoh_end_date
                                  AND atoh.atoh_delete_or_not = 'n') 
                        ELSE a.a_open_time 
                        END
                    ELSE a.a_open_time
                    END
                AND '${end_time}' <=
                    CASE 
                    WHEN (SELECT COUNT(*) 
                          FROM affiliate_temporary_open_hour atoh 
                          WHERE a.a_index = atoh.atoh_a_index 
                          AND atoh.atoh_delete_or_not = 'n') > 0
                    THEN 
                        CASE 
                        WHEN (SELECT COUNT(*) 
                              FROM affiliate_temporary_open_hour atoh 
                              WHERE a.a_index = atoh.atoh_a_index
                                    AND '${end_date}' >= atoh.atoh_start_date
                                    AND '${end_date}' <= atoh.atoh_end_date
                                    AND atoh.atoh_delete_or_not = 'n') > 0
                        THEN (SELECT atoh.atoh_close_time
                            FROM affiliate_temporary_open_hour atoh 
                            WHERE a.a_index = atoh.atoh_a_index
                                  AND '${end_date}' >= atoh.atoh_start_date
                                  AND '${end_date}' <= atoh.atoh_end_date
                                  AND atoh.atoh_delete_or_not = 'n') 
                        ELSE a.a_close_time
                        END
                    ELSE a.a_close_time
                    END
                AND rs.rs_index NOT IN (SELECT distinct rr.rr_rs_index
                                        FROM rentcar_status rs, rentcar_reservation rr
                                        WHERE rs.rs_index = rr.rr_rs_index
                                            AND rr.rr_cancel_or_not = 'n'
                                            AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}') 
                                                    OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}')
                                                    OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${endTime}'))
                                        )
        ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV'), c.c_name, a.a_name ASC`;

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    findReservedCar: (carName, location, startTime, endTime, callback) => {
        const sql1 = `
        SELECT COUNT(S.name) count
        FROM (SELECT a.a_name name
              FROM rentcar_status rs
              INNER JOIN car c
              INNER JOIN affiliate a
              INNER JOIN rentcar_reservation rr
              INNER JOIN location l
              ON rs.rs_c_index = c.c_index
                 AND rs.rs_a_index = a.a_index
                 AND rs.rs_index = rr.rr_rs_index
                 AND a.a_l_index = l.l_index
              WHERE c.c_name = '${carName}'
                    AND rr.rr_cancel_or_not = 'n'
                    AND (l.l_name = '${location}' OR l.l_subname = '${location}')
                    AND a.a_open_time <= '${startTime}' AND a.a_close_time >= '${startTime}'
                    AND a.a_open_time <= '${endTime}' AND a.a_close_time >= '${endTime}'
                    AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}') 
                          OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}')
                          OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${endTime}'))
                    GROUP BY a.a_name) AS S;`;
                            
        const sql2 = `
        SELECT COUNT(*) count
        FROM rentcar_status rs
        INNER JOIN car c
        INNER JOIN affiliate a
        INNER JOIN rentcar_reservation rr
        INNER JOIN location l
        ON rs.rs_c_index = c.c_index
           AND rs.rs_a_index = a.a_index
           AND rs.rs_index = rr.rr_rs_index
           AND a.a_l_index = l.l_index
        WHERE c.c_name = '${carName}'
              AND rr.rr_cancel_or_not = 'n'
              AND (l.l_name = '${location}' OR l.l_subname = '${location}')
              AND a.a_open_time <= '${startTime}' AND a.a_close_time >= '${startTime}'
              AND a.a_open_time <= '${endTime}' AND a.a_close_time >= '${endTime}'
              AND ((rr.rr_start_time >= '${startTime}' AND rr.rr_start_time <= '${endTime}') 
                    OR (rr.rr_end_time >= '${startTime}' AND rr.rr_end_time <= '${endTime}')
                    OR (rr.rr_start_time <= '${startTime}' AND rr.rr_end_time >= '${endTime}'));`;

        return connection.query(sql1 + sql2, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    findOneCar: (index, callback) => {
        const sql = `
        SELECT c_index, c_type, c_name, c_max_number_of_people, c_gear, c_number_of_load, c_number_of_door, c_air_conditioner_or_not, c_production_year, c_fuel, c_description, c_driver_age 
        FROM car 
        WHERE c_index = ?`;

        return connection.query(sql, index, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    findPeakSeasons: (location, startTime, endTime, callback) => {
        const sql = `
        SELECT ps.ps_a_index, ps.ps_start_date, ps.ps_end_date
        FROM peak_season ps
        INNER JOIN location l
        INNER JOIN affiliate a
        ON ps.ps_a_index = a.a_index
           AND a.a_l_index = l.l_index
        WHERE ps_delete_or_not = 'n'
              AND (l.l_name = '${location}' OR l.l_subname = '${location}')
              AND ((ps.ps_start_date >= '${startTime}' AND ps.ps_start_date <= '${endTime}') 
                    OR (ps.ps_end_date >= '${startTime}' AND ps.ps_end_date <= '${endTime}')
                    OR (ps.ps_start_date <= '${startTime}' AND ps.ps_end_date >= '${endTime}'));`;

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
 };
