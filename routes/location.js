const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const con = mysql.init();

// 모든 지역 정보 불러오기
router.get("/all", function(req, res){
    const sql = "SELECT * from location";
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - 인기 지역
router.get("/popular", function(req, res){
    const sql = `SELECT distinct l_subname from location 
                 WHERE l_popular_or_not = 'y'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - 공항
router.get("/airport", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location
                 WHERE l_type = '공항'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - KTX역
router.get("/ktx", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location 
                 WHERE l_type = 'KTX역'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - SRT역
router.get("/srt", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location 
                 WHERE l_type = 'SRT역'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - 버스터미널
router.get("/bus", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location 
                 WHERE l_type = '버스터미널'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - 지역
router.get("/region", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location 
                 WHERE l_type = '지역'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 지역선택 - 해외
router.get("/abroad", function(req, res){
    const sql = `SELECT distinct l_name, l_immediate_or_not from location 
                 WHERE l_type = '해외'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;
