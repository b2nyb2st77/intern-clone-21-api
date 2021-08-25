const express = require('express')

const responseHandler = require('../core/responseHandler')
const validate = require('../core/validate')
const error = require('../core/error')
const application = require('../application/location')

const router = express.Router()

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
 *              l_index: 1
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
 *       l_index:
 *         type: integer
 *         description: 지역 고유번호
 *       l_name:
 *         type: string
 *         description: 지역 이름
 *       l_type:
 *         type: string
 *         description: 지역 종류
 *       l_popular_or_not:
 *         type: string
 *         enum: [y, n]
 *         description: 인기지역 유무
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
router.get('/', function (req, res) {
  const searchWord = decodeURIComponent(req.query.searchWord)

  if (validate.isEmpty(searchWord)) {
    responseHandler.responseValidateError(res, error.LENGTH_REQUIRED, error.PARAMETER_ERROR_MESSAGE)
    return
  }

  if (!validate.checkInjection(searchWord)) {
    responseHandler.responseInjectionError(res)
    return
  }

  application.searchLocation(searchWord, res)
})

module.exports = router
