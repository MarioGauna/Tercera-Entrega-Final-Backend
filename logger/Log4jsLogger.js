import log4js from 'log4js';
import dotenv from 'dotenv';

dotenv.config();

log4js.configure({
    appenders: {
        terminal: {type: 'console'},
        warnFile: {type: 'file', filename: './logs/warn.log'},
        errorFile: {type: 'file', filename: './logs/error.log'},
        loggerInfo: {type: 'logLevelFilter', appender: 'terminal', level: 'info'},
        loggerWarn: {type: 'logLevelFilter', appender: 'warnFile', level: 'warn'},
        loggerError: {type: 'logLevelFilter', appender: 'errorFile', level: 'error'}
    },
    categories: {
        default: {appenders: ['terminal', 'loggerWarn', 'loggerError'], level: 'all'},
        prod:{
            appenders:['warnFile','errorFile'],level:'all'
        }
    }
})

let logger=null

if(process.env.NODE_ENV==='PROD'){
    logger=log4js.getLogger('prod');
}else{
    logger=log4js.getLogger();
}

export default logger;