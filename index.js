const { response } = require("express");
const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");

const con = mysql.createConnection({
    host: 'teamo2-test.c0dbvvfuggmr.ap-northeast-2.rds.amazonaws.com',
    user: 'teamo2_intern',
    password: 'teamo0924',
    database: 'carmore'
});

con.connect(function(err){
    if(err) throw err;
    console.log("mysql is connected");

    // con.query('CREATE DATABASE carmore', function(err, result){
    //     if(err) throw err;
    //     console.log('database created');
    // })
})

app.get("/", function(req, res){
    res.send("Hello World!\n");
});

app.get("/cars", function(req, res){
    const sql = "select * from car";
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

app.get("/locations", function(req, res){
    const sql = "select * from location";
    con.query(sql, function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

app.use(function(res, res, next){
    res.status(404).send("NOT FOUND\n");
    next();
});

app.listen(port, function(){
    console.log("simple api server is open");
});