const express = require("express");

module.exports = {
    response404Error: (res) => {
        const code = "NOT FOUND";
        res.status(404).send({code: code});
    },
    response501Error: (res, msg) => {
        const code = "501 ERROR";
        const errorMsg = msg;
        res.status(501).send({code: code, errorMessage: errorMsg});
    },
    response406Error: (res) => {
        const code = "INJECTION ERROR";
        res.status(406).send({code: code});
    },
};