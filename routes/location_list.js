const express = require("express");
const router = express.Router();
const location_repository = require("../db/location");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");

const locationTypes = [
    'popular',
    'airport',
    'ktx',
    'srt',
    'bus',
    'region',
    'abroad',
];

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
 *        parameters:
 *        - name: type
 *          in: query
 *          description: 지역 종류(타입)
 *          required: true
 *          type: string
 *        responses: 
 *          200: 
 *            description: 지역 리스트 불러오기 성공
 *            schema:
 *              $ref: '#/definitions/Location_list'
 *            examples:
 *              popular_list:
 *                $ref: '#/components/examples/popular_list'
 *              type_list:
 *                $ref: '#/components/examples/type_list'                     
 *          404: 
 *            description: 지역 리스트 불러오기 실패
 *          406: 
 *            description: sql injection 발생
 *          501: 
 *            description: type값 오류
 * 
 * components:
 *   examples:
 *     popular_list:
 *       value:
 *         l_subname : '인천공항'
 *     type_list:
 *       value:
 *         l_name: '서울역'
 *         l_immediate_or_not: 'y'
 */
router.get("/", function(req, res){
    const type = req.query.type;

    if (!validate.checkInjection(type)) {
        response_handler.response406Error(res);
        return;
    }

    if (validate.isEmpty(type)) {
        response_handler.response501Error(res, "PARAMETER IS EMPTY");
        return;
    }

    if (!~locationTypes.indexOf(type)) {
        response_handler.response501Error(res, "TYPE DOES NOT MATCH");
        return;
    }
    
    location_repository.findLocations(type, function(err, result){
        if(err) throw err;
        res.send(result);
    });

});

module.exports = router;
