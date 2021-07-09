const express = require("express");
const mysql = require("../db/mysql");
const con = mysql.init();

const init_sql = `SELECT c.*, a.*, rs.rs_price 
                  FROM rentcar_status rs, car c, affiliate a 
                  WHERE rs.rs_c_index = c.c_index
                  AND rs.rs_a_index = a.a_index `;

module.exports = {
    type_all: (callback) => {
        const sql = init_sql + 
                    `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
        
        return con.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    type_other: (type, callback) => {
        let sql = init_sql;

        if(type == 'elec'){
            sql += `AND c.c_fuel = '전기'`;

            return con.query(sql, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }
        else{
            sql += `AND c.c_type `;

            switch(type){
                case 'small':
                    type = ['경형', '소형'];
                    sql += `IN (?, ?)
                            ORDER BY FIELD(c.c_type, '경형', '소형')`; 
                    break;
                case 'middle':
                    type = '준중형';
                    sql += `= ?`
                    break;
                case 'big':
                    type = ['중형', '대형'];
                    sql += `IN (?, ?)
                            ORDER BY FIELD(c.c_type, '중형', '대형')`;
                    break;
                case 'suv':
                    type = 'SUV';
                    sql += `= ?`
                    break;
                case 'rv':
                    type = 'RV';
                    sql += `= ?`
                    break;
                case 'import':
                    type = '수입';
                    sql += `= ?`
                    break;
            }

            return con.query(sql, type, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }
    },
    price_all: (callback) => {
        const sql = init_sql + 
                    `ORDER BY rs.rs_price ASC`;
        
        return con.query(sql, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
    price_other: (type, callback) => {
        let sql = init_sql;

        if(type == 'elec'){
            sql += `AND c.c_fuel = '전기'
                    ORDER BY rs.rs_price ASC'`;

            return con.query(sql, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }
        else{
            sql += `AND c.c_type `;

            switch(type){
                case 'small':
                    type = ['경형', '소형'];
                    sql += `IN (?, ?)
                            ORDER BY FIELD(c.c_type, '경형', '소형'), rs.rs_price ASC`; 
                    break;
                case 'middle':
                    type = '준중형';
                    sql += `= ? ORDER BY rs.rs_price ASC`
                    break;
                case 'big':
                    type = ['중형', '대형'];
                    sql += `IN (?, ?)
                            ORDER BY FIELD(c.c_type, '중형', '대형'), rs.rs_price ASC`;
                    break;
                case 'suv':
                    type = 'SUV';
                    sql += `= ? ORDER BY rs.rs_price ASC`
                    break;
                case 'rv':
                    type = 'RV';
                    sql += `= ? ORDER BY rs.rs_price ASC`
                    break;
                case 'import':
                    type = '수입';
                    sql += `= ? ORDER BY rs.rs_price ASC`
                    break;
            }

            return con.query(sql, type, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }
    },
    findOne: (index, callback) => {
        const sql = `SELECT * 
                     FROM car 
                     WHERE c_index = ?`;

        return con.query(sql, index, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
};