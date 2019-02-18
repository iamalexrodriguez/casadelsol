const router = require("express").Router();
const User = require("../models/User");
const Child = require("../models/Child");
const uploadCloud = require("../helpers/cloudinary");


//hay que agregar auth
router.post('/addsponsor/:id', (req, res, next)=>{
  console.log(req.params)
  const {id} = req.params
  const padrinos = req.body.gestionpadrinos

  console.log('duv')
  console.log(padrinos)
  Child.findByIdAndUpdate(id,{$push:{sponsors:padrinos}}, {new:true})
  .then(() => {
    res.redirect(`/children/detail/${id}`)
  })
  .catch(error => {
    console.log(error)
    es.render("/", { error });
  });

})


router.get('/sponsors/:id', (req,res,next)=>{
  const {id} = req.params
  let users 
  User.find()
  .then((u)=>{
    users = u
    return Child.findById(id) 
  }) 
  .then(child=>{
    res.render('admin/sponsorview', {users, child})
  })
  .catch(error=>{
    res.render('admin/sponsorview', {error})
  })

})

//Backup
// router.get('/detail/:id', (req,res,next)=>{
//   const{id} = req.params
//   Child.findById(id)
//     .then((child)=>{
//       res.render('admin/detailchild', child)
//     })
//     .catch(error=>{
//       res.render('admin/detailchild', {error})
//     })
// })

router.get('/detail/:id', (req,res,next)=>{
  const{id} = req.params
  Child.findById(id)
    .then((child)=>{
      res.render('admin/detailchild', child)
    })
    .catch(error=>{
      res.render('admin/detailchild', {error})
    })
})

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
    .then(
      //Aqui podria ir agregar la relacion a padrino?
      //Como relaciono algo que este fuera de
      res.redirect("/children")
    )
    .catch(error => {
      res.render("/", { error });
    });
});

module.exports = router;
