const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    // 지역선택
    findLocations: (type, callback) => {
        let sql;
        if (type === 'popular') {
            sql = `SELECT DISTINCT l_subname 
                   FROM location 
                   WHERE l_popular_or_not = 'y'`;
        }
        else if (type === 'airport' || type === 'ktx' || type === 'srt' || type === 'bus' || type === 'region' || type === 'abroad') {
            sql = `SELECT DISTINCT l_name, l_immediate_or_not 
                   FROM location
                   WHERE l_type = '` + type + `'`;         
        }

        return connection.query(sql, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
    // 지역검색
    searchLocation: (searchWord, callback) => {
        const sql = `SELECT DISTINCT l_name, l_immediate_or_not 
                     FROM location
                     WHERE l_name LIKE '%` + decodeURIComponent(searchWord) + `%'`;         

        return connection.query(sql, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};
