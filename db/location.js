const express = require("express");
const mysql = require("../db/mysql");
const con = mysql.init();

module.exports = {
    popular: (callback) => {
        const sql = `SELECT DISTINCT l_subname 
                     FROM location 
                     WHERE l_popular_or_not = 'y'`;

        return con.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    othertype: (type, callback) => {
        const sql = `SELECT DISTINCT l_name, l_immediate_or_not 
                     FROM location
                     WHERE l_type = ?`;         

        return con.query(sql, type, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};
