const { Router, response } = require("express");
const {check} = require("express-validator");
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require("../controllers/productos");
const { validaridProducto, existeproducto } = require("../helpers/validarid-Producto");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { esAdminRole } = require("../middlewares/validar-roles");
const router = Router();


// la ruta es /api/productos

// obtner productos - publico
router.get('/',obtenerProductos);

// obtner producto - publico
router.get('/:id',[
    check('id',['no es un id valido ']).isMongoId(),
    validarCampos,
    existeproducto,
],obtenerProducto);
// crear producto - usuario con JWT
router.post('/',[
    validarJWT,
    check('categoria',['ID de categoria no correcto']).isMongoId(),
    check('nombre',['nombre es requerido']).notEmpty(),
    validarCampos
],crearProducto);

// actualizar producto - usuario con JWT
router.put('/:id',[
validarJWT,
check('nombre',['nombre es requerido']).notEmpty(),
check('categoria',['ID de categoria no correcto']).isMongoId(),
validarCampos
],actualizarProducto);


// Borrar producto-usuario con JWT - ROLE ADMIN 
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    validarCampos,
    check('id',['el id no es de mongo']).isMongoId(),
    validarCampos,
    check('id').custom(validaridProducto),
    validarCampos
],borrarProducto);


module.exports = router