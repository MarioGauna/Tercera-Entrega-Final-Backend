import mongoose from "mongoose";
import configDB from "../db/configDB.js";

mongoose.connect(configDB.mongoDB.url,configDB.mongoDB.options)

class contCart{
    constructor(collectionName,docSchema){
        this.collection = mongoose.model(collectionName,docSchema)
    }
    async existsCart(id){
        try {
            const result = await this.collection.findOne({_id:id});
            return result
        } catch (error) {
            console.log('Hubo un error al crear el carrito',error)
        }
    }
    async createCart(){
        try {
            return await this.collection.create({});
        } catch (error) {
            console.log('Hubo un error al crear el carrito',error)
        }
    }
    async deleteCart(id){
        try {
            const result = await this.collection.deleteOne({_id:id});
            if(result.deletedCount == 0){
                return null
            }else {
                return result
            }
        } catch (error) {
            console.log('Hubo un error al mostrar la base de datos',error)
        }
    }
    async addToCart(id,obj){
        try {
            const res = await this.existsCart(id)
            const newId = obj._id.toString()
            if(res !== null){
                let exists1 = await this.collection.findOne({_id:id,"products._id":obj._id})
                if(exists1 !== null ){
                    let locate = exists1.products.find(i => i._id == newId)
                    locate.qty++;
                    const res = await this.collection.updateOne({_id:id,"products._id":obj._id},{$set:{"products.$":locate}});
                    return res
                } else {
                    const res = await this.collection.updateOne({_id:id},{$push:{products:obj}});
                    let exists2 = await this.collection.findOne({_id:id,"products._id":obj._id})
                    let locate = exists2.products.find(i => i._id == newId);
                    locate.qty = 1;
                    const final = await this.collection.updateOne({_id:id,"products._id":obj._id},{$set:{"products.$":locate}});
                    return final
                }
            }else{
                return null
            }
        } catch (error) {
            console.log('Hubo un error al guardar el producto seleccionado',error)
        }
    }
    async getById(id){
        try {
            return await this.collection.findById(id).populate('products').select({products: 1, _id:0});
        } catch (error) {
            console.log('Hubo un error al actualizar el producto seleccionado',error)
        }
    }
    async deleteById(id,id_prod){
        try {
            let exists = await this.collection.findById({_id:id,"products._id":mongoose.Types.ObjectId(id_prod)})
            if (exists){
                let res = await this.collection.updateOne({_id:id},{$pull : { products : { _id : mongoose.Types.ObjectId(id_prod)}}})
                return res
            } else {
                return null
            }
        } catch (error) {
            console.log('Hubo un error al borrar el articulo seleccionado',error)
        }
    }
}

export default contCart;