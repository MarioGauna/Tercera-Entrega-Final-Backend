import passport from 'passport';
import {Strategy} from 'passport-local';
import usuarioSchema from '../models/usuarios.js';

const localStrategy = Strategy;

passport.use('registro', new localStrategy({
    usernameField: 'email',
    passwordField: 'contraseña',
    passReqToCallback: true
    }, async (req,email,contraseña,done) => {
    const usuarioDB = await usuarioSchema.findOne({email})
    if (usuarioDB){
        return done(null,false);
    }
    const newUsuario = new usuarioSchema();
    const {nombre,direccion,edad,telefono,foto} = req.body;
    newUsuario.nombre = nombre;
    newUsuario.direccion = direccion;
    newUsuario.edad = edad;
    newUsuario.telefono = telefono;
    newUsuario.foto = foto;
    newUsuario.email = email;
    newUsuario.contraseña = newUsuario.encrypt(contraseña);
    await newUsuario.save();
    return done(null, newUsuario);
}));

passport.use('login', new localStrategy({
    usernameField: 'email',
    passwordField: 'contraseña',
    passReqToCallback: true
    }, async (req, email, contraseña, done) => {
    const usuarioDB = await usuarioSchema.findOne({email})
    const pass = usuarioDB.contraseña;
    const match = usuarioDB.comparar(contraseña,pass)
    if (usuarioDB && match){
        return done(null, usuarioDB)
    }else{
        return done(null,false)
    }
    }
));

passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await usuarioSchema.findById(id);
    done(null, usuario);
});

// if (!usuarioDB){
//     return done(null,false)
// }
// if (!usuarioDB.comparar(contraseña)){
//     return done(null,false)
// }
// return done(null, usuarioDB)
// }