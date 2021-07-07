const express = require("express");
const mysql = require("mysql");

module.exports = {
    init: () => {
        const con = mysql.createConnection({
            host: 'teamo2-test.c0dbvvfuggmr.ap-northeast-2.rds.amazonaws.com',
            user: 'teamo2_intern',
            password: 'teamo0924',
            database: 'carmore'
        });

        con.connect(function(err){
            if(err) throw err;
            console.log("mysql is connected");
        });

        return con;
    },
};