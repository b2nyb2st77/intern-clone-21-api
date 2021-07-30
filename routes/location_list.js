const express = require("express");
const router = express.Router();
const location_repository = require("../db/location");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error_string = require("../core/error_string");

/**
 * @swagger
 * paths:
 *   /locations:
 *     get:
 *        tags:
 *        - location
 *        description: 지역 리스트 불러오기
 *        produces:
 *        - applicaion/json
 *        responses: 
 *          200: 
 *            description: 지역 리스트 불러오기 성공
 *            schema:
 *              $ref: '#/definitions/Location_list'
 *            examples:
 *              l_index: 1
 *              l_name: '서울역'
 *              l_type: 'ktx'
 *              l_popular_or_not: 'n'
 *              l_immediate_or_not: 'y'
 *              l_subname: ''                     
 *          404: 
 *            description: 지역 리스트 불러오기 실패
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
 *            description: type값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
 */
router.get("/", function(req, res){ 
    location_repository.findLocations(function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });
});

module.exports = router;
