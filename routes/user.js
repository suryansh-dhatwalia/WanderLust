const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const userController = require("../controller/user.js");


router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.Login
  );

router.route("/logout").get(userController.logOut);

module.exports = router;
