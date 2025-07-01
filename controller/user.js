const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup");
}

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        } else {
          req.flash("success", "Welcome to WanderLust!");
          res.redirect("/listings");
        }
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }


  module.exports.renderLoginForm =  (req, res) => {
  res.render("users/login");
}

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome Back to WanderLust!");
    const redirectedUrl = res.locals.redirectedUrl || "/listings"
    res.redirect(redirectedUrl);
  }

module.exports.logOut =  (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You have been logged out successfully");
      res.redirect("/listings");
    }
  });
}