const LOG = require('../../manager/log/log-manager');
const messageUtils = require('../../utils/message-utils');
const sdfBuild = require('../../message/builder/sdf-builder');
const STAT = require('../../constants/fz-stat');
const STATE = require('../../constants/fz-state');
const KEYNAME = require('../../constants/fz-key-name');
const DOMAIN = require('../../constants/fz-domain');
const validator = require('../../utils/validator');
const CONFIG = require('../../configurations/config');
const dsmpBuild = require('../../message/builder/dsmp-builder');
const STATUS = require('../../constants/fz-status');
const IDENTITYTYPE = require('../../constants/fz-identity-type');
const globalService = require('../../utils/globalService');
const generator = require('../../utils/generator');
const DB = require('../../message/builder/db-builder');  
const coder = require('../../utils/coder');

exports.postSubscriptionsResponse = async function(instance, res, statusCode, stat, privateId, listOfService, errorMsg, errorMessageStack, errorMessageStackList) {
    try {

        let responseMessage = module.exports.getResponseMessage(statusCode, listOfService, privateId, errorMessageStack, errorMessageStackList);

        if(statusCode != STATUS.ORDER_STILL_IN_PROCESSING){
            await DB.DELETE_POSTSUBSCRIPTIONS.call(this, instance, instance.idValueForDelete);
        }

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

exports.getResponseMessage = function(statusCode, listOfService, privateId, errorMessageStack, errorMessageStackList) {
    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    if(privateId) {
        responseMessage.privateId = privateId;
    }
    if(listOfService) {
        responseMessage.listOfService = listOfService;
    }

    let newErrorMessageStack = messageUtils.getErrorMessageStacksList(errorMessageStack, errorMessageStackList);
    if(newErrorMessageStack){
        responseMessage.errorMessageStack = newErrorMessageStack;
    };
    return responseMessage;
}

exports.createInfoToDB = async function(instance, publicId) {
    if(instance.isExpriedCorrelate === false){
        let data = await DB.INSERT_POSTSUBSCRIPTIONS.call(this, instance, publicId);
        if(validator.isDefinedValue(data) === true){
            return true;
        }
    }else{
        let data = await DB.UPDATE_POSTSUBSCRIPTIONS.call(this, instance, publicId);
        if(validator.isDefinedValue(data) === true){
            return true;
        }
    }
    return false;
}

exports.isOrderStillInProcessing = async function(instance, publicId) {
    instance.isExpriedCorrelate = false;
    let data = await DB.READ_POSTSUBSCRIPTIONS.call(this, instance, publicId);
    if(validator.isDefinedValue(data)){
        for(let value of data){
            if(validator.equalsValue(publicId, value.publicId)){
                let now = Date.now();
                if((now - value.timestamp) > (CONFIG.POSTSUBSCRIPTIONS.CORRELATE_TIME * 1000) === true){
                    instance.isExpriedCorrelate = true;
                    return false;
                }
                return true;
            }
        }
    }
    return false;
}

exports.getGupGlobalService = async function(instance){
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_REQUEST);
    instance.nextState = STATE.W_GET_GUPGLOBALSERVICE;
    instance.getGupGlobalServiceResponse = await sdfBuild.getGupGlobalService.call(this, instance);
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

exports.getGupCommonByPrivateId = async function(instance, privateId) {
    let keyName = getKeyName(privateId);
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_REQUEST);
    instance.convertPrivate = privateId;
    instance.nextState = STATE.W_GET_GUPCOMMON_BY_PRIVATEID;
    instance.getGupCommonResponseByPrivate = await sdfBuild.getGupCommon.call(this, instance, keyName, privateId);
}

getKeyName = function(publicId) {
    if(validator.isMsisdn(publicId)){
        return KEYNAME.MSISDN;
    }else if(validator.isFbbId(publicId)){
        return KEYNAME.PRIVATEID;
    }else{
        return KEYNAME.PUBLICID;
    }
}

exports.getStbManageDeviceProfile = async function(instance, deviceId) {
    LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_REQUEST);
    instance.nextState = STATE.W_GET_STBMANAGEDEVICEPROFILE;
    instance.getStbManageDeviceProfile = await sdfBuild.getStbManageDeviceProfile.call(this, instance, deviceId);
}

checkCSPNameIsAis = function(instance, cspName) {
    let cspList = CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_CSPNAME_CHECKPROFILE_LIST;
    if(validator.isDefinedValue(cspList)){
        for(let value of cspList){
            if(value.toLowerCase() === cspName.toLowerCase()){
                instance.isAis = true;
                return true;
            }
        }
    }
    instance.isAis = false;
    return false;
}

isAllowSubscriberByAppName = function(instance, appName) {
    LOG.DEBUG.DEBUG.call(this, instance, `--------------- AAF will create new profile by appName ---------------`);
    LOG.DEBUG.DEBUG.call(this, instance, ` --|appName:${appName}`);
    if(validator.isDefinedValue(appName) === false){
        LOG.DEBUG.DEBUG.call(this, instance, ` --|result:block`);
        return false;
    }
    let allowAppNameList = CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_APPNAME_ALLOW_CREATE_SUB;
    LOG.DEBUG.DEBUG.call(this, instance, ` --|allow appName:${JSON.stringify(allowAppNameList)}`);
    if(validator.isDefinedValue(allowAppNameList)){
        for(let allow of allowAppNameList){
            if(validator.equalsValue(allow.trim(), appName.trim()) === true
            || validator.equalsValue(allow.trim(), 'all') === true){
                LOG.DEBUG.DEBUG.call(this, instance, ` --|result:allow`);
                return true;
            }
            if(validator.equalsValue(allow.trim(), 'none') === true){
                return false;
            }
        }
    }
    LOG.DEBUG.DEBUG.call(this, instance, ` --|result:block`);
    return false;
}

exports.postSubscriber = async function(instance, publicId) {
    let postSubscriptionsRequest = instance.postSubscriptionsRequest;
    let pfPassword;
    let serviceProfileId;
    if(validator.isMsisdn(publicId)){
        serviceProfileId = CONFIG.SERVICEPROFILEID_IS_NOT_AIS;
    }else{
        serviceProfileId = CONFIG.SERVICEPROFILEID_FBBID;
    }
    let privateId = generatePrivateId45Digit(undefined);
    instance.privateId = privateId;

    let impiList;
    let msisdnList;
    let impuList;

    impiList = [privateId];
    if(validator.isMsisdn(publicId)){
        msisdnList = [publicId];
        pfPassword = getCredential(postSubscriptionsRequest.credential);
    }else{
        impuList = [publicId];
    }
    instance.serviceProfileId = serviceProfileId;
    instance.privateId = privateId;

    let createAmf;
    let ds3ClassOfService;
    let ds3ClassOfServiceNonAis;
    let brandIdNonAis;
    let ds3spNameNonAis;
    
    if(validator.isMsisdn(publicId)){
        createAmf = CONFIG.POSTSUBSCRIPTIONS.NAFA_CREATE_AMF_ENABLE;
        ds3ClassOfService = CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_CLASS_OF_SERVICE_AIS;
        ds3ClassOfServiceNonAis = CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_CLASS_OF_SERVICE_NON_AIS;
        brandIdNonAis = CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_BRAND_ID_NON_AIS;
        ds3spNameNonAis = CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3SPNAME_NON_AIS;
    }else{
        createAmf = CONFIG.POSTSUBSCRIPTIONS.EMAIL_CREATE_AMF_ENABLE;
        ds3ClassOfService = CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_CLASS_OF_SERVICE_AIS;
        ds3ClassOfServiceNonAis = CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_CLASS_OF_SERVICE_NON_AIS;
        brandIdNonAis = CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_BRAND_ID_NON_AIS;
        ds3spNameNonAis = CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3SPNAME_NON_AIS;
    }

    let currentTime = generateDateTimeForInsertSubscriber(false);
    let expireTime = generateDateTimeForInsertSubscriber(true);
    let isAis = instance.isAis;
    
    let data = {
        methodVersion : '1',
        impiAlias : impiList,

    }
    if(validator.isDefinedValue(impuList) === true){
        data.impuAlias = impuList;
    }
    if(validator.isDefinedValue(msisdnList) === true){
        data.msisdnAlias = msisdnList;
        let gupSubProfile = {
            subscriptionState : 'active',
            gupDataServLifestyle : 'decent',
            gupAuthenLevel : 'no',
            gupRegistrationLevel : 'no',
            msisdn : msisdnList[0],
            serviceProfileId : serviceProfileId
        }
        
        gupSubProfile.privateIds = [privateId];

        if(validator.isDefinedValue(pfPassword) === true){
            if(postSubscriptionsRequest.credential.type === 'password'){
                gupSubProfile.pfPassword = pfPassword;
            }else{
                gupSubProfile.ds3pin = pfPassword;
            }
        }
        data.gupSubProfile = [gupSubProfile];
    }

    let ds3SubProfile = {
        language : 'tha'
    }
    if(isAis === true){
        ds3SubProfile.ds3spName = 'awn';
        ds3SubProfile.ds3brandId = '6';
    }else{
        ds3SubProfile.ds3spName = ds3spNameNonAis;
        if(validator.isDefinedValue(brandIdNonAis) === true && validator.equalsValue('none', brandIdNonAis.toLowerCase()) === false){
            ds3SubProfile.ds3brandId = brandIdNonAis;
        }
    }
    data.ds3subProfile = ds3SubProfile;
    let masteredByList = CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_MASTEREDBY;
    let index = generator.randomNumber(masteredByList.length);
    let masteredBy = masteredByList[index];
    if(validator.isDefinedValue(masteredBy) === true && validator.equalsValue('none', masteredBy.toLowerCase()) === false){
        data.masteredBy = masteredBy;
    }
    if(createAmf === true){
        let amfSubProfile = {
            subscriptionState : 'active',
            registrationDate : currentTime,
            expirationDate : expireTime,
            firstModifiedTime : currentTime,
            lastModifiedTime : currentTime
        }

        let amfAccount = {
            subscriptionState : 'active'
        }
        
        let accountId;
        if(validator.isDefinedValue(msisdnList) === true){
            accountId = msisdnList[0];
        }else{
            accountId = 'email_personal_1'
        }
        amfAccount.accountId = accountId;

        if(isAis === true && validator.isDefinedValue(ds3ClassOfService) === true && validator.equalsValue('none', ds3ClassOfService.toLowerCase()) === false){
            amfAccount.ds3classOfService = ds3ClassOfService;
        }else if(isAis === false && validator.isDefinedValue(ds3ClassOfServiceNonAis) === true && validator.equalsValue('none', ds3ClassOfServiceNonAis.toLowerCase()) === false){
            amfAccount.ds3classOfService = ds3ClassOfServiceNonAis;
        }

        data.amfSubProfile = amfSubProfile;
        data.amfAccount = amfAccount;
    }

    let givenName = postSubscriptionsRequest.givenName;
    let surname = postSubscriptionsRequest.surname;
    let subscriberProfile;
    if(validator.isDefinedValue(givenName) === true){
        subscriberProfile = {
            givenName : givenName
        }
    }
    if(validator.isDefinedValue(surname) === true){
        if(validator.isDefinedValue(subscriberProfile) === false){
            subscriberProfile = {
                surname : surname
            }   
        }else{
            subscriberProfile.surname = surname;
        }
    }
    if(validator.isDefinedValue(subscriberProfile) === true){
        data.subscriberProfile = subscriberProfile;
    }

    LOG.STAT.call(this, STAT.AAF_DSMP_INSERT_SUBSCRIBER_REQUEST);
    instance.isNewInsertSub = true;
    instance.nextState = STATE.W_POST_SUBSCRIBER;
    instance.postSubscriberResponse = await dsmpBuild.postInsertSubscriber.call(this, instance, data);
    
}

function generateDateTimeForInsertSubscriber(isYear2106) {
    try {
        let now = new Date();
        if(isYear2106 === true){
            now = now.setFullYear(2106);
            return dateFormat(now, yyyyMMddHHmmssZ);
        }else{
            return dateFormat(now, yyyyMMddHHmmssZ);
        }   
    } catch (error) {
    }
}

getCredential = (credential) => {
    if(validator.isDefinedValue(credential) === false){
        return undefined;
    }
    if(validator.equalsValue('password', credential.type) === true && validator.isDefinedValue(credential.value) === true){
        return coder.encryptMD5(credential.value);
    }
    return undefined;
}

exports.getGupDevice = async function(instance, deviceId) {
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_DEVICE_REQUEST);
    instance.nextState = STATE.W_GET_GUPDEVICE;
    instance.getGupDeviceResponse = await sdfBuild.getGupDevice.call(this, instance, deviceId, KEYNAME.DEVICEID, deviceId);
}

exports.validateDeviceOwner = function(instance, uidKey, gupDevices) {
    LOG.DEBUG.DEBUG.call(this, instance, `--------------- Validate owner device ---------------`);
    LOG.DEBUG.DEBUG.call(this, instance, `-|uid:${uidKey}`);
    if(validator.isDefinedValue(uidKey) === false || validator.isDefinedValue(gupDevices) === false){
        LOG.DEBUG.DEBUG.call(this, instance, `-|result:fail!!!`);
        return false;
    }
    if(validator.isDefinedValue(gupDevices.gupDevice)){
        for(let gupDevice of gupDevices.gupDevice){
            let uid = messageUtils.getValueFromDN(gupDevice.dn, KEYNAME.UID);
            LOG.DEBUG.DEBUG.call(this, instance, ` --|device uid:${uid}`);
            if(validator.equalsValue(uidKey, uid)){
                LOG.DEBUG.DEBUG.call(this, instance, ` --|result:success`);
                return true;
            }
        }
    }
    LOG.DEBUG.DEBUG.call(this, instance, ` --|result:fail!!!`);
    return false;
}

exports.getUid = function(instance, publicId) {
    let data = instance.getGupCommonResponse.data;
    let resultCode = data.resultCode;
    if(STATUS.SUCCESS.RESULT_CODE === resultCode){
        if(validator.isMsisdn(publicId)){
            if(validator.isDefinedValue(data.gupSubProfile)){
                for(let gupSub of data.gupSubProfile){
                    let uid = messageUtils.getValueFromDN(gupSub.dn, KEYNAME.UID);
                    instance.uid = uid;
                    if(gupSub.msisdn === publicId){
                        instance.serviceProfileId = gupSub.serviceProfileId;
                        if(validator.isDefinedValue(gupSub.privateIds)){
                            instance.privateId = gupSub.privateIds[0];
                        }     
                        break;
                    }
                }
            }
        }else{
            if(validator.isDefinedValue(data.gupImpu)){
                for(let impu of data.gupImpu){
                    let uid = messageUtils.getValueFromDN(impu.dn, KEYNAME.UID);
                    instance.uid = uid;
                    if(impu.publicId.toLowerCase() === publicId.toLowerCase()){
                        instance.serviceProfileId = impu.serviceProfileId;
                        if(validator.isDefinedValue(impu.privateIds)){
                            instance.privateId = impu.privateIds[0];
                        }     
                        break;
                    }
                }
            }
        }
    }

    if(!validator.isMsisdn(publicId) && validator.isDefinedValue(data.gupImpi)){
        for(let impi of data.gupImpi){
            let uid = messageUtils.getValueFromDN(impi.dn, KEYNAME.UID);
            instance.uid = uid;
            if(!instance.postByImpiUid){
                //default use first impi
                instance.privateForPostImpu = impi.privateId;
            }
            instance.postByImpiUid = true;
            if(validator.isDefinedValue(impi.publicIds)){
                //if found impi bind with public use this privateId for post impu
                if(impi.publicIds[0].toLowerCase() === publicId.toLowerCase()){
                    instance.isAlreadyHaveImpi = true;
                    instance.privateForPostImpu = impi.privateId;
                    instance.privateId = impi.privateId;
                    break;
                }
            }
        }
    }
}

exports.mainProcessGupCommon = async function(instance, res, idType, idValue, cspName, appName, resultCode, errMessageStack, errMessageStacks){
    
    //case 88@playbox getGupCommon by privateId
    if(validator.equalsValue(idType.toLowerCase(), IDENTITYTYPE.EMAIL.toLowerCase()) && idValue.endsWith('@playbox.co.th')){
        let fbbId = messageUtils.convertPlayboxToFbbFormat(idValue);
        if(validator.isFbbId(fbbId)){
            await module.exports.getGupCommonByPrivateId.call(this, instance, fbbId);
            return;
        }
    }

    //cspName is ais , must found data from gupCommon
    if(validator.isDefinedValue(cspName)){
        if(checkCSPNameIsAis(instance,cspName)){
            if(STATUS.DATA_NOT_FOUND.RESULT_CODE === resultCode){
                module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'cspName is ais must found data', errMessageStack , errMessageStacks)
                return;
            }
        }
    }

    if(!isAllowSubscriberByAppName.call(this, instance, appName)){
        module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'appName not allow create subscriber', errMessageStack , errMessageStacks)
        return;
    }

    if(STATUS.SUCCESS.RESULT_CODE === resultCode){
        module.exports.getUid(instance, idValue);
        module.exports.checkDataForPost.call(this, instance, res, idValue);
        await module.exports.mainProcessPost.call(this, instance, res);
        return;
    }else{
        await module.exports.postSubscriber.call(this, instance,idValue);
        return;
    }
}

exports.postGupServiceElement = async function(instance) {
    let postSubscriptionsRequest = instance.postSubscriptionsRequest;

    let data = {
        objectClass : 'gupServiceElement',
        subscriptionState : 'active',
        privateIds : [instance.privateId]
    }
    let serviceProfileId = instance.serviceProfileId;
    let pfPassword = getCredential(postSubscriptionsRequest.credential);
    
    if(messageUtils.checkAppNameCredential(instance.postSubscriptionsRequest.appName)){
        if(validator.isDefinedValue(pfPassword) === true){
            if(postSubscriptionsRequest.credential.type === 'password'){
                data.pfPassword = pfPassword;
            }else{
                data.ds3pin = pfPassword;
            }
        }
    }
    
    let serviceInfos = getServiceInfos(instance);
    if(validator.isDefinedValue(serviceInfos) === true){
        data.serviceInfos = serviceInfos;
    }

    LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_SERVICEELEMENT_REQUEST);
    instance.isAlreadyHaveServiceElement = true;
    instance.isPostGupServiceElement = true;
    instance.nextState = STATE.W_POST_GUPSERVICEELEMENT;
    instance.postGupServiceElementResponse = await sdfBuild.postGupServiceElement.call(this, instance, KEYNAME.UID, instance.uid, serviceProfileId, instance.serviceId, data);    
    
}

getServiceInfos = function(instance) {
    try {
        let postSubscriptionsRequest = instance.postSubscriptionsRequest;
        let callBackUrl = postSubscriptionsRequest.callBackUrl;
        if(validator.isDefinedValue(callBackUrl) === true){
            let serviceInfos = [];
            let xApp = postSubscriptionsRequest['x-app'];
            let xSessionId = postSubscriptionsRequest['x-session-id'];
            let submissionTime = postSubscriptionsRequest.submissionTime;
            let partnerId = postSubscriptionsRequest.partnerId;
            let serviceInfo = messageUtils.generateServiceInfo(callBackUrl, xApp, xSessionId, submissionTime, partnerId);
            serviceInfos.push(serviceInfo);
            return serviceInfos;
        }
    } catch (error) {
        
    }
    return undefined;
}

exports.getUidFromPrivate = function(instance, privateId) {
    let data = instance.getGupCommonResponseByPrivate.data;
    let resultCode = data.resultCode;
    if(STATUS.SUCCESS.RESULT_CODE === resultCode){
        if(validator.isDefinedValue(data.gupImpi)){
            for(let impi of data.gupImpi){
                let uid = messageUtils.getValueFromDN(impi.dn, KEYNAME.UID);
                instance.uid = uid;
            }
        }else if(validator.isDefinedValue(data.gupImpu)){
            for(let impu of data.gupImpu){
                let uid = messageUtils.getValueFromDN(impu.dn, KEYNAME.UID);
                instance.uid = uid;
            }
        }
    }
}

exports.postModifyIdentityGupDevice = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_POST_MODIFYIDENTITY_GUPDEVICE;
    let deviceId = instance.postSubscriptionsRequest.deviceId;
    instance.postModifyGupDeviceResponse = await sdfBuild.postModifyIdentity.call(this, instance, KEYNAME.DEVICEID, deviceId, instance.uid);
}

exports.postGupDevice = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_DEVICE_REQUEST);
    instance.nextState = STATE.W_POST_GUPDEVICE;
    let deviceId = instance.postSubscriptionsRequest.deviceId;
    let privateId = instance.privateId;
    let data = {
        objectClass : 'gupDevice',
        deviceState : 'active',
        privateIds : [privateId],
        regPrivateIds : [privateId]
    };
    instance.postGupDeviceResponse = await sdfBuild.postGupDevice.call(this, instance, KEYNAME.DEVICEID, deviceId, deviceId, data);
}

exports.getServiceList = async function(instance) {

    listOfService = [];
    let gupServiceElement = instance.getGupCommonResponse.data.gupServiceElement;
    if(validator.isDefinedValue(gupServiceElement)){
        for(let serviceElement of gupServiceElement){
            let serviceId = messageUtils.getValueFromDN(serviceElement.dn, KEYNAME.SERVICEID);
            let appName = await globalService.getServiceNameByServiceId(instance, serviceId);
            if(validator.isDefinedValue(appName)){
                listOfService.push({
                    serviceName : appName
                })
            }
        }
    }

    listOfService.push({
        serviceName : instance.postSubscriptionsRequest.appName
    })

    return listOfService;
}

exports.isSameUid = function(instance) {
    let privateCommonData = instance.getGupCommonResponseByPrivate.data;    
    let privateUid;

    if(validator.isDefinedValue(privateCommonData.gupImpu)){
        for(let impu of privateCommonData.gupImpu){
            privateUid = messageUtils.getValueFromDN(impu.dn, KEYNAME.UID);
        }
    }else if(validator.isDefinedValue(privateCommonData.gupImpi)){
        for(let impi of privateCommonData.gupImpi){
            privateUid = messageUtils.getValueFromDN(impi.dn, KEYNAME.UID);
        }
    }

    LOG.DEBUG.DEBUG.call(this, instance, ` gupCommon1 uid : `+instance.uid);
    LOG.DEBUG.DEBUG.call(this, instance, ` gupCommon2 uid : `+privateUid);

    if(instance.uid === privateUid){
        LOG.DEBUG.DEBUG.call(this, instance, 'uid is match !!');
        return true;
    }else{
        LOG.DEBUG.DEBUG.call(this, instance, 'uid is not match !!');
        return false;
    }
}

exports.checkDataForPost = function(instance, res, publicId) {
    let data = instance.getGupCommonResponse.data;
    let privateId = instance.privateId? instance.privateId : "";
    let serviceProfileId = instance.serviceProfileId;
    
    if(STATUS.SUCCESS.RESULT_CODE === data.resultCode){
        if(validator.isMsisdn(publicId)){
            if(validator.isDefinedValue(data.gupSubProfile)){
                for(let subProfile of data.gupSubProfile){
                    if(subProfile.msisdn === publicId){
                        if(validator.isDefinedValue(subProfile.privateIds)){
                            privateId = subProfile.privateIds[0];
                        }
                        instance.privateId = privateId;
                        serviceProfileId = subProfile.serviceProfileId;         
                        instance.serviceProfileId = serviceProfileId;
                        instance.isAlreadyHaveSubProfile = true;
                    }
                }
            }
        }else{
            if(validator.isDefinedValue(data.gupImpu)){
                for(let impu of data.gupImpu){
                    if(impu.publicId.toLowerCase() === publicId.toLowerCase()){
                        if(validator.isDefinedValue(impu.privateIds)){
                            privateId = impu.privateIds[0];
                        }
                        instance.privateId = privateId;
                        serviceProfileId = impu.serviceProfileId;
                        instance.serviceProfileId = serviceProfileId;
                        instance.isAlreadyHaveImpu = true;
                    }
                }
            }
        }

        if(validator.isDefinedValue(data.gupImpi)){
            for(let impi of data.gupImpi){
                if(impi.privateId.toLowerCase() === privateId.toLowerCase()){
                    instance.isAlreadyHaveImpi = true;
                }
            }
        }

        if(validator.isDefinedValue(data.gupServiceProfile)){
            for(let serviceProfile of data.gupServiceProfile){
                let gupServiceProfileId = messageUtils.getValueFromDN(serviceProfile.dn, KEYNAME.SERVICEPROFILEID);
                if(gupServiceProfileId === serviceProfileId){
                    instance.isAlreadyHaveServiceProfile = true;
                }
            }
        }   

        if(validator.isDefinedValue(data.gupServiceElement)){
            for(let serviceElement of data.gupServiceElement){
                let gupServiceId = messageUtils.getValueFromDN(serviceElement.dn, KEYNAME.SERVICEID);
                let gupServiceProfileId = messageUtils.getValueFromDN(serviceElement.dn, KEYNAME.SERVICEPROFILEID);
                if(gupServiceProfileId === serviceProfileId && gupServiceId === instance.serviceId){
                    if(serviceElement.privateIds) {
                        if(serviceElement.privateIds.includes(privateId)) {
                            instance.isAlreadyHaveServiceElement = true;
                        }
                    } else {
                        if(serviceProfileId === gupServiceElement.serviceProfileId){
                            instance.isAlreadyHaveServiceElement = true;
                        }
                    }
                }
            }
        }
    }
}

generatePrivateId45Digit = function(gupImpis) {
    let privateId = generator.generatePrivateIdWithDomainByConfig();
    try {
        if(validator.isDefinedValue(gupImpis)){
            for(let gupImpi of gupImpis){
                let gupPrivateId = messageUtils.getValueFromDN(gupImpi.dn, KEYNAME.PRIVATEID);
                if(validator.equalsValue(privateId, gupPrivateId) === true){
                    privateId = generator.generatePrivateIdWithDomainByConfig();
                }
            }
        }
    } catch (error) {
    }
    return privateId;
}

exports.postGupImpu = async function(instance) {
    let postSubscriptionsRequest = instance.postSubscriptionsRequest;
    let publicId = postSubscriptionsRequest.idValue;
    let accountId;
    let privateId = instance.privateId;
    if(!validator.isDefinedValue(privateId)){
        privateId = generatePrivateId45Digit(undefined);
    }
    instance.privateId = privateId

    if(validator.isMsisdn(publicId) === true){
        accountId = publicId;
    }else{
        accountId = 'email_personal_1';
    }
    
    let data = {
        objectClass : 'gupImpu',
        subscriptionState : 'active',
        serviceProfileId : CONFIG.SERVICEPROFILEID_FBBID,
        accountId : accountId,
        privateIds : [privateId]
    };
    instance.serviceProfileId = CONFIG.SERVICEPROFILEID_FBBID;

    let pfPassword = getCredential(postSubscriptionsRequest.credential);
    if(!messageUtils.checkAppNameCredential(postSubscriptionsRequest.appName)){
        if(validator.isDefinedValue(pfPassword) === true){
            if(postSubscriptionsRequest.credential.type === 'password'){
                data.pfPassword = pfPassword;
            }else{
                data.ds3pin = pfPassword;
            }
        }
    }

    if(validator.isDefinedValue(postSubscriptionsRequest.accountType)){
        data.accountCategory = postSubscriptionsRequest.accountType;
    }
    
    // let productNoList = getProductNoList(instance);
    // if(validator.isDefinedValue(productNoList) === true){
        //     data.productNoList = productNoList;
        // }
        
    LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_IMPU_REQUEST);
    instance.isAlreadyHaveImpu = true;
    instance.isPostImpu = true;
    instance.nextState = STATE.W_POST_GUPIMPU;

    if(instance.postByImpiUid){
        //post by impi uid -> use private impi as keyName and keyValue
        instance.postGupImpuResponse = await sdfBuild.postGupImpu.call(this, instance, KEYNAME.PRIVATEID, instance.privateForPostImpu, publicId, data);
    }else{
        instance.postGupImpuResponse = await sdfBuild.postGupImpu.call(this, instance, KEYNAME.PUBLICID, publicId, publicId, data);
    }
}

exports.postGupSubProfile = async function(instance) {
    let postSubscriptionsRequest = instance.postSubscriptionsRequest;
    let privateId = instance.privateId;
    if(!validator.isDefinedValue(privateId)){
        privateId = generatePrivateId45Digit(undefined);
    }
    instance.privateId = privateId

    let data = {
        objectClass : 'gupSubProfile',
        subscriptionState : 'active',
        gupDataServLifestyle : 'decent',
        gupAuthenLevel : 'no',
        gupRegistrationLevel : 'no',
        serviceProfileId : CONFIG.SERVICEPROFILEID_IS_NOT_AIS,
        privateIds : [privateId]
    };
    instance.serviceProfileId = CONFIG.SERVICEPROFILEID_IS_NOT_AIS;

    let pfPassword = getCredential(postSubscriptionsRequest.credential);
    if(!messageUtils.checkAppNameCredential(postSubscriptionsRequest.appName)){
        if(validator.isDefinedValue(pfPassword) === true){
            if(postSubscriptionsRequest.credential.type === 'password'){
                data.pfPassword = pfPassword;
            }else{
                data.ds3pin = pfPassword;
            }
        }
    }
    
    LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_SUB_PROFILE_REQUEST);
    instance.isAlreadyHaveSubProfile = true;
    instance.isPostGupSub = true;
    instance.nextState = STATE.W_POST_GUPSUBPROFILE;
    instance.postGupSubProfileResponse = await sdfBuild.postGupSubProfile.call(this, instance, postSubscriptionsRequest.idValue, data);
}

exports.postModifyIdentityGupSubprofile = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_POST_MODIFYIDENTITY_GUPSUBPROFILE;
    instance.postModifyGupSubResponse = await sdfBuild.postModifyIdentity.call(this, instance, KEYNAME.MSISDN, instance.postSubscriptionsRequest.idValue, instance.uid);
    instance.isPostModifyGupSub = true;
}

exports.postModifyIdentityGupImpu = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_POST_MODIFYIDENTITY_GUPIMPU;
    instance.postModifyGupImpuResponse = await sdfBuild.postModifyIdentity.call(this, instance, KEYNAME.PUBLICID, instance.postSubscriptionsRequest.idValue, instance.uid);
    instance.isPostModifyGupImpu = true;
}

exports.postModifyIdentityGupImpi = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_POST_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_POST_MODIFYIDENTITY_GUPIMPI;
    instance.postModifyGupImpiResponse = await sdfBuild.postModifyIdentity.call(this, instance, KEYNAME.PRIVATEID, instance.privateId, instance.uid);
    instance.isPostModifyGupImpi = true;
}

exports.postGupImpi = async function(instance) {

    // let productNoList = getProductNoList(instance);
    let privateId = instance.privateId;
    let publicId = instance.postSubscriptionsRequest.idValue;
    
    let accountId;
    if(validator.isMsisdn(publicId) === true){
        accountId = publicId;
    }else{
        accountId = 'email_personal_1';
    }

    let data = {
        objectClass : 'gupImpi',
        subscriptionState : 'active',
        deviceType : 'stb',
        accountId : accountId
    }
    // if(validator.isDefinedValue(productNoList) === true){
    //     data.productNoList = productNoList;
    // }
    if(validator.isMsisdn(publicId) === true){
        data.msisdn = publicId;
    }else{
        data.publicIds = [publicId];
    }
    LOG.STAT.call(this, STAT.AAF_SDF_POST_GUP_IMPI_REQUEST);
    instance.isAlreadyHaveImpi = true;
    instance.isPostImpi = true;
    instance.nextState = STATE.W_POST_GUPIMPI;
    instance.postGupImpiResponse = await sdfBuild.postGupImpi.call(this, instance, KEYNAME.PRIVATEID, privateId, privateId, data);
}

exports.postGupServiceProfile = async function(instance) {
    instance.nextState = STATE.W_POST_GUPSERVICEPROFILE;
    let data = {
        objectClass : 'gupServiceProfile',
        subscriptionState : 'active'
    }

    LOG.STAT.call(this,STAT.AAF_SDF_POST_GUP_SERVICEPROFILE_REQUEST);
    instance.isAlreadyHaveServiceProfile = true;
    instance.isPostGupServiceProfile = true;
    instance.postGupServiceProfileResponse = await sdfBuild.postGupServiceProfile.call(this, instance, KEYNAME.UID, instance.uid, instance.serviceProfileId, data);
}

exports.mainProcessPost = async function(instance, res) {

    //if found impu/gupSub must have privateIds
    if(instance.isAlreadyHaveImpu || instance.isAlreadyHaveSubProfile){
        if(!validator.isDefinedValue(instance.privateId)){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'impu/gupSub not have privateIds', undefined , undefined)
            return;
        }

        if(!validator.isDefinedValue(instance.serviceProfileId)){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'impu/gupSub not have serviceProfileId', undefined , undefined)
            return;
        }
    }

    let data = instance.getGupCommonResponse.data;
    if(STATUS.SUCCESS.RESULT_CODE === data.resultCode ){
        //case email success must have impi
        if(!validator.isMsisdn(instance.postSubscriptionsRequest.idValue) && !validator.isDefinedValue(data.gupImpi)){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'case email but not have impi', undefined , undefined)
            return;
        }

        //case email success found impu must found impi match
        if(!validator.isMsisdn(instance.postSubscriptionsRequest.idValue) && !instance.isPostImpu && instance.isAlreadyHaveImpu &&  !instance.isAlreadyHaveImpi){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'case email found impu must bind with impi', undefined , undefined)
            return;
        }

        //case msisdn success must found gupSub
        if(validator.isMsisdn(instance.postSubscriptionsRequest.idValue) && !instance.isAlreadyHaveSubProfile){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'case msisdn success but not found GupSubProfile', undefined , undefined)
            return;
        }

        //case success must found uid
        if(!instance.uid){
            module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATABASE_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'case gupCommon success not found uid', undefined , undefined)
            return;
        }
    }

    if(validator.isMsisdn(instance.postSubscriptionsRequest.idValue)){
        if(!instance.isAlreadyHaveSubProfile){
            if(instance.isNewInsertSub){
                await module.exports.postGupSubProfile.call(this, instance);
                return;
            }else{
                await module.exports.postModifyIdentityGupSubprofile.call(this,instance);
                return;
            }
        }
    }else{
        if(!instance.isAlreadyHaveImpu){
            if(instance.isNewInsertSub || STATUS.SUCCESS.RESULT_CODE === data.resultCode){
                await module.exports.postGupImpu.call(this, instance);
                return;
            }else{
                await module.exports.postModifyIdentityGupImpu.call(this,instance);
                return;
            }
        }
    }
    
    if(!instance.isAlreadyHaveImpi){
        if(instance.isNewInsertSub){
            await module.exports.postGupImpi.call(this, instance);
            return;
        }else{
            await module.exports.postModifyIdentityGupImpi.call(this,instance);
            return;
        }
    }else if(!instance.isAlreadyHaveServiceProfile){
        await module.exports.postGupServiceProfile.call(this,instance);
        return;
    }else if(!instance.isAlreadyHaveServiceElement){
        await module.exports.postGupServiceElement.call(this,instance);
        return;
    }

    if(instance.isCreateDevice){
        await utils.postModifyIdentityGupDevice.call(this, instance);
        return;
    }

    if(instance.isAlreadyHaveServiceElement){
        module.exports.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, 'already have serviceElement', undefined , undefined)
        return;
    }

    instance.nextState = STATE.END;
    return;
}

exports.deleteGupImpu = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_IMPU_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPIMPU;
    let publicId = instance.postSubscriptionsRequest.idValue;
    instance.deleteGupImpuResponse = await sdfBuild.deleteGupImpu.call(this, instance, KEYNAME.PUBLICID, publicId, publicId);
    instance.isPostImpu = false;
}

exports.deleteGupImpi = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_IMPI_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPIMPI;
    let privateId = instance.privateId;
    instance.deleteGupImpiResponse = await sdfBuild.deleteGupImpi.call(this, instance, KEYNAME.PRIVATEID, privateId, privateId);
    instance.isPostImpi = false;
}

exports.deleteGupSubProfile = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_SUBPROFILE_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPSUBPROFILE;
    let msisdn = instance.postSubscriptionsRequest.idValue;
    instance.deleteGupSubProfileResponse = await sdfBuild.deleteGupSubProfile.call(this, instance, msisdn);
    instance.isPostGupSub = false;
}

exports.deleteGupDevice = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_DEVICE_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPDEVICE;
    let deviceId = instance.postSubscriptionsRequest.deviceId;
    instance.deleteDeviceResponse = await sdfBuild.deleteGupDevice.call(this, instance, KEYNAME.DEVICEID, deviceId, deviceId);
}

exports.deleteGupServiceProfile = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_SERVICE_PROFILE_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPSERVICEPROFILE;
    let uid = instance.uid;
    let serviceProfileId = instance.serviceProfileId;
    instance.deleteGupServiceProfileResponse = await sdfBuild.deleteGupServiceProfile.call(this, instance, KEYNAME.UID, uid, serviceProfileId);
    instance.isPostGupServiceProfile = false;
}

exports.deleteGupServiceElement = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_REQUEST);
    instance.nextState = STATE.W_DELETE_GUPSERVICEELEMENT;
    let uid = instance.uid;
    let serviceProfileId = instance.serviceProfileId;
    let serviceId = instance.serviceId;
    instance.deleteGupServiceElementResponses = await sdfBuild.deleteGupServiceElement.call(this, instance, KEYNAME.UID, uid, serviceProfileId, serviceId);
    instance.isPostGupServiceElement = false;
}

exports.deleteModifyIdentityGupDevice = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_DELETE_MODIFYIDENTITY_GUPDEVICE;
    let uid = instance.uid;
    let deviceId = instance.postSubscriptionsRequest.deviceId;
    instance.deleteModifyGupDeviceResponse = await sdfBuild.deleteModifyIdentity.call(this, instance, KEYNAME.DEVICEID, deviceId, uid);
}

exports.deleteModifyIdentityGupImpu = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_DELETE_MODIFYIDENTITY_GUPIMPU;
    let uid = instance.uid;
    let publicId = instance.postSubscriptionsRequest.idValue;
    instance.deleteModifyGupImpuResponse = await sdfBuild.deleteModifyIdentity.call(this, instance, KEYNAME.PUBLICID, publicId, uid);
    instance.isPostModifyGupImpu = false;
}

exports.deleteModifyIdentityGupImpi = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_DELETE_MODIFYIDENTITY_GUPIMPI;
    let uid = instance.uid;
    let privateId = instance.privateId;
    instance.deleteModifyGupImpiResponse = await sdfBuild.deleteModifyIdentity.call(this, instance, KEYNAME.PRIVATEID, privateId, uid);
    instance.isPostModifyGupImpi = false;
}

exports.deleteModifyIdentityGupSubProfile = async function(instance) {
    LOG.STAT.call(this, STAT.AAF_SDF_DELETE_MODIFY_IDENTITY_REQUEST);
    instance.nextState = STATE.W_DELETE_MODIFYIDENTITY_GUPSUBPROFILE;
    let uid = instance.uid;
    let msisdn = instance.postSubscriptionsRequest.idValue;
    instance.deleteModifyGupSubResponse = await sdfBuild.deleteModifyIdentity.call(this, instance, KEYNAME.MSISDN, msisdn, uid);
    instance.isPostModifyGupSub = false;
}

exports.mainProcessDelete = async function(instance) {
    
    if(instance.isPostGupServiceElement){
        await module.exports.deleteGupServiceElement.call(this,instance);
        return;
    }else if(instance.isPostGupServiceProfile){
        await module.exports.deleteGupServiceProfile.call(this,instance);
        return;
    }else if(instance.isPostImpi){
        await module.exports.deleteGupImpi.call(this, instance);
        return;
    }else if(instance.isPostModifyGupImpi){
        await module.exports.deleteModifyIdentityGupImpi.call(this, instance);
        return;
    }

    if(validator.isMsisdn(instance.postSubscriptionsRequest.idValue)){
        if(instance.isPostGupSub){
            await module.exports.deleteGupSubProfile.call(this, instance);
            return;
        }else if(instance.isPostModifyGupSub){
            await module.exports.deleteModifyIdentityGupSubProfile.call(this, instance);
            return;
        }
    }else{
        if(instance.isPostImpu){
            await module.exports.deleteGupImpu.call(this, instance);
            return;
        }else if(instance.isPostModifyGupImpu){
            await module.exports.deleteModifyIdentityGupImpu.call(this, instance);
            return;
        }
    }

    if(instance.isNewInsertSub){
        await module.exports.deleteSubscriber.call(this,instance);
        return;
    }

    instance.nextState = STATE.END;
    return;
}

exports.deleteSubscriber = async function(instance) {
    let publicId = instance.postSubscriptionsRequest.idValue;
    let data = {};
    if(validator.isMsisdn(publicId) === true){
        data.msisdn = publicId;
    }else{
        data.publicId = publicId;
    }
    
    LOG.STAT.call(this, STAT.AAF_DSMP_DELETE_SUBSCRIBER_REQUEST);
    instance.nextState = STATE.W_DELETE_SUBSCRIBER;
    instance.deleteSubscriberResponse = await dsmpBuild.deleteInsertSubscriber.call(this, instance, data);
}