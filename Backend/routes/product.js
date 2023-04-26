const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
var chechRole = require('../services/checkRole');

// AGREGAR PRODUCTOS.  
router.post('/add', auth.authenticateToken, chechRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "insert into product (name,categoryId,description,price,status) values(?,?,?,?, 'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            return res.status(200).json({ message: "Producto agregado con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// MOSTRAR PRODUCTOS AGREGADOS. 
router.get('/get', auth.authenticateToken, chechRole.checkRole, (req, res, next) => {
    var query = "select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// MOSTRAR POR CATEGORIA. 
router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,name from product where categoryId= ? and status= 'true'";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// MOSTRAR POR ID.  
router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    var query = "select id,name,description,price from product where id = ?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            return res.status(200).json(results[0]);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// ACTUALIZAR PRODUCTOS.  
router.patch('/update', auth.authenticateToken, chechRole.checkRole, (req, res, next) => {
    let product = req.body;
    var query = "update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(query, [product.name, product.categoryId, product.description, product.price, product.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "El ID del producto no se encuentra." });
            }
            return res.status(200).json({ message: "Se actualizo el producto con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// ELIMINAR PRODUCTO.  
router.delete('/delete/:id', auth.authenticateToken, chechRole.checkRole, (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "El ID del producto no se encuentra." });
            }
            return res.status(200).json({ message: "Producto eliminado con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// ACTUALIZAR ESTADO.  
router.patch('/updateStatus', auth.authenticateToken, chechRole.checkRole, (req, res, next) => {
    let user = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({ message: "El producto no se encuentra." });
            }
            return res.status(202).json({ message: "Actualización del estado del producto con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;