const express = require("express");

const routes = express.Router();

const { check } = require('express-validator');

const authController = require("../controllers/authController");
const User = require("../model/userModel");

const isAuth = require("../middleware/isAuth");


routes.get('/', isAuth, authController.getIndex)

routes.get("/register", authController.getSignUp);

routes.post("/register", [

    check('userName')
        .custom((val, { req }) => {
            if (val == '') {
                throw new Error('Enter Your Name!')
            } else {
                return true;
            }
        })
        .trim(),

    check('userMail')
        .isEmail()
        .withMessage('Enter a valid Email!')
        .custom((val, { req }) => {
            return User.findOne({ userMail: val }).then(user => {
                if (user) {
                    return Promise.reject('Email is already in use');
                }
            })
        }),

    check('passWord')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password should contain more than 6 characters!'),
], authController.postSignUp);

routes.get("/login", authController.getSignIn);

routes.post("/login", authController.postSignIn);

routes.post('/logout', authController.postLogout);

module.exports = routes;