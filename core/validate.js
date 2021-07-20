const express = require("express");

module.exports = {
    validateRequestInteger: (index) => {
        if(isNaN(index)) return false;
        else if(index <= 0) return false;
        else return true;
    },
    validateRequestDatetime: (startTime, endTime) => {
        const regexp = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;

        return regexp.test(startTime) && regexp.test(endTime);
    },
    isEmpty: (str) => {
        if (typeof str == "undefined" || str == null || str == "") return true;
        else return false;
    },
    checkInjection: (obj) => { 
        if (obj.length > 0) {
            const expText = /[%=><]/;

            if (expText.test(obj) == true) { 
                obj.value = obj.value.split(expText).join(""); 
                return false; 
            }

            const sqlRegExp = /(OR)+|(SELECT)+|(INSERT)+|(DELETE)+|(UPDATE)+|(CREATE)+|(DROP)+|(EXEC)+|(UNION)+|(FETCH)+|(DECLARE)+|(TRUNCATE)+/;

            if (sqlRegExp.test(obj)) { 
                return false; 
            }

        } 
        
        return true;
    }
};