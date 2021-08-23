const express = require("express");
const dayjs = require("dayjs");

const TOTAL_HOURS_OF_1DAY = 24;

module.exports = {
    calculatePriceOfCars: (startTime, endTime, car_list_and_price_list, peak_season_list, available_affiliates) => {
        const start_date = dayjs(startTime);
        const end_date = dayjs(endTime);
        const day  = end_date.diff(start_date, 'day');
        let hour = end_date.diff(start_date, 'hour') % TOTAL_HOURS_OF_1DAY;

        if (start_date.minute() != end_date.minute()) {
            hour++;
        }

        let car_list = find_available_car_list(car_list_and_price_list, available_affiliates);

        const length = car_list.length;

        for (let i = 0; i < length; i++) {
            let total_price_of_car = 0;

            let price_list_of_car = car_list[i].price_list;
            let [weekend_price, weekdays_price, peak_season_price] = classify_price_list_by_price_type(price_list_of_car);
            let peak_season_of_affiliate = peak_season_list.filter(peak_season => peak_season.affiliate_index === car_list[i].a_index);
            let weekend_of_affiliate = car_list[i].a_weekend;

            let [number_of_peak_season_days, number_of_weekdays, number_of_weekend, type_of_last_day] = 
            calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(start_date, end_date, peak_season_of_affiliate, weekend_of_affiliate);

            let total_day_price_of_car = calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price);

            if (!~total_day_price_of_car) {
                return new Error("NEGATIVE DAY ERROR");
            }

            total_price_of_car += total_day_price_of_car;

            if (hour === 0) {
                car_list[i].car_price = total_price_of_car;
                continue;
            }

            switch (type_of_last_day) {
                case "weekend":
                    total_price_of_car += calculate_hour_price(hour, weekend_price[0]);
                    break;
                case "weekdays":
                    total_price_of_car += calculate_hour_price(hour, weekdays_price[0]);
                    break;
                case "peakseason":
                    total_price_of_car += calculate_hour_price(hour, peak_season_price[0]);
                    break;
                default:
                    return new Error("TYPE OF LAST DAY ERROR");
            }
            
            car_list[i].car_price = total_price_of_car;
        }

        return car_list.map(({price_list, ...rest}) => rest);
    },
 };

 function find_available_car_list(car_list_and_price_list, available_affiliates) {
    let car_list = [];
    const length = car_list_and_price_list.length;
    
    for (let k = 0; k < length; k++) {
        const findAvailableAffiliate = available_affiliates.find(element => element === car_list_and_price_list[k].a_index);
        if (findAvailableAffiliate) {
            car_list.push({...car_list_and_price_list[k]});
        }
    }

    return car_list;
 }

 function classify_price_list_by_price_type(price_list_of_car) {
    let weekend_price = [];
    let weekdays_price = [];
    let peak_season_price = [];
    const length = price_list_of_car.length;

    for (let k = 0; k < length; k++) {
        switch (price_list_of_car[k].price_type) {
            case "weekend":
                weekend_price.push(price_list_of_car[k]);
                break;
            case "weekdays":
                weekdays_price.push(price_list_of_car[k]);
                break;
            case "peakseason":
                peak_season_price.push(price_list_of_car[k]);
                break;
            default:
                return new Error("PRICE TYPE ERROR");
        }
    }

    return [weekend_price, weekdays_price, peak_season_price];
 }

 function calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(start_date, end_date, peak_season_of_affiliate, weekend_of_affiliate) {
    let number_of_peak_season_days = 0;
    let number_of_weekdays = 0;
    let number_of_weekend = 0;
    let type_of_last_day = "";
    
    const weekends = weekend_of_affiliate.split(", ");
    const length = peak_season_of_affiliate.length;

    for (let date = start_date; date <= end_date; date = date.add(1, 'day')) {
        
        let isDayPeakSeason = false;

        if (peak_season_of_affiliate && length) {

            for (let k = 0; k < length; k++) {
                
                const ps_start_date = dayjs(peak_season_of_affiliate[k].start_date);
                const ps_end_date = dayjs(peak_season_of_affiliate[k].end_date);
                
                if (isDateBetweenStartDateAndEndDate(date, ps_start_date, ps_end_date)) {
                    isDayPeakSeason = true;

                    if (isDateSame(date, end_date)) {
                        type_of_last_day = "peakseason";
                    }
                    else {
                        number_of_peak_season_days++;
                    }
                }
            }
    
            if (isDayPeakSeason) {
                continue;
            }
        }

        const day = date.day().toString();

        if (isDateSame(date, end_date)) {
            type_of_last_day = (!~weekends.indexOf(day)) ? "weekdays" : "weekend";
        }
        else {
            (!~weekends.indexOf(day)) ? number_of_weekdays++ : number_of_weekend++;
        }
    }

    return [number_of_peak_season_days, number_of_weekdays, number_of_weekend, type_of_last_day];
 }

 function isDateSame(date1, date2) {
    return (date1.diff(date2, 'day') === 0);
 }

 function isDateBetweenStartDateAndEndDate(date, start, end) { 
    return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0);
 }
 
 function calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price) {
    let total_price_of_car = 0;

    if (day >= 7) {
        total_price_of_car += number_of_weekend * weekend_price[0].price_of_7_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].price_of_7_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].price_of_7_days;
    }
    else if (day === 5 || day === 6) {
        total_price_of_car += number_of_weekend * weekend_price[0].price_of_5_or_6_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].price_of_5_or_6_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].price_of_5_or_6_days;
    }
    else if (day === 3 || day === 4) {
        total_price_of_car += number_of_weekend * weekend_price[0].price_of_3_or_4_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].price_of_3_or_4_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].price_of_3_or_4_days;
    }
    else if (day === 1 || day === 2) {
        total_price_of_car += number_of_weekend * weekend_price[0].price_of_1_or_2_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].price_of_1_or_2_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].price_of_1_or_2_days;
    }
    else {
        return -1;
    }

    return total_price_of_car;
 }

 function calculate_hour_price(hour, hour_price) {
    let total_price_of_car = 0;

    if (hour_price.price_of_12_hours != 0 && hour >= 12) {
        hour = hour % 12;
        total_price_of_car += hour_price.price_of_12_hours;

        if (hour_price.price_of_6_hours != 0 && hour >= 6) {
            hour = hour % 6;
            total_price_of_car += hour_price.price_of_6_hours;

            if (hour > 0) {
                total_price_of_car += hour * hour_price.price_of_1_hour;
            }
        }
    }
    else if (hour_price.price_of_6_hours != 0 && hour >= 6) {
        hour = hour % 6;
        total_price_of_car += Math.floor(hour / 6) * hour_price.price_of_6_hours;

        if (hour > 0) {
            total_price_of_car += hour * hour_price.price_of_1_hour;
        }
    }
    else {
        total_price_of_car += hour * hour_price.price_of_1_hour;
    }

    return total_price_of_car;
 }
