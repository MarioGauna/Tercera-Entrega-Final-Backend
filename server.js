import express from 'express';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import routes from './routes/routes.js';
import logger from './logger/Log4jsLogger.js'
import minimist from 'minimist';
import './passport/local.js';
import './db/database.js';
import 'dotenv/config';

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.set('views','./views');
app.set('view engine', 'ejs');

app.use(
    session({
        secret:'key',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl:`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.1vxmmjy.mongodb.net/${process.env.MONGO_DBASE}?retryWrites=true&w=majority`}),
            cookie:{maxAge: 180*60*1000},
        })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/',routes);
app.use('*',(req,res)=>{
    logger.warn(`Ruta Inexistente`);
    res.send(`Ruta Inexistente`);
})

const select = {
    alias: {
        "p": "PORT"
    },
    default: {
        "PORT": 8080
    }
};

const { PORT } = minimist(process.argv, select);

const MODO=process.argv[2]==='CLUSTER';

if(MODO && cluster.isMaster){
    const CPUs=os.cpus().length;
    console.log('Master');
    for(let i = 0; i < CPUs;i++){
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        cluster.fork();
    });
}else{
    const server = app.listen(PORT, () => {
        console.log(`Servidor escuchando puerto ${PORT}`);
        })
        
    server.on('error', (err) => console.log(err));
}

// const PORT = process.env.PORT || 8080;
// const server = app.listen(PORT, ()=> console.log(`Servidor iniciado en el puerto ${PORT}`));
// server.on('error',(error) => console.log(err));