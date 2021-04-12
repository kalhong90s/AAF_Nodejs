const dateFormat = require('dateformat');
const FZ_HTTP_METHOD = require('../constants/fz-http-method');
const validator = require('./validator');
const random = require('randomstring');
const DOMAIN = require('../constants/fz-domain');
const CONFIG = require('../configurations/config');
const HEADER = require('../constants/fz-header-name');

exports.generateInvoke = (sessionID, command) => {
    //let invoke = `${sessionID}&cmd=${command}:${Date.now()}${this.generateAlphanumeric(5)}`
    let invoke = `${sessionID}&cmd=${command}:${this.generateAlphanumeric(7)}`
    return invoke;
}

exports.generateDateTime = (format) => {
    let now = new Date();
    try{
        if(validator.isDefinedValue(format)){
            return dateFormat(now, format);
        }
    }catch (e) {
    }
    return dateFormat(now, 'yyyymmddHHMMssl'); //yyyymmddHHMMssl = 20190130183010342 (YearMonthDayHoursMinutesSecMillisec)
}

exports.randomNumber = (lenght) => {
    try {
        if(validator.isDefinedValue(lenght)){
            return Math.floor(Math.random() * Math.floor(lenght));
        }
    }catch (e) {
    }
    return Math.random();
}

exports.generateSessionId = (req) => {
    let xTid = req.headers[HEADER.XTID] ? req.headers[HEADER.XTID] : '';
    let xSessionID = req.headers[HEADER.XSESSIONID];
    let invoke = req.invoke;
    //let method = req.method.toLowerCase();
    /*let GET = FZ_HTTP_METHOD.GET;
    let POST = FZ_HTTP_METHOD.POST;
    let PUT = FZ_HTTP_METHOD.PUT;
    let DELETE = FZ_HTTP_METHOD.DELETE;
    let commandId = '';
    if(GET === method){
        //req.query or req.params
        commandId = req.query.commandId ? req.query.commandId : '';
    }else if(DELETE === method){
        //req.query or req.params
        commandId = req.query.commandId ? req.query.commandId : '';
    }else if(POST === method){
        //req.params or req.body
        commandId = req.body.commandId ? req.body.commandId : ''
    }else if(PUT === method){
        //req.params or req.body
        commandId = req.body.commandId ? req.body.commandId : ''
    }*/

    //format initInvoke:xSession:sTid:datetime
    //let sessionID = `${invoke ? invoke + ':' : ''}${xSessionID ? xSessionID + ':' : ''}${xTid ? xTid : this.generateXTid('AAF')}:${Date.now()}`;
    //format xSession:sTid:datetime
    let sessionID = `${xSessionID ? xSessionID + ':' : ''}${xTid ? xTid : this.generateXTid('AAF')}:${Date.now()}`;
    return sessionID;
}

exports.generateRouteURLWithIdtypeIdValue = (url) => {
        /*`/aaf/v1.4.4/subscriptions/:idType/:idValue/:uid.(json)`,
        `/aaf/v1.4.4/subscriptions/:idType/:idValue/.(json)`,
        `/aaf/v1.4.4/subscriptions/:idType/:idValue.(json)`,
        `/aaf/v1.4.4/subscriptions/:idType/.(json)`,
        `/aaf/v1.4.4/subscriptions/:idType.(json)`,
        `/aaf/v1.4.4/subscriptions/.(json)`,
        `/aaf/v1.4.4/subscriptions.json`,
        `/aaf/v1.4.4/subscriptions///.json`,
        `/aaf/v1.4.4/subscriptions//.json`,
        `/aaf/v1.4.4/subscriptions/.json`,
        `/aaf/v1.4.4/subscriptions/:idType//.json`,
        `/aaf/v1.4.4/subscriptions//:idValue/.json`,
        `/aaf/v1.4.4/subscriptions//:idValue/:uid.(json)`,
        `/aaf/v1.4.4/subscriptions///:uid.(json)`,
        `/aaf/v1.4.4/subscriptions/:idType//:uid.(json)`,*/
    let URLList = [
        `${url}/:idType/:idValue/:uid.(json)`,
        `${url}/:idType/:idValue/.(json)`,
        `${url}/:idType/:idValue.(json)`,
        `${url}/:idType/.(json)`,
        `${url}/:idType.(json)`,
        `${url}/.(json)`,
        `${url}.json`,
        `${url}///.json`,
        `${url}//.json`,
        `${url}/.json`,
        `${url}/:idType//.json`,
        `${url}//:idValue/.json`,
        `${url}//:idValue/:uid.(json)`,
        `${url}///:uid.(json)`,
        `${url}/:idType//:uid.(json)`
    ];
    return URLList;
}

exports.generateAlphanumeric = (lenght) => {
    //--- charset ---
    //alphanumeric - [0-9 a-z A-Z]
    //alphabetic - [a-z A-Z]
    //numeric - [0-9]
    //hex - [0-9 a-f]
    //custom - any given characters

    if(!lenght){
        lenght = 32;
    }

    let randomStr = random.generate({
        length : lenght,
        charset : 'alphanumeric'
    });
    return randomStr;
}

exports.generatePrivateId = () =>{
    let randomStr = this.generateAlphanumeric(32);
    let timeInMillis = Date.now();
    return randomStr + timeInMillis + DOMAIN.FBB_AIS;
}

exports.generatePrivateIdWithDomainByConfig = () =>{
    let randomStr = this.generateAlphanumeric(32);
    let timeInMillis = Date.now();
    return randomStr + timeInMillis + CONFIG.SUFFIX_DOMAIN_FOR_GENERATE_PRIVATEID_45_DIGIT;
}

exports.generateXTid = (nodeName) => {
    //AAF-180905HlxHNNOKY7Qs
    let num = this.randomNumber(4) + 9; //--> [0...3]  + 9 = [9...12]
    let randomStr = this.generateAlphanumeric(num);
    let date = this.generateDateTime('yyMMdd');
    return nodeName.toUpperCase() + '-' + date + randomStr;
}