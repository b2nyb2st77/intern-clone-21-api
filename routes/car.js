const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const con = mysql.init();

// 차종순으로 자동차의 정보 나열하기 - 전체
router.get("/order-by-type", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 전기
router.get("/order-by-type/elec", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_fuel = '전기'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 경소형
router.get("/order-by-type/small", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '경형' OR '소형'
    ORDER BY FIELD(c.c_type, '경형', '소형')`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 준중형
router.get("/order-by-type/middle", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '준중형'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 중대형
router.get("/order-by-type/big", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '중형' OR '대형'
    ORDER BY FIELD(c.c_type, '중형', '대형')`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - SUV
router.get("/order-by-type/suv", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = 'SUV'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 승합
router.get("/order-by-type/rv", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = 'RV'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 차종순으로 자동차의 정보 나열하기 - 수입
router.get("/order-by-type/import", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '수입'`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});


/****** 가격순은 더 고민해보아야 함! *******/

// 가격순으로 자동차의 정보 나열하기 - 전체
router.get("/order-by-price", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 전기
router.get("/order-by-price/elec", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_fuel = '전기'
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 경소형
router.get("/order-by-price/small", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '경형' OR '소형'
    ORDER BY FIELD(c.c_type, '경형', '소형'), rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 준중형
router.get("/order-by-price/middle", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '준중형'
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 중대형
router.get("/order-by-price/big", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '중형' OR '대형'
    ORDER BY FIELD(c.c_type, '중형', '대형'), rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - SUV
router.get("/order-by-price/suv", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = 'SUV'
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 승합
router.get("/order-by-price/rv", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = 'RV'
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 가격순으로 자동차의 정보 나열하기 - 수입
router.get("/order-by-price/import", function(req, res){
    const sql = `SELECT c.*, a.*, rs.rs_price from rentcar_status rs, car c, affiliate a 
    WHERE rs.rs_c_index = c.c_index
    AND rs.rs_a_index = a.a_index
    AND c.c_type = '수입'
    ORDER BY rs.rs_price ASC`;
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// index로 자동차 하나의 정보 불러오기 (상세보기)
router.get("/:index", function(req, res){
    const sql = "SELECT * from car WHERE c_index = ?";
    con.query(sql, [req.params.index], function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;