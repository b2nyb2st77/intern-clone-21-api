const express = require("express");
const dayjs = require('dayjs');
const number = require("./number");

module.exports = {
    calculatePriceOfCars: (startTime, endTime, car_list, price_list, peak_season_list) => {
        const start_date = dayjs(startTime);
        const end_date = dayjs(endTime);
        const day  = end_date.diff(start_date, 'day');
        let hour = end_date.diff(start_date, 'hour') % number.TOTAL_HOURS_OF_1DAY;

        if (start_date.minute() != end_date.minute()) hour++;

        for (let i = 0; i < car_list.length; i++) {
            let total = 0;

            let price_list_of_car = find_price_list_of_car(car_list, price_list, i);
            let [weekend_price, weekdays_price, peak_season_price] = classify_price_list_by_price_type(price_list_of_car);
            let peak_season_of_affiliate = find_peak_seasons_of_affiliate(car_list, peak_season_list, i);

            let [number_of_peak_season_days, number_of_weekdays, number_of_weekend, type_of_last_day] = 
            calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(start_date, end_date, peak_season_of_affiliate);

            total += calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price);

            if (hour > 0) {
                switch (type_of_last_day) {
                    case 'weekend':
                        total += calculate_hour_price(hour, weekend_price[0]);
                        break;
                    case 'weekdays':
                        total += calculate_hour_price(hour, weekdays_price[0]);
                        break;
                    case 'peakseason':
                        total += calculate_hour_price(hour, peak_season_price[0]);
                        break;
                    default:
                        break;
                }
            }

            car_list[i].car_price = total;
        }

        return car_list;
    },
 };

 function find_price_list_of_car(car_list, price_list, i) {
    let price_list_of_car = [];

    for (let k = 0; k < price_list.length; k++) {
        if(car_list[i].rs_index == price_list[k].p_rs_index) {
            price_list_of_car.push(price_list[k]);
        }
    }

    return price_list_of_car;
 }

 function classify_price_list_by_price_type(price_list_of_car) {
    let weekend_price = [];
    let weekdays_price = [];
    let peak_season_price = [];

    for (let k = 0; k < price_list_of_car.length; k++) {
        if (price_list_of_car[k].p_type == 'weekend') {
            weekend_price.push(price_list_of_car[k]);
        }
        if (price_list_of_car[k].p_type == 'weekdays') {
            weekdays_price.push(price_list_of_car[k]);
        }
        if (price_list_of_car[k].p_type == 'peakseason') {
            peak_season_price.push(price_list_of_car[k]);
        }
    }

    return [weekend_price, weekdays_price, peak_season_price];
 }

 function find_peak_seasons_of_affiliate(car_list, peak_season_list, i) {
    let peak_season_of_affiliate = [];

    for (let k = 0; k < peak_season_list.length; k++) {
        if(car_list[i].a_index == peak_season_list[k].ps_a_index) {
            peak_season_of_affiliate.push(peak_season_list[k]);
        }
    }

    return peak_season_of_affiliate;
 }

 function calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(start_date, end_date, peak_season_of_affiliate) {
    let number_of_peak_season_days = 0;
    let number_of_weekdays = 0;
    let number_of_weekend = 0;
    let type_of_last_day = '';

    for (let k = start_date; k <= end_date; k = k.add(1, 'day')) {
        
        let isDayPeakSeason = false;

        if (peak_season_of_affiliate != null && peak_season_of_affiliate != undefined) {

            for (let j = 0; j < peak_season_of_affiliate.length; j++) {
                
                const ps_start_date = dayjs(peak_season_of_affiliate[j].ps_start_date);
                const ps_end_date = dayjs(peak_season_of_affiliate[j].ps_end_date);
                
                if (isDateBetweenStartDateAndEndDate(k, ps_start_date, ps_end_date)) {
                    isDayPeakSeason = true;

                    if (isDateSame(k, end_date)) type_of_last_day = 'peakseason';
                    else number_of_peak_season_days++;
                }
            }

            if (isDayPeakSeason) continue;
        }
        
        const day = k.day();
        const weekdays = [1, 2, 3, 4, 5];

        if (isDateSame(k, end_date)) {
            type_of_last_day = (!~weekdays.indexOf(day)) ? 'weekend' : 'weekdays';
        }
        else {
            (!~weekdays.indexOf(day)) ? number_of_weekend++ : number_of_weekdays++;
        }
    }

    return [number_of_peak_season_days, number_of_weekdays, number_of_weekend, type_of_last_day];
 }

 function isDateSame(date1, date2) {
    return (date1.year() == date2.year() && date1.month() == date2.month() && date1.date() == date2.date());
 }

 function isDateBetweenStartDateAndEndDate(date, start, end) { 
    return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0);
 }
 
 function calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price) {
    let total = 0;

    if (day >= 7) {
        total += number_of_weekend * weekend_price[0].p_7_days;
        total += number_of_weekdays * weekdays_price[0].p_7_days;
        total += number_of_peak_season_days * peak_season_price[0].p_7_days;
    }
    else if (day == 5 || day == 6) {
        total += number_of_weekend * weekend_price[0].p_5_or_6_days;
        total += number_of_weekdays * weekdays_price[0].p_5_or_6_days;
        total += number_of_peak_season_days * peak_season_price[0].p_5_or_6_days;
    }
    else if (day == 3 || day == 4) {
        total += number_of_weekend * weekend_price[0].p_3_or_4_days;
        total += number_of_weekdays * weekdays_price[0].p_3_or_4_days;
        total += number_of_peak_season_days * peak_season_price[0].p_3_or_4_days;
    }
    else if (day == 1 || day == 2) {
        total += number_of_weekend * weekend_price[0].p_1_or_2_days;
        total += number_of_weekdays * weekdays_price[0].p_1_or_2_days;
        total += number_of_peak_season_days * peak_season_price[0].p_1_or_2_days;
    }

    return total;
 }

 function calculate_hour_price(hour, hour_price) {
    let total = 0;

    if (hour_price.p_12_hours != 0 && hour >= 12) {
        hour = hour % 12;
        total += hour_price.p_12_hours;

        if (hour_price.p_6_hours != 0 && hour >= 6) {
            hour = hour % 6;
            total += hour_price.p_6_hours;

            if (hour > 0) {
                total += hour * hour_price.p_1_hour;
            }
        }
    }
    else if (hour_price.p_6_hours != 0 && hour >= 6) {
        hour = hour % 6;
        total += Math.floor(hour / 6) * hour_price.p_6_hours;

        if (hour > 0) {
            total += hour * hour_price.p_1_hour;
        }
    }
    else {
        total += hour * hour_price.p_1_hour;
    }

    return total;
 }