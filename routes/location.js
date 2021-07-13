const express = require("express");
const router = express.Router();
const location_repository = require("../db/location");

/**
 * @swagger
 *  /locations:
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
 *          404: 
 *            description: 지역 리스트 불러오기 실패
 */
router.get("/", function(req, res){
    const type = req.query.type;

    // 인기 지역
    if (type == 'popular') {
        location_repository.findPopularLocations(function(err, result){
            if(err) throw err;
            res.send(result);
        });
    }
    // 공항(airport), KTX역(ktx), SRT역(srt), 버스터미널(bus), 지역(region), 해외(abroad)
    else if (type == 'airport' || type == 'ktx' || type == 'srt' || type == 'bus' || type == 'region' || type == 'abroad') {
        location_repository.findByLocationType(type, function(err, result){
            if(err) throw err;
            res.send(result);
        });
    }
    // 다른 것을 입력했을 경우 예외 처리
    else {
        res.status(404).send("NOT FOUND\n");
    }

});

module.exports = router;
