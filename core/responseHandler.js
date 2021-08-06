const express = require("express");

module.exports = {
    responseNotFoundError: (res) => {
        res.status(404).send({code: "404 NOT FOUND ERROR"});
    },
    responseValidateError: (res, code, msg) => {
        res.status(code).send({code: `${code} VALIDATION FAIL ERROR`, errorMessage: msg});
    },
    responseInjectionError: (res) => {
        res.status(406).send({code: "406 INJECTION ERROR"});
    },
};