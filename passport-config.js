const passport = require("passport")
const bcrypt = require("bcrypt")
const local = require("passport-local").Strategy

function initialize(passport){
    const authenticateUser = async (username, password, done) => {
        try {
            const findUser = `SELECT hashedpassword FROM users WHERE username="${username}"`
            
            db.query(findUser, async (err, results) => {
              if (err) {
                console.error(err);
                return next(err);
              }
              if (results.length === 0) {
                done(null, false, { message: "User not registered" });
              } else {
                const result = await bcrypt.compare(password, results[0].hashedpassword)
                if (result) {
                  done(null, results[0]);
                } else {
                  done(null, false, { message: "Incorrect Password" });
                }
              }
            });
          } catch (error) {
            console.error(error);
            done(error);
          }
    }
    passport.use(new local({usernameField: "username", passwordField: "password"}, authenticateUser))
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}


module.exports = initialize