import contCart from "../../containers/classCarritos.js";

export class initCart extends contCart{
    constructor(){
        super('carritos',{
            timestamp:{type:Date,default: Date.now},
            products: []
        })
    }
}