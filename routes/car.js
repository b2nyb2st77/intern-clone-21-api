const express = require("express");
const router = express.Router();
const sql_query = require("../db/car");

router.get("/", function(req, res){
    const order = req.query.order;
    const type = req.query.type;

    // 차종순으로 자동차의 정보 나열하기
    if(order == 'type'){
        // 전체
        if(type == '' || type == null){
            const execSql = sql_query.type_all(function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        // 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
        else if(type == 'elec' || type == 'small' || type == 'middle' || type == 'big' || type == 'suv' || type == 'rv' || type == 'import'){
            const execSql = sql_query.type_other(type, function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        else{
            res.status(404).send("NOT FOUND\n");
        }

    }
    /****** 가격순은 더 고민해보아야 함! *******/
    // 가격순으로 자동차의 정보 나열하기
    else if(order == 'price'){
        // 전체
        if(type == '' || type == null){
            const execSql = sql_query.price_all(function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        // 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
        else if(type == 'elec' || type == 'small' || type == 'middle' || type == 'big' || type == 'suv' || type == 'rv' || type == 'import'){
            const execSql = sql_query.price_other(type, function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        else{
            res.status(404).send("NOT FOUND\n");
        }

    } else {
        res.status(404).send("NOT FOUND\n");
    }

});

// index로 자동차 하나의 정보 불러오기 (상세보기)
router.get("/:index", function(req, res){
    const index = req.params.index;

    const execSql = sql_query.findOne(index, function(err, result){
        if(err) throw err;
        res.send(result);
    });

    console.log(execSql.sql);
});

module.exports = router;