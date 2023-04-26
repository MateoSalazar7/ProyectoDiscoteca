const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');

//AGREGAR CATEGORIA.  
router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let category = req.body;
    query = "insert into category (name) values(?)";
    connection.query(query, [category.name], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Categoría agregada con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// MOSTRAR CATEGORIAS AGREGADAS. 
router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    var query = "select *from category order by name";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// ACTUALIZAR CATEGORIAS. 
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query, [product.name, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(400).json({ messsage: "No se encuentra el ID de categoría." });
            }
            return res.status(200).json({ message: "Actualización de categoría con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;