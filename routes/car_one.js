const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");
const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error_string = require("../core/error_string");

/**
 * @swagger
 * paths:
 *   /car/{index}:
 *     get:
 *        tags:
 *        - car
 *        description: 차량 하나의 정보 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: index
 *          in: path
 *          description: 차량 고유번호
 *          required: true
 *          type: integer
 *        responses: 
 *          200: 
 *            description: 차량 정보 불러오기 성공
 *            schema:
 *              $ref: '#/definitions/Car_one'
 *            example:
 *              c_index: 1
 *              c_type: '경형'
 *              c_name: '레이'
 *              c_max_number_of_people: 5
 *              c_gear: '오토'
 *              c_number_of_load: 3
 *              c_number_of_door: 4
 *              c_air_conditioner_or_not: 'y'
 *              c_production_year: '15~17년식'
 *              c_fuel: '휘발유'
 *              c_description: '경차 최고의 실내공간 깡패'
 *              c_driver_age: 21
 *          404: 
 *            description: 차량 정보 불러오기 실패
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
 *   Car_one:
 *     type: object
 *     required:
 *       - c_index
 *       - c_type
 *       - c_name
 *       - c_max_number_of_people
 *       - c_gear
 *       - c_number_of_load
 *       - c_number_of_door
 *       - c_air_conditioner_or_not
 *       - c_production_year
 *       - c_fuel
 *       - c_description
 *       - c_driver_age
 *     properties:
 *       c_index:
 *         type: integer
 *         description: 자동차 고유번호
 *       c_type:
 *         type: string
 *         description: 자동차 등급
 *       c_name:
 *         type: string
 *         description: 자동차 모델명
 *       c_max_number_of_people:
 *         type: integer
 *         description: 최대 탑승 인원수
 *       c_gear:
 *         type: string
 *         description: 기어 종류
 *       c_number_of_load:
 *         type: integer
 *         description: 짐 개수
 *       c_number_of_door:
 *         type: integer
 *         description: 문 개수
 *       c_air_conditioner_or_not:
 *         type: string
 *         enum: [y, n]
 *         description: 에어컨 유무
 *       c_production_year:
 *         type: string
 *         description: 자동차 제조년도
 *       c_fuel:
 *         type: string
 *         description: 연료 종류
 *       c_description:
 *         type: string
 *         description: 자동차 설명
 *       c_driver_age:
 *         type: integer
 *         description: 자동차 보험나이
 */
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    if (!validate.checkInjection(index)) {
        response_handler.response406Error(res);
        return;
    }

    if (validate.isEmpty(index)) {
        response_handler.response501Error(res, PARAMETER_ERROR);
        return;
    }

    if (!validate.validateRequestInteger(index)) {
        response_handler.response501Error(res, VALIDATION_ERROR);
        return;
    }
    
    car_repository.findOneCar(index, function(err, result){
        if (err) res.status(404).send({code: "SQL ERROR", errorMessage: err});
        else res.send(result);
    });
});

module.exports = router;