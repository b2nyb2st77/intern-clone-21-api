const express = require("express");

const response_handler = require("../core/responseHandler");
const validate = require("../core/validate");
const error = require("../core/error");
const application = require("../application/car");
const time = require("../application/check_time");

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /cars:
 *     get:
 *        tags:
 *        - car
 *        description: 차량 리스트 불러오기
 *        produces:
 *        - applicaion/json
 *        parameters:
 *        - name: location
 *          in: query
 *          description: 지역
 *          required: true
 *          type: string
 *        - name: startTime
 *          in: query
 *          description: 대여시간
 *          required: true
 *          type: string
 *          format: date-time
 *        - name: endTime
 *          in: query
 *          description: 반납시간
 *          required: true
 *          type: string
 *          format: date-time
 *        responses: 
 *          200: 
 *            description: 차량 리스트 불러오기 성공
 *            schema:
 *              $ref: '#/definitions/Car_list'
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
 *              a_index: 2
 *              a_name: '세븐렌트카'
 *              a_info: '송내역 2번 출구 도보 5분 이내'
 *              a_number_of_reservation: 2200
 *              a_grade: 4.9
 *              a_new_or_not: 'n'
 *              rs_index: 1
 *              car_price: 55000
 *          404: 
 *            description: 차량 리스트 불러오기 실패
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
 *            description: 파라미터값 오류
 *            schema:
 *              $ref: '#/definitions/Error_501'
 *            example:
 *              code: '501 ERROR'
 *              errorMessage: 'PARAMETER IS EMPTY'
 * 
 * definitions:
 *   Car_list:
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
 *       - a_index
 *       - a_name
 *       - a_info
 *       - a_number_of_reservation
 *       - a_grade
 *       - a_new_or_not
 *       - rs_index
 *       - car_price
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
 *       a_new_or_not:
 *         type: string
 *         enum: [y, n]
 *         description: 신규등록업체 유무
 *       rs_index:
 *         type: integer
 *         description: 렌트가능차량 고유번호
 *       car_price:
 *         type: integer
 *         description: 렌트가능차량 가격
 */
router.get("/", function(req, res){
    const location = decodeURIComponent(req.query.location);
    const { startTime, endTime } = req.query;
    
    if (validate.isEmpty(location) || validate.isEmpty(startTime) || validate.isEmpty(endTime)) {
        response_handler.responseValidateError(res, error.LENGTH_REQUIRED, error.PARAMETER_ERROR_MESSAGE);
        return;
    }
    
    if (!validate.checkInjection(location) || !validate.checkInjection(startTime) || !validate.checkInjection(endTime)) {
        response_handler.responseInjectionError(res);
        return;
    }
    
    if (!validate.validateRequestDatetime(startTime, endTime)) {
        response_handler.responseValidateError(res, error.PRECONDITION_FAILED, error.VALIDATION_ERROR_MESSAGE);
        return;
    }
    
    if(!time.checkTimeError(startTime, endTime, res)) return;

    application.findCarList(location, startTime, endTime, res);
});

module.exports = router;
