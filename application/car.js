const express = require("express");
const car_repository = require("../db/car");
const calculate = require("./calculate_price");

module.exports = {
    findCarList: (location, startTime, endTime, res) => {
        Promise.all(getCarListAndPriceListAndPeakSeasonList(location, startTime, endTime))
        .then((values) => {
            if (values[0] != undefined && values[0] != null && values[1] != undefined && values[1] != null) {
                car_list = calculate.calculatePriceOfCars(startTime, endTime, values[0], values[1]);
                res.send(car_list);
            }
            else {
                res.status(404).send({code: "SQL ERROR", errorMessage: "CAR LIST ERROR"});
            }
        });
    },
    findOneCar: (index, res) => {
        car_repository.findOneCar(index, function(err, result){
            if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
            else res.send(result);
        });
    },
    findReservedCar: (carName, location, startTime, endTime, res) => {
        car_repository.findReservedCar(carName, location, startTime, endTime, function(err, result){
                if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
                else res.send({number_of_affiliate: result[0][0].count, number_of_car: result[1][0].count});
            }
        );
    }
};

function getCarListAndPriceListAndPeakSeasonList(location, startTime, endTime) {
    const carListAndPriceList = new Promise(function(resolve, reject) {
        car_repository.findCarsAndPrices(location, startTime, endTime, function(err, result){
            if (err) reject(err);
            else resolve(result);
        });
    });

    const peakSeasonList = new Promise(function(resolve, reject) {
        car_repository.findPeakSeasons(location, startTime, endTime, function(err, result){
            if (err) reject(err);
            else resolve(result);
        });
    });

    return [carListAndPriceList, peakSeasonList];
}
