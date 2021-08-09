const express = require("express");
const affiliate_repository = require("../db/affiliate");

module.exports = {
    findOneAffiliate: (index, res) => {
        affiliate_repository.findOneAffiliate(index, function(err, result){
            if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
            else res.send(result);
        });
    }
};
