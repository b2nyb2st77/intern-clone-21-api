const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");

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
    const type = req.query.type;

    // 전체, 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
    if (type == '' || type == null || type === 'elec' || type === 'small' || type === 'middle' || type === 'big' || type === 'suv' || type === 'rv' || type === 'import') {
        car_repository.findCars(order, type, function(err, result){
            if(err) throw err;
            res.send(result);
        });
    }
    // 다른 것을 입력했을 경우 예외 처리
    else {
        res.status(404).send("NOT FOUND\n");
    }

});

module.exports = router;