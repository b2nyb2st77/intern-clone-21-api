const OVER_TIME = "OVER_TIME";
const TIME_DIFFERENCE = "TIME_DIFFERENCE";
const PAST_TIME = "PAST_TIME";
const OK = "OK";
const PARAMETER_ERROR = "PARAMETER IS EMPTY";
const VALIDATION_ERROR = "VALIDATION CHECK FAIL";
const OVER_TIME_ERROR = "END TIME SHOULD BE QUICKER THAN START TIME";
const TIME_DIFFERENCE_ERROR = "END TIME SHOULD BE MORE THAN 24 HOURS LATER THAN START TIME";
const PAST_TIME_ERROR = "START TIME AND END TIME SHOULD BE LATER THAN NOW";
const TYPE_ERROR = "PARAMETER DOES NOT MATCH ITS TYPE";

module.exports = { 
    OVER_TIME, 
    TIME_DIFFERENCE, 
    PAST_TIME, 
    OK, 
    PARAMETER_ERROR, 
    VALIDATION_ERROR, 
    OVER_TIME_ERROR, 
    TIME_DIFFERENCE_ERROR, 
    PAST_TIME_ERROR, 
    TYPE_ERROR 
};
