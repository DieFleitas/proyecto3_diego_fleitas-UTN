var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');
var util = require('util');
var cloudinary = require('cloudinary').v2;

const uploader = util.promisify(cloudinary.uploader.upload);


router.get('/', async function (req, res, next) {
    // var novedades = await novedadesModel.getNovedades();
    var novedades;
    if (req.query.q === undefined) {
        novedades = await novedadesModel.getNovedades();
    } else {
        novedades = await novedadesModel.buscarNovedades(req.query.q);
    }

    novedades = novedades.map(novedad => {
        if(novedad.img_id){
            const imagen = cloudinary.image(novedad.img_id, {
                width:80,
                height:80,
                crp:'fill'
            });
            return{
                ...novedad,
                imagen
            }
        } else{
            return{
                ...novedad,
                imagen:''
            }
        }
    })

    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario:  req.session.nombre,
        novedades,
        is_search: req.query.q !== undefined,
        q: req.query.q
    })
});

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await novedadesModel.deleteNovedadesByID(id);
    res.redirect('/admin/novedades');
})


router.get('/agregar', (req, res, next) => {
    res.render ('admin/agregar', {
        layout: 'admin/layout'
    });
});


router.post('/agregar', async (req, res, next) => {
    try {
        var img_id = '';
        if (req.files && Object.keys(req.files).length > 0) {
            var id = req.files.imagen;
            img_id =(await uploader(imagen.tempFilePath)).public_id;
        } 



        if(req.body.titulo != '' && req.body.subtitulo != '' && req.body.cuerpo != '') {
            await novedadesModel.insertNovedad({
                ...req.body,
                img_id
            });
            res.redirect('/admin/novedades');
        } else {
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregar' , {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        })
    }
});

router.get('/modificar/:id', async (req,res, next) => {
    var id = req.params.id;
    var novedades = await novedadesModel.getNovedadesById(id);

    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedades
    })
});

router.post('/modificar', async (req, res, next)=> {
    try {
        var obj = {
            titulo: req.body.titulo,
            subtitulo: req.body.subtitulo,
            cuerpo:req.body.cuerpo
        }
        await novedadesModel.modificarNovedadById(obj, req.body.id);
        res.redirect('/admin/novedades')
    } catch (error) {
        console.log(error)
        res.render('admin/layout', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        })
    }
})




module.exports = router