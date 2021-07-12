const express = require("express");
const router = express.Router();
const car_repository = require("../db/car");

router.get("/", function(req, res){
    const order = req.query.order;
    const type = req.query.type;

    // 전체, 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
    if (type == '' || type == null || type === 'elec' || type === 'small' || type === 'middle' || type === 'big' || type === 'suv' || type === 'rv' || type === 'import') {
        car_repository.findCars(order, type, function(err, result){
            if(err) throw err;
            res.send(result);
        });
    }
    // 다른 것을 입력했을 경우 예외 처리
    else {
        res.status(404).send("NOT FOUND\n");
    }

});

// index로 자동차 하나의 정보 불러오기 (상세보기)
router.get("/:index", function(req, res){
    const index = req.params.index;

    car_repository.findOneCar(index, function(err, result){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;