const express = require("express");
const router = express.Router();
const location_repository = require("../db/location");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error_string = require("../core/error_string");

/**
 * @swagger
 * paths:
 *   /search_location:
 *     get:
 *        tags:
 *        - location
 *        description: 지역 리스트 검색하기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: searchWord
 *          in: query
 *          description: 검색단어
 *          required: true
 *          type: string
 *        responses: 
 *          200: 
 *            description: 지역 리스트 검색하기 성공
 *            schema:
 *              $ref: '#/definitions/Location_list'
 *            example:
 *              l_name: '서울역'
 *              l_immediate_or_not: 'y'
 *          404: 
 *            description: 지역 리스트 검색하기 실패
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
 *            description: searchWord값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
 * 
 * definitions:
 *   Location_list:
 *     type: object
 *     properties:
 *       l_name:
 *         type: string
 *         description: 지역 이름
 *       l_immediate_or_not:
 *         type: string
 *         enum: [y, n]
 *         description: 바로예약지역 유무
 *       l_subname:
 *         type: string
 *         description: 인기지역 이름
 *   Error_404:
 *     type: object
 *     required:
 *       - code
 *     properties:
 *       code:
 *         type: string
 *         description: 오류 코드
 *   Error_406:
 *     type: object
 *     required:
 *       - code
 *     properties:
 *       code:
 *         type: string
 *         description: 오류 코드
 *   Error_501:
 *     type: object
 *     required:
 *       - code
 *       - errorMessage
 *     properties:
 *       code:
 *         type: string
 *         description: 오류 코드
 *       errorMessage:
 *         type: string
 *         description: 오류 내용
 */
router.get("/", function(req, res){
    const searchWord = decodeURIComponent(req.query.searchWord);

    if (!validate.checkInjection(searchWord)) {
        response_handler.response406Error(res);
        return;
    }

    if (validate.isEmpty(searchWord)) {
        response_handler.response501Error(res, PARAMETER_ERROR);
        return;
    }

    location_repository.searchLocation(searchWord, function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });

});

module.exports = router;
