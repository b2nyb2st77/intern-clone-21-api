const express = require("express");
const router = express.Router();
const mysql = require("../db/mysql");
const sql_query = require("../db/location");
const con = mysql.init();

// 지역선택
router.get("/", function(req, res){
    const type = req.param('type');

    // 지역선택 - 인기 지역
    if(type == 'popular'){
        const sql = sql_query.popular();

        const execSql = con.query(sql, function(err, result){
            if(err) throw err;
            res.send(result);
        });

        console.log(execSql.sql);
    }
    // 지역선택 - 공항(airport), KTX역(ktx), SRT역(srt), 버스터미널(bus), 지역(region), 해외(abroad)
    else if(type == 'airport' || type == 'ktx' || type == 'srt' || type == 'bus' || type == 'region' || type == 'abroad'){
        const sql = sql_query.othertype();
        
        const execSql = con.query(sql, type, function(err, result){
            if(err) throw err;
            res.send(result);
        });

        console.log(execSql.sql);
    }
    // 다른 것을 입력했을 경우 예외 처리
    else {
        res.status(404).send("NOT FOUND\n");
    }

});

module.exports = router;
