const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    findOneAffiliate: (index, callback) => {
        const sql = `SELECT * 
                     FROM affiliate 
                     WHERE a_index = ?`;
        
        return connection.query(sql, index, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};