const express = require("express");
const time = require("./calculate_time");

module.exports = {
    checkIfTimeDiffIsLessThan24Hours: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();

        return (time.calculateTimeDiff(start, end) < 24) ? false : true;
    },
    checkIfDateDiffIsMoreThan14Days: (startTime, endTime) => {
        const start = startTime.substring(0,10).split('-');
        const end = endTime.substring(0,10).split('-');
        
        return (time.calculateDateDiff(start, end) > 14) ? false : true;
    },
    checkIfTimeIsLaterThanNow: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date();

        return (start < now || end < now) ? false : true;
    }
 };