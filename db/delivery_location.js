const express = require("express");

const mysql = require("./mysql");

const connection = mysql.init();

module.exports = {
    findDeliveryLocation: (affiliateName, callback) => {
        const sql = `
        SELECT dl.dl_sido, dl.dl_gu 
        FROM delivery_location dl
        INNER JOIN affiliate a
        ON dl.dl_a_index = a.a_index
        WHERE a.a_name = '${affiliateName}'`;
        
        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                callback(null, result);
            }
        });
    },
};
