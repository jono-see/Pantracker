const express = require("express");

// create router
const userRouter = express.Router();

// load/import the author controller
const userController = require("../controller/userController.js");

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
// GET /logout
userRouter.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/');
        }
      });
    }
  });

  userRouter.get('/sessionId', function(req, res, next) {
      res.send(req.session.userId);
  });

  userRouter.get('/data', userController.dataUser);
  userRouter.get('/', function(req, res, next) {
    res.render('user');
});


module.exports = userRouter;
