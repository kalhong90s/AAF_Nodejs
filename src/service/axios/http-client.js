const axios = require('axios');
const FzMethod = require('../../constants/fz-http-method');
const FzAppStatus = require('../../constants/fz-status');
const LOG = require('../../manager/log/log-manager');
const validator = require('../../utils/validator');
const PROTOCOL = 'HTTP';

exports.request = function(instance, url, optionAttribute) {

    let reqTimeInMilliSec = Date.now();
    let method = optionAttribute.method;

    LOG.DEBUG.DEBUG.call(this,instance, `--------------- ${optionAttribute.command} ---------------`);
    LOG.DEBUG.DEBUG.call(this,instance, `-|Request`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|url:${url}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Invoke:${optionAttribute.invoke}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Method:${method}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|headers:${JSON.stringify(optionAttribute.headers)}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Body:${JSON.stringify(optionAttribute.body)}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Params:${JSON.stringify(optionAttribute.params)}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Timeout:${optionAttribute.timeout} ms`);

    let optionAttr = {
        headers : optionAttribute.headers,
        timeout : optionAttribute.timeout,
        invoke : optionAttribute.invoke,
        params : optionAttribute.params
    };
    let body = optionAttribute.body;


    if(optionAttribute.isWriteDetailLog === true){
        let rawData = Object.assign({}, {headers : optionAttr.headers}, {url : url}, {params : optionAttr.params}, {body : body});
        let dataMessage = Object.assign({}, {headers : optionAttr.headers}, {url : url}, {params : optionAttr.params}, {body : body});
        LOG.DETAILLOG.OUT_REQUEST(instance, optionAttr.invoke, optionAttribute.node, optionAttribute.command, rawData, dataMessage, PROTOCOL, method);
    }
    
    if (method === FzMethod.GET) {
        return axios.get(url, optionAttr).then((resolve) => {
            return responseHandle.call(this, instance, resolve, optionAttribute, reqTimeInMilliSec);
        }).catch((error) => {
            return responseHandle.call(this, instance, error, optionAttribute, reqTimeInMilliSec);
        });
    } else if (method === FzMethod.DELETE) {
        return axios.delete(url, optionAttr).then((resolve) => {
            return responseHandle.call(this, instance, resolve, optionAttribute, reqTimeInMilliSec);
        }).catch((error) => {
            return responseHandle.call(this, instance, error, optionAttribute, reqTimeInMilliSec);
        });
    } else if (method === FzMethod.PUT) {
        return axios.put(url, body, optionAttr).then((resolve) => {
            return responseHandle.call(this, instance, resolve, optionAttribute, reqTimeInMilliSec);
        }).catch((error) => {
            return responseHandle.call(this, instance, error, optionAttribute, reqTimeInMilliSec);
        });
    } else if (method === FzMethod.POST) {
        return axios.post(url, body, optionAttr).then((resolve) => {
            return responseHandle.call(this, instance, resolve, optionAttribute, reqTimeInMilliSec);
        }).catch((error) => {
            return responseHandle.call(this, instance, error, optionAttribute, reqTimeInMilliSec);
        });
    }
    outReqCount++;
}

responseHandle = function(instance, resObj, optionAttribute, reqTimeInMilliSec) {
    let response;
    let resErrorMsg;
    let invoke = resObj.config.invoke ? resObj.config.invoke : optionAttribute.invoke;
    LOG.DEBUG.DEBUG.call(this,instance, `-|Response`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Invoke:${invoke}`);
    //if (validator.isDefinedValue(resObj.response) || FzAppStatus.SUCCESS.STATUS_CODE == resObj.status) {
    if (validator.isDefinedValue(resObj.response) || validator.isDefinedValue(resObj.data)) {
        response = createResponse(resObj);
        LOG.DEBUG.DEBUG.call(this,instance, ` --|StatusCode:${response.statusCode}`);
        LOG.DEBUG.DEBUG.call(this,instance, ` --|StatusMessage:${response.statusMessage}`);
    } else {
        let errorMessage = resObj.message;
        let errorCode = resObj.code;
        let isTimeout = errorCode.includes('ETIMEDOUT') || errorMessage.includes('timeout') || errorMessage.includes('Timeout') || errorMessage.includes('TIMEOUT');
        LOG.DEBUG.DEBUG.call(this,instance, ` --|Code:${errorCode}`);
        LOG.DEBUG.DEBUG.call(this,instance, ` --|Message:${errorMessage}`);

        resErrorMsg = {
            errorCode: errorCode,
            errorMessage: errorMessage
        }

        if (isTimeout) {
            response = createErrorResponse(FzAppStatus.CONNECTION_TIMEOUT, errorCode, errorMessage);
        } else {
            response = createErrorResponse(FzAppStatus.CONNECTION_ERROR, errorCode, errorMessage);
        }
    }

    let resTimeInMilliSec = Date.now();
    let useTimeInMilliSec = resTimeInMilliSec - reqTimeInMilliSec;
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Data:${JSON.stringify(response)}`);
    LOG.DEBUG.DEBUG.call(this,instance, `-|Time`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Request:InMilliSec:${reqTimeInMilliSec}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Response:InMilliSec:${resTimeInMilliSec}`);
    LOG.DEBUG.DEBUG.call(this,instance, ` --|Use:InMilliSec:${useTimeInMilliSec} ms`);

    if(optionAttribute.isWriteDetailLog === true){
        // LOG.DETAILLOG.END(instance);
        if (resErrorMsg) {
            //Received Response Error
            LOG.DETAILLOG.IN_RESPONSE(instance, invoke, optionAttribute.node, optionAttribute.command, Object.assign({}, resErrorMsg), Object.assign({}, resErrorMsg), useTimeInMilliSec);
        } else {
            //Received Response Success
            LOG.DETAILLOG.IN_RESPONSE(instance, invoke, optionAttribute.node, optionAttribute.command, Object.assign({}, response), Object.assign({}, response.data), useTimeInMilliSec);
        }
    }
    return response;
}

createResponse = function(response) {
    let status = response.status;
    let statusText;
    let data;
    if (validator.isDefinedValue(response.data) === true) {
        //200 Success
        status = status.toString();
        statusText = response.statusText;
        data = response.data;
    } else {
        //404 Not Found
        status = response.response.status ? response.response.status.toString() : '';
        statusText = response.response.statusText ? response.response.statusText.toString() : '';
        data = response.response.data ? response.response.data : '';
    }
    /*if (status && FzAppStatus.SUCCESS.STATUS_CODE == status) {
        //200 Success
        status = status.toString();
        statusText = response.statusText;
        data = response.data;
    } else {
        //404 Not Found
        status = response.response.status ? response.response.status.toString() : '';
        statusText = response.response.statusText ? response.response.statusText.toString() : '';
        data = response.response.data ? response.response.data : '';
    }*/
    let res = {
        statusCode: status,
        statusMessage: statusText,
        data: data
    };
    return res;
}

createErrorResponse = function(status, errorCode, errorMessage) {
    let res = {
        errorCode: errorCode,
        errorMessage: errorMessage,
        statusCode: status.RESULT_CODE,
        statusMessage: status.DEVELOPER_MESSAGE
    };
    return res;
}
