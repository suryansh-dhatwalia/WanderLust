module.exports.isLoggedIn = (req,res, next)=>{
        if(!req.isAuthenticated()){
            req.session.redirectedUrl = req.originalUrl;
        req.flash("error","You have not logged in to create a new listing");
        res.redirect("/login");
    }
    next();
}

module.exports.savedUrl = (req,res,next) =>{
    if(req.session.redirectedUrl){
        res.locals.redirectedUrl = req.session.redirectedUrl ;
    }
    next();
}