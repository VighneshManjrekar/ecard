require("dotenv").config();
const config = process.env;
const path = require('path')
const nodemailer = require("nodemailer");
const User = require("../model/userModel");

exports.thankYou = (req, res, next) => {
    

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'thankYou',
        cards: ['https://images.unsplash.com/photo-1549032305-e816fabf0dd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1602045486350-4e53a69865c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1586810165616-94c631fc2f79?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1521685468847-de0a1a3c41a8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1620843437920-ead942b3abd3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
            'https://images.unsplash.com/photo-1549032305-e816fabf0dd2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80']
    });
};
exports.wellDone = (req, res, next) => {

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'wellDone',
        cards: ['coi.png', 'coa.png', 'coi.png', 'coi.png', 'coi.png', 'coi.png']
    });
};

exports.excellence = (req, res, next) => {

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'excellence',
        cards: ['s1.jpg', 's1.jpg', 's2.jpg', 's1.jpg', 's1.jpg', 's1.jpg']
    });
};
exports.attitude = (req, res, next) => {

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'attitude',
        cards: ['s2.jpg', 's2.jpg', 's1.jpg', 's2.jpg', 's2.jpg', 's2.jpg']
    });
};
exports.teamWork = (req, res, next) => {

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'teamWork',
        cards: ['wel.png', 'thank.jpg', 'wel.png', 'wel.png', 'wel.png', 'wel.png']
    });
};
exports.leader = (req, res, next) => {

    let user = {
        name: req.user.userName,
        mail: req.user.userMail
    }
    res.render("cards", {
        pageTitle: "title",
        user,
        cardType: 'leader',
        cards: ['thank.jpg', 's2.jpg', 'thank.jpg', 'thank.jpg', 'thank.jpg', 'thank.jpg']
    });
};

exports.sendMail = async (req, res, next) => {
    const sendTo = req.body.recieverMail;
    const sub = req.body.mailSubject;
    const from = req.user.userMail;
    const cardType = req.body.cardType;
    const cardImg = req.body.cardImg;
    const name = req.user.userName;
    const filePath = path.join(__dirname, "test1.ejs")

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${config.MAIL}`,
            pass: `${config.MAIL_PASS}`
        }
    });
    const ejs = require("ejs");
    const data = await ejs.renderFile(filePath, { cardType, cardImg, name });

    const mailOptions = {
        from,
        to: sendTo,
        subject: sub,
        cc: req.user.userMail,
        html: data
    };
    try {
        const userExist = await User.findOne({userMail:sendTo})
        if(!userExist){
            return res.status(500).json({msg:"User Don't exists"})
        }
        await transporter.sendMail(mailOptions)
        await req.user.addCard(sendTo, cardType)
        const recievedUser = await User.findOne({userMail:sendTo})
        recievedUser.cardsRecieved[cardType].qty +=1
        recievedUser.cardsRecieved[cardType].sentBy.push(from)
        await recievedUser.save()
        return res.status(200).json({user:req.user})
        // return res.redirect('/');
    }
    catch (err) {
        
        return res.status(500).json({msg:err})
        // const error = new Error(err);
        // error.httpStatusCode = 500;
        // return next(error);
    }


}
