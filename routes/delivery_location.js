const express = require("express");
const router = express.Router();
const dl_repository = require("../db/delivery_location");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error_string = require("../core/error_string");

/**
 * @swagger
 * paths:
 *   /delivery_location:
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
 *            schema:
 *              $ref: '#/definitions/Delivery_location_list'
 *            example:
 *              dl_sido: '서울'
 *              dl_gu: '강남구'
 *          404: 
 *            description: 배달가능지역 불러오기 실패
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
 *            description: affiliateName값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
 * definitions:
 *   Delivery_location_list:
 *     type: object
 *     required:
 *       - dl_sido
 *       - dl_gu
 *     properties:
 *       dl_sido:
 *         type: string
 *         description: 지역 시도
 *       dl_gu:
 *         type: string
 *         description: 지역 구
 */
router.get("/", function(req, res){
    const affiliateName = decodeURIComponent(req.query.affiliateName);

    if (validate.isEmpty(affiliateName, error_string.PARAMETER_ERROR_MESSAGE)) {
        response_handler.response501Error(res);
        return;
    }

    if (!validate.checkInjection(affiliateName)) {
        response_handler.response406Error(res);
        return;
    }
    
    dl_repository.findDeliveryLocation(affiliateName, function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });
});

module.exports = router;