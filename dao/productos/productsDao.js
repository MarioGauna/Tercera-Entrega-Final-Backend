import contProd from "../../containers/classProducts.js";

export class initProd extends contProd{
    constructor(){
        super('productos',{
            title:{type:String,require:true,max:100},
            description:{type:String,require:true,max:500},
            image:{type:String,require:true,max:200},
            stock:{type:Number,require:true,max:1000},
            price:{type:Number,require:true},
            timestamp:{type:Date,default: Date.now},
        })
    }
}