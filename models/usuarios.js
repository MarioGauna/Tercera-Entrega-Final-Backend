import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const usuarioSchema = new mongoose.Schema({
    nombre:{type:String,require:false}, 
    contraseña:{type:String,require:true},
    edad:{type:String,require:false}, 
    direccion:{type:String,require:false},
    telefono:{type:String,require:true}, 
    foto:{type:String,require:false},
    email:{type:String,require:true},
    cart: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'carrito' 
    }
})
usuarioSchema.methods.encrypt = (contraseña)=>{
    return bcrypt.hashSync(contraseña,bcrypt.genSaltSync(10))
}
usuarioSchema.methods.comparar = (contraseña,password)=>{
    return bcrypt.compareSync(contraseña,password)
}

export default mongoose.model('usuarios',usuarioSchema)