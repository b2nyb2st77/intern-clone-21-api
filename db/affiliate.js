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
};
