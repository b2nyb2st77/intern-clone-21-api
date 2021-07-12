const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");

/**
 * @swagger
 *  /car/{index}:
 *     get:
 *        tags:
 *        - car
 *        description: 차량 하나의 정보 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: index
 *          in: path
 *          description: 차량 고유번호
 *          required: true
 *          type: integer
 *        responses: 
 *          200: 
 *            description: 차량 정보 불러오기 성공
 *          404: 
 *            description: 차량 정보 불러오기 실패
 */
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    // index로 자동차 하나의 정보 불러오기 (상세보기)
    car_repository.findOneCar(index, function(err, result){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;