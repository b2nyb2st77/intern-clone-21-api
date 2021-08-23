const express = require("express");
const dayjs = require("dayjs");

module.exports = {
    findAvailableAffiliate: (startTime, endTime, affiliates, affiliate_temporary_open_hour_list) => {
        const start_date = dayjs(startTime);
        const start_time = dayjs(startTime).format("HH:mm:ss");
        const end_date = dayjs(endTime);
        const end_time = dayjs(endTime).format("HH:mm:ss");

        let available_affiliates = [];

        for (let i = 0; i < affiliates.length; i++) {
            let temporaray_open_hour_of_affiliate = find_temporaray_open_hour_of_affiliate(affiliates[i], affiliate_temporary_open_hour_list);

            const affiliate_open_time = affiliates[i].open_time;
            const affiliate_close_time = affiliates[i].close_time;
            
            if (!temporaray_open_hour_of_affiliate.length) {
                if (isTimeBetweenStartTimeAndEndTime(start_time, affiliate_open_time, affiliate_close_time) && isTimeBetweenStartTimeAndEndTime(end_time, affiliate_open_time, affiliate_close_time)) {
                    available_affiliates.push(affiliates[i].affiliate_index);
                }
                continue;
            }

            for (let k = 0; k < temporaray_open_hour_of_affiliate.length; k++) {
                let [isStartTimeOk, isEndTimeOk] = 
                checkIfAvailiableOnStartTimeAndEndTime(temporaray_open_hour_of_affiliate[k], start_date, start_time, end_date, end_time, affiliate_open_time, affiliate_close_time);

                if (isStartTimeOk && isEndTimeOk) {
                    available_affiliates.push(affiliates[i].affiliate_index);
                }
            }
        }

        return available_affiliates;
    },
 };

 function find_temporaray_open_hour_of_affiliate(affiliate, affiliate_temporary_open_hour_list) {
    let temporaray_open_hour_of_affiliate = [];
    const length = affiliate_temporary_open_hour_list.length;

    for (let k = 0; k < length; k++) {
        if(affiliate.affiliate_index === affiliate_temporary_open_hour_list[k].affiliate_index) {
            temporaray_open_hour_of_affiliate.push(affiliate_temporary_open_hour_list[k]);
        }
    }

    return temporaray_open_hour_of_affiliate;
 }

 function isTimeBetweenStartTimeAndEndTime(time, start, end) { 
    return (start <= time && time <= end);
 }

 function isDateBetweenStartDateAndEndDate(date, start, end) { 
    return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0);
 }
 

 function checkIfAvailiableOnStartTimeAndEndTime(temporaray_open_hour_of_affiliate, start_date, start_time, end_date, end_time, affiliate_open_time, affiliate_close_time) { 
    let isAvailiableOnStartTime = false;
    let isAvailiableOnEndTime = false;
    
    const temporary_start_date = dayjs(temporaray_open_hour_of_affiliate.start_date);
    const temporary_end_date = dayjs(temporaray_open_hour_of_affiliate.end_date);
    const temporary_open_time = temporaray_open_hour_of_affiliate.open_time;
    const temporary_close_time = temporaray_open_hour_of_affiliate.close_time;

    if (isDateBetweenStartDateAndEndDate(start_date, temporary_start_date, temporary_end_date) && isTimeBetweenStartTimeAndEndTime(start_time, temporary_open_time, temporary_close_time)) {
        isAvailiableOnStartTime = true;
    }
    else if (!isDateBetweenStartDateAndEndDate(start_date, temporary_start_date, temporary_end_date) && isTimeBetweenStartTimeAndEndTime(start_time, affiliate_open_time, affiliate_close_time)) {
        isAvailiableOnStartTime = true;
    }

    if (isDateBetweenStartDateAndEndDate(end_date, temporary_start_date, temporary_end_date) && isTimeBetweenStartTimeAndEndTime(end_time, temporary_open_time, temporary_close_time)) {
        isAvailiableOnEndTime = true;
    }
    else if (!isDateBetweenStartDateAndEndDate(end_date, temporary_start_date, temporary_end_date) && isTimeBetweenStartTimeAndEndTime(end_time, affiliate_open_time, affiliate_close_time)) {
        isAvailiableOnEndTime = true;
    }

    return [isAvailiableOnStartTime, isAvailiableOnEndTime];
 }
