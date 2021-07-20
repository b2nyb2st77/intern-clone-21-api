const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");

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
 *          406: 
 *            description: sql injection 발생
 *          501: 
 *            description: 파라미터값 오류
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
        response_handler.response501Error(res);
        return;
    }

    if (!validate.validateRequestDatetime(startTime, endTime)) {
        response_handler.response501Error(res);
        return;
    }

    car_repository.findReservedCar(
        carName, 
        location, 
        startTime, 
        endTime, 
        function(err, result){
        if(err) throw err;
        res.send(result);
    });

});

module.exports = router;