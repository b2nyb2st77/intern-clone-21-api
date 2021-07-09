const express = require("express");
const mysql = require("../db/mysql");
const con = mysql.init();

module.exports = {
    findOne: (index, callback) => {
        const sql = `SELECT * 
                     FROM affiliate 
                     WHERE a_index = ?`;
        
        return con.query(sql, index, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};