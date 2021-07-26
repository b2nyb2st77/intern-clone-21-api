const express = require("express");

module.exports = {
    calculateTimeDiff: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const timeDiff = Math.floor((end - start) / 3600000);
        
        return timeDiff;
    },
    compareTime: (startTime, endTime) => {
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const now = new Date();

        return !(start < now || end < now) ? true : false;
    }
 };