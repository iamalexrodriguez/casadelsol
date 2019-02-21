const router = require("express").Router();
const User = require("../models/User");
const Child = require("../models/Child");
const Post = require("../models/Post");
const uploadCloud = require("../helpers/cloudinary");

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

//revisar post
router.post("/addpost/:id", uploadCloud.single("photoURL"), (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  Post.create({ ...req.body, photoURL: req.file.url })
    .then(doc => {
      console.log(doc);
      Child.findByIdAndUpdate(
        id,
        { $push: { pictureGallery: doc._id } },
        { new: true }
      )
      .then(()=>{res.redirect(`/children/gallery/${id}`);})
      .catch(()=>{res.render("/", { error });})
    })
    .catch(error => {
      res.render("/", { error });
    });
});

router.post("/addsponsor/:id", (req, res, next) => {
  const { id } = req.params;
  const padrinos = req.body.gestionpadrinos;
  Child.findByIdAndUpdate(id, { $push: { sponsors: padrinos } }, { new: true })
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
  console.log(padrinos)
  // Child.findByIdAndUpdate(id, { $pull: { sponsors: padrinos } }, { new: true })

  //!!
  Child.findByIdAndUpdate(id,{$pull: {sponsors : { in: [padrinos]}}}, {multi:true})
    .then(() => {
      res.redirect(`/children/detail/${id}`);
    })
    .catch(error => {
      console.log(error);
      res.render("/children", { error });
    });
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
      res.render("admin/sponsorview", { users, child });
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
