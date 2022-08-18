import dotenv from 'dotenv';
dotenv.config();

let colProdDao
    switch (process.env.DBASE) {
        case 'mongoDB':
            import('./productos/productsDao.js').then(({initProd})=>{
                colProdDao = new initProd()
            })
            break;
        default:
            break;
    }

    let colCartDao
    switch (process.env.DBASE) {
        
        case 'mongoDB':
            import('./carritos/carritoDao.js').then(({initCart})=>{
                colCartDao = new initCart()
            })
            break;
        default:
            break;
    }

export {colProdDao,colCartDao};