const express = require("express");
const number = require("./number_string");

module.exports = {
    calculateTimeDiff: (start, end) => {
        return Math.floor((end - start) / (number.TOTAL_MINS_OF_1HOUR * number.TOTAL_SECONDS_OF_1MIN * number.THOUSAND));
    },
    calculateTimeDiffForPrice: (start, end) => {
        const timeDiff = Math.ceil((end - start) / (number.TOTAL_MINS_OF_1HOUR * number.TOTAL_SECONDS_OF_1MIN * number.THOUSAND));

        const day = Math.floor(timeDiff / number.TOTAL_HOURS_OF_1DAY);
        const hour = timeDiff % number.TOTAL_HOURS_OF_1DAY;

        return [day, hour];
    },
    calculateDayAndDateOfToday: () => {
        const today = new Date();   

        const t_year = today.getFullYear();
        const t_month = ('0' + (today.getMonth() + 1)).slice(-2);
        const t_day = ('0' + today.getDate()).slice(-2);

        const today_date = `${t_year}-${t_month}-${t_day}`;

        const today_day = today.getDay();

        return [today_date, today_day];
    },
    calculateDateDiff: (start, end) => {
        const start_date = new Date(start[0], start[1], start[2]).getTime();
        const end_date = new Date(end[0], end[1], end[2]).getTime();
        
        return Math.floor((end_date - start_date) / (number.TOTAL_HOURS_OF_1DAY * number.TOTAL_MINS_OF_1HOUR * number.TOTAL_SECONDS_OF_1MIN * number.THOUSAND));
    }
 };