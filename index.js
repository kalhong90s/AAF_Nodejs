const CONFIG = require('./src/configurations/config');
const generator = require('./src/utils/generator');
const mongodb = require('./src/configurations/mongodb')
const CODER = require('./src/utils/coder');
const messageUtils = require('./src/utils/message-utils');

let commonRodOpt = {
    mongo_create_connect: false,
    detaillog_add_output_response: false,
    summarylog_auto_end: false
};

let cb_BeforeRunServer = function () {
    let startServer = true;
    return startServer
}

let commonRod = require('common-rod');
let app = commonRod(cb_BeforeRunServer, commonRodOpt);

if(CONFIG.verifyConfiguration.call(app) === true){
    let deviceId = 'MTY1NHw0MTU0fDQ3ODY1fDQ0NTQ='
    deviceId = CODER.decodeBase64(deviceId);
    let test = messageUtils.convertDeviceIdFormatFollowConfig(deviceId);
    app.use(function (req, res, next) {
        req.instance = {};
        req.instance.sessionID = req.sessionID;
        req.instance.initInvoke = req.invoke;
        req.instance.isEndDetailLog = true;
        next();
    });

    app.session = function (req, res) {
        let session = generator.generateSessionId(req);
        return session;
    }

    function logResponseBody(req, res, next) {
        var oldWrite = res.write,
            oldEnd = res.end;
    
        var chunks = [];
    
        res.write = function (chunk) {
        chunks.push(chunk);
        oldWrite.apply(res, arguments);
        };
    
        res.end = function (chunk) {
            var body = '';
        
            if (typeof chunk !== 'string' && !(chunk instanceof Buffer)) {
                res["resBody"] = body ;
                oldEnd.apply(res, arguments);
                return ;
            }
        
            if (!(chunk instanceof String || typeof chunk === 'string' ) )
                chunks.push(chunk);
            try { 
                body =  chunks.length > 0? Buffer.concat(chunks).toString('utf8')  :'';
                res.body = body;
            } catch (error) {
                req.debugLog.error(error);
            }
        
            res["resBody"] = body ;

            //detail and summary
            const LOG = require('./src/manager/log/log-manager');
            let rawData = JSON.parse(body);
            let instance = req.instance;
            LOG.DETAILLOG.OUT_RESPONSE.call(this, instance, instance.initInvoke, rawData, res.errorMessage, 'AAF', instance.cmd);
            LOG.SUMMARYLOG.END.call(this, instance, rawData.resultCode, rawData.developerMessage);
            if(instance.isEndDetailLog === true)
                LOG.DETAILLOG.END.call(this, instance);
            oldEnd.apply(res, arguments);
        };
        next();
    }
    app.use(logResponseBody);

    mongodb.connectMongoDB.call(app);

} else {
    console.info('VERIFY CONFIG FAIL!!! STOP CREATE SERVER');
}