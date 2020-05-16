var mongoose = require('mongoose');
var User = mongoose.model('User');

const registerUser = (req, res, next) => {
    if (req.body.username &&
        req.body.password) {
        var userData = {
          username: req.body.username,
          password: req.body.password
        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
          if (err) {
            console.log(err)
            return res.redirect('/user');
          } else {
            return res.redirect('/user');
          }
        });
      }
};

const loginUser = (req, res, next) => {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          var err = new Error('Wrong username or password.');
          err.status = 401;
          console.log(err);
          return res.redirect('/user')
        } else {
            req.session.userId = user.username;
            console.log(req.session.userId);
            return res.redirect('/');
        }
      });
};

const dataUser = (req, res, next) => {
    User.findOne({username: req.session.userId})
    .then(result => {
        res.send(result);
      })
      .catch(err => console.error("failed to find document"));
};

module.exports = {
    registerUser,
    loginUser,
    dataUser
};