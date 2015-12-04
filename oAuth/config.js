var ids = {
        github: {
          clientID: '75bd2504cf265c5960ed',
          clientSecret: 'a0090082954f055de914a35afa7a55940036024a',
          callbackURL: "http://mylightblog.herokuapp.com/auth/github/callback"
        },
        google: {
          clientID: '539119632438-s55kekll56cami5api29bc31krrab7vu.apps.googleusercontent.com',
          clientSecret: 'tJbVNE8EZzbF9OI6k8YMbL4G',
          callbackURL: "http://127.0.0.1:3000/auth/google/callback"
        }
        // twitter: {
        //   consumerKey: 'get_your_own',
        //   consumerSecret: 'get_your_own',
        //   callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
        // }
};

module.exports = ids;