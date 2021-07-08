const express = require("express");
const router = express.Router();
const mysql = require("../db/mysql");
const sql_query = require("../db/car");
const con = mysql.init();
const init_query = sql_query.init();

router.get("/", function(req, res){
    const order = req.param('order');
    const type = req.param('type');

    // 차종순으로 자동차의 정보 나열하기
    if(order == 'type'){

        // 전체
        if(type == '' || type == null){
            const sql = init_query + sql_query.type_all();
            
            const execSql = con.query(sql, function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        // 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
        else if(type == 'elec' || type == 'small' || type == 'middle' || type == 'big' || type == 'suv' || type == 'rv' || type == 'import'){
            let sql;

            // 전기
            if(type == 'elec'){
                sql = init_query + sql_query.type_elec();
            }
            // 경소형
            else if(type == 'small'){
                sql = init_query + sql_query.type_small();
            }
            // 준중형
            else if(type == 'middle'){
                sql = init_query + sql_query.type_middle();
            }
            // 중대형
            else if(type == 'big'){
                sql = init_query + sql_query.type_big();
            }
            // SUV
            else if(type == 'suv'){
                sql = init_query + sql_query.type_suv();
            }
            // 승합
            else if(type == 'rv'){
                sql = init_query + sql_query.type_rv();
            }
            // 수입
            else if(type == 'import'){
                sql = init_query + sql_query.type_import();
            }
                
            const execSql = con.query(sql, function(err, result){
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
            const sql = init_query + sql_query.price_all();
            
            const execSql = con.query(sql, function(err, result){
                if(err) throw err;
                res.send(result);
            });

            console.log(execSql.sql);
        }
        // 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
        else if(type == 'elec' || type == 'small' || type == 'middle' || type == 'big' || type == 'suv' || type == 'rv' || type == 'import'){
            let sql;
            
            // 전기
            if(type == 'elec'){
                sql = init_query + sql_query.price_elec();
            }
            // 경소형
            else if(type == 'small'){
                sql = init_query + sql_query.price_small();
            }
            // 준중형
            else if(type == 'middle'){
                sql = init_query + sql_query.price_middle();
            }
            // 중대형
            else if(type == 'big'){
                sql = init_query + sql_query.price_big();
            }
            // SUV
            else if(type == 'suv'){
                sql = init_query + sql_query.price_suv();
            }
            // 승합
            else if(type == 'rv'){
                sql = init_query + sql_query.price_rv();
            }
            // 수입
            else if(type == 'import'){
                sql = init_query + sql_query.price_import();
            }
                
            const execSql = con.query(sql, function(err, result){
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
    const sql = sql_query.one();

    var execSql = con.query(sql, [req.params.index], function(err, result){
        if(err) throw err;
        res.send(result);
    });

    console.log(execSql.sql);
});

module.exports = router;