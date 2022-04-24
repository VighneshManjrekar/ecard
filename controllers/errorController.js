const express = require('express');
const routes = express.Router()

exports.get404 = (req, res, next) => {
    res.status(404).render('error/404', {
        pageTitle: '404'
    })
}

exports.routes = routes;
