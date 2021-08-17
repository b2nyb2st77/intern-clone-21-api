const express = require("express");
const dayjs = require("dayjs");

const mysql = require("../db/mysql");

const connection = mysql.init();

module.exports = {
    findCarsAndPrices: (affiliates, startTime, endTime, callback) => {
        const sql = `
        SELECT c.c_index, c.c_type, c.c_name, c.c_max_number_of_people, c.c_gear, c.c_number_of_load, c.c_number_of_door, c.c_air_conditioner_or_not, c.c_production_year, c.c_fuel,
               c.c_description, c.c_driver_age, a.a_index, a.a_name, a.a_info, a.a_number_of_reservation, a.a_grade, a.a_new_or_not, a.a_weekend, rs.rs_index, 
               p.p_rs_index, p.p_1_or_2_days, p.p_3_or_4_days, p.p_5_or_6_days, p.p_7_days, p.p_1_hour, p.p_6_hours, p.p_12_hours, p.p_type
        FROM rentcar_status rs
        INNER JOIN car c
        INNER JOIN affiliate a
        INNER JOIN price p
        ON rs.rs_c_index = c.c_index
            AND rs.rs_a_index = a.a_index
            AND p.p_rs_index = rs.rs_index
        WHERE a.a_index IN (${affiliates.map(item => item.a_index).join(",")})
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
                let car_list = carAndPriceListMapper(result);

                callback(null, car_list);
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
                callback(null, {number_of_affiliate: result[0][0].count, number_of_car: result[1][0].count});
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
    }
 };

 function carAndPriceListMapper(result) {
    let car_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        let [isSameCarInList, carIndex] = findIfAndWhereIsCarInList(car_list, result[i]);

        if (isSameCarInList) {
            car_list[carIndex].price_list.push({
                p_rs_index : result[i].p_rs_index, 
                p_1_or_2_days : result[i].p_1_or_2_days, 
                p_3_or_4_days : result[i].p_3_or_4_days, 
                p_5_or_6_days : result[i].p_5_or_6_days, 
                p_7_days : result[i].p_7_days, 
                p_1_hour : result[i].p_1_hour, 
                p_6_hours : result[i].p_6_hours, 
                p_12_hours : result[i].p_12_hours, 
                p_type : result[i].p_type
            });

            continue;
        }

        car_list.push({
            c_index : result[i].c_index, 
            c_type : result[i].c_type, 
            c_name : result[i].c_name, 
            c_max_number_of_people : result[i].c_max_number_of_people, 
            c_gear : result[i].c_gear, 
            c_number_of_load : result[i].c_number_of_load, 
            c_number_of_door : result[i].c_number_of_door, 
            c_air_conditioner_or_not : result[i].c_air_conditioner_or_not, 
            c_production_year : result[i].c_production_year, 
            c_fuel : result[i].c_fuel,
            c_description : result[i].c_description, 
            c_driver_age : result[i].c_driver_age, 
            a_index : result[i].a_index, 
            a_name : result[i].a_name, 
            a_info : result[i].a_info, 
            a_number_of_reservation : result[i].a_number_of_reservation, 
            a_grade : result[i].a_grade, 
            a_new_or_not : result[i].a_new_or_not, 
            a_weekend : result[i].a_weekend, 
            rs_index : result[i].rs_index,
            price_list : [{
                p_rs_index : result[i].p_rs_index, 
                p_1_or_2_days : result[i].p_1_or_2_days, 
                p_3_or_4_days : result[i].p_3_or_4_days, 
                p_5_or_6_days : result[i].p_5_or_6_days, 
                p_7_days : result[i].p_7_days, 
                p_1_hour : result[i].p_1_hour, 
                p_6_hours : result[i].p_6_hours, 
                p_12_hours : result[i].p_12_hours, 
                p_type : result[i].p_type
            }]
        });
    }

    return car_list;
 }

 function findIfAndWhereIsCarInList(car_list, result) {
    let isSameCarInList = false;
    let carIndex = 0;
    const length = car_list.length;

    for (let k = 0; k < length; k++) {
        if (car_list[k].rs_index === result.rs_index) {
            isSameCarInList = true;
            carIndex = k;
            break;
        }
    }

    return [isSameCarInList, carIndex];
 }
