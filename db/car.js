const express = require("express");
const mysql = require("../db/mysql");
const connection = mysql.init();

const init_sql = `SELECT c.*, a.*, rs.rs_price 
                  FROM rentcar_status rs, car c, affiliate a 
                  WHERE rs.rs_c_index = c.c_index
                        AND rs.rs_a_index = a.a_index `;

module.exports = {
    // 차량리스트 나열하기
    findCars: (order, type, callback) => {
        let sql = init_sql;

        // 모든 차종
        if (type == '' || type == null) {
            // 차종순
            if (order === 'type') {
                sql += `ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV')`;
            }
            // 가격순
            else if (order === 'price') {
                sql += `ORDER BY rs.rs_price ASC`;
            }
            // 인기순 (sql문 맞는지 점검필요)
            else if (order == 'popular'){
                sql += `ORDER BY FIELD(c.c_name, (SELECT c.c_name
                                                  FROM rentcar_status rs, car c, rentcar_reservation rr
                                                  WHERE rs.rs_c_index = c.c_index
                                                        AND rs.rs_index = rr.rr_rs_index
                                                        AND rr.rr_cancel_or_not = 'n'
                                                  GROUP BY c.c_name
                                                  ORDER BY count(c.c_name) DESC))`;
            }
            // 예외처리 어떻게 할지 고민해보기
            else {
                return "error";
            }

            return connection.query(sql, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }
        // 전기(elec), 경소형(small), 준중형(middle), SUV(suv), 승합(rv), 수입(import)
        else {
            switch (type) {
                case 'elec':
                    sql += `AND c.c_fuel = '전기'`;
                    
                    if (order === 'price') {
                        sql += ` ORDER BY rs.rs_price ASC`;
                    }
                    
                    break;
                case 'small':
                    sql += `AND c.c_type IN ('경형', '소형')
                            ORDER BY FIELD(c.c_type, '경형', '소형')`;

                    if (order === 'price') {
                        sql += `, rs.rs_price ASC`;
                    }

                    break;
                case 'middle':
                    sql += `AND c.c_type = '준중형'`
                                        
                    if (order === 'price') {
                        sql += ` ORDER BY rs.rs_price ASC`;
                    }
                    
                    break;
                case 'big':
                    sql += `AND c.c_type IN ('중형', '대형')
                            ORDER BY FIELD(c.c_type, '중형', '대형')`;

                    if (order === 'price') {
                        sql += `, rs.rs_price ASC`;
                    }

                    break;
                case 'suv':
                    sql += `AND c.c_type = 'SUV'`
                                        
                    if (order === 'price') {
                        sql += ` ORDER BY rs.rs_price ASC`;
                    }
                    
                    break;
                case 'rv':
                    sql += `AND c.c_type = 'RV'`
                                        
                    if (order === 'price') {
                        sql += ` ORDER BY rs.rs_price ASC`;
                    }
                    
                    break;
                case 'import':
                    sql += `AND c.c_type = '수입'`
                                        
                    if (order === 'price') {
                        sql += ` ORDER BY rs.rs_price ASC`;
                    }
                    
                    break;
                default:
                    break;
            }

            return connection.query(sql, function(err, result){
                if(err) callback(err);
                else callback(null, result);
            });
        }

    },
    // 차량 하나의 정보 찾기
    findOneCar: (index, callback) => {
        const sql = `SELECT * 
                     FROM car 
                     WHERE c_index = ?`;

        return connection.query(sql, index, function(err, result){
            if(err) callback(err);
            else callback(null, result);
        });
    },
};