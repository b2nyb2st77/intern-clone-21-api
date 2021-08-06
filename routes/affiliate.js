const express = require("express");
const router = express.Router();
const affiliate_repository = require("../db/affiliate");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error = require("../core/error");

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
 *              a_open_time: 08:00:00
 *              a_close_time: 22:00:00
 *          404: 
 *            description: 업체 정보 불러오기 실패
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
 *            description: index값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
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
 *       - a_open_time
 *       - a_close_time
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
 *       a_open_time:
 *         type: string
 *         format: time
 *         description: 업체 오픈 시간
 *       a_close_time:
 *         type: string
 *         format: time
 *         description: 업체 마감 시간
 */
router.get("/:index", function(req, res){
    const index = req.params.index;

    if (validate.isEmpty(index)) {
        response_handler.responseValidateError(res, error.LENGTH_REQUIRED, error.PARAMETER_ERROR_MESSAGE);
        return;
    }

    if (!validate.checkInjection(index)) {
        response_handler.responseInjectionError(res);
        return;
    }
    
    if (!validate.validateRequestInteger(index)) {
        response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.VALIDATION_ERROR_MESSAGE);
        return;
    }

    affiliate_repository.findOneAffiliate(index, function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });
});

module.exports = router;