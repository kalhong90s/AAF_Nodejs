const LOG = require('../../manager/log/log-manager');
const sdf = require('../../message/builder/sdf-builder');
const validate = require('../../utils/validator');
const KEYNAME = require('../../constants/fz-key-name');
const STAT = require('../../constants/fz-stat');
const STATE = require('../../constants/fz-state');
const messageUtils = require('../../utils/message-utils');

getPrivateIdResponseMessage = function (statusCode, listOfPrivateId, errorMessageStack, errorMessageStackList) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    if(listOfPrivateId){
        responseMessage.listOfPrivateId = listOfPrivateId;
    }
    let newErrorMessageStack = messageUtils.getErrorMessageStacksList(errorMessageStack, errorMessageStackList);
    if(newErrorMessageStack){
        responseMessage.errorMessageStack = newErrorMessageStack;
    };
    return responseMessage;
}

exports.getPrivateIdResponse = function (instance, res, statusCode, listOfPrivateId, errorMessageStack, errorMessageStackList, errorMsg, stat) {
    let responseMessage = getPrivateIdResponseMessage(statusCode, listOfPrivateId, errorMessageStack, errorMessageStackList);
    res.errorMessage = errorMsg;
    res.status(statusCode.STATUS_CODE).send(responseMessage);
    LOG.STAT.call(this, stat);
    instance.nextState = STATE.END;
    instance.response = res;
}

exports.getGupCommon = async function(instance, publicId) {
    let keyname = KEYNAME.PUBLICID;
    if(validate.isMsisdn(publicId)){
        keyname = KEYNAME.MSISDN;
    }
    
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_REQUEST);
    instance.nextState = STATE.W_GET_GUPCOMMON;
    instance.getGupCommonResponse = await sdf.getGupCommon.call(this, instance, keyname, publicId);
}

exports.getGupSubProfile = function (publicId, gupSubProfiles) {
    try {
        if(gupSubProfiles){
            for(let data of gupSubProfiles){    
                let msisdn = messageUtils.getValueFromDN(data.dn, KEYNAME.MSISDN);
                if(publicId === msisdn){
                    return data;
                }
            }
        }   
    } catch (error) {
    }
}

exports.getGupImpu = function (publicId, gupImpus) {
    try {
        if(gupImpus){
            for(let data of gupImpus){    
                let gupPublicId = messageUtils.getValueFromDN(data.dn, KEYNAME.PUBLICID);
                if(publicId === gupPublicId){
                    return data;
                }
            }
        }   
    } catch (error) {
    }
}

exports.getGupImpi = function (publicId, privateId, gupImpis) {
    try {
        if(gupImpis){
            for(let data of gupImpis){
                let gupPrivateId = messageUtils.getValueFromDN(data.dn, KEYNAME.PRIVATEID);
                if(validate.equalsValue(privateId, gupPrivateId) === false)
                    continue;

                if(validate.isMsisdn(publicId) === true && validate.equalsValue(publicId, data.msisdn) === true){
                    return data;
                } else if(validate.isEmail(publicId) === true && data.publicIds !== undefined && data.publicIds.includes(x) === true){
                    return data;
                }
            }
        }   
    } catch (error) {
    }
}