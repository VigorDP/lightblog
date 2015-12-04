var passport = require('passport');
var GitHubStrategy = require('passport-github2').Strategy;

var User = require('../models/user');
var config = require('./config');
var init = require('./init');
init();// serialize user into the session
passport.use(new GitHubStrategy(
  {
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        console.log(profile)
        var _user={
            name: profile.displayName,
            email: profile.emails[0].value,
            head:profile._json.avatar_url
          }
          var user=new User(_user);
          user.save(function(err,user){
             return done(null, user);
          })
      });
  }
));
module.exports = passport;