const router = require('express').Router()
const User = require('../models/User')
const Child = require('../models/Child')
const uploadCloud = require('../helpers/cloudinary')




router.post('/delete/:id', (req, res, next)=>{
  Child.findByIdAndRemove(req.params.id)
  .then(()=>{
    res.redirect('/')
  })
  .catch(error =>{
    res.render('/', {error})
  })
})

router.get('/', (req,res,next)=>{
  Child.find()
    .then(children =>{
      res.render('admin/panel', { children })
    })
    .catch(error =>{
      res.render('admin/panel', {error})
    })
})

router.get('/create', (req,res,next)=>{
  res.render('admin/addchild')
})



router.post('/create', uploadCloud.single('profilePic'),(req,res,next)=>{
  Child.create({...req.body, profilePic: req.file.url})
  .then(
    //Aqui podria ir agregar la relacion a padrino?
    //Como relaciono algo que este fuera de 
    res.redirect('/')
  )
  .catch(error =>{
    res.render('/', {error})
  })
})




module.exports = router