
// const this = require('commonthis-kb');
const validator = require('../../utils/validator');

let COMMONLOG = {};

//============ debug
COMMONLOG.DEBUG = {};
COMMONLOG.DEBUG.DEBUG = function(instance, ...msg) {
    this.debug(instance.sessionID, ...msg);
}
COMMONLOG.DEBUG.INFO = function(instance, ...msg) {
    this.info(instance.sessionID, ...msg);
}
COMMONLOG.DEBUG.ERROR = function(instance, ...msg) {
    this.error(instance.sessionID, ...msg);
}
COMMONLOG.DEBUG.WARN = function(instance, ...msg) {
    this.warn(instance.sessionID, ...msg);
}

//============ stat
COMMONLOG.STAT = function (stat) {
    this.stat(stat);
}

//=========== summary this
COMMONLOG.SUMMARYLOG = {};
COMMONLOG.SUMMARYLOG.SUCCESS = function(instance, nodeName, command, resultCode, resultDesc){
    nodeName = nodeName ? nodeName : '';
    command = command ? command : '';
    resultCode = resultCode ? resultCode : '';
    resultDesc = resultDesc ? resultDesc : '';
    instance.summaryLog.addSuccessBlock(nodeName, command, resultCode, resultDesc);
}

COMMONLOG.SUMMARYLOG.ERROR = function(instance, nodeName, command, resultCode, resultDesc){
    nodeName = nodeName ? nodeName : '';
    command = command ? command : '';
    resultCode = resultCode ? resultCode : '';
    resultDesc = resultDesc ? resultDesc : '';
    instance.summaryLog.addErrorBlock(nodeName, command, resultCode, resultDesc);
}

COMMONLOG.SUMMARYLOG.END = function(instance, resultCode, developerMessage) {
    instance.summaryLog.end(resultCode, developerMessage);
}

//=========== detail this
COMMONLOG.DETAILLOG = {};
COMMONLOG.DETAILLOG.IN_REQUEST = function(req, invoke, nodeName, cmd){
    let inputRawdata = getInputRawMessage(req);
    let inputData = getInputData(req);
    req.instance.detailLog.addInputRequest(nodeName, cmd, invoke, inputRawdata, inputData, req.protocol.toUpperCase(), req.method.toUpperCase());
}

COMMONLOG.DETAILLOG.OUT_RESPONSE = function(instance, initInvoke, responseRawData, errorMessage, nodeName, cmd){
    instance.detailLog.addOutputResponse(nodeName, cmd, initInvoke, responseRawData, getErrorMessage(responseRawData, errorMessage));
    /*if(errorMsg){
        instance.detailLog.addOutputResponse(nodeName, cmd, initInvoke, response, getErrorMessage(errorMsg));
    }else{
        instance.detailLog.addOutputResponse(nodeName, cmd, initInvoke, response, response);
    }*/
}

//output to backend
COMMONLOG.DETAILLOG.OUT_REQUEST = function(instance, invoke, nodeName, command, inputRawdata, inputData, protocol, method){
    instance.detailLog.addOutputRequest(nodeName, command, invoke, inputRawdata, inputData, protocol.toUpperCase(), method.toUpperCase());
}

//input from backend
COMMONLOG.DETAILLOG.IN_RESPONSE = function(instance, invoke, nodeName, command, inputRawdata, inputData, resTime) {
    instance.detailLog.addInputResponse(nodeName, command, invoke, inputRawdata, inputData, resTime);
}

COMMONLOG.DETAILLOG.END = function(instance) {
    instance.detailLog.end();
}

getInputRawMessage = function(req) {
    try{
        let inputRawdata = {};

        let method = req.method;
        if(validator.isDefinedValue(method)){
            inputRawdata.method = method;
        }

        let url = req.url;
        if(validator.isDefinedValue(url)){
            inputRawdata.url = url;
        }

        let header = req.headers;
        if(validator.isDefinedValue(header)){
            inputRawdata.header = header;
        }

        let body = req.body;
        if(validator.isDefinedValue(body)){
            inputRawdata.body = body;
        }

        return inputRawdata;
    }catch(err){

    }
    return '';
}

getInputData = function(req) {
    try {
        let inputData = {};

        let identity = {};
        let identityType = req.params.identityType;
        let identityValue = req.params.identityValue;

        if(validator.isDefinedValue(identityType)){
            identity.identityType = identityType;
        }
        if(validator.isDefinedValue(identityValue)){
            identity.identityValue = identityValue;
        }
        if(validator.isDefinedValue(identity)){
            inputData.identity = identity;
        }

        let query = req.query;
        if(validator.isDefinedValue(query)){
            inputData.queryString = query;
        }

        let body = req.body;
        if(validator.isDefinedValue(body)){
            inputData.body = body;
        }
        return inputData;
    } catch (error) {

    }
    return '';
}

getErrorMessage = function(rawData, errorMsg) {
    if(!errorMsg){
        return rawData;
    }else{
        return Object.assign({}, {body : rawData, error : errorMsg});
    }
}


//============ init
COMMONLOG.INIT = function(req, initInvoke, nodeName, cmd, identity) {
    req.instance.cmd = cmd; 
    //req.instance.summaryLog = this.summary(req.sessionID, initInvoke, cmd, identity);
    //req.instance.detailLog = this.detail(req.sessionID, initInvoke, cmd, identity);
    identity = identity ? identity : '';
    req.instance.summaryLog = this.summary(initInvoke, cmd, identity); 
    req.instance.detailLog = this.detail(initInvoke, cmd, identity);
    COMMONLOG.DETAILLOG.IN_REQUEST(req, initInvoke, nodeName, cmd);
}

module.exports = COMMONLOG;