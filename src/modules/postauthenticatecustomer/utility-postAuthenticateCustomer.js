const LOG = require('../../manager/log/log-manager');
const messageUtils = require('../../utils/message-utils');
const sdfBuild = require('../../message/builder/sdf-builder');
const thirdpartyBuild = require('../../message/builder/thirdparty-builder');
const ssoidsBuild = require('../../message/builder/ssoids-builder');
const ladpBuild = require('../../message/builder/ldap-builder');
const STAT = require('../../constants/fz-stat');
const STATE = require('../../constants/fz-state');
const KEYNAME = require('../../constants/fz-key-name');
const validator = require('../../utils/validator');
const IDENTITYTYPE = require('../../constants/fz-identity-type');

exports.postAuthenticateCustomerResponse = function(instance, res, statusCode, stat, uid, privateId, listOfPublicId, errorMsg, errorMessageStack, errorMessageStackList) {
    try {

        let responseMessage = module.exports.getResponseMessage(statusCode, listOfPublicId, uid, privateId, errorMessageStack, errorMessageStackList);

        LOG.STAT.call(this,stat);
        if(validator.isDefinedValue(errorMsg)){
            LOG.DEBUG.DEBUG.call(this,instance, ` ------ `+errorMsg+` ------ `);
        }
        LOG.DEBUG.DEBUG.call(this,instance, ` --|Response Message:${JSON.stringify(responseMessage)}`);
        res.errorMessage = errorMsg;
        instance.nextState = STATE.END;
        return res.status(statusCode.STATUS_CODE).send(responseMessage);
    } catch (error) {
        error.message;
    }
}

exports.getResponseMessage = function(statusCode, listOfPublicId, uid, privateId, errorMessageStack, errorMessageStackList){
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    if(uid){
        responseMessage.uid = uid;
    }
    if(privateId) {
        responseMessage.privateId = privateId;
    }
    if(listOfPublicId) {
        responseMessage.listOfPublicId = listOfPublicId;
    }

    let newErrorMessageStack = messageUtils.getErrorMessageStacksList(errorMessageStack, errorMessageStackList);
    if(newErrorMessageStack){
        responseMessage.errorMessageStack = newErrorMessageStack;
    };
    return responseMessage;
}

exports.getGupGlobalService = async function(instance){
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_REQUEST);
    instance.nextState = STATE.W_GET_GUPGLOBALSERVICE;
    instance.getGupGlobalServiceResponse = await sdfBuild.getGupGlobalService.call(this, instance);
}

exports.postThirdParty = async function(instance){
    LOG.STAT.call(this, STAT.AAF_THIRDPARTY_POST_THIRDPARTY_REQUEST);
    instance.nextState = STATE.W_THIRDPARTY_POST_THIRDPARTY;
    instance.postThirdPartyResponse = await thirdpartyBuild.ThirdParty.call(this,instance);
}

exports.postIdentityService = async function(instance){
    LOG.STAT.call(this, STAT.AAF_SSO_IDS_POST_IDENTITYSERVICE_REQUEST);
    instance.nextState = STATE.W_SSO_IDS_POST_IDENTITYSERVICE;
    instance.postIdentityServiceResponse = await ssoidsBuild.Ssoids.call(this,instance);
}

exports.getCustomerProfile = async function(instance){
    LOG.STAT.call(this, STAT.AAF_SSO_IDS_GET_CUSTOMERPROFILE_REQUEST);
    instance.nextState = STATE.W_SSO_IDS_GET_CUSTOMERPROFILE;
    instance.getCustomerProfileResponse = await ssoidsBuild.Ssoids.call(this,instance);
}

exports.postLdap = async function(instance){
    LOG.STAT.call(this, STAT.AAF_LDAP_POST_LDAP_REQUEST);
    instance.nextState = STATE.W_LDAP_POST_LDAP;
    instance.postLdapResponse = await ladpBuild.Ladp.call(this,instance);
}

exports.getGupCommon = async function(instance, publicId) {
    let keyName = getKeyName(publicId);
    if(validator.equalsValue(keyName, KEYNAME.PRIVATEID) === true){
        publicId = messageUtils.convertFbbToPrivateIdFormat(publicId);
    }
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_REQUEST);
    instance.nextState = STATE.W_GET_GUPCOMMON;
    instance.getGupCommonResponse = await sdfBuild.getGupCommon.call(this, instance, keyName, publicId);
}

exports.setListOfService = function(data, serviceName) {
    let listOfService = {};
    if(serviceName){
        listOfService.serviceName = serviceName;
    }else{
        listOfService.serviceName = "default";
    }

    if (!validator.isDefinedValue(data.pfPassword)) {
        listOfService.password = "n";
    } else {
        listOfService.password = "y";
    }

    if (!validator.isDefinedValue(data.ds3pin)) {
        listOfService.pin = "n";
    } else {
        listOfService.pin = "y";
    }

    if (!validator.isDefinedValue(data.secretQuestion)) {
        listOfService.question = "n";
    } else {
        listOfService.question = "y";
    }

    if (!validator.isDefinedValue(data.secretAnswer)) {
        listOfService.answer ="n";
    } else {
        listOfService.answer = "y";
    }
    
    return listOfService;
}

exports.setPasswordFromGupServiceElement = function(type,gupServiceElement,publicId) {
    if('password' === type){
        if(validator.isDefinedValue(gupServiceElement.getPfPassword())){
            if (publicId === gupServiceElement.getPfPassword()){
                return true;
            }
        }   
    }else if('pincode' === type){
        if(validator.isDefinedValue(gupServiceElement.getDs3pin())){
            if (publicId=== gupServiceElement.getDs3pin()){
                return true;
            }
        }
    }
    return false;
}

exports.setPasswordFromGupSubProfile = function(type,gupSubProfile,publicId) {
    if('password' === type){
        if(null != gupSubProfile.getPfPassword()){
            if (publicId === gupSubProfile.getPfPassword()){
                return true;
            }
        }else if('pincode' === type){
        	if(null != gupSubProfile.getDs3pin()){
        		if (publicId=== gupSubProfile.getDs3pin()){
        			return true;
        		}
        	}
        }
    }
    return false;
}

exports.setPasswordFromGupImpu = function(type,gupImpu,publicId) {
    if('password' === type){
        if(null != gupImpu.getPfPassword()){
            if (publicId === gupImpu.getPfPassword()){
                return true;
            }
        }else if('pincode' === type){
        	if(null != gupImpu.getDs3pin()){
        		if (publicId=== gupImpu.getDs3pin()){
        			return true;
        		}
        	}
        }
    }
    return false;
}

exports.getGupCommonAnswer = function(instance, res, statusCode, stat, uid, publicId, listOfPublicId) {
    try {

        let responseMessage = getGupcommonresponseMessage(statusCode, uid, publicId,listOfPublicId);

        LOG.STAT.call(this,stat);
        res.errorMessage = errorMsg;
        return res.status(statusCode.STATUS_CODE).send(responseMessage);
    } catch (error) {
        error.message;
    }
}

getGupcommonresponseMessage = function(statusCode, uid, publicId,listOfPublicId) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    if(uid) {
        responseMessage.uid = uid;
    }
    if(publicId) {
        responseMessage.publicId = publicId;
    }

    if(listOfPublicId) {
        responseMessage.listOfPublicId = listOfPublicId;
    }
    return responseMessage;
}
exports.postThirdPartyAnswer = function(instance, res, statusCode, stat) {
    try {

        let responseMessage = postThirdPartyresponseMessage(statusCode);

        LOG.STAT.call(this,stat);
        res.errorMessage = errorMsg;
        return res.status(statusCode.STATUS_CODE).send(responseMessage);
    } catch (error) {
        error.message;
    }
}

postThirdPartyresponseMessage = function(statusCode) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    return responseMessage;
}

exports.postIdentityServiveAnswer = function(instance, res, statusCode, stat,partnerSession) {
    try {

        let responseMessage = postIdentityServiveresponseMessage(statusCode,partnerSession);

        LOG.STAT.call(this,stat);
        res.errorMessage = errorMsg;
        return res.status(statusCode.STATUS_CODE).send(responseMessage);
    } catch (error) {
        error.message;
    }
}

postIdentityServiveresponseMessage = function(statusCode,partnerSession) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };

    if(partnerSession) {
        responseMessage.partnerSession = partnerSession;
    }
    return responseMessage;
}

exports.selectionAuthenticate = async function(instance){
    // let appNameListThird = CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_THIRD_PARTY_APPNAME_LIST;
    // let appNameListSso = CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_SSO_IDS_APPNAME_LIST;
    // let appNameListLdap = CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_LDAP_APPNAME_LIST;

    let postAuthenticateCustomerRequest = instance.postAuthenticateCustomerRequest;

    // for(let value of appNameListThird){
    //     if(postAuthenticateCustomerRequest.appName === value){
    //         //Post ThirdParty
    //         await module.exports.postThirdParty.call(this, instance);
    //         return;
    //     }
    // }
    
    // for(let value of appNameListSso){
    //     if(postAuthenticateCustomerRequest.appName === value){
    //         //Post IdentityService
    //         await module.exports.postIdentityService.call(this, instance);
    //         return;
    //     }
    // }

    // for(let value of appNameListLdap){
    //     if(postAuthenticateCustomerRequest.appName === value){
    //         //Post Ldap
    //         await module.exports.postLdap.call(this, instance);
    //         return;
    //     }
    // }
    
    //Get GupCommon
    let idValue = postAuthenticateCustomerRequest.idValue;
    let idType = postAuthenticateCustomerRequest.idType;
    if(validator.equalsValue(idType, IDENTITYTYPE.EMAIL)){
        if(validator.isEmail(idValue)){
            idValue = messageUtils.convertPublicIdToProtocolFormat(idValue);
        }else if(messageUtils.checkAppNameAddSuffix(postAuthenticateCustomerRequest.appName)){
            idValue = messageUtils.convertPublicIdToAppNameDomainFormat(idValue, postAuthenticateCustomerRequest.appName);
        }
    }
    postAuthenticateCustomerRequest.idValue = idValue;
    instance.postAuthenticateCustomerRequest = postAuthenticateCustomerRequest;

    await module.exports.getGupCommon.call(this, instance, postAuthenticateCustomerRequest.idValue);
    return;

}
