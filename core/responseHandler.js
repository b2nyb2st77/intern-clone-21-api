const express = require("express");

module.exports = {
    response404Error: (res) => {
        res.status(404).send("NOT FOUND\n");
    },
    response501Error: (res) => {
        res.status(501).send("ERROR\n");
    },
    response406Error: (res) => {
        res.status(406).send("INJECTION ERROR\n");
    },
};