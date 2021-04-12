const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./utility-postSubscription');
const parser = require('../../message/parser/request-parser');
const idle = require('./idle');
const getGupGlobalService = require('./getGupGlobalService');
const getGupCommon = require('./getGupCommon');
const getStbManageDeviceProfile = require('./getStbManageDeviceProfile');
const getGupDevice = require('./getGupDevice');
const getGupCommonByPrivateId = require('./getGupCommonByPrivateId');
const postGupServiceElement = require('./postGupServiceElement');
const postModifyIdentityGupDevice = require('./postModifyIdentityGupDevice');
const postModifyIdentityGupImpu = require('./postModifyIdentityGupImpu');
const postModifyIdentityGupImpi = require('./postModifyIdentityGupImpi');
const postModifyIdentityGupSubProfile = require('./postModifyIdentityGupSubProfile');
const postGupDevice = require('./postGupDevice');
const postGupImpu = require('./postGupImpu');
const postGupImpi = require('./postGupImpi');
const postGupSubProfile = require('./postGupSubProfile');
const postGupServiceProfile = require('./postGupServiceProfile');
const postSubscriber = require('./postSubscriber');
const deleteGupSubProfile = require('./deleteGupSubProfile');
const deleteGupImpu = require('./deleteGupImpu');
const deleteGupImpi = require('./deleteGupImpi');
const deleteModifyIdentityGupDevice = require('./deleteModifyIdentityGupDevice');
const deleteModifyIdentityGupImpu = require('./deleteModifyIdentityGupImpu');
const deleteModifyIdentityGupImpi = require('./deleteModifyIdentityGupImpi');
const deleteModifyIdentityGupSubProfile = require('./deleteModifyIdentityGupSubProfile');
const deleteGupServiceProfile = require('./deleteGupServiceProfile');
const deleteGupServiceElement = require('./deleteGupServiceElement');
const deleteSubscriber = require('./deleteSubscriber');
const deleteGupDevice = require('./deleteGupDevice');

module.exports.postSubscriptionController = async function(req, res){
    let instance = req.instance; //get instance
    let command = require('../../constants/fz-aaf-command-name').POST_SUBSCRIPTIONS;
    let node = require('../../constants/fz-node-name').AAF;
    let continueProcess = true;

    instance.cmd = command; //set command

    try {
        let postSubscriptionsRequest = parser(req);

        let idValue = postSubscriptionsRequest.idValue ? postSubscriptionsRequest.idValue : '';
        LOG.INIT.call(this, req, instance.initInvoke, node, command, idValue);

        let state = STATE.IDLE;
        while(continueProcess){
            LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${state}] ####################`);
            if(state === STATE.IDLE){
                await idle.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPGLOBALSERVICE){
                await getGupGlobalService.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPCOMMON){
                await getGupCommon.call(this, req, res, instance);
            }else if(state === STATE.W_GET_STBMANAGEDEVICEPROFILE){
                await getStbManageDeviceProfile.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPDEVICE){
                await getGupDevice.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPCOMMON_BY_PRIVATEID){
                await getGupCommonByPrivateId.call(this, req, res, instance);
            }else if(state === STATE.W_POST_MODIFYIDENTITY_GUPDEVICE){
                await postModifyIdentityGupDevice.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPDEVICE){
                await postGupDevice.call(this, req, res, instance);
            }else if(state === STATE.W_POST_MODIFYIDENTITY_GUPIMPU){
                await postModifyIdentityGupImpu.call(this, req, res, instance);
            }else if(state === STATE.W_POST_MODIFYIDENTITY_GUPIMPI){
                await postModifyIdentityGupImpi.call(this, req, res, instance);
            }else if(state === STATE.W_POST_MODIFYIDENTITY_GUPSUBPROFILE){
                await postModifyIdentityGupSubProfile.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPIMPU){
                await postGupImpu.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPIMPI){
                await postGupImpi.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPSUBPROFILE){
                await postGupSubProfile.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPSERVICEPROFILE){
                await postGupServiceProfile.call(this, req, res, instance);
            }else if(state === STATE.W_POST_GUPSERVICEELEMENT){
                await postGupServiceElement.call(this, req, res, instance);
            }else if(state === STATE.W_POST_SUBSCRIBER){
                await postSubscriber.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_MODIFYIDENTITY_GUPIMPU){
                await deleteModifyIdentityGupImpu.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_MODIFYIDENTITY_GUPIMPI){
                await deleteModifyIdentityGupImpi.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_MODIFYIDENTITY_GUPSUBPROFILE){
                await deleteModifyIdentityGupSubProfile.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPIMPU){
                await deleteGupImpu.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPIMPI){
                await deleteGupImpi.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPSUBPROFILE){
                await deleteGupSubProfile.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPSERVICEPROFILE){
                await deleteGupServiceProfile.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPSERVICEELEMENT){
                await deleteGupServiceElement.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_MODIFYIDENTITY_GUPDEVICE){
                await deleteModifyIdentityGupDevice.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_GUPDEVICE){
                await deleteGupDevice.call(this, req, res, instance);
            }else if(state === STATE.W_DELETE_SUBSCRIBER){
                await deleteSubscriber.call(this, req, res, instance);
            }else{
                continueProcess = false;
                break;
            }
            
            state = instance.nextState;
            instance.nextState = STATE.END;
        }
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this,instance, `[APPLICATION:ERROR] : ${error.message}`);
        utils.postSubscriptionsResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, STAT.AAF_RETURN_POST_SUBSCRIPTION_ERROR,undefined, undefined, error.message, undefined,undefined);
    }
}