const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Child = require("../models/Child");
let { sendActivationMail } = require("../helpers/mailer");
const { isActive } = require("../helpers/middlewares");
const { isRole } = require("../helpers/middlewares");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Middleware Loggedin

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send("Contenido privado, no has hecho sign in");
  }
}

function isAdmin(req, res, next) {
  if (req.user.role === "ADMIN") res.redirect("/children");
  else res.redirect("/");
}
//Create confirmation code
function generateCode() {
  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

//Testing a private page in case there is a logged user with an active accountcode
router.get("/private", isLoggedIn, isActive("Active"), (req, res) => {
  res.render("profile/private");
});

//Confirmation route

router.get("/confirm/:confirmCode", (req, res, next) => {
  let confirmCode = req.params.confirmCode;
  User.findOneAndUpdate(
    { confirmationCode: confirmCode },
    { $set: { status: "Active" } },
    { new: true }
  )
    .then(r => res.render("auth/confirmation"))
    .catch(e => next(e));
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});



router.post(
  "/login",
  passport.authenticate("local"),
  isActive("Active"),
  (req, res, next) => {
    if (req.user.role === "ADMIN") return res.redirect("/children");
    const email = req.body.email;
    User.findOne({ email: email })
      .then(r => {
        res.redirect("/profile");
      })
      .catch(e => next(e));
  }
);


router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (email === "" || password === "") {
    res.render("auth/signup", {
      message: "Es necesario indicar un email y contraseña"
    });
    return;
  }

  User.findOne({ email }, "email", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", {
        message: "Este email ya lo tenemos dado de alta en una cuenta :)"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    let confirmationCode = generateCode();

    const newUser = new User({
      username,
      email,
      confirmationCode,
      password: hashPass
    });

    let data = {
      name: username
    };

    newUser
      .save()
      .then(() => {
        res.render("auth/confirm", data);
        sendActivationMail(username, email, confirmationCode);
      })
      .catch(err => {
        res.render("auth/signup", {
          message: "Algo salio mal al darte de alta"
        });
      });
  });
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
