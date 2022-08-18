import mongoose from "mongoose";
import configDB from "../db/configDB.js";

mongoose.connect(configDB.mongoDB.url,configDB.mongoDB.options)

class contProd{
    constructor(collectionName,docSchema){
        this.collection = mongoose.model(collectionName,docSchema)
    }
    async existe(id){
        try {
            const result =await this.collection.findById(id);
            console.log(result)
            return result
        } catch (error) {
            console.log('Hubo un error al guardar el articulo',error)
        }
    }
    async create(obj){
        try {
            const result = await this.collection.create(obj);
            return result
        } catch (error) {
            console.log('Hubo un error al guardar el articulo',error)
        }
    }
    async getAll(){
        try {
            const result = await this.collection.find({})
            return result
        } catch (error) {
            console.log('Hubo un error al mostrar la base de datos',error)
        }
    }
    async getById(id){
        try {
            const result = await this.collection.findOne({_id:id});
            return result
        } catch (error) {
            console.log('Hubo un error al obtener el producto seleccionado',error)
        }
    }
    async updateById(id,obj){
        try {
            const result = await this.collection.findByIdAndUpdate({_id:id},obj);
            return result
        } catch (error) {
            console.log('Hubo un error al actualizar el producto seleccionado',error)
        }
    }
    async deleteById(id){
        try {
            const result = await this.collection.deleteOne({_id:id});
            if(result.deletedCount == 0){
                return null
            }else {
                return result
            }
        } catch (error) {
            console.log('Hubo un error al borrar el articulo seleccionado',error)
        }
    }
}

export default contProd;