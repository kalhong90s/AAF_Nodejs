const LOG = require('../../manager/log/log-manager');
const STAT = require('../../constants/fz-stat');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const util = require('./utility-checkPublicIdAvailability');
const parser = require('../../message/parser/request-parser');
const pantryValidate = require('../../message/validate/aaf-validate');
const sdf = require('../../message/builder/sdf-builder');
const sdfValidate = require('../../message/validate/sdf-validate');
const messageUtil = require('../../utils/message-utils');
const globalService = require('../../utils/globalService');
const FzStat = require('../../constants/fz-stat');
const FzNode = require('../../constants/fz-node-name');
const exception = require('../../constants/fz-exception-event');
const validator = require('../../utils/validator');
const messageUtils = require('../../utils/message-utils');
const IDENTITYTYPE = require('../../constants/fz-identity-type');
const KEYNAME = require('../../constants/fz-key-name');
const COMMAND = require('../../constants/fz-client-command-name');

module.exports.postCheckPublicIdAvailabilityController = async function(req, res){
    
	let instance = req.instance;
    let command = require('../../constants/fz-aaf-command-name').POST_CHECKPUBLICIDAVAILABILITY;
    let node = require('../../constants/fz-node-name').AAF;
    let nodeName
    let commandName
    let publicId;
    let serviceId;
    let appName;
    let isFirstRegister = false;

    instance.cmd = command;

    
    // IDLE
    let CPARequest = parser(req);
    idType = CPARequest.idType;
    publicId = CPARequest.idValue;
    LOG.INIT.call(this,req, instance.initInvoke, node, command, publicId); //init debugLog, detailLog, summaryLog, stat    
    LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${STATE.IDLE}] ####################`);

    try {
        appName = CPARequest.appName;
        instance.appName = appName;
        LOG.DEBUG.DEBUG.call(this,req, `postCheckPublicIdAvailabilityController is process`);
        pantryValidate.validatePostCheckPublicAvailability(CPARequest);
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this,instance, `Error : ${error.message}`);
        LOG.STAT.call(this,STAT.AAF_RECEIVED_BAD_POST_CHECKPUBLICAVAILABILITY_REQUEST);
        return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.MISSING_OR_INVALID_PARAMETER, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR);
    }
    LOG.STAT.call(this,STAT.AAF_RECEIVED_POST_CHECKPUBLICAVAILABILITY_REQUEST);

    if(validator.equalsValue(idType, IDENTITYTYPE.EMAIL)){
        if(messageUtils.checkAppNameAddSuffix(appName)){
            publicId = messageUtils.convertPublicIdToAppNameDomainFormat(publicId, appName);
        }
        publicId = messageUtils.convertPublicIdToProtocolFormat(publicId);
    }

    // GET GUPGLOBALSERVICE
    let isGetGupGlobalService = await globalService.haveToQueryGupGlobalService.call(this,instance, appName);
    let getGupGlobalServiceResponse;
    if(isGetGupGlobalService === true) {
        LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_GLOBAL_SERVICE_REQUEST);
        getGupGlobalServiceResponse = await sdf.getGupGlobalService.call(this,instance);  
        LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${STATE.W_GET_GUPGLOBALSERVICE}] ####################`);
        nodeName = FzNode.SDF;
        commandName = COMMAND.GET_GUPGLOBALSERVICE;
        let getGupGlobalServiceData;
        let resultCode;
        let resultDesc;
        let errMessageStacks;
    
        if(validator.isDefinedValue(getGupGlobalServiceResponse)){
            getGupGlobalServiceData = getGupGlobalServiceResponse.data;
            if(validator.isDefinedValue(getGupGlobalServiceData)){
                resultCode = getGupGlobalServiceData.resultCode;
                resultDesc = getGupGlobalServiceData.resultDescription;
                errMessageStacks = getGupGlobalServiceData.errorMessageStack;
            }else{
                resultCode = getGupGlobalServiceResponse.statusCode;
                resultDesc = getGupGlobalServiceResponse.statusMessage;
            }
        }
        let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)
        try{
            sdfValidate.validateGetGupGlobalServiceResponse(getGupGlobalServiceResponse);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RESPONSE);
            await globalService.manangeServiceId.call(this, instance, getGupGlobalServiceResponse);
            serviceId = await globalService.getServiceIdByAppName.call(this,instance, CPARequest.appName, getGupGlobalServiceResponse);
        }catch(error){
            LOG.DEBUG.DEBUG.call(this,req, `Error : ${error.message}`);
            if(error.event === exception.MISSING_OR_INVALID_PARAMETER){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_BAD);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else if(error.event === exception.DATA_NOT_FOUND){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_NOT_FOUND, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else if(error.event === exception.DATA_EXIST){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_EXIST, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else if(error.event === exception.SYSTEM_ERROR){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else if(error.event === exception.CONNECTION_TIMEOUT){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_TIMEOUT);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.CONNECTION_TIMEOUT, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else if(error.event === exception.CONNECTION_ERROR){
                LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_CONNECTION_ERROR);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.CONNECTION_ERROR, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }else{
                LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR);
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
            }
        }

    }else{
        serviceId = instance.serviceId;
    }

    LOG.DEBUG.DEBUG.call(this, instance, `ServicId is ${serviceId}`);
    if(validator.isDefinedValue(serviceId) === false){
        util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_NOT_FOUND, "Not found serviceId from GupGlobal", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined);
        return;
    }

    // GET GUPCOMMON
    let keyName = validator.isMsisdn(publicId)?KEYNAME.MSISDN:KEYNAME.PUBLICID;
    LOG.STAT.call(this, STAT.AAF_SDF_GET_GUP_COMMON_REQUEST);
    let getGupCommonResponse = await sdf.getGupCommon.call(this, instance, keyName, publicId);
    LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${STATE.W_GET_GUPCOMMON}] ####################`);
    nodeName = FzNode.SDF;
    commandName = COMMAND.GET_GUPCOMMON;
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
        
        LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RESPONSE);
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this,req, `Error : ${error.message}`);
        if(error.event === exception.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_BAD);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }else if(error.event === exception.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            isFirstRegister = true;
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SUCCESS, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE, undefined, undefined, undefined, isFirstRegister);
        }else if(error.event === exception.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_EXIST, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }else if(error.event === exception.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }else if(error.event === exception.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.CONNECTION_TIMEOUT, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }else if(error.event === exception.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR.call(this, instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_CONNECTION_ERROR);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.CONNECTION_ERROR, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }else{
            LOG.STAT.call(this,FzStat.AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR);
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, error.message, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, errMessageStack, errMessageStacks);
        }
    }

    isFirstRegister = false;
    if(validator.isMsisdn(publicId)){
        if(util.isAlreadyHaveGupSubProfile.call(this, instance, publicId, getGupCommonResponse, isFirstRegister)){
            if("active" !== instance.subscriptionState.toLowerCase()){
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.INACTIVE_USER, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }

            if(!validator.isDefinedValue(instance.serviceProfileId)){
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATABASE_ERROR, "Not found serviceProfileId in gupSub", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }

            if(util.isAlreadyHaveGupImpi.call(this, instance, publicId, getGupCommonResponse, isFirstRegister)) {
                if(util.isAlreadyHaveService.call(this, instance, serviceId, getGupCommonResponse)){
                    return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_EXIST, "Already have service", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, instance.privateId, isFirstRegister, instance.uid);
                } else {
                    return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SUCCESS, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE, undefined, undefined, instance.privateId, isFirstRegister, instance.uid);
                }
            } else {
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, "Not found gupImpi", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }
        } else {
            isFirstRegister = true;
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SUCCESS, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE, undefined, undefined, undefined, isFirstRegister, undefined);
        }
    }else{
        if(util.isAlreadyHaveGupImpu.call(this, instance, publicId, getGupCommonResponse, isFirstRegister)) {
            if("active" !== instance.subscriptionState.toLowerCase()){
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.INACTIVE_USER, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }

            if(!validator.isDefinedValue(instance.serviceProfileId)){
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATABASE_ERROR, "Not found serviceProfileId in impu", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }

            if(util.isAlreadyHaveGupImpi.call(this, instance, publicId, getGupCommonResponse, isFirstRegister)) {
                if(util.isAlreadyHaveService.call(this, instance, serviceId, getGupCommonResponse)){
                    return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.DATA_EXIST, "Already have service", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, instance.privateId, isFirstRegister, instance.uid);
                } else {
                    return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SUCCESS, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE, undefined, undefined, instance.privateId, isFirstRegister, instance.uid);
                }
            } else {
                return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SYSTEM_ERROR, "Not found gupImpi", STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR, undefined, undefined, undefined, isFirstRegister, instance.uid);
            }
        } else {
            isFirstRegister = true;
            return util.postCheckPublicIdAvailabilityResponse.call(this,instance, res, STATUS.SUCCESS, undefined, STAT.AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE, undefined, undefined, undefined, isFirstRegister, undefined);
        }
    }

}