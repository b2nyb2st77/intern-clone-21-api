const express = require("express");
const router = express.Router();
const mysql = require("../../mysql");
const con = mysql.init();

// index로 렌트카 업체 하나의 정보 불러오기
router.get("/:index", function(req, res){
    const sql = "SELECT * from affiliate WHERE a_index = ?";
    con.query(sql, [req.params.index], function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;