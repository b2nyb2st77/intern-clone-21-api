const express = require("express");
const dayjs = require("dayjs");

module.exports = {
    findAvailableAffiliate: (startTime, endTime, affiliates, affiliate_temporary_open_hour_list) => {
        const start_date = dayjs(startTime).format("YYYY-MM-DD");
        const start_time = dayjs(startTime).format("HH:mm:ss");
        const end_date = dayjs(endTime).format("YYYY-MM-DD");
        const end_time = dayjs(endTime).format("HH:mm:ss");

        let available_affiliates = [];

        for (let i = 0; i < affiliates.length; i++) {
            let temporaray_open_hour_of_affiliate = find_temporaray_open_hour_of_affiliate(affiliates[i], affiliate_temporary_open_hour_list);

            const affiliate_open_time = affiliates[i].a_open_time;
            const affiliate_close_time = affiliates[i].a_close_time;
            
            if (temporaray_open_hour_of_affiliate.length === 0) {
                if (isDateOrTimeBetweenStartDateAndEndDate(start_time, affiliate_open_time, affiliate_close_time) && isDateOrTimeBetweenStartDateAndEndDate(end_time, affiliate_open_time, affiliate_close_time)) {
                    available_affiliates.push(affiliates[i].a_index);
                }
                continue;
            }

            for (let k = 0; k < temporaray_open_hour_of_affiliate.length; k++) {
                let [isStartTimeOk, isEndTimeOk] = 
                checkIfAvailiableOnStartTimeAndEndTime(temporaray_open_hour_of_affiliate[k], start_date, start_time, end_date, end_time, affiliate_open_time, affiliate_close_time);

                if (isStartTimeOk && isEndTimeOk) {
                    available_affiliates.push(affiliates[i].a_index);
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
        if(affiliate.a_index === affiliate_temporary_open_hour_list[k].atoh_a_index) {
            temporaray_open_hour_of_affiliate.push(affiliate_temporary_open_hour_list[k]);
        }
    }

    return temporaray_open_hour_of_affiliate;
 }

 function isDateOrTimeBetweenStartDateAndEndDate(date_or_time, start, end) { 
    return (start <= date_or_time && date_or_time <= end);
 }

 function checkIfAvailiableOnStartTimeAndEndTime(temporaray_open_hour_of_affiliate, start_date, start_time, end_date, end_time, affiliate_open_time, affiliate_close_time) { 
    let isStartTimeOk = false;
    let isEndTimeOk = false;
    
    const temporary_start_date = dayjs(temporaray_open_hour_of_affiliate.atoh_start_date).format("YYYY-MM-DD");
    const temporary_end_date = dayjs(temporaray_open_hour_of_affiliate.atoh_end_date).format("YYYY-MM-DD");
    const temporary_open_time = dayjs(temporaray_open_hour_of_affiliate.atoh_open_time).format("HH:mm:ss");
    const temporary_close_time = dayjs(temporaray_open_hour_of_affiliate.atoh_close_time).format("HH:mm:ss");

    if (isDateOrTimeBetweenStartDateAndEndDate(start_date, temporary_start_date, temporary_end_date)) {
        if (isDateOrTimeBetweenStartDateAndEndDate(start_time, temporary_open_time, temporary_close_time)) {
            isStartTimeOk = true;
        }
    }
    else {
        if (isDateOrTimeBetweenStartDateAndEndDate(start_time, affiliate_open_time, affiliate_close_time)) {
            isStartTimeOk = true;
        }
    }

    if (isDateOrTimeBetweenStartDateAndEndDate(end_date, temporary_start_date, temporary_end_date)) {
        if (isDateOrTimeBetweenStartDateAndEndDate(end_time, temporary_open_time, temporary_close_time)) {
            isEndTimeOk = true;
        }
    }
    else {
        if (isDateOrTimeBetweenStartDateAndEndDate(end_time, affiliate_open_time, affiliate_close_time)) {
            isEndTimeOk = true;
        }
    }

    return [isStartTimeOk, isEndTimeOk];
 }
