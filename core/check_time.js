const express = require("express");
const time = require("./calculate_time");
const number = require("./number_string");

module.exports = {
    checkIfTimeDiffIsLessThanMinimumHoursOfRent: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        return (time.calculateTimeDiff(start, end) < number.MINIMUM_HOURS_OF_RENT) ? false : true;
    },
    checkIfDateDiffIsMoreThanMaximumDaysOfRent: (startTime, endTime) => {
        const start = startTime.substring(0,10).split('-');
        const end = endTime.substring(0,10).split('-');
        
        return (time.calculateDateDiff(start, end) > number.MAXIMUM_DAYS_OF_RENT) ? false : true;
    },
    checkIfTimeIsLaterThanNow: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date();

        return (start < now || end < now) ? false : true;
    }
 };