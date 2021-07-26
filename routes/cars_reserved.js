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

    if (!validate.checkInjection(carName) || !validate.checkInjection(location) || !validate.checkInjection(startTime) ||!validate.checkInjection(endTime)) {
        response_handler.response406Error(res);
        return;
    }

    if (validate.isEmpty(carName) || validate.isEmpty(location) || validate.isEmpty(startTime) || validate.isEmpty(endTime)) {
        response_handler.response501Error(res, PARAMETER_ERROR);
        return;
    }
    
    if (validate.checkTime(startTime, endTime) == OVER_TIME) {
        response_handler.response501Error(res, OVER_TIME_ERROR);
        return;
    }
    else if (validate.checkTime(startTime, endTime) == TIME_DIFFERENCE) {
        response_handler.response501Error(res, TIME_DIFFERENCE_ERROR);
        return;
    }
    else if (validate.checkTime(startTime, endTime) == PAST_TIME) {
        response_handler.response501Error(res, PAST_TIME_ERROR);
        return;
    }
    
    if (!validate.validateRequestDatetime(startTime, endTime)) {
        response_handler.response501Error(res, VALIDATION_ERROR);
        return;
    }

    car_repository.findReservedCar(
        carName, 
        location, 
        startTime, 
        endTime, 
        function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });

});

module.exports = router;