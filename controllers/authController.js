const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../model/userModel");

exports.getSignIn = (req, res, next) => {
  res.status(400).render("auth/login", {
    pageTitle: "Login",
    emailErr: "",
    passwordErr: "",
    oldInput: {
      userMail: "",
      passWord: "",
    },
  });
};

exports.getSignUp = (req, res, next) => {
  let errs = {
    userNameErr: null,
    emailErr: null,
    passwordErr: null,
  }
  res.status(400).render("auth/register", {
    pageTitle: "Register",
    message: errs,
    oldInput: {
      userMail: "",
      userName: "",
      passWord: "",
    },
  });
};

exports.postSignUp = async (req, res, next) => {
  const userMail = req.body.userMail.toLowerCase();
  const userName = req.body.userName;
  const passWord = req.body.passWord;
  const error = validationResult(req);

  const userNameErr =
    error.mapped().userName != undefined ? error.mapped().userName.msg : null;
  const emailErr =
    error.mapped().userMail != undefined ? error.mapped().userMail.msg : null;
  const passwordErr =
    error.mapped().passWord != undefined ? error.mapped().passWord.msg : null;

  if (!error.isEmpty()) {
    let errs = {
      userNameErr,
      emailErr,
      passwordErr,
    };

    return res.status(400).render("auth/register", {
      pageTitle: "Register",
      message: errs,
      oldInput: {
        userMail,
        userName,
        passWord,
      },
    });
  }

  try {
    const hashedPass = await bcrypt.hash(passWord, 12);
    const user = new User({
      userName,
      userMail: userMail,
      passWord: hashedPass,
    });
    await user.save();
    res.redirect("/login");

  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postSignIn = async (req, res, next) => {
  const userMail = req.body.userMail.toLowerCase();
  const passWord = req.body.passWord;

  try {
    const user = await User.findOne({ userMail });
    if (!user) {
      return res.status(400).render("auth/login", {
        pageTitle: "Login",
        emailErr: "No user was found with this Email",
        passwordErr: "",
        oldInput: {
          userMail,
          passWord,
        },
      });
    }
    const isMatch = await bcrypt.compare(passWord, user.passWord);

    if (isMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      res.redirect("/");
    } else {
      return res.status(400).render("auth/login", {
        pageTitle: "Login",
        emailErr: "",
        passwordErr: "Invalid Email or Password!",
        oldInput: {
          userMail,
          passWord,
        },
      });
    }
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getIndex = async (req, res, next) => {
  let remainingCards = 7 - req.user.cardsUsed.length;

  let user = {
    name: req.user.userName,
    cardsUsed: req.user.cardsUsed.length,
    id: req.user._id,
    mail: req.user.userMail,
    remainingCards,
  }
  res.status(400).render("index", {
    pageTitle: "Home",
    user,

  });
}


