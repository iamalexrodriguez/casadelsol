exports.isRole = function(role){
  console.log(role)
  return(req,res,next)=>{
    if(req.user.role === role)  next()
    else (res.redirect('/'))
  }
}

exports.isActive = function(active){
  return (req,res,next) =>{
    if(req.user.status === active) next()
    //Sustituir por una vista mas linda
    else res.render('auth/forceconfirm')
    //else res.send('Porfavor activa tu cuenta, user')
  }
}