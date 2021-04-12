const LOG = require('../../manager/log/log-manager');
const messageUtil = require('../../utils/message-utils');
const validator = require('../../utils/validator');
const CONFIG = require('../../configurations/config');
const messageUtils = require('../../utils/message-utils');

exports.postCheckPublicIdAvailabilityResponse = function(instance, res, statusCode, errorMsg, stat, errMessageStack, errorMessageStackList, privateId, isFirstRegister, uid) {
    try {
        responseMessage = {
            resultCode : statusCode.RESULT_CODE,
            developerMessage : statusCode.DEVELOPER_MESSAGE          
        };
        if(privateId) {
            responseMessage.privateId = privateId;
        }
        if(uid){
            responseMessage.uid = uid;
        }
        if(isFirstRegister) {
            responseMessage.isFirstRegistration = isFirstRegister;
        }
        if(checkAppNameCheckCredential(instance.appName) && !isFirstRegister){
            responseMessage.isCredentialExist = instance.isCredentialExist;
        }
        let newErrorMessageStack = messageUtils.getErrorMessageStacksList(errMessageStack, errorMessageStackList);
        if(newErrorMessageStack){
            responseMessage.errorMessageStack = newErrorMessageStack;
        };
        LOG.STAT.call(this,stat);
        if(validator.isDefinedValue(errorMsg)){
            LOG.DEBUG.DEBUG.call(this,instance, ` ------ `+errorMsg+` ------ `);
        }
        LOG.DEBUG.DEBUG.call(this,instance, ` --|Response Message:${JSON.stringify(responseMessage)}`);
        res.errorMessage = errorMsg;
        return res.status(statusCode.STATUS_CODE).send(responseMessage);
    } catch (error) {
        error.message;
    }
}

exports.isAlreadyHaveGupSubProfile = function(instance, publicId, getGupCommonResponse, isFirstRegister){
    let gupSubProfiles =  getGupCommonResponse.data.gupSubProfile;

    if(!validator.isDefinedValue(gupSubProfiles) ) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupSubProfile !');
        isFirstRegister = true;
        return false;
    } else {
        for(let gupSubProfile of gupSubProfiles) {
            let msisdn = messageUtil.getValueFromDN(gupSubProfile.dn, 'msisdn');

            if(msisdn === publicId) {
                let uid = messageUtil.getValueFromDN(gupSubProfile.dn, 'uid');
                let serviceProfileId = gupSubProfile.serviceProfileId;
                let privateId = "";
                if(validator.isDefinedValue(gupSubProfile.privateIds)){
                    privateId = gupSubProfile.privateIds[0];
                }                
                if(validator.isDefinedValue(gupSubProfile.pfPassword)){
                    instance.isCredentialExist = true;
                }else{
                    instance.isCredentialExist = false;
                }
                instance.serviceProfileId = serviceProfileId;
                instance.privateId = privateId;
                instance.uid = uid;

                let subscriptionState = gupSubProfile.subscriptionState;
                if(!validator.isDefinedValue(subscriptionState)){
                    subscriptionState = "";
                }
                instance.subscriptionState = subscriptionState;                
                return true;
            }
        }
    }

    isFirstRegister = true;
}

checkAppNameCheckCredential = function(appName) {
    let appNameList = CONFIG.CHECKPUBLICAVAILABILITY.CHECKPUBLICAVAILABILITY_APPNAME_CHECKCREDENTIAL_LIST;
    for(let value of appNameList){
        if(value === appName){
            return true;
        }
    }
    return false;
}

exports.isAlreadyHaveGupImpu = function(instance, publicId, getGupCommonResponse, isFirstRegister){
    let gupImpus =  getGupCommonResponse.data.gupImpu;

    if(!validator.isDefinedValue(gupImpus)) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupImpu !');
        isFirstRegister = true;
        return false;
    } else {
        for(let gupImpu of gupImpus) {
            let publicIdFromDn = messageUtil.getValueFromDN(gupImpu.dn, 'publicId');

            if(publicId.toLowerCase() === publicIdFromDn.toLowerCase()) {
                let uid = messageUtil.getValueFromDN(gupImpu.dn, 'uid');
                let serviceProfileId = gupImpu.serviceProfileId;
                let privateId = "";
                if(validator.isDefinedValue(gupImpu.privateIds)){
                    privateId = gupImpu.privateIds[0];
                }
                if(validator.isDefinedValue(gupImpu.pfPassword)){
                    instance.isCredentialExist = true;
                }else{
                    instance.isCredentialExist = false;
                }
                instance.serviceProfileId = serviceProfileId;
                instance.privateId = privateId;
                instance.uid = uid;

                let subscriptionState = gupImpu.subscriptionState;
                if(!validator.isDefinedValue(subscriptionState)){
                    subscriptionState = "";
                }
                instance.subscriptionState = subscriptionState;
                return true;
            }
        }
    }

    isFirstRegister = true;

    /*publicId = messageUtil.convertPublicIdToProtocolFormat(publicId);
    let gupImpus =  getGupCommonResponse.gupImpu;

    if(null === gupImpus) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupImpu !');
        isFirstRegister = true;
        return false;
    } else {
        for(let gupImpu of gupImpus) {
            let publicIdFromDn = messageUtil.getValueFromDN(gupImpu.dn, 'publicId');

            if(publicId === publicIdFromDn) {
                let serviceProfileId = gupImpu.serviceProfileId;
                let privateId = gupImpu.privateId[0];
                instance.serviceProfileId = serviceProfileId;
                instance.privateId = privateId;
                return true;
            }
        }
    }

    isFirstRegister = true;*/
}

exports.isAlreadyHaveGupImpi = function(instance, publicId, getGupCommonResponse, isFirstRegister){
    let gupImpis = getGupCommonResponse.data.gupImpi;

    if(!validator.isDefinedValue(gupImpis)) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupImpi !');
        return false;
    } else {
        for(let gupImpi of gupImpis) {
            let privateIdFromDn = gupImpi.privateId;
            if(privateIdFromDn === instance.privateId){
                return true;
            }
        }
    }

    return false;
}

exports.isAlreadyHaveService = function(instance, serviceId, getGupCommonResponse){
    let gupServiceElements = getGupCommonResponse.data.gupServiceElement;
    let gupServiceProfiles = getGupCommonResponse.data.gupServiceProfile;
    let serviceProfileId = instance.serviceProfileId;
    let privateId = instance.privateId;
    let matchGupServiceElement = false;

    if(!validator.isDefinedValue(gupServiceElements)) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupServiceElement !');
        return false;
    }
    if(!validator.isDefinedValue(gupServiceProfiles)) {
        LOG.DEBUG.DEBUG.call(this,instance, 'Have no gupServiceProfile !');
        return false;  
    }

    // Check already have serviceId
    for(let gupServiceElement of gupServiceElements) {
        let serviceIdFromDn = messageUtil.getValueFromDN(gupServiceElement.dn, 'serviceId');
        let serviceProfileIdFromDn = messageUtil.getValueFromDN(gupServiceElement.dn, 'serviceProfileId');

        if(serviceId === serviceIdFromDn) {
            if(serviceProfileId === serviceProfileIdFromDn){
                if(gupServiceElement.privateIds) {
                    if(gupServiceElement.privateIds.includes(privateId)) {
                        LOG.DEBUG.DEBUG.call(this,instance, 'Found serviceId : ' + serviceIdFromDn);
                        matchGupServiceElement = true;
                    }
                } else {
                    LOG.DEBUG.DEBUG.call(this,instance, 'Found serviceId : ' + serviceIdFromDn);
                    matchGupServiceElement = true;
                }
            }
        }
    }

    // Verify correctness
    if(matchGupServiceElement) {
        for(let gupServiceProfileId of gupServiceProfiles) {
            let ServiceProfileIdFromDn = messageUtil.getValueFromDN(gupServiceProfileId.dn, 'serviceProfileId');

            if(serviceProfileId === ServiceProfileIdFromDn) {
                return true;
            }
        }
    }
    
    return false;
}