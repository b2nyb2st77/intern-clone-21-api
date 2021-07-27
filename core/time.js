const express = require("express");

module.exports = {
    calculateTimeDiff: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const timeDiff = Math.floor((end - start) / 3600000);
        
        return timeDiff;
    },
    calculateDateDiff: (startTime, endTime) => {
        const start = startTime.substring(0,10).split('-');
        const start_date = new Date(start[0], start[1], start[2]).getTime();
        
        const end = endTime.substring(0,10).split('-');
        const end_date = new Date(end[0], end[1], end[2]).getTime();
        
        const dateDiff = Math.floor((end_date - start_date) / (3600000 * 24));
        
        return dateDiff;
    },
    compareTime: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date();

        return !(start < now || end < now) ? true : false;
    }
 };