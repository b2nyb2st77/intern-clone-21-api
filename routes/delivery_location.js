const express = require("express");
const router = express.Router();

const application = require("../application/delivery_location");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error = require("../core/error");

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

    if (validate.isEmpty(affiliateName)) {
        response_handler.responseValidateError(res, error.LENGTH_REQUIRED, error.PARAMETER_ERROR_MESSAGE);
        return;
    }

    if (!validate.checkInjection(affiliateName)) {
        response_handler.responseInjectionError(res);
        return;
    }
    
    application.findDeliveryLocation(affiliateName, res);
});

module.exports = router;
