const express = require("express");
const mysql = require("./mysql");
const connection = mysql.init();

module.exports = {
    findDeliveryLocation: (affiliateName, callback) => {
        const sql = `SELECT dl.* 
                     FROM delivery_location dl, affiliate a
                     WHERE dl.dl_a_index = a.a_index
                           AND a.a_name = '` + decodeURIComponent(affiliateName) +`'`;
        
        return connection.query(sql, function(err, result){
            if(err) throw err;
            else callback(null, result);
        });
    },
};