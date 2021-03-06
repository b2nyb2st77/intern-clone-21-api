const express = require("express");

const application = require("../application/location");

const router = express.Router();

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
    application.findLocations(res);
});

module.exports = router;
