import { Router } from "express";
import passport from 'passport';
import logger from '../logger/Log4jsLogger.js'
import nodemailer from 'nodemailer';
import twilio from "twilio";
import { colCartDao as cartApi} from "../dao/index.js";
import { colProdDao as prodApi} from "../dao/index.js";

const router = Router();

router.get('/', async(req, res) => {
    res.render('inicio.ejs');
    logger.info('Ruta exitosa');
})

// RUTAS LOGIN

router.post('/login', passport.authenticate('login',{
    failureRedirect:'/errorLogin',
    successRedirect:'/inicio',
}))

router.post('/registro',passport.authenticate('registro',{
    failureRedirect:'/errorRegistro',
    successRedirect:'/regexito',
}))

router.get('/regexito', async(req, res) => {
    let [nombre,edad,direccion,telefono,foto,email] = [req.user.nombre,req.user.edad,req.user.direccion,req.user.telefono,req.user.foto,req.user.email];
    let template = `
    <h1>Aviso de registro</h1>
    <h3>Datos del nuevo usuario</h3>
    <p>Nombre: ${nombre}</p>
    <p>Edad: ${edad}</p>
    <p>Direccion: ${direccion}</p>
    <p>Telefono: ${telefono}</p>
    <p>Foto: ${foto}</p>
    <p>E-mail: ${email}</p>
    ` 

    const transporter = nodemailer.createTransport({
        host:'smtp.ethereal.email',
        port:587,
        auth:{
            user:process.env.USER_ETHEREAL,
            pass:process.env.PASS_ETHEREAL,
        }
    })

    let adminMail='<tutor@codehouse.com>';

    await transporter.sendMail({
        from:'Mario Gauna <test@mail.com>',
        to: adminMail,
        subject:'Nuevo registro',
        html: template,
    })
    res.render('regexito.ejs');
    logger.info('Ruta exitosa');
})

router.get('/checkout', async(req, res) => {

    let [nombre,direccion,telefono,userEmail] = [req.user.nombre,req.user.direccion,req.user.telefono,req.user.email];

    let template = `
        <h1>Recibo de Compra</h1>
        <h3>${nombre} tu pedido sera enviado a ${direccion}</h3>
        ` 
    const transporter = nodemailer.createTransport({
        host:'smtp.ethereal.email',
        port:587,
        auth:{
            user:process.env.USER_ETHEREAL,
            pass:process.env.PASS_ETHEREAL,
        }
    })

    await transporter.sendMail({
        from:'Compras <test@mail.com>',
        to: userEmail,
        subject:`Nuevo pedido de ${nombre}`,
        html: template,
    })

    const twilioAccount = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);

    twilioAccount.messages.create({
        body: `${nombre} tu pedido sera enviado a ${direccion}`,
        from: '+18787686333',
        to: `+54${telefono}`,
    });

    twilioAccount.messages.create({
        body: `${nombre} tu pedido sera enviado a ${direccion}`,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:+549${telefono}`,
    });

    res.render('checkout.ejs')
    logger.info('Ruta exitosa');
})


router.get('/errorRegistro', async(req, res) => {
    res.render('errorRegistro.ejs');
    logger.info('Ruta exitosa');
})

router.get('/errorLogin', async(req, res) => {
    res.render('errorLogin.ejs');
    logger.info('Ruta exitosa');
})

router.get("/logout", (req, res) => {
	req.session.destroy( (error) => {
        if (error) {
            res.json(error);
        } else {
            res.render('logout.ejs',{status: false,usuario:req.user.nombre});
        }
    })
    logger.info('Ruta exitosa');
});

//RUTA PRODUCTOS

router.get('/inicio', async(req, res) => {
    //let persona = req.session.user;
    let products = await prodApi.getAll();
    res.render('bienvenido.ejs',{products,persona:req.user.nombre});
    logger.info('Ruta exitosa');
})

router.post('/inicio/addtocart/:id',async(req,res)=>{
    let products = await prodApi.getAll();
    const {id} = req.params;
    const item = await prodApi.getById(id);
    const newId = req.user.cart;
    if(!req.user.cart){
        const result = await cartApi.createCart();
        req.user.cart = result;
        req.user.save();
        await cartApi.addToCart(newId,item);
        res.render('bienvenido.ejs',{products,persona:req.user.nombre})
    } else {
        await cartApi.addToCart(newId,item);
        res.render('bienvenido.ejs',{products,persona:req.user.nombre})
    }
    logger.info('Ruta exitosa');
})

//RUTA CARRITO

router.get('/carrito', async(req, res) => {
    const carrito = req.user.cart.toString();
    const products = await cartApi.getById(carrito);
    res.render('carrito.ejs',{products,persona:req.user.nombre});
    logger.info('Ruta exitosa');
})

// router.delete('/carrito/delete/:id', async(req, res) => {
//     const {id} = req.params;
//     //const carrito = req.user.cart.toString();
//     //const products = await cartApi.getById(carrito);
//     //
//     console.log(id)

//     //res.render('carrito.ejs',{products,persona:req.user.nombre})
// })

export default router;