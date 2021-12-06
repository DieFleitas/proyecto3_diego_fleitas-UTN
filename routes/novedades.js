var express = require('express');
var router = express.Router();
var novedadesModel = require('../models/novedadesModel')

/* GET home page. */
router.get('/',  async function(req, res, next) {
  // var novedades = await novedadesModel.getNovedades()
  var novedades;
  if (req.query.q === undefined) {
    novedades = await novedadesModel.getNovedades();
  } else {
    novedades = await novedadesModel.buscarNovedades(req.query.q)
  }

  res.render('novedades', {
    isNovedades: true,
    novedades,
    is_search: req.query.q !== undefined,
    q: req.query.q
  });
});

module.exports = router;
