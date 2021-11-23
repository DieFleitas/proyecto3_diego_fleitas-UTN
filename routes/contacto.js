var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contacto', {
    isContacto: true
  });
});

router.post('/', async(req, res, next) => {
  console.log(req.body);
  var nombre = req.body.nombre;
  var email = req.body.email;
  var tel = req.body.tel;
  var comentarios = req.body.comentarios;

  var obj = {
    to: 'fleitasdiegoariel98@gmail.com',
    subject: 'CONTACTO WEB',
    html: `${nombre} se contacto a traves de la pagina y quiere saber mas info a este email ${email}. Ademas, hizo el siguiente comentario: "${comentarios}".Su numero de telefono es: ${tel} .`
  }

  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  var info = await transport.sendMail(obj);

  res.render('contacto', {
    message: 'Mensaje enviado'
  })
})

module.exports = router;
