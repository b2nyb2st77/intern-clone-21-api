const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;

const { swaggerUi, specs } = require('./swagger/swagger');
app.use("/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

const location_routes = require("./routes/location");
const cars_routes = require("./routes/car_list");
const car_routes = require("./routes/car_one");
const cars_reserved_routes = require("./routes/cars_reserved");
const affiliate_routes = require("./routes/affiliate");
const dl_routes = require("./routes/delivery_location");

app.use("/locations", location_routes);
app.use("/cars", cars_routes);
app.use("/car", car_routes);
app.use("/reserved_cars", cars_reserved_routes);
app.use("/affiliate", affiliate_routes);
app.use("/delivery_location", dl_routes);

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
    console.log("server is opened!");
});