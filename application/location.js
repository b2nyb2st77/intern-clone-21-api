const express = require("express");

const location_repository = require("../db/location");

module.exports = {
    findLocations: (res) => {
        location_repository.findLocations(function(err, result){
            if (err) {
                res.status(404).send({code: "SQL ERROR", errorMessage: err});
            }
            else {
                res.send(result);
            }
        });
    },
    searchLocation: (searchWord, res) => {
        location_repository.searchLocation(searchWord, function(err, result){
            if (err) {
                res.status(404).send({code: "SQL ERROR", errorMessage: err});
            }
            else {
                res.send(result);
            }
        });
    }
};
