const express = require("express");
const dayjs = require('dayjs');
const number = require("./number_string");

module.exports = {
    checkIfTimeDiffIsLessThanMinimumHoursOfRent: (startTime, endTime) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);

        return (end.diff(start, 'hour') < number.MINIMUM_HOURS_OF_RENT) ? false : true;
    },
    checkIfDateDiffIsMoreThanMaximumDaysOfRent: (startTime, endTime) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        
        return (end.diff(start, 'day') > number.MAXIMUM_DAYS_OF_RENT) ? false : true;
    },
    checkIfTimeIsLaterThanNow: (startTime, endTime) => {
        const start = dayjs(startTime);
        const end = dayjs(endTime);
        const now = dayjs();

        return (start < now || end < now) ? false : true;
    }
 };