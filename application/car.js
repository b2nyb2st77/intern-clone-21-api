const express = require("express");

const car_repository = require("../db/car");
const affiliate_repository = require("../db/affiliate");
const calculate_price = require("./calculate_price");
const check_open_hour = require("./check_open_hour");

module.exports = {
    findOneCar: (index, res) => {
        car_repository.findOneCar(index, function(err, result){
            if (err) {
                res.status(404).send({code: "SQL ERROR", errorMessage: err});
            }
            else {
                res.send(result);
            }
        });
    },
    findReservedCar: (carName, location, startTime, endTime, res) => {
        car_repository.findReservedCar(carName, location, startTime, endTime, function(err, result){
                if (err) {
                    res.status(404).send({code: "SQL ERROR", errorMessage: err});
                }
                else {
                    res.send({number_of_affiliate: result[0][0].count, number_of_car: result[1][0].count});
                }
            }
        );
    },
    findCarList: (location, startTime, endTime, res) => {
        affiliate_repository.findAffiliatesByLocation(location, function(err, affiliates){
            if (err) {
                res.status(404).send({code: "SQL ERROR", errorMessage: err});
            }
            else {
                Promise.all(getCarListAndPriceListAndPeakSeasonListAndAvailableAffiliate(affiliates, startTime, endTime))
                .then((values) => {
                    if (values[0] != undefined && values[0] != null && values[1] != undefined && values[1] != null && values[2] != undefined && values[2] != null) {
                        try {
                            car_list = calculate_price.calculatePriceOfCars(startTime, endTime, values[0], values[1], values[2]);
                            res.send(car_list);
                        } catch (error) {
                            res.status(404).send({code: "CARCULATE PRICE ERROR", errorMessage: error});
                        }
                    }
                    else {
                        res.status(404).send({code: "SQL ERROR", errorMessage: "CAR LIST ERROR"});
                    }
                });
            }
        });
    },
};

function getCarListAndPriceListAndPeakSeasonListAndAvailableAffiliate(affiliates, startTime, endTime) {
    const carListAndPriceList = new Promise(function(resolve, reject) {
        car_repository.findCarsAndPrices(affiliates, startTime, endTime, function(err, result){
            if (err) {
                reject(err);  
            }
            else {
                resolve(result);
            }
        });
    });
    
    const peakSeasonList = new Promise(function(resolve, reject) {
        affiliate_repository.findPeakSeasonOfAffiliates(affiliates, startTime, endTime, function(err, result){
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
    
    const temporaryOpenHourList = new Promise(function(resolve, reject) {
        affiliate_repository.findTemporaryOpenHourOfAffiliates(affiliates, function(err, result){
            if (err) {
                reject(err);
            }
            else {
                const available_affiliates = check_open_hour.findAvailableAffiliate(startTime, endTime, affiliates, result);
                resolve(available_affiliates);
                
            }
        });
    });

    return [carListAndPriceList, peakSeasonList, temporaryOpenHourList];
}
