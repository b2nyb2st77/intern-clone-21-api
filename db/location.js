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
                let location_list = searchLocationListMapper(result);

                callback(null, location_list);
            }
        });
    },
};

function locationListMapper(result) {
    let location_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        location_list.push({
            l_index : result[i].l_index,
            l_name : result[i].l_name,
            l_type : result[i].l_type,
            l_popular_or_not : result[i].l_popular_or_not,
            l_immediate_or_not : result[i].l_immediate_or_not,
            l_subname : result[i].l_subname
        });
    }

    return location_list;
}

function searchLocationListMapper(result) {
    let location_list = [];
    const length = result.length;
    
    for (let i = 0; i < length; i++) {
        location_list.push({
            l_index : result[i].l_index,
            l_name : result[i].l_name,
            l_immediate_or_not : result[i].l_immediate_or_not
        });
    }

    return location_list;
}
