const express = require("express");

const routes = express.Router();
const { check } = require('express-validator');
const User = require("../model/userModel");

const cardController = require("../controllers/cardController");

const isAuth = require("../middleware/isAuth");

const isValid = require("../middleware/isValid");

routes.get('/thank-you', isAuth, isValid, cardController.thankYou);

routes.get('/well-done', isAuth, isValid, cardController.wellDone);

routes.get('/excellence', isAuth, isValid, cardController.excellence);

// routes.get('/team-work', isAuth, isValid, cardController.teamWork);

routes.get('/attitude', isAuth, isValid, cardController.attitude);

routes.get('/leader', isAuth, isValid, cardController.leader);

routes.post('/send-mail', isAuth, isValid, [check('recieverMail')
    .isEmail()
    .withMessage('Enter a valid Email!')
    .custom((val, { req }) => {
        return User.exists({ userMail: val }).then(user => {
            if (!user) {
                return Promise.reject('User doesn\'t exists');
            } else if (req.user.userMail == val) {
                return Promise.reject('You can\t send mail to yourself!');
            }
        })
    })
], cardController.sendMail);

module.exports = routes;

// db.sales.aggregate( [
//     {
//       $group: {
//          _id: null,
//          count: { $count: { } }
//       }
//     }
//   ] )

// //   allUSers = db.users.aggregate( [ { $unwind : "$cardsRecieved" } ] ).limit(1)
// //   allUSers.sort({qty:-1}).limit(1)