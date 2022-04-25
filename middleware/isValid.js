module.exports = (req, res, next) => {

    if (req.session.isLoggedIn) {
        if (req.user.cardsUsed >= 7) {
            return res.status(400).json({msg:"Cards not available"});
        }
    }
    next();
}