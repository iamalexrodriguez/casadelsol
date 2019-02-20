const router = require("express").Router();
const User = require("../models/User");
const Child = require("../models/Child");
const Post = require("../models/Post");
const passport = require("passport");
const { isActive } = require("../helpers/middlewares");
const uploadCloud = require("../helpers/cloudinary");


router.get("/gallery/:id", (req, res, next) => {
  const { id } = req.params;
  Child.findById(id)
    .populate("pictureGallery")
    .then(child => {
      console.log(child);
      res.render("user/gallery", child);
    })
    .catch(e => next(e));
});

router.get("/", (req, res, next) => {
  Child.find({ sponsors: req.user._id })
    .then(children => {
      res.render("user/profile", { user: req.user, children });
    })
    .catch(e => next(e));
});

module.exports = router;
