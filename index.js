require("dotenv").config();
// const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const cron = require('node-cron');


const adminController = require("./controllers/adminController")


const User = require("./model/userModel");
const authRoutes = require("./routes/authRoutes");
const cardRoutes = require("./routes/cardRoutes");
const errorController = require('./controllers/errorController');

const app = express();
const config = process.env;
app.set("view engine", "ejs");
app.set("views", "views");
const MONGO_URI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@node-learning.kxjrf.mongodb.net/${config.MONGO_DB}?retryWrites=true&w=majority`;
const store = new mongoSession({
    uri: MONGO_URI,
    collection: "session",
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(express.static('public'))
app.use(
    session({
        secret: `${config.SECRET_KEY}`,
        resave: false,
        saveUninitialized: false,
        store,
    })
);

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn;
    next();
});

app.use(async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user._id);
        req.user = user;
        next();
    } catch (err) {
        next(new Error(err))
    }
});

app.use(authRoutes);
app.use(cardRoutes);
app.use(errorController.get404)

app.use((error,req,res,next)=>{
    console.log(error);
    res.status(500).render('error/505',{
        pageTitle: 'Error 505',
        path:'',
        isLoggedIn: req.session.isLoggedIn
    })
})

cron.schedule('0 0 28 * *', function() {
    adminController.updateMax()
  });

mongoose.connect(MONGO_URI).then((result) => {
    console.log("DB Connected");
    app.listen(config.PORT, () => {
        console.log(`Server running on ${config.PORT}`);
    });
});