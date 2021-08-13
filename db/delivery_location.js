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
                let delivery_location_list = [];
                const length = result.length;
                
                for (let i = 0; i < length; i++) {
                    delivery_location_list.push({
                        dl_sido : result[i].dl_sido,
                        dl_gu : result[i].dl_gu
                    });
                }

                callback(null, delivery_location_list);
            }
        });
    },
};
