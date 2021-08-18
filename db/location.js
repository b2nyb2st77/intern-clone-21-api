const express = require("express");

const mysql = require("../db/mysql");

const connection = mysql.init();

module.exports = {
    findLocations: (callback) => {
        let sql = `
        SELECT l_index, l_name, l_type, l_popular_or_not, l_immediate_or_not, l_subname
        FROM location`;

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                let location_list = locationListMapper(result);

                callback(null, location_list);
            }
        });
    },
    searchLocation: (searchWord, callback) => {
        const sql = `
        SELECT DISTINCT l_index, l_name, l_immediate_or_not
        FROM location
        WHERE l_name LIKE '%${searchWord}%'`;         

        return connection.query(sql, function(err, result){
            if (err) {
                callback(err);
            }
            else {
                let location_list = locationListMapper(result);

                callback(null, location_list);
            }
        });
    },
};

function locationListMapper(locations) {
    let location_list = [];
    const length = locations.length;
    
    for (let i = 0; i < length; i++) {
        let location = new Object();
        location.l_index = locations[i].l_index;
        location.l_name = locations[i].l_name;
        location.l_immediate_or_not = locations[i].l_immediate_or_not;

        if (locations[i].l_type != null && locations[i].l_type != undefined) {
            location.l_type = locations[i].l_type;
        }

        if (locations[i].l_popular_or_not != null && locations[i].l_popular_or_not != undefined) {
            location.l_popular_or_not = locations[i].l_popular_or_not;
        }

        if (locations[i].l_subname != null && locations[i].l_subname != undefined) {
            location.l_subname = locations[i].l_subname;
        }

        location_list.push(location);
    }

    return location_list;
}
