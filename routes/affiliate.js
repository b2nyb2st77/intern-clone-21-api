const express = require("express");
const router = express.Router();
const affiliate_repository = require("../db/affiliate");

/**
 * @swagger
 *  /affiliate/{index}:
 *     get:
 *        tags:
 *        - affiliate
 *        description: 업체 하나의 정보 불러오기
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
 *            description: 업체 정보 불러오기 성공
 *          404: 
 *            description: 업체 정보 불러오기 실패
 */
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    // index로 렌트카 업체 하나의 정보 불러오기
    affiliate_repository.findOneAffiliate(index, function(err, result){
        if(err) throw err;
        res.send(result);
    })
});

module.exports = router;