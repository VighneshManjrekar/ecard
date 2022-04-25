module.exports = (req,res,next) =>{

    if(!req.session.isLoggedIn){
        console.log('ok')
        return res.status(401).json({msg:"Unauthorized"});
    }
    next();
}