let nodemailer = require("nodemailer");

let transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS
  }
});

//Hay que mover el link de local a remoto

exports.sendActivationMail = function(name, email, confirmationCode) {
  transport
    .sendMail({
      from: "Jorge de Casa del Sol 🧒🏻👶🏻 <jorge@casadelsol.com>",
      bcc: email,
      subject: `Bienvenido, ${name}`,
      html: `<h3>Hola, ${name}! </h3>
           <p> Muchas gracias por estar interesado en unirte a nuestra causa, nuestros niños te lo agradecen mucho. </p>
           <p> Porfavor haz click en el link de confirmación abajo:</p>
           <a href="https://infinite-lowlands-77324.herokuapp.com/auth/confirm/${confirmationCode}">Haz click aqui!</a>
    
    `
    })
    .then(r => console.log(r))
    .catch(e => console.log(e));
};



exports.sendUpdateEmail = function (name, email){
  transport
      .sendMail({
        from:"Jorge de Casa del Sol 🧒🏻👶🏻 <jorge@casadelsol.com>",
        bcc: email,
        subject: `Tenemos una noticia para ti, ${name}`,
        html: `<h3>Hola, ${name}! </h3>
        <p> Acabamos de actualiar la galería de tu ahijado accede a tu cuenta para poder ver el mensaje :)</p> 
        `
      })
}