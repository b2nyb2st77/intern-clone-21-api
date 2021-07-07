const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const location = require("./location");
const car = require("./car");

// 시작
app.get("/", function(req, res){
    res.send("Hello World!\n");
});

app.use("/location", location);
app.use("/car", car);

// index로 렌트카 업체 하나의 정보 불러오기
app.get("/affiliate/:index", function(req, res){
    const sql = "select * from affiliate where a_index = ?";
    con.query(sql, [req.params.index], function(err, result, fields){
        if(err) throw err;
        res.send(result);
    });
});

// 없는 api일 때
app.use(function(res, res, next){
    res.status(404).send("NOT FOUND\n");
    next();
});

// 서버 연결 완료
app.listen(port, function(){
    console.log("simple api server is open");
});