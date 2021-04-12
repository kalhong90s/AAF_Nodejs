const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const confLog = require('./commonlog-kb');
const generator = require('../utils/generator');

module.exports = function () {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    app.use(function(req, res, next){
        req.sessionID = generator.generateSessionId(req);
        req.instance = {};
        req.instance.sessionID = req.sessionID;
        req.instance.initInvoke = '';
        next();
    });

    require('commonlog-kb').init(confLog ,app);

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
            const LOG = require('../manager/log/log-manager');
            let rawData = JSON.parse(body);
            let instance = req.instance;
            LOG.DETAILLOG.OUT_RESPONSE(instance, instance.initInvoke, rawData, res.errorMessage, 'AAF', instance.cmd);
            LOG.SUMMARYLOG.END(instance, rawData.resultCode, rawData.developerMessage);
            oldEnd.apply(res, arguments);
        };
        next();
    }
    app.use(logResponseBody);

    /* Load routes and modules */
    let load = require('express-load');
    let rootPath = path.join(__dirname, '..'); //=> src/
    load('controllers/api',
        {
            cwd : rootPath,
            checkext : true,
            extlist : ['ctrl.js']
        }
    ).into(app);
    load('controllers/routes',
        {
            cwd : rootPath,
            checkext : true,
            extlist : ['route.js']
        }
    ).into(app);
    return app;
}