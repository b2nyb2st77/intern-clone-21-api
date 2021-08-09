const express = require("express");
const dl_repository = require("../db/delivery_location");

module.exports = {
    findDeliveryLocation: (affiliateName, res) => {
        dl_repository.findDeliveryLocation(affiliateName, function(err, result){
            if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
            else res.send(result);
        });
    }
};
