const express = require("express");
const router = express.Router();
const dl_repository = require("../db/delivery_location");

/**
 * @swagger
 *  /delivery_location/{index}:
 *     get:
 *        tags:
 *        - delivery_location
 *        description: 업체의 배달가능지역 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: index
 *          in: path
 *          description: 업체 고유번호
 *          required: true
 *          type: integer
 *        responses: 
 *          200: 
 *            description: 배달가능지역 불러오기 성공
 *          404: 
 *            description: 배달가능지역 불러오기 실패
 */
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    // index로 자동차 하나의 정보 불러오기 (상세보기)
    dl_repository.findDeliveryLocation(index, function(err, result){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;