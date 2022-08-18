import { Router } from "express";
import { colCartDao as cartApi} from "../dao/index.js";
import { colProdDao as prodApi} from "../dao/index.js";

const router = new Router();


router.post('/',async(req,res)=>{
    const result = await cartApi.createCart();
    res.status(200).json({"success" : "Carrito creado con ID "+ result._id})
})

router.delete('/:id',async(req,res)=>{
    const { id } = req.params;
	const result = await cartApi.deleteCart(id);
    result 
    ? res.status(200).json({"success" : "Carrito Borrado"})
    : res.status(400).json({"error": "ID Inexistente"})
})

router.post('/:id/productos',async(req,res)=>{
    const {id} = req.params;
    const {body} = req;
    const newProd = await prodApi.getById(body._id);
    if (newProd){
        const result = await cartApi.addToCart(id,newProd);
        result !== null
        ? res.status(200).json({"success" : "Producto Agregado"})
        : res.status(400).json({"error": "Carrito no encontrado ID Inexistente"})
    } else {
        res.status(400).json({"error": "ID Ingresado Inexistente"})
    }
})

router.get('/:id/productos',async(req,res)=>{
	const {id} = req.params;
    const result = await cartApi.getById(id);
    result 
    ? res.status(200).json({"success" : "Carrito Encontrado",result})
    : res.status(404).json({"error": "ID Inexistente"})
})

router.delete('/:id/productos/:id_prod',async(req,res)=>{
    const {id,id_prod} = req.params;
    const exists = await cartApi.getById(id);
    if(exists){
        const result = await cartApi.deleteById(id,id_prod);
        result 
    ? res.status(200).json({"success" : "Producto Borrado"})
    : res.status(404).json({"error": "ID Inexistente"})
        
    } else {
        res.status(404).json({"error": "Carrito no encontrado ID Inexistente"});
    }
})

export default router