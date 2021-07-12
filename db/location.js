const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

module.exports = {
    // 지역선택 - 인기 지역
    findPopular: (callback) => {
        const sql = `SELECT DISTINCT l_subname 
                     FROM location 
                     WHERE l_popular_or_not = 'y'`;

        return connection.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    // 지역선택 - 공항(airport), KTX역(ktx), SRT역(srt), 버스터미널(bus), 지역(region), 해외(abroad)
    findOtherType: (type, callback) => {
        const sql = `SELECT DISTINCT l_name, l_immediate_or_not 
                     FROM location
                     WHERE l_type = ?`;         

        return connection.query(sql, type, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};
