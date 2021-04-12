const LOG = require('../../manager/log/log-manager');
const sdf = require('../../message/builder/sdf-builder');
const validate = require('../../utils/validator');
const KEYNAME = require('../../constants/fz-key-name');
const STAT = require('../../constants/fz-stat');
const STATE = require('../../constants/fz-state');
const messageUtils = require('../../utils/message-utils');

getContactNumberResponseMessage = function (statusCode,msisdn, errorMessageStack, errorMessageStackList) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE        
    };
    if(msisdn){
        responseMessage.contactNumber = msisdn;
    }

    let newErrorMessageStack = messageUtils.getErrorMessageStacksList(errorMessageStack, errorMessageStackList);
    if(newErrorMessageStack){
        responseMessage.errorMessageStack = newErrorMessageStack;
    };
    return responseMessage;
}

exports.getContactNumberResponse = function (instance, res, statusCode,msisdn, errorMessageStack, errorMessageStackList, errorMsg, stat) {
    let responseMessage = getContactNumberResponseMessage(statusCode,msisdn, errorMessageStack, errorMessageStackList);
    res.errorMessage = errorMsg;
    res.status(statusCode.STATUS_CODE).send(responseMessage);
    LOG.STAT.call(this, stat);
    instance.nextState = STATE.END;
    instance.response = res;
}

exports.getGupCommon = async function(instance, privateId) {
    let keyname = KEYNAME.PRIVATEID;    
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_REQUEST);
    instance.nextState = STATE.W_GET_GUPCOMMON;
    instance.getGupCommonResponse = await sdf.getGupCommon.call(this, instance, keyname, privateId);
}

exports.findContactNumber = function (gupCommon,privateId) {
    let contactNumber = undefined;	
    let domain = "@ais.co.th";
    try {
        if(!privateId.toLowerCase().endsWith(domain)){
            privateId = privateId + domain ;
        }    
        if(gupCommon.gupImpi){
            for(let data of gupCommon.gupImpi){
                if(privateId == data.privateId){
                    contactNumber = data.msisdn;
                    break;
                }
            }
        }

        return contactNumber;

    } catch (error) {
    }
}


exports.checkDomain = function(privateId) {
    let domain = "@ais.co.th";
    if(privateId.toLowerCase().endsWith(domain)){
        privateId = privateId.substring(0,privateId.toLowerCase().indexOf(domain));
    }
    privateId = privateId+domain;
    return privateId;
   
}
