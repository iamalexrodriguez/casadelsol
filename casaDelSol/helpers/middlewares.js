exports.isRole = function(role){
  return(req,res,next)=>{
    if(req.user.role === role) next()
    else (res.redirect('/'))
  }
}

exports.isActive = function(active){
  return (req,res,next) =>{
    if(req.user.status === active) next()
    //Sustituir por una vista mas linda
    else res.send('Porfavor activa tu cuenta')
  }
}