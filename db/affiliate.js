const express = require("express");

module.exports = {
    one: () => {
        const sql = `SELECT * 
        FROM affiliate 
        WHERE a_index = ?`;
        
        return sql;
    },
};