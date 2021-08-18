const { application } = require("express");
const express = require("express");

const mysql = require("../db/mysql");

const connection = mysql.init();

module.exports = {
    findOneAffiliate: (index, callback) => {
        const sql = `
        SELECT a_index, a_name, a_info, a_number_of_reservation, a_grade, a_new_or_not, a_open_time, a_close_time, a_weekend
        FROM affiliate 
        WHERE a_index = ?`;
        
        return connection.query(sql, index, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
    findAffiliatesByLocation: (location, callback) => {
        const sql = `
        SELECT a.a_index, a_open_time, a_close_time
        FROM affiliate a
        INNER JOIN location l
        ON a.a_l_index = l.l_index
        WHERE l.l_name = '${location}' OR l.l_subname = '${location}'`;
        
        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                let affiliate_list = affiliateListMapper(result);

                callback(null, affiliate_list);
            }
        });
    },
    findTemporaryOpenHourOfAffiliates: (affiliates, callback) => {
        const sql = `
        SELECT atoh_a_index, atoh_start_date, atoh_end_date, atoh_open_time, atoh_close_time
        FROM affiliate_temporary_open_hour
        WHERE atoh_a_index IN (${affiliates.map(item => item.affiliate_index).join(",")})
              AND atoh_delete_or_not = 'n'`;

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                let temporary_open_hour_list = temporaryOpenHourListMapper(result);
                
                callback(null, temporary_open_hour_list);
            }
        });
    },
    findPeakSeasonOfAffiliates: (affiliates, startTime, endTime, callback) => {
        const sql = `
        SELECT ps.ps_a_index, ps.ps_start_date, ps.ps_end_date
        FROM peak_season ps
        INNER JOIN affiliate a
        ON ps.ps_a_index = a.a_index
        WHERE ps_delete_or_not = 'n'
              AND a.a_index IN (${affiliates.map(item => item.affiliate_index).join(",")})
              AND ((ps.ps_start_date >= '${startTime}' AND ps.ps_start_date <= '${endTime}') 
                    OR (ps.ps_end_date >= '${startTime}' AND ps.ps_end_date <= '${endTime}')
                    OR (ps.ps_start_date <= '${startTime}' AND ps.ps_end_date >= '${endTime}'));`;

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                let peak_season_list = peakSeasonListMapper(result);

                callback(null, peak_season_list);
            }
        });
    },
    findNumberOfAffiliatesOfReservedCars: (carName, location, startTime, endTime, callback) => {
        const sql = `
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
    
        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    }
};

function affiliateListMapper(affiliates) {
    let affiliate_list = [];
    const length = affiliates.length;
    
    for (let i = 0; i < length; i++) {
        affiliate_list.push({
            affiliate_index : affiliates[i].a_index,
            open_time : affiliates[i].a_open_time,
            close_time : affiliates[i].a_close_time
        });
    }

    return affiliate_list;
}

function temporaryOpenHourListMapper(temporaray_open_hours) {
    let temporary_open_hour_list = [];
    const length = temporaray_open_hours.length;
    
    for (let i = 0; i < length; i++) {
        temporary_open_hour_list.push({
            affiliate_index : temporaray_open_hours[i].atoh_a_index,
            start_date : temporaray_open_hours[i].atoh_start_date,
            end_date : temporaray_open_hours[i].atoh_end_date,
            open_time : temporaray_open_hours[i].atoh_open_time,
            close_time : temporaray_open_hours[i].atoh_close_time
        });
    }

    return temporary_open_hour_list;
}

function peakSeasonListMapper(peak_seasons) {
    let peak_season_list = [];
    const length = peak_seasons.length;
    
    for (let i = 0; i < length; i++) {
        peak_season_list.push({
            affiliate_index : peak_seasons[i].ps_a_index,
            start_date : peak_seasons[i].ps_start_date,
            end_date : peak_seasons[i].ps_end_date
        });
    }

    return peak_season_list;
}