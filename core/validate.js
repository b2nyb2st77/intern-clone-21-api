const express = require("express");
const time = require("./time");
const error_string = require("./error_string");

module.exports = {
    validateRequestInteger: (index) => {
        return !(isNaN(index) || index <= 0) ? true : false;
    },
    validateRequestDatetime: (startTime, endTime) => {
        const regexp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
        return regexp.test(startTime) && regexp.test(endTime);
    },
    checkTime: (startTime, endTime) => {
        if (startTime >= endTime) return OVER_TIME;
        else if (time.calculateTimeDiff(startTime, endTime) < 24) return TIME_DIFFERENCE;
        else if (!time.compareTime(startTime, endTime)) return PAST_TIME;
        else return OK;
    },
    isEmpty: (str) => {
        return (typeof str == "undefined" || str == null || str == "") ? true : false;
    },
    checkInjection: (obj) => { 
        if (obj.length > 0) {
            const expText = /[%=><]/;
            if (expText.test(obj)) return false; 

            const sqlRegExp = /(OR)+|(SELECT)+|(INSERT)+|(DELETE)+|(UPDATE)+|(CREATE)+|(DROP)+|(EXEC)+|(UNION)+|(FETCH)+|(DECLARE)+|(TRUNCATE)+/;
            if (sqlRegExp.test(obj)) return false;
        }

        return true;
    }
};