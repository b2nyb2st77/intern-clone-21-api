const express = require("express");
const dayjs = require('dayjs');

const TOTAL_HOURS_OF_1DAY = 24;

module.exports = {
    calculatePriceOfCars: (startTime, endTime, car_list_and_price_list, peak_season_list) => {
        const start_date = dayjs(startTime);
        const end_date = dayjs(endTime);
        const day  = end_date.diff(start_date, 'day');
        let hour = end_date.diff(start_date, 'hour') % TOTAL_HOURS_OF_1DAY;

        if (start_date.minute() != end_date.minute()) {
            hour++;
        }

        let [car_list, price_list] = seperate_car_list_and_price_list(car_list_and_price_list);

        const length = car_list.length;

        for (let i = 0; i < length; i++) {
            let total_price_of_car = 0;

            let price_list_of_car = find_price_list_of_car(car_list[i], price_list);
            let [weekend_price, weekdays_price, peak_season_price] = classify_price_list_by_price_type(price_list_of_car);
            let peak_season_of_affiliate = find_peak_seasons_of_affiliate(car_list[i], peak_season_list);

            let [number_of_peak_season_days, number_of_weekdays, number_of_weekend, type_of_last_day] = 
            calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(start_date, end_date, peak_season_of_affiliate);

            total_price_of_car += calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price);

            if (hour > 0) {
                switch (type_of_last_day) {
                    case 'weekend':
                        total_price_of_car += calculate_hour_price(hour, weekend_price[0]);
                        break;
                    case 'weekdays':
                        total_price_of_car += calculate_hour_price(hour, weekdays_price[0]);
                        break;
                    case 'peakseason':
                        total_price_of_car += calculate_hour_price(hour, peak_season_price[0]);
                        break;
                    default:
                        break;
                }
            }

            car_list[i].car_price = total_price_of_car;
        }

        return car_list;
    },
 };

 function seperate_car_list_and_price_list(car_list_and_price_list) {
    let car_list = [];
    let price_list = [];
    const length = car_list_and_price_list.length;
    
    for (let i = 0; i < length; i++) {
        let price = new Object();
        price.p_rs_index = car_list_and_price_list[i].p_rs_index;
        price.p_1_or_2_days = car_list_and_price_list[i].p_1_or_2_days;
        price.p_3_or_4_days = car_list_and_price_list[i].p_3_or_4_days;
        price.p_5_or_6_days = car_list_and_price_list[i].p_5_or_6_days;
        price.p_7_days = car_list_and_price_list[i].p_7_days;
        price.p_1_hour = car_list_and_price_list[i].p_1_hour;
        price.p_6_hours = car_list_and_price_list[i].p_6_hours;
        price.p_12_hours = car_list_and_price_list[i].p_12_hours;
        price.p_type = car_list_and_price_list[i].p_type;

        price_list.push(price);

        let isSameCarInList = findIfSameCarIsInList(car_list, car_list_and_price_list[i]);

        if (isSameCarInList) {
            continue;
        }

        let data = new Object();
        data.c_index = car_list_and_price_list[i].c_index;
        data.c_type = car_list_and_price_list[i].c_type;
        data.c_name = car_list_and_price_list[i].c_name;
        data.c_max_number_of_people = car_list_and_price_list[i].c_max_number_of_people;
        data.c_gear = car_list_and_price_list[i].c_gear;
        data.c_number_of_load = car_list_and_price_list[i].c_number_of_load;
        data.c_number_of_door = car_list_and_price_list[i].c_number_of_door;
        data.c_air_conditioner_or_not = car_list_and_price_list[i].c_air_conditioner_or_not;
        data.c_production_year = car_list_and_price_list[i].c_production_year;
        data.c_fuel = car_list_and_price_list[i].c_fuel;
        data.c_description = car_list_and_price_list[i].c_description;
        data.c_driver_age = car_list_and_price_list[i].c_driver_age;
        data.a_index = car_list_and_price_list[i].a_index;
        data.a_name = car_list_and_price_list[i].a_name;
        data.a_info = car_list_and_price_list[i].a_info;
        data.a_number_of_reservation = car_list_and_price_list[i].a_number_of_reservation;
        data.a_grade = car_list_and_price_list[i].a_grade;
        data.a_new_or_not = car_list_and_price_list[i].a_new_or_not;
        data.rs_index = car_list_and_price_list[i].rs_index;

        car_list.push(data);
    }

    return [car_list, price_list];
 }

 function findIfSameCarIsInList(car_list, car_list_and_price_list_item) {
    let isSameCarInList = false;
    const length = car_list.length;

    for (let k = 0; k < length; k++) {
        if (car_list[k].rs_index === car_list_and_price_list_item.rs_index) {
            isSameCarInList = true;
            break;
        }
    }

    return isSameCarInList;
 }

 function find_price_list_of_car(car, price_list) {
    let price_list_of_car = [];
    const length = price_list.length;

    for (let k = 0; k < length; k++) {
        if(car.rs_index === price_list[k].p_rs_index) {
            price_list_of_car.push(price_list[k]);
        }
    }

    return price_list_of_car;
 }

 function classify_price_list_by_price_type(price_list_of_car) {
    let weekend_price = [];
    let weekdays_price = [];
    let peak_season_price = [];
    const length = price_list_of_car.length;

    for (let k = 0; k < length; k++) {
        switch (price_list_of_car[k].p_type) {
            case 'weekend':
                weekend_price.push(price_list_of_car[k]);
                break;
            case 'weekdays':
                weekdays_price.push(price_list_of_car[k]);
                break;
            case 'peakseason':
                peak_season_price.push(price_list_of_car[k]);
                break;
            default:
                break;
        }
    }

    return [weekend_price, weekdays_price, peak_season_price];
 }

 function find_peak_seasons_of_affiliate(car, peak_season_list) {
    let peak_season_of_affiliate = [];
    const length = peak_season_list.length;

    for (let k = 0; k < length; k++) {
        if(car.a_index === peak_season_list[k].ps_a_index) {
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
    
    const weekdays = [1, 2, 3, 4, 5];
    const length = peak_season_of_affiliate.length;

    for (let k = start_date; k <= end_date; k = k.add(1, 'day')) {
        
        let isDayPeakSeason = false;

        if (peak_season_of_affiliate != null && peak_season_of_affiliate != undefined) {

            for (let j = 0; j < length; j++) {
                
                const ps_start_date = dayjs(peak_season_of_affiliate[j].ps_start_date);
                const ps_end_date = dayjs(peak_season_of_affiliate[j].ps_end_date);
                
                if (isDateBetweenStartDateAndEndDate(k, ps_start_date, ps_end_date)) {
                    isDayPeakSeason = true;

                    if (isDateSame(k, end_date)) type_of_last_day = 'peakseason';
                    else number_of_peak_season_days++;
                }
            }

            if (isDayPeakSeason) {
                continue;
            }
        }
        
        const day = k.day();

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
    return (date1.year() === date2.year() && date1.month() === date2.month() && date1.date() === date2.date());
 }

 function isDateBetweenStartDateAndEndDate(date, start, end) { 
    return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0);
 }
 
 function calculate_day_price(day, number_of_weekend, number_of_weekdays, number_of_peak_season_days, weekend_price, weekdays_price, peak_season_price) {
    let total_price_of_car = 0;

    if (day >= 7) {
        total_price_of_car += number_of_weekend * weekend_price[0].p_7_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].p_7_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].p_7_days;
    }
    else if (day === 5 || day === 6) {
        total_price_of_car += number_of_weekend * weekend_price[0].p_5_or_6_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].p_5_or_6_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].p_5_or_6_days;
    }
    else if (day === 3 || day === 4) {
        total_price_of_car += number_of_weekend * weekend_price[0].p_3_or_4_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].p_3_or_4_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].p_3_or_4_days;
    }
    else if (day === 1 || day === 2) {
        total_price_of_car += number_of_weekend * weekend_price[0].p_1_or_2_days;
        total_price_of_car += number_of_weekdays * weekdays_price[0].p_1_or_2_days;
        total_price_of_car += number_of_peak_season_days * peak_season_price[0].p_1_or_2_days;
    }

    return total_price_of_car;
 }

 function calculate_hour_price(hour, hour_price) {
    let total_price_of_car = 0;

    if (hour_price.p_12_hours != 0 && hour >= 12) {
        hour = hour % 12;
        total_price_of_car += hour_price.p_12_hours;

        if (hour_price.p_6_hours != 0 && hour >= 6) {
            hour = hour % 6;
            total_price_of_car += hour_price.p_6_hours;

            if (hour > 0) {
                total_price_of_car += hour * hour_price.p_1_hour;
            }
        }
    }
    else if (hour_price.p_6_hours != 0 && hour >= 6) {
        hour = hour % 6;
        total_price_of_car += Math.floor(hour / 6) * hour_price.p_6_hours;

        if (hour > 0) {
            total_price_of_car += hour * hour_price.p_1_hour;
        }
    }
    else {
        total_price_of_car += hour * hour_price.p_1_hour;
    }

    return total_price_of_car;
 }
