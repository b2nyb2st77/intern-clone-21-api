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
        WHERE atoh_a_index IN (${affiliates.map(item => item.a_index).join(",")})
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
              AND a.a_index IN (${affiliates.map(item => item.a_index).join(",")})
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
    }
};

function affiliateListMapper(result) {
    let affiliate_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        affiliate_list.push({
            a_index : result[i].a_index,
            a_open_time : result[i].a_open_time,
            a_close_time : result[i].a_close_time
        });
    }

    return affiliate_list;
}

function temporaryOpenHourListMapper(result) {
    let temporary_open_hour_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        temporary_open_hour_list.push({
            atoh_a_index : result[i].atoh_a_index,
            atoh_start_date : result[i].atoh_start_date,
            atoh_end_date : result[i].atoh_end_date,
            atoh_open_time : result[i].atoh_open_time,
            atoh_close_time : result[i].atoh_close_time
        });
    }

    return temporary_open_hour_list;
}

function peakSeasonListMapper(result) {
    let peak_season_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        peak_season_list.push({
            ps_a_index : result[i].ps_a_index,
            ps_start_date : result[i].ps_start_date,
            ps_end_date : result[i].ps_end_date
        });
    }

    return peak_season_list;
}