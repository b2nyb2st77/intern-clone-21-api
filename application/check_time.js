const express = require("express");
const dayjs = require("dayjs");

const number = require("../core/constant");
const error = require("../core/error");
const response_handler = require("../core/responseHandler");

module.exports = {
    checkTimeError: (startTime, endTime, res) => {
        switch (checkTime(startTime, endTime)) {
            case error.OVER_TIME_ERROR:
                response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.OVER_TIME_ERROR_MESSAGE);
                return false;
            case error.PAST_TIME_ERROR:
                response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.PAST_TIME_ERROR_MESSAGE);
                return false;
            case error.TIME_DIFFERENCE_ERROR:
                response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.TIME_DIFFERENCE_ERROR_MESSAGE);
                return false;
            case error.DATE_DIFFERENCE_ERROR:
                response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.DATE_DIFFERENCE_ERROR_MESSAGE);
                return false;
            default:
                return true;   
        }
    }
};

function checkTime(startTime, endTime) {
    if (startTime >= endTime) {
        return error.OVER_TIME_ERROR;
    }
    else if (!checkIfTimeIsLaterThanNow(startTime, endTime)) {
        return error.PAST_TIME_ERROR;
    }
    else if (!checkIfTimeDiffIsLessThanMinimumHoursOfRent(startTime, endTime)) {
        return error.TIME_DIFFERENCE_ERROR;
    }
    else if (!checkIfDateDiffIsMoreThanMaximumDaysOfRent(startTime, endTime)) {
        return error.DATE_DIFFERENCE_ERROR;
    }
    else {
        return error.OK;
    }
}

function checkIfTimeDiffIsLessThanMinimumHoursOfRent(startTime, endTime) {
    const start = dayjs(startTime);
    const end = dayjs(endTime);

    return (end.diff(start, 'hour') >= number.MINIMUM_HOURS_OF_RENT);
}

function checkIfDateDiffIsMoreThanMaximumDaysOfRent(startTime, endTime) {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    
    return (end.diff(start, 'day') <= number.MAXIMUM_DAYS_OF_RENT);
}

function checkIfTimeIsLaterThanNow(startTime, endTime) {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    const now = dayjs();

    return (start > now && end > now);
}
