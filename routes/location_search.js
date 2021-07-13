const express = require("express");
const router = express.Router();
const location_repository = require("../db/location");

/**
 * @swagger
 *  /search_location:
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
 *          404: 
 *            description: 지역 리스트 검색하기 실패
 */
router.get("/", function(req, res){
    const searchWord = req.query.searchWord;

    location_repository.searchLocation(searchWord, function(err, result){
        if(err) throw err;
        res.send(result);
    });

});

module.exports = router;
