const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    findLocations: (callback) => {
        let sql = `SELECT * 
                   FROM location`;

        return connection.query(sql, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
    searchLocation: (searchWord, callback) => {
        const sql = `SELECT DISTINCT l_index, l_name, l_immediate_or_not 
                     FROM location
                     WHERE l_name LIKE '%${searchWord}%'`;         

        return connection.query(sql, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};
