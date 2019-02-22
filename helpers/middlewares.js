exports.isRole = function(role){
  return(req,res,next)=>{
    if(req.user.role === role)  next()
    else (res.redirect('/'))
  }
}

exports.isActive = function(active){
  return (req,res,next) =>{
    console.log(active)
    if(req.user.status === active) next()
    else res.render('auth/forceconfirm')
  }
}