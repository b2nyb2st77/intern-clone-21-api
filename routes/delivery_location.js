const express = require("express");
const router = express.Router();
const dl_repository = require("../db/delivery_location");

/**
 * @swagger
 *  /delivery_location:
 *     get:
 *        tags:
 *        - delivery_location
 *        description: 업체의 배달가능지역 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: affiliateName
 *          in: query
 *          description: 업체 이름
 *          required: true
 *          type: string
 *        responses: 
 *          200: 
 *            description: 배달가능지역 불러오기 성공
 *          404: 
 *            description: 배달가능지역 불러오기 실패
 */
router.get("/", function(req, res){
    const affiliateName = req.query.affiliateName;
    
    // 업체이름으로 해당 업체의 배달가능지역 불러오기
    dl_repository.findDeliveryLocation(affiliateName, function(err, result){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;