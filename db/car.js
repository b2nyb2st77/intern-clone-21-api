const express = require("express");
const sql_query = require("../db/car");

module.exports = {
    init: () => {
        const sql = `SELECT c.*, a.*, rs.rs_price 
           FROM rentcar_status rs, car c, affiliate a 
           WHERE rs.rs_c_index = c.c_index
           AND rs.rs_a_index = a.a_index `;
        return sql;
    },
    type_all: () => {
        const sql = `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
        return sql;
    },
    type_elec: () => {
        const sql = `AND c.c_fuel = '전기'`;                   
        return sql;
    },
    type_small: () => {
        const sql = `AND c.c_type = '경형' OR '소형'
                     ORDER BY FIELD(c.c_type, '경형', '소형')`;                 
        return sql;
    },
    type_middle: () => {
        const sql = `AND c.c_type = '준중형'`;                
        return sql;
    },
    type_big: () => {
        const sql = `AND c.c_type = '중형' OR '대형'
                     ORDER BY FIELD(c.c_type, '중형', '대형')`;             
        return sql;
    },
    type_suv: () => {
        const sql = `AND c.c_type = 'SUV'`;             
        return sql;
    },
    type_rv: () => {
        const sql = `AND c.c_type = 'RV'`;            
        return sql;
    },
    type_import: () => {
        const sql = `AND c.c_type = '수입'`;         
        return sql;
    },
    price_all: () => {
        const sql = `ORDER BY rs.rs_price ASC`;
        return sql;
    },
    price_elec: () => {
        const sql = `AND c.c_fuel = '전기'
                     ORDER BY rs.rs_price ASC`;           
        return sql;
    },
    price_small: () => {
        const sql = `AND c.c_type = '경형' OR '소형'
                     ORDER BY FIELD(c.c_type, '경형', '소형'), rs.rs_price ASC`;           
        return sql;
    },
    price_middle: () => {
        const sql = `AND c.c_type = '준중형'
                     ORDER BY rs.rs_price ASC`;          
        return sql;
    },
    price_big: () => {
        const sql = `AND c.c_type = '중형' OR '대형'
                     ORDER BY FIELD(c.c_type, '중형', '대형'), rs.rs_price ASC`;       
        return sql;
    },
    price_suv: () => {
        const sql = `AND c.c_type = 'SUV'
                     ORDER BY rs.rs_price ASC`;        
        return sql;
    },
    price_rv: () => {
        const sql = `AND c.c_type = 'RV'
                     ORDER BY rs.rs_price ASC`;           
        return sql;
    },
    price_import: () => {
        const sql = `AND c.c_type = '수입'
                     ORDER BY rs.rs_price ASC`;         
        return sql;
    },
    one: () => {
        const sql = `SELECT * 
                     FROM car 
                     WHERE c_index = ?`;       
        return sql;
    },
};