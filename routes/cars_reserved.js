const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error_string = require("../core/error_string");

/**
 * @swagger
 * paths:
 *   /reserved_cars:
 *     get:
 *        tags:
 *        - car
 *        description: 마감된 차량의 업체 개수, 차량 개수 찾기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: carName
 *          in: query
 *          description: 차량 이름
 *          required: true
 *          type: string
 *        - name: location
 *          in: query
 *          description: 지역
 *          required: true
 *          type: string
 *        - name: startTime
 *          in: query
 *          description: 대여시간
 *          required: true
 *          type: string
 *          format: date-time
 *        - name: endTime
 *          in: query
 *          description: 반납시간
 *          required: true
 *          type: string
 *          format: date-time
 *        responses: 
 *          200: 
 *            description: 마감된 차량의 업체 개수, 차량 개수 찾기 성공
 *            schema:
 *              $ref: '#/definitions/Car_reserved'
 *            example:
 *              number_of_affiliate: 2
 *              number_of_car: 3
 *          404: 
 *            description: 마감된 차량의 업체 개수, 차량 개수 찾기 실패
 *            schema:
 *              $ref: '#/definitions/Error_404'
 *            example:
 *              code: 'NOT FOUND'
 *          406: 
 *            description: sql injection 발생
 *            schema:
 *              $ref: '#/definitions/Error_406'
 *            example:
 *              code: 'INJECTION ERROR'
 *          501: 
 *            description: 파라미터값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
 * definitions:
 *   Car_reserved:
 *     type: object
 *     required:
 *       - number_of_affiliate
 *       - number_of_car
 *     properties:
 *       number_of_affiliate:
 *         type: integer
 *         description: 마감된 차량의 업체 개수
 *       number_of_car:
 *         type: integer
 *         description: 마감된 차량의 차량 개수
 */
router.get("/", function(req, res){
    const carName = decodeURIComponent(req.query.carName);
    const location = decodeURIComponent(req.query.location);
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    if (validate.isEmpty(carName) || validate.isEmpty(location) || validate.isEmpty(startTime) || validate.isEmpty(endTime)) {
        response_handler.responseValidateError(res, 411, error_string.PARAMETER_ERROR_MESSAGE);
        return;
    }

    if (!validate.checkInjection(carName) || !validate.checkInjection(location) || !validate.checkInjection(startTime) ||!validate.checkInjection(endTime)) {
        response_handler.response406Error(res);
        return;
    }
    
    switch (validate.checkTime(startTime, endTime)) {
        case error_string.OVER_TIME_ERROR:
            response_handler.responseValidateError(res, 412, error_string.OVER_TIME_ERROR_MESSAGE);
            return;
        case error_string.PAST_TIME_ERROR:
            response_handler.responseValidateError(res, 412, error_string.PAST_TIME_ERROR_MESSAGE);
            return;
        case error_string.TIME_DIFFERENCE_ERROR:
            response_handler.responseValidateError(res, 412, error_string.TIME_DIFFERENCE_ERROR_MESSAGE);
            return;
        case error_string.DATE_DIFFERENCE_ERROR:
            response_handler.responseValidateError(res, 412, error_string.DATE_DIFFERENCE_ERROR_MESSAGE);
            return;
        default:
            break;    
    }
    
    if (!validate.validateRequestDatetime(startTime, endTime)) {
        response_handler.responseValidateError(res, 412, error_string.VALIDATION_ERROR_MESSAGE);
        return;
    }

    car_repository.findReservedCar(
        carName, 
        location, 
        startTime, 
        endTime, 
        function(err, result){
            if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
            else res.send({number_of_affiliate: result[0][0].count, number_of_car: result[1][0].count});
        }
    );
});

module.exports = router;