const { Router, response } = require('express');
const { check } = require('express-validator');
const { crearCategoria ,
     obtenerCategorias,
     obtenercategoria, 
     actualizarcategoria, 
     borrarCategoria } = require('../controllers/categoria.controller.js');

const { existeCategoria } = require('../helpers/catagoriaID-validator.js');
const { validarnombre, validarid } = require('../helpers/validarnombre-categoria.js');

const { validarCampos } = require('../middlewares/validar-campos');
const {validarJWT} = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles.js');

const router = Router();

/* {{url}}/api/categorias */

//obtener todas las categorias -publico
router.get('/',obtenerCategorias);

//obtener una categoria - publico
router.get('/:id',[
    check('id',['no es un id de mongo']).isMongoId(),
    check('id').custom(existeCategoria),//middleware personalizado para el id
    validarCampos
],obtenercategoria);


//crear categoria privado - persona con token valido 

router.post('/',[
    validarJWT,
    check('nombre',['nombre requerido']).notEmpty(),
    
    validarCampos
],crearCategoria);


//actualizar las categorias - con token valido - privado
router.put('/:id',[
    validarJWT,
    check('id',['no es un id de mongo']).isMongoId(),
    validarCampos,
    check('nombre',['nombre requerido']).notEmpty(),
    check('nombre').custom(validarnombre),
    validarCampos
],actualizarcategoria);


//borrar una categoria -usuario con rol ADMIN 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id',['no es un id de mongo']).isMongoId(), 
    validarCampos  ,
    check('id').custom(validarid),
    validarCampos  
],borrarCategoria);

module.exports = router;