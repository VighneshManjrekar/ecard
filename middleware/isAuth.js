module.exports = (req,res,next) =>{

    if(!req.session.isLoggedIn){
        console.log('ok')
        return res.redirect('/login');
    }
    next();
}