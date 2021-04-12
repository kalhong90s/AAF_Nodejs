const LOG = require('../../manager/log/log-manager');
const NODE = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const STATE = require('../../constants/fz-state');
const STAT = require('../../constants/fz-stat');
const STATUS = require('../../constants/fz-status');
const DEVICE_STATE = require('../../constants/fz-device-stat');
const validator = require('../../utils/validator');
const sdfValidate = require('../../message/validate/sdf-validate');
const utils = require('./utility-postSubscription');
const messageUtils = require('../../utils/message-utils');
const CONFIG = require('../../configurations/config');
const EXCEPTIONEVENT = require('../../constants/fz-exception-event');

module.exports = async function(req, res, instance) {
    instance.currentState = STATE.W_GET_STBMANAGEDEVICEPROFILE;
    let nodeName = NODE.SDF;
    let commandName = COMMAND.GET_STBMANAGEDEVICEPROFILE;
    let getStbManageDeviceProfileResponse = instance.getStbManageDeviceProfile;
    delete instance.getStbManageDeviceProfile;
    let getStbManageDeviceProfile;
    let resultCode;
    let resultDesc;
    let errMessageStacks;

    if(validator.isDefinedValue(getStbManageDeviceProfileResponse)){
        getStbManageDeviceProfile = getStbManageDeviceProfileResponse.data;
        if(validator.isDefinedValue(getStbManageDeviceProfile)){
            resultCode = getStbManageDeviceProfile.resultCode;
            resultDesc = getStbManageDeviceProfile.resultDescription;
            errMessageStacks = getStbManageDeviceProfile.errMessageStack;
        }else{
            resultCode = getStbManageDeviceProfileResponse.statusCode;
            resultDesc = getStbManageDeviceProfileResponse.statusMessage;
        }
    }

    let errMessageStack = messageUtils.errorMessageStack(nodeName, resultCode, resultDesc)

    try{
        sdfValidate.validateGetStbManageDeviceProfile(getStbManageDeviceProfileResponse);
        LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RESPONSE);
    }catch(error){
        LOG.DEBUG.DEBUG.call(this, instance, `Error : ${error.message}`);
        if(error.event === EXCEPTIONEVENT.MISSING_OR_INVALID_PARAMETER){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_BAD);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.DATA_NOT_FOUND){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_NOT_FOUND, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.DATA_EXIST){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.DATA_EXIST, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.SYSTEM_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_TIMEOUT){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_TIMEOUT);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_TIMEOUT, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else if(error.event === EXCEPTIONEVENT.CONNECTION_ERROR){
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_CONNECTION_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.CONNECTION_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }else{
            LOG.SUMMARYLOG.ERROR(instance, nodeName, commandName, resultCode, resultDesc);
            LOG.STAT.call(this, STAT.AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_ERROR);
            utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, error.message, errMessageStack , errMessageStacks)
        }
        return;
    }

    let stbManagedDeviceProfile = getStbManageDeviceProfile.stbManagedDeviceProfile;
    let warehouseState;
    if(validator.isDefinedValue(stbManagedDeviceProfile) === true){
        for(let data of stbManagedDeviceProfile){
            warehouseState = data.warehouseState;
            if(validator.isDefinedValue(warehouseState) === false){
                continue;
            }
            
            let statusList = CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_STBMANAGEDEVICE_STATUS_LIST;
            for(let value of statusList){
                if(value.toLowerCase() === warehouseState.toLowerCase()){
                    await utils.getGupDevice.call(this, instance, instance.postSubscriptionsRequest.deviceId);
                    return;
                }
            }
    
        }
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.ACCESS_DENIED, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, `stbManageDeviceProfile warehouseState is ${warehouseState}`, undefined , errMessageStacks)
        return;
    }
    utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR, undefined, undefined, `not found stbManageDeviceProfile`, undefined , errMessageStacks)
    return;
}