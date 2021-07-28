const express = require("express");

module.exports = {
    calculateTimeDiff: (start, end) => {
        return Math.floor((end - start) / 3600000);
    },
    calculateDateDiff: (start, end) => {
        const start_date = new Date(start[0], start[1], start[2]).getTime();
        const end_date = new Date(end[0], end[1], end[2]).getTime();
        
        return Math.floor((end_date - start_date) / (3600000 * 24));
    }
 };