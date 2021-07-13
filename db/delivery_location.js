const express = require("express");
const mysql = require("./mysql");
const connection = mysql.init();

module.exports = {
    findDeliveryLocation: (index, callback) => {
        const sql = `SELECT * 
                     FROM delivery_location 
                     WHERE dl_a_index = ?`;
        
        return connection.query(sql, index, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};