const express = require("express");

module.exports = {
    response404Error: (res) => {
        res.status(404).send({code: "404 NOT FOUND ERROR"});
    },
    response501Error: (res, msg) => {
        res.status(501).send({code: "501 ERROR", errorMessage: msg});
    },
    response406Error: (res) => {
        res.status(406).send({code: "INJECTION ERROR"});
    },
};