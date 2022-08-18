import { Router } from "express";
import { colProdDao as prodApi} from "../dao/index.js";

const router = new Router();

function auth(req,res,next){
    if(!isAdmin){
        res.status(404).json({"error": "Funcion Habilitada solo para Administradores"})
    } else {
        next()
    }
}

router.get('/',async(req,res)=>{
    const result = await prodApi.getAll();
    result
    ? res.status(200).json({"success" : "Listado de productos",result})
    : res.status(400).json({"error": "Falla de la base de datos"})
})

router.get('/:id',async(req,res)=>{
    const {id} = req.params;
    const result = await prodApi.getById(id);
    result 
    ? res.status(200).json({"success" : "Producto Encontrado",result})
    : res.status(400).json({"error": "ID Inexistente"})
})

router.post('/',auth,async(req,res)=>{
    const newProd = req.body;
    const propiedades = ["title","description","image","price","stock"];
    const all = propiedades.every(prop => newProd.hasOwnProperty(prop));
    if (all){
        const result = await prodApi.create(newProd);
        res.status(200).json({"success" : "Producto Creado con ID "+result._id})
    } else {
        res.status(400).json({"error": "Debe llenar las propiedades nombre, descripcion, foto, precio y stock"})
    }
    
})

router.put('/:id',auth,async(req,res)=>{
    const { id } = req.params;
    const body = req.body;
    const propiedades = ["title","description","image","price","stock"];
    const all = propiedades.every(prop => body.hasOwnProperty(prop));
    if (all){
        const result = await prodApi.updateById(id, body);
        result 
        ? res.status(200).json({"success" : "Producto Actualizado"})
        : res.status(400).json({"error": "ID no encontrado"})
    } else {
        res.status(400).json({"error": "Debe actualizar todas las propiedades nombre, descripcion, foto, precio y stock"})
    }
    
})

router.delete('/:id',auth,async(req,res)=>{
    const {id} = req.params;
    const result = await prodApi.deleteById(id);
    result 
    ? res.status(200).json({"success" : "Producto Borrado",result})
    : res.status(400).json({"error": "ID no encontrado"})
})

export default router