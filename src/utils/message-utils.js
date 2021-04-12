const FZ_PROTOCAL = require('../constants/fz-publicId-protocol');
const FZ_DOMAIN = require('../constants/fz-domain');
const STATUS = require('../constants/fz-status');
const validator = require('./validator');
const CONFIG = require('../configurations/config');
const KEYNAME = require('../constants/fz-key-name');

exports.getValueFromDN = (dn, key) => {
    try {
        if(!validator.isDefinedValue(dn) || !validator.isDefinedValue(key)){
            return null
        }
        let dnList = dn.split(',');
        for(let dnVal of dnList){
            let dnValList = dnVal.split('=');
            if(dnValList[0] === key){
                return dnValList[1];
            }
        }
    } catch (error) {        
    }
}

exports.getErrorMessageStacksList = (currentErrorMessageStack, receiveErrorMessageStack) => {
    let errorMessageStack;
    if(validator.isDefinedValue(receiveErrorMessageStack)){
        errorMessageStack = receiveErrorMessageStack;
    }

    if(validator.isDefinedValue(currentErrorMessageStack)){
        if(!validator.isDefinedValue(errorMessageStack)){
            errorMessageStack = [];
        }
        errorMessageStack.unshift(currentErrorMessageStack); //add to first
    }
    return errorMessageStack;
}

exports.convertPublicIdToProtocolFormat = (publicId) => {
    if(!validator.isDefinedValue(publicId)){
        return publicId;
    }
    if(validator.isMsisdn(publicId)){
        return publicId;
    }

    if(publicId.trim().toLowerCase().startsWith(FZ_PROTOCAL.SIP)){
        return publicId.trim();
    }
    return FZ_PROTOCAL.SIP.trim() + ':' + publicId.trim();
}

exports.checkAppNameAddSuffix = function(appName) {
    let appNameList = CONFIG.APPNAME_CHECK_ADDING_SUFFIX;
    for(let value of appNameList){
        if(value === appName){
            return true;
        }
    }
    return false;
}

exports.convertPublicIdToAppNameDomainFormat = (publicId, appName) => {
    if(!validator.isDefinedValue(publicId)){
        return publicId;
    }
    if(validator.isMsisdn(publicId) || validator.isEmail(publicId)){
        return publicId;
    }
    if(!publicId.includes('@')){
        if(validator.isDefinedValue(appName)){
            return publicId + '@' + appName;
        }else{
            return publicId + '@';
        }
    }
}

exports.convertFbbToPlayboxFormat = (publicId) => {
    if(!validator.isDefinedValue(publicId)){
        return publicId;
    }
    if(validator.isMsisdn(publicId)){
        return publicId;
    }
    if(validator.isEmail(publicId)){
        return publicId;
    }
    return FZ_PROTOCAL.SIP + ':' + publicId + FZ_DOMAIN.FBB_PLAYBOX;
}

exports.convertPlayboxToFbbFormat = (publicId) => {
    if(!validator.isDefinedValue(publicId)){
        return publicId;
    }
    if(validator.isMsisdn(publicId)){
        return publicId;
    }
    if(publicId.startsWith(FZ_PROTOCAL.SIP+":")){
        publicId = publicId.replace(FZ_PROTOCAL.SIP+":","");
    }
    if(publicId.endsWith(FZ_DOMAIN.FBB_PLAYBOX)){
        publicId = publicId.replace(FZ_DOMAIN.FBB_PLAYBOX,FZ_DOMAIN.FBB_AIS)
    }
    return publicId;
}

exports.convertFbbToPrivateIdFormat = (fbbId) => {
    if(!validator.isDefinedValue(fbbId)){
        return fbbId;
    }
    if(validator.isMsisdn(fbbId)){
        return fbbId;
    }
    let value = fbbId.split(':','-1');
    value = value[value.length - 1].split('@','-1');
    return value[0] + FZ_DOMAIN.FBB_AIS;
}

exports.convertDeviceIdFormatFollowConfig = (deviceId) => {
    if(!validator.isDefinedValue(deviceId)){
        return deviceId;
    }
    try {
        let result = '';
        let formatList = CONFIG.MANAGED_DEVICE_ID_FORMAT.split('|','-1'); //1 enable, 0 disable
        let deviceIdList = deviceId.split('|','-1');
        if(deviceId.includes('|') && validator.isDefinedValue(deviceIdList)){
            if(deviceIdList.length === 4 && formatList.length === 4){
                for(let i = 0; i < formatList.length; i++){
                    if(i !== 0){
                        result += '|';
                    }
                    if(validator.equalsValue('1',formatList[i]) === true){
                        result += deviceIdList[i];
                    }
                }
                return result;
            }
        }   
    } catch (error) {
        
    }
    return deviceId
}

exports.generateServiceInfo = (callBackUrl, xApp, xSessionId, submissionTime, partnerId) => {
    try {
        //format => callBackUrl,xApp,xSession,submissionTime,partnerId
        callBackUrl = callBackUrl ? callBackUrl : '';
        xApp = xApp ? xApp : '';
        xSessionId = xSessionId ? xSessionId : '';
        submissionTime = submissionTime ? submissionTime : '';
        partnerId = partnerId ? partnerId : '';
        return `${callBackUrl},${xApp},${xSessionId},${submissionTime},${partnerId}`;
    } catch (error) {
    }
    return undefined;
}

exports.removeArrayValue = (array, values) => {
    try {
        if(typeof values === 'string'){
            values = [values];
        }
        if(Array.isArray(values) === true){
            for(let value of values){
                let index = array.indexOf(value);
                if(index > -1){
                    array.splice(index, 1);
                }   
            }
        }else{
            let index = array.indexOf(values);
            if(index > -1){
                array.splice(index, 1);
            }
        }
        
    } catch (error) {
        
    }
    return array;
}

exports.errorMessageStack = (node , resultCode, developerMessage) => {
    let errorMessageStack = {};
    if(validator.isDefinedValue(node)){
        errorMessageStack.node = node;
    }
    if(validator.isDefinedValue(node)){
        errorMessageStack.resultCode = resultCode;
    }
    if(validator.isDefinedValue(node)){
        errorMessageStack.developerMessage = developerMessage;
    }
    if((STATUS.SUCCESS.RESULT_CODE === errorMessageStack.resultCode && STATUS.SUCCESS.DEVELOPER_MESSAGE === errorMessageStack.developerMessage)
    || (STATUS.CREATE_SUCCESS.RESULT_CODE === errorMessageStack.resultCode && STATUS.CREATE_SUCCESS.DEVELOPER_MESSAGE === errorMessageStack.developerMessage)){
        errorMessageStack = undefined;
    }
    return errorMessageStack;
}

exports.getKeyName = (value) => {
    let keyName = KEYNAME.PRIVATEID;

    if(validator.isEmail(value)){
        keyName = KEYNAME.PUBLICID;
    }
    if(validator.isMsisdn(value)){
        keyName = KEYNAME.MSISDN;
    } 
    
    return keyName;
}

exports.cloneObject = (object) => {
    try{
        if(typeof object === 'object'){
            let newObject = Object.assign({}, object);
            return newObject;
        }
    }catch(error){

    }
    return object;
}

exports.checkAppNameCredential = function(appName) {
    let appNameList = CONFIG.APPNAME_LIST_CHECKCREDENTIAL_GUPSERVICEELEMENT;
    for(let value of appNameList){
        if(value === appName){
            return true;
        }
    }
    return false;
}

exports.getUrlPath = function(url,keyName,keyValue,idType,idValue,idType2,idValue2) {
    url = url.replace('${keyName}',keyName);
    url = url.replace('${keyValue}',keyValue);
    url = url.replace('${'+idType+'}',idValue);
    url = url.replace('${'+idType2+'}',idValue2);
    return url;
}