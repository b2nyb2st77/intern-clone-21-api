const express = require("express");
const router = express.Router();
const mysql = require("../db/mysql");
const sql_query = require("../db/affiliate");
const con = mysql.init();

// index로 렌트카 업체 하나의 정보 불러오기
router.get("/:index", function(req, res){
    const sql = sql_query.one();
    
    var execSql = con.query(sql, [req.params.index], function(err, result){
        if(err) throw err;
        res.send(result);
    });

    console.log(execSql.sql);
});

module.exports = router;