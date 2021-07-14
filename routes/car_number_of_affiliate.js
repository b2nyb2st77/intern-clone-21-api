const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");

/**
 * @swagger
 *  /find_number_of_affiliate:
 *     get:
 *        tags:
 *        - car
 *        description: 마감된 차량의 업체 개수 찾기
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
 *            description: 마감된 차량의 업체 개수 찾기 성공
 *          404: 
 *            description: 마감된 차량의 업체 개수 찾기 실패
 */
router.get("/", function(req, res){
    const carName = req.query.carName;
    const location = req.query.location;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    car_repository.findNumberOfAffiliate(carName, location, startTime, endTime, function(err, result){
        if(err) throw err;
        res.send(result);
    });

});

module.exports = router;