const LOG = require('../../manager/log/log-manager');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postAuthenticateCustomer');
const sdfValidate = require('../../message/validate/sdf-validate');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const STATE = require('../../constants/fz-state');
const NODE = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const messageUtils = require('../../utils/message-utils');
const CODER = require('../../utils/coder');
const IDENTITYTYPE = require('../../constants/fz-identity-type');
const globalService = require('../../utils/globalService');
const KEYNAME = require('../../constants/fz-key-name');
const CONFIG = require('../../configurations/config');

module.exports = async function (req, res, instance) {
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_GUPCOMMON;

    let getGupCommonResponse = instance.getGupCommonResponse;
    instance.currentState = STATE.W_GET_GUPCOMMON;
    let getGupCommonData;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getGupCommonResponse)){
        getGupCommonData = getGupCommonResponse.data;
        if(validator.isDefinedValue(getGupCommonData)){
            resultCode = getGupCommonData.resultCode;
            resultDesc = getGupCommonData.resultDescription;
            errMessageStacks = getGupCommonData.errorMessageStack;
        }else{
            resultCode = getGupCommonResponse.statusCode;
            resultDesc = getGupCommonResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try {
        sdfValidate.validateGetGupCommonResponse(getGupCommonResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RESPONSE);
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if (error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER) {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_BAD);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        } else if (error.event === EXCEPTIONEVENT.DATA_NOT_FOUND) {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        } else if (error.event === EXCEPTIONEVENT.SYSTEM_ERROR) {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        } else if (error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT) {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, getGupCommonData.errorCode, getGupCommonData.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        } else if (error.event === EXCEPTIONEVENT.CONNECTION_ERROR) {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, getGupCommonData.errorCode, getGupCommonData.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_CONNECTION_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        } else {
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, getGupCommonData.errorCode, getGupCommonData.errorMessage);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, error.message, errMessageStack, errMessageStacks)
            return;
        }
    }

    let postAuthenticateCustomerRequest = instance.postAuthenticateCustomerRequest;
    let appName = postAuthenticateCustomerRequest.appName;
    let publicId = postAuthenticateCustomerRequest.idValue;
    let credential = postAuthenticateCustomerRequest.credential;
    let authenticateServiceIdFlag = postAuthenticateCustomerRequest.authenticateServiceIdFlag;
    let authenServiceResult = true;
    let authenPasswordResult = false;
    let flagCheckImpuOrGupSub = false;
    let serviceId = instance.serviceId;
    let listOfPublicId = [];
    let privateIdForResponse;

    //check authenticateServiceIdFlag
    if(!validator.isDefinedValue(authenticateServiceIdFlag) || authenticateServiceIdFlag.toLowerCase() == "y"){
        authenServiceResult = false;
        if(validator.isDefinedValue(getGupCommonData.gupServiceElement)){
            for(let gupServiceElement of getGupCommonData.gupServiceElement){
                let gupServiceId = messageUtils.getValueFromDN(gupServiceElement.dn, KEYNAME.SERVICEID);
                
                if(gupServiceId === serviceId){
                    authenServiceResult = true;
                }

                //check password serviceElement
                if(messageUtils.checkAppNameCredential(appName)){
                    if(credential.type === 'password' && credential.value === gupServiceElement.pfPassword){
                        authenPasswordResult = true;
                    }else if(credential.type === 'pincode' && credential.value === gupServiceElement.ds3pin){
                        authenPasswordResult = true;
                    }
                }
            }         
        }
    }

    if(!authenServiceResult){
        utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "authenFlag Y but serviceId Not Match!", undefined, undefined)
        return;
    }

    if(validator.isMsisdn(publicId)){
        if(!validator.isDefinedValue(getGupCommonData.gupSubProfile)){
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "GupSubProfile is missing!", undefined, undefined)
            return;
        }

        for(let gupSubProfile of getGupCommonData.gupSubProfile){
            let listOfService = [];

            //checkPassword gupSub
            if(gupSubProfile.msisdn == publicId){
                flagCheckImpuOrGupSub = true;
                if((validator.isDefinedValue(authenticateServiceIdFlag) && authenticateServiceIdFlag.toLowerCase() == "n")
                || !messageUtils.checkAppNameCredential(appName)){
                    if(credential.type === 'password' && credential.value === gupSubProfile.pfPassword){
                        authenPasswordResult = true;
                    }else if(credential.type === 'pincode' && credential.value === gupSubProfile.ds3pin){
                        authenPasswordResult = true;
                    }
                }
            }

            //get privateId and uid for response
            let privateIdOfGupSub = gupSubProfile.privateIds?gupSubProfile.privateIds[0]:"";
            if(validator.isDefinedValue(getGupCommonData.gupImpi)){
                for(let gupImpi of getGupCommonData.gupImpi){
                    if(gupImpi.privateId === privateIdOfGupSub){
                        privateIdForResponse = privateIdOfGupSub;
                    }
                }
            }
            instance.uid = messageUtils.getValueFromDN(gupSubProfile.dn, KEYNAME.UID)
            
            //get listOfService
            let identities = {};
            identities.identity = gupSubProfile.msisdn;
            identities.identityType = "msisdn"
            identities.state = gupSubProfile.subscriptionState;

            if(listOfService.length == 0){
                let defaultService = utils.setListOfService(gupSubProfile);
                listOfService.push(defaultService);
            }
            if(validator.isDefinedValue(getGupCommonData.gupServiceElement)){
                let serviceProfileCheck = false;

                if(validator.isDefinedValue(getGupCommonData.gupServiceProfile)){
                    for(let gupServiceProfile of getGupCommonData.gupServiceProfile){
                        if(messageUtils.getValueFromDN(gupServiceProfile.dn, KEYNAME.SERVICEPROFILEID) == gupSubProfile.serviceProfileId){
                            serviceProfileCheck = true;
                        }
                    }
                }

                if(!serviceProfileCheck){
                    utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.ACCESS_DENIED, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "gupServiceProfile not match!", undefined, undefined)
                    return;
                }

                for(let gupServiceElement of getGupCommonData.gupServiceElement){
                    let gupServiceId = messageUtils.getValueFromDN(gupServiceElement.dn, KEYNAME.SERVICEID);
                    let gupServiceProfileId = messageUtils.getValueFromDN(gupServiceElement.dn, KEYNAME.SERVICEPROFILEID);

                    if(gupServiceProfileId === gupSubProfile.serviceProfileId && gupServiceElement.privateIds.includes(privateIdOfGupSub)){
                        let serviceName = await globalService.getServiceNameByServiceId(instance, gupServiceId, instance.getGupGlobalServiceResponse);
                        let service = utils.setListOfService(gupServiceElement, serviceName);
                        listOfService.push(service);
                    }
                }
            }

            identities.listOfService = listOfService;
            listOfPublicId.push(identities);
        }
    } else {
        //case email
        if(!validator.isDefinedValue(getGupCommonData.gupImpu)){
            utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "GupSubProfile is missing!", undefined, undefined)
            return;
        }

        for(let gupImpu of getGupCommonData.gupImpu){
            let listOfService = [];

            //checkPassword impu
            if(gupImpu.publicId.toLowerCase() == publicId.toLowerCase()){
                flagCheckImpuOrGupSub = true;
                if((validator.isDefinedValue(authenticateServiceIdFlag) && authenticateServiceIdFlag.toLowerCase() == "n")
                || !messageUtils.checkAppNameCredential(appName)){
                    if(credential.type === 'password' && credential.value === gupImpu.pfPassword){
                        authenPasswordResult = true;
                    }else if(credential.type === 'pincode' && credential.value === gupImpu.ds3pin){
                        authenPasswordResult = true;
                    }
                }
            }

            //get privateId and uid for response
            let privateIdOfImpu = gupImpu.privateIds?gupImpu.privateIds[0]:"";
            if(validator.isDefinedValue(getGupCommonData.gupImpi)){
                for(let gupImpi of getGupCommonData.gupImpi){
                    if(gupImpi.privateId === privateIdOfImpu){
                        privateIdForResponse = privateIdOfImpu;
                    }
                }
            }
            instance.uid = messageUtils.getValueFromDN(gupImpu.dn, KEYNAME.UID)
            
            //get listOfService
            let identities = {};
            identities.identity = gupImpu.publicId;
            identities.identityType = "publicId"
            identities.state = gupImpu.subscriptionState;

            if(listOfService.length == 0){
                let defaultService = utils.setListOfService(gupImpu);
                listOfService.push(defaultService);
            }
            if(validator.isDefinedValue(getGupCommonData.gupServiceElement)){
                let serviceProfileCheck = false;

                if(validator.isDefinedValue(getGupCommonData.gupServiceProfile)){
                    for(let gupServiceProfile of getGupCommonData.gupServiceProfile){
                        if(messageUtils.getValueFromDN(gupServiceProfile.dn, KEYNAME.SERVICEPROFILEID) == gupImpu.serviceProfileId){
                            serviceProfileCheck = true;
                        }
                    }
                }

                if(!serviceProfileCheck){
                    utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.ACCESS_DENIED, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "gupServiceProfile not match!", undefined, undefined)
                    return;
                }

                for(let gupServiceElement of getGupCommonData.gupServiceElement){
                    let gupServiceId = messageUtils.getValueFromDN(gupServiceElement.dn, KEYNAME.SERVICEID);
                    let gupServiceProfileId = messageUtils.getValueFromDN(gupServiceElement.dn, KEYNAME.SERVICEPROFILEID);

                    if(gupServiceProfileId === gupImpu.serviceProfileId && gupServiceElement.privateIds.includes(privateIdOfImpu)){
                        let serviceName = await globalService.getServiceNameByServiceId(instance, gupServiceId, instance.getGupGlobalServiceResponse);
                        let service = utils.setListOfService(gupServiceElement, serviceName);
                        listOfService.push(service);
                    }
                }
            }

            identities.listOfService = listOfService;
            listOfPublicId.push(identities);
        }
    }
    
    if(!flagCheckImpuOrGupSub){
        utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.ACCESS_DENIED, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "impu/gupSub not match with request!", undefined, undefined)
        return;
    }

    if(!authenPasswordResult){
        utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.ACCESS_DENIED, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR, undefined, undefined, undefined, "Password Not Match!", undefined, undefined)
        return;
    }

    utils.postAuthenticateCustomerResponse.call(this, instance, res, STATUS.SUCCESS, STAT.AAF_RETURN_POST_AUTHENTICATECUSTOMER_RESPONSE, instance.uid, privateIdForResponse, listOfPublicId, "Success", undefined, undefined)
    return;
}