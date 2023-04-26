const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


// REGISTRO USUARIO
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?, 'false', 'user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Registro exitoso!" });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "El correo electronico ya existe." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


// INICIO DE SESIÓN
router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Nombre de usuario o contraseña incorrecta." });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Espere la aprobación del administrador." });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "El correo electronico ya existe." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


// RECUPERAR CONTRASEÑA
router.post('/forgotPassword', (req, res) => {
    const user = req.body;
    query = "select name,email,password from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: "Contraseña enviada con éxito a su correo electrónico." });
            }
            else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Recuperar contraseña Discoteca el Oasis',
                    html: '<h1>Recuperación de contraseña!</h1><p>Hola Señor@ <b>' + results[0].name + '</b></p><p><b>Sus datos de inicio de sesión para la Discoteca El Oasis son los siguientes:</b><br><b>Correo electronico: </b>' + results[0].email + '<br><b>Contraseña: </b>' + results[0].password + '<br><a href="http://localhost:4200/">Click aqui para iniciar sesión</a></p><br><a style="text-align: right; " href="https://imgbb.com/"><img src="https://i.ibb.co/Xpm5J7M/Logo-Discoteca-Oasis.png" alt="Logo-Discoteca-Oasis" border="0" width="180px" height="90px"></a>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return res.status(200).json({ message: "Contraseña enviada con éxito a su correo electrónico." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})
// try {
//     // var query = "SELECT email, password FROM user WHERE email=?";
//     var email = req.body.email;
//     const [rows, fields] = await connection.query("SELECT email, password FROM user WHERE email=?", [email]);
//     const data = JSON.stringify(rows);
//     res.json("Todo melo");
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD
//         }
//       });
//     // Configurar el objeto de mensaje
//     const message = {
//       from: 'discoeloasis2023@gmail.com',
//       to: req.params.email,
//       subject: 'Creación de cuenta VetMarket',
//       html: `
//         <div>
//           <p>¡Hola!</p>
//           <p>Gracias por unirte a nuestro servicio de correo electrónico. ¡Estamos emocionados de tenerte aquí!</p>
//           <p>Ahora tendrás acceso a una bandeja de entrada de correo electrónico organizada y fácil de usar. Esperamos que disfrutes de la experiencia.</p>
//           <p>Saludos cordiales,<br>El equipo de correo electrónico.</p>
//         </div>
//         <div>
//           <p>Hello!</p>
//           <p>Thank you for joining our email service. We're excited to have you here!</p>
//           <p>You will now have access to a streamlined and easy-to-use email inbox. We hope you enjoy the experience.</p>
//           <p>Best regards,<br>The email team.</p>
//         </div>
//       `
//     };
//     transporter.sendMail(message, (error, info) => {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Correo electrónico enviado: ' + info.response);
//         }
//       });

//     await connection.end();
// } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error al intentar recuperar la contraseña" });
// }




// TRAER DATOS, CUENTAS REGISTRADAS. 
router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    var query = "select id,name,email,contactNumber,status from user where role='user'";
    connection.query(query, (err, results) => {
        if (!err) {
            return res.status(200).json(results);
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// ACTUALIZAR USUARIOS. 
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
        if (!err) {
            if (results.affectedRows == 0) {
                return res.status(400).json({ message: "El ID de usuario no existe." });
            }
            return res.status(200).json({ message: "Se actualizo el usuario con éxito." });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

// CHECAR TOKEN. 
router.get('/checkToken', auth.authenticateToken, (req, res) => {
    return res.status(200).json({ message: "true" });
})

// CAMBIAR CONTRASEÑA. 
router.post('/changePassword', auth.authenticateToken, (req, res) => {
    const user = req.body;
    const email = res.locals.email;
    var query = "select *from user where email=? and password=?";
    connection.query(query, [email, user.oldPassword], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(400).json({ message: "Contraseña antigua incorrecta." });
            }
            else if (results[0].password == user.oldPassword) {
                query = "update user set password=? where email=?";
                connection.query(query, [user.newPassword, email], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Contraseña actualizada exitosamente." });
                    }
                    else {
                        return res.status(500).json(err);
                    }
                })
            }
            else {
                return res.status(400).json({ message: "Algo salió mal. Por favor, inténtelo de nuevo más tarde." });
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})


module.exports = router;