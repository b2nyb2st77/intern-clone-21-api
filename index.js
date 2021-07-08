const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;

const location = require("./routes/location");
const car = require("./routes/car");
const affiliate = require("./routes/affiliate");

app.use("/locations", location);
app.use("/cars", car);
app.use("/affiliates", affiliate);

// 시작
app.get("/", function(req, res){
    res.send("Hello World!\n");
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