const router = require("express").Router();
const User = require("../models/User");
const Child = require("../models/Child");
const Post = require("../models/Post");
const uploadCloud = require("../helpers/cloudinary");
let { sendUpdateEmail } = require("../helpers/mailer");

//hay que agregar auth

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

router.get("/addpost/:id", (req, res, next) => {
  const { id } = req.params;
  res.render("admin/addpost", { id });
});



router.post("/addpost/:id", uploadCloud.single("photoURL"), (req, res, next) => {
  const { id } = req.params;
  //const {name} = req.body.username
  //const {email} = req.body.email
 // console.log(email, name)
 //Elaborar un array de correos
 //populate sponsors
  console.log(id);
  Post.create({ ...req.body, photoURL: req.file.url })
    .then(doc => {
      console.log(doc);
      Child.findByIdAndUpdate(
        id,
        { $push: { pictureGallery: doc._id } },
        { new: true }
      )
      .then(()=>{
        //!
        //sendUpdateEmail(name, email),
        res.redirect(`/children/gallery/${id}`);})
    .catch(e => next(e));
    })
    .catch(error => {
      res.render("/", { error });
    });
});

router.post("/addsponsor/:id", (req, res, next) => {
  const { id } = req.params;
  console.log(req.body.gestionpadrinos);
  const padrinos = req.body.gestionpadrinos;
  Child.findByIdAndUpdate(id, { $set: { sponsors: padrinos } }, { new: true })
    .then(() => {
      res.redirect(`/children/detail/${id}`);
    })
    .catch(error => {
      console.log(error);
      res.render("/", { error });
    });
});

router.post("/removesponsor/:id", (req, res, next) => {
  const { id } = req.params;
  const padrinos = req.body.gestionpadrinos;
  Child.findByIdAndUpdate(
    id,
    { $pull: { sponsors: { $in: padrinos } } },
    { multi: true }
  )
    .then(() => {
      res.redirect(`/children/detail/${id}`);
    })
    .catch(error => {
      console.log(error);
      res.render("/children", { error });
    });
});

router.get("/api/child/:id", (req, res) => {
  console.log(req.params.id);
  Child.findById(req.params.id).then(child => res.json(child));
});

router.get("/sponsors/:id", (req, res, next) => {
  const { id } = req.params;
  let users;
  User.find()
    .then(u => {
      users = u;
      return Child.findById(id);
    })
    .then(child => {
      // console.log(users, child);
      res.render("admin/sponsorview", {
        users,
        child
      });
    })
    .catch(error => {
      res.render("admin/sponsorview", { error });
    });
});

router.get("/detail/:id", (req, res, next) => {
  const { id } = req.params;
  User.findById();
  Child.findById(id)
    .populate("sponsors")
    .then(child => {
      res.render("admin/detailchild", child);
    })
    .catch(error => {
      res.render("admin/detailchild", { error });
    });
});

router.get("/delete/:id", (req, res, next) => {
  Child.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/children");
    })
    .catch(error => {
      res.render("/", { error });
    });
});

router.get("/", (req, res, next) => {
  Child.find()
    .then(children => {
      res.render("admin/panel", { children });
    })
    .catch(error => {
      res.render("admin/panel", { error });
    });
});

router.get("/create", (req, res, next) => {
  res.render("admin/addchild");
});

router.post("/create", uploadCloud.single("profilePic"), (req, res, next) => {
  Child.create({ ...req.body, profilePic: req.file.url })
    .then(res.redirect("/children"))
    .catch(error => {
      res.render("/", { error });
    });
});

module.exports = router;
