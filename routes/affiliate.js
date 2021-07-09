const express = require("express");
const router = express.Router();
const sql_query = require("../db/affiliate");


// index로 렌트카 업체 하나의 정보 불러오기
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    const execSql = sql_query.findOne(index, function(err, result){
        if(err) throw err;
        res.send(result);
    })

    console.log(execSql.sql);
});

module.exports = router;