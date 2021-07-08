const express = require("express");

module.exports = {
    popular: () => {
        const sql = `SELECT DISTINCT l_subname 
                     FROM location 
                     WHERE l_popular_or_not = 'y'`;

        return sql;
    },
    othertype: () => {
        const sql = `SELECT DISTINCT l_name, l_immediate_or_not 
                     FROM location
                     WHERE l_type = ?`;         
                                 
        return sql;
    },
};
