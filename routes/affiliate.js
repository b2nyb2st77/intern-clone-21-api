const express = require("express");
const router = express.Router();
const affiliate_repository = require("../db/affiliate");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");

/**
 * @swagger
 * paths:
 *   /affiliate/{index}:
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
 *            schema:
 *              $ref: '#/definitions/Affiliate_one'
 *            example:
 *              a_index: 2
 *              a_name: '세븐렌트카'
 *              a_info: '송내역 2번 출구 도보 5분 이내'
 *              a_number_of_reservation: 2200
 *              a_grade: 4.9
 *              a_l_index: 13
 *              a_new_or_not: 'n'
 *          404: 
 *            description: 업체 정보 불러오기 실패
 *          406: 
 *            description: sql injection 발생
 *          501: 
 *            description: index값 오류
 * 
 * definitions:
 *   Affiliate_one:
 *     type: object
 *     required:
 *       - a_index
 *       - a_name
 *       - a_info
 *       - a_number_of_reservation
 *       - a_grade
 *       - a_l_index
 *       - a_new_or_not
 *     properties:
 *       a_index:
 *         type: integer
 *         description: 업체 고유번호
 *       a_name:
 *         type: string
 *         description: 업체 이름
 *       a_info:
 *         type: string
 *         description: 업체 정보
 *       a_number_of_reservation:
 *         type: integer
 *         description: 업체 예약수
 *       a_grade:
 *         type: number
 *         format: float
 *         description: 업체 평점
 *       a_l_index:
 *         type: integer
 *         description: 지역 고유번호
 *       a_new_or_not:
 *         type: string
 *         enum: [y, n]
 *         description: 신규등록업체 유무
 */
router.get("/:index", function(req, res){
    const index = req.params.index;

    if (!validate.checkInjection(index)) {
        response_handler.response406Error(res);
        return;
    }

    if (validate.isEmpty(index)) {
        response_handler.response501Error(res, "PARAMETER IS EMPTY");
        return;
    }
    
    if (!validate.validateRequestInteger(index)) {
        response_handler.response501Error(res, "VALIDATION CHECK FAIL");
        return;
    }

    affiliate_repository.findOneAffiliate(index, function(err, result){
        if(err) throw err;
        res.send(result);
    })
});

module.exports = router;