const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");

const carTypes = [
    '',
    'elec',
    'small',
    'middle',
    'big',
    'suv',
    'rv',
    'import',
];

/**
 * @swagger
 *  /cars:
 *     get:
 *        tags:
 *        - car
 *        description: 차량 리스트 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: order
 *          in: query
 *          description: 정렬 타입
 *          required: true
 *          type: string
 *        - name: type
 *          in: query
 *          description: 차종
 *          required: false
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
 *            description: 차량 리스트 불러오기 성공
 *          404: 
 *            description: 차량 리스트 불러오기 실패
 */
router.get("/", function(req, res){
    const order = req.query.order;
    let type = req.query.type;
    const location = req.query.location;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    if (!validate.checkInjection(order) || !validate.checkInjection(type) || !validate.checkInjection(location) || !validate.checkInjection(startTime) ||!validate.checkInjection(endTime)) {
        response_handler.response406Error(res);
        return;
    }

    if(validate.isEmpty(type)){
        type = '';
    }

    if (validate.isEmpty(order) || validate.isEmpty(location) || validate.isEmpty(startTime) || validate.isEmpty(endTime)) {
        response_handler.response501Error(res);
        return;
    }
    
    if (!(order === "type" || order === "price")) {
        response_handler.response501Error(res);
        return;
    }
    
    if (!~carTypes.indexOf(type)) {
        response_handler.response501Error(res);
        return;
    }
    
    if (!validate.validateRequestDatetime(startTime, endTime)) {
        response_handler.response501Error(res);
        return;
    }

    car_repository.findCars(
        order,
        type,
        location,
        startTime,
        endTime,
        function(err, result){
            if(err) throw err;
            res.send(result);
        },
    );
});

module.exports = router;