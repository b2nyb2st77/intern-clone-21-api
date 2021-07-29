const express = require("express");
const time = require("./calculate_time");
const number = require("./number_string");

module.exports = {
    checkIfTimeDiffIsLessThanMinimumHoursOfRent: (startTime, endTime) => {
        const start = time.calculateMillisecondsOfTime(startTime);
        const end = time.calculateMillisecondsOfTime(endTime);

        return (time.calculateTimeDiff(start, end) < number.MINIMUM_HOURS_OF_RENT) ? false : true;
    },
    checkIfDateDiffIsMoreThanMaximumDaysOfRent: (startTime, endTime) => {
        const start_splited = time.splitDateByHypen(startTime);
        const end_splited = time.splitDateByHypen(endTime);
        
        return (time.calculateDateDiff(start_splited, end_splited) > number.MAXIMUM_DAYS_OF_RENT) ? false : true;
    },
    checkIfTimeIsLaterThanNow: (startTime, endTime) => {
        const start = time.calculateMillisecondsOfTime(startTime);
        const end = time.calculateMillisecondsOfTime(endTime);
        const now = new Date();

        return (start < now || end < now) ? false : true;
    }
 };