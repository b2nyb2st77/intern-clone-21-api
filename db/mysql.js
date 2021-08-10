const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

const { host, user, password, database } = process.env;

module.exports = {
    init: () => {
        const con = mysql.createConnection({
            host     : host,
            user     : user,
            password : password,
            database : database,
            multipleStatements : true
        });

        con.connect(function(err){
            if (err) {
                throw err;
            }
        });

        return con;
    },
};
