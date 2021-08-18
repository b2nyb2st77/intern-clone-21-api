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
                let delivery_location_list = deliveryLocationListMapper(result);

                callback(null, delivery_location_list);
            }
        });
    }
};

function deliveryLocationListMapper(delivery_locations) {
    let delivery_location_list = [];
    const length = delivery_locations.length;
    
    for (let i = 0; i < length; i++) {
        delivery_location_list.push({
            dl_sido : delivery_locations[i].dl_sido,
            dl_gu : delivery_locations[i].dl_gu
        });
    }

    return delivery_location_list;
}
