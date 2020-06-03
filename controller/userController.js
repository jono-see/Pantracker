var mongoose = require('mongoose');
var User = mongoose.model('User');


const registerUser = async (req, res, next) => {
    // Ensure all fields are there
    var exists = await User.exists({username: req.body.username});
    if (!(req.body.username && req.body.password)) {
        res.render('user', {
            registerMessage: "Email and password required"
        });
    }
    // Ensure email is not already in database
    else if (exists) {
        res.render('user', {
            registerMessage: "Email address already registered"
        })
    } else {
        var userData = {
            username: req.body.username,
            password: req.body.password
        };
        //use schema.create to insert data into the db
        await User.create(userData, function (err, user) {
            if (err) {
                return res.render('error', {
                    message: "Error creating account"
                });
            } else {
                req.session.userId = userData.username;
                return res.redirect('/');
            }
        });
    }
};

const loginUser = (req, res, next) => {
    User.authenticate(req.body.username, req.body.password, function (error, user) {
        if (error || !user) {
          return res.render('user', {
              loginMessage:"Invalid email or password"
          });
        } else {
            req.session.userId = user.username;
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