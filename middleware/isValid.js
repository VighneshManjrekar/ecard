module.exports = (req, res, next) => {

    if (req.session.isLoggedIn) {
        if (req.user.cardsUsed >= 7) {
            return res.redirect('/');
        }
    }
    next();
}