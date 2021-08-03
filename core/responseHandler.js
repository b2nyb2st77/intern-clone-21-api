const express = require("express");

module.exports = {
    response404Error: (res) => {
        res.status(404).send({code: "404 NOT FOUND ERROR"});
    },
    responseValidateError: (res, code, msg) => {
        res.status(code).send({code: code + " ERROR", errorMessage: msg});
    },
    response406Error: (res) => {
        res.status(406).send({code: "INJECTION ERROR"});
    },
};