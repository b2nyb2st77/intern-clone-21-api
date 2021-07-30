const express = require("express");
const time = require("./calculate_time");

module.exports = {
    calculatePriceOfCars: (startTime, endTime, price_list) => {
        const start = time.calculateMillisecondsOfTime(startTime);
        const end = time.calculateMillisecondsOfTime(endTime);
        const [day, hour] =  time.calculateDayAndHourForPrice(start, end);

        let total_list = new Array();

        for (let i = 0; i < price_list.length; i++) {
            let total = 0;
    
            if (day >= 7) total += day * price_list[i].p_7_days
            else if (day == 5 || day == 6) total += day * price_list[i].p_5_or_6_days
            else if (day == 3 || day == 4) total += day * price_list[i].p_3_or_4_days
            else if (day == 1 || day == 2) total += day * price_list[i].p_1_or_2_days
    
            if (hour > 0) {
                if (price_list[i].p_12_hours != 0 && hour >= 12) {
                    hour = hour % 12;
                    total += price_list[i].p_12_hours;
    
                    if (price_list[i].p_6_hours != 0 && hour >= 6) {
                        hour = hour % 6;
                        total += price_list[i].p_6_hours;
    
                        if (hour > 0) {
                            total += hour * price_list[i].p_1_hour;
                        }
                    }
                }
                else if (price_list[i].p_6_hours != 0 && hour >= 6) {
                    hour = hour % 6;
                    total += Math.floor(hour / 6) * price_list[i].p_6_hours;
    
                    if (hour > 0) {
                        total += hour * price_list[i].p_1_hour;
                    }
                }
                else {
                    total += hour * price_list[i].p_1_hour;
                }
            }

            const data = new Object();           
            data.price = total; 
            total_list.push(data);
        }

        return total_list;
    },
 };