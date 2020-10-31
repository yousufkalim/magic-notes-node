//Local Authentication for user login page
//init
const bcrypt = require('bcryptjs');
const users = require('../Model/users');
const LocalStrategy = require('passport-local').Strategy;



//Strategy
module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField : 'email'}, (email, password, done) => {
        //finding user to check if email is correct
        users.findOne({email : email}, (err, data) => {
            if (err) throw err;
            if (!data) {
                //if no user found with provided email.
                return done(null, false, { message : 'User not exist...'});
            }else if(data){
                //Comparing password if user found
                bcrypt.compare(password, data.password, (err, match) => {
                    if (err) {
                        //if error
                        return done(null, false);
                    }else if(!match){
                        //if password incorrect
                        return done(null, false, { message : 'Password is incorrect' });
                    }else if(match){
                        //if password matched
                        return done(null, data);
                    }
                });
            }
        });
    }));

    //Serialize User
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });


    //Deserialize User
    passport.deserializeUser((id, done) => {
        users.findById(id, (err, user) => {
            done(err, user);
        });
    });
};