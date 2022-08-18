import mongoose from "mongoose";
import 'dotenv/config';

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.1vxmmjy.mongodb.net/${process.env.MONGO_DBASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, 
    useUnifiedTopology: true 
    }
)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.log(err));