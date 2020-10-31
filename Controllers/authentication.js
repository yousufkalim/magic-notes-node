//Users will not be able to access the pages that needs login
exports.checkAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.set('cache-control', 'no-cache, no-store, private, must-revalidate, post-check=0, pre-check=0');
        next();
    }else{
        res.redirect('/');
    }
};


//Users will not be able to access login/register page if they already logged in
exports.loginPageAuth = (req, res, next) => {
    if (req.isAuthenticated()){
        res.redirect('/notes');
    }else{
        next();
    }
};