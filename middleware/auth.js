module.exports = function(req, res, next) {
    if(!req.session.isAuth){
        req.session.isAuthenticated = false;
        return res.redirect('/auth/login');
    } else {
        req.session.isAuthenticated = true;
    }
    
    next();
}