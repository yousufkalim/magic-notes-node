//Init
const router = require('express').Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const users = require('../Model/users');
require('./passport')(passport);
const { checkAuth, loginPageAuth } = require('./authentication');
const notesController = require('./notes')



//Middleware
router.use(bodyParser.urlencoded({ extended : true }));
router.use(cookieParser(process.env.SESSION_KEY || "fvhsk5kj3j6k4b3k35"));
router.use(session({
    secret : process.env.SESSION_KEY || "fvhsk5kj3j6k4b3k35",
    maxAge : 3600000,
    resave : true,
    saveUninitialized : true
}));


//Passport Stuff
router.use(passport.initialize());
router.use(passport.session());

//Flash
router.use(flash());
router.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
});



/*
=============
Routes
=============
*/

//register Page
router.get('/', loginPageAuth, (req, res) => {
    res.status(200).render('login', { successMessage : req.flash('message')});
});
router.get('/login', (req, res) => {
    res.redirect('/');
});



// Auth
router.post('/', loginPageAuth, (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect : '/',
        successRedirect : '/notes',
        failureFlash : true
    })(req, res, next);
});


// Page
router.get('/register', loginPageAuth, (req, res) => {
    res.status(200).render('register');
});


//Register
router.post('/register', loginPageAuth,
    [
        //Validation
        check('name').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail(),
        check('password').not().isEmpty().trim().escape(),
        check('confirmPassword').not().isEmpty().trim().escape()
    ],
    (req, res) => {
        let { name, email, password, confirmPassword } = req.body;
        const validationError = validationResult(req);
        let err;
        if(!validationError.isEmpty()){
            //If validation failed
            err = 'All fields must filled...';
            res.status(200).render('register', { err : err, name : name, email : email });
        }else{
            //if validation success
            if (password !== confirmPassword) {
                //if password not matched
                err = 'Password not matched...';
                res.status(200).render('register', { err : err, name : name, email : email });
            }else{
                //finding user to check if user already exist.
                users.findOne({email : email}, (userErr, user) => {
                    if (userErr) throw err;
                    if(user){
                        //if user already exist
                        err = 'User already exist with this email...';
                        res.status(200).render('register', { err : err, name : name, email : email});
                    }else{
                        //if everything Ok
                        const hashedPassword = bcrypt.hashSync(password, 10);
                        users.create(
                            {
                                name : name,
                                email : email,
                                password : hashedPassword
                            },
                            (err) => {
                                if(err) throw err;
                                //if successfully registered.
                                req.flash('message', 'Registered successfully, Login to continue...');
                                res.redirect('/');
                            }
                        );
                    }
                });
            }
        }
    }
);


//Logout
router.get('/logout', checkAuth, (req, res) => {
    req.logout();
    res.redirect('/');
});


//Success Routes
router.get('/notes', checkAuth, notesController);
router.post("/notes", checkAuth, notesController);
router.put("/mark/:id", checkAuth, notesController);
router.delete("/delete/:id", checkAuth, notesController);
router.get("/update/:id", checkAuth, notesController);
router.put("/update/:id", checkAuth, notesController);


//404 Error Route
router.all('*', (req, res) => {
    res.status(404).render('error', { url : req.url })
})


/*
=================
Module Export
=================
*/
module.exports = router;