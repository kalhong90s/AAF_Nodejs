const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const parser = require('../../message/parser/request-parser');
const STAT = require('../../constants/fz-stat');
const idle = require('./pushnoti-idle');
const e01 = require('./pushnoti-query-e01-serviceofpayload');
const pantry = require('./pushnoti-pantry-pushnotificationInfo');
const getGupCommon = require('./pushnoti-get-gupcommon');
const gen = require('./pushnoti-generatepartnerspecificprivateid');
const external = require('./pushnoti-external-pushnotificationInfo');
const utils = require('./pushnoti-utils');

module.exports.process = async function(req, res) {
    let instance = req.instance; //get instance
    let command = require('../../constants/fz-aaf-command-name').POST_PUSHNOTIFICATIONINFO;
    let node = require('../../constants/fz-node-name').AAF;
    let continueProcess = true;

    instance.cmd = command; //set command

    try {
        let pushnotificationInfoRequest = parser(req);
        instance.pushnotificationInfoRequest = pushnotificationInfoRequest;
        let subscriptionId = utils.getSubscriptionIdValue(pushnotificationInfoRequest.subscriptionId);
        let identity = subscriptionId ? subscriptionId[1] : '';
        LOG.INIT.call(this, req, instance.initInvoke, node, command, identity); //init debugLog, detailLog, summaryLog, stat

        let state = STATE.IDLE;
        while(continueProcess){
            LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${state}] ####################`);
            if(state === STATE.IDLE){
                await idle.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPCOMMON){
                await getGupCommon.call(this, req, res, instance);
            }else if(state === STATE.W_QUERY_E01_SERVICEOFPAYLOAD){
                await e01.call(this, req, res, instance);
            }else if(state === STATE.W_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID){
                await gen.call(this, req, res, instance);
            }else if(state === STATE.W_EXTERNAL_PUSHNOTIFICATIONINFO){
                await external.call(this, req, res, instance);
            }else if(state === STATE.W_PANTRY_PUSHNOTIFICATIONINFO){
                await pantry.call(this, req, res, instance);
            }else{
                continueProcess = false;
                break;
            }
            
            state = instance.nextState;
            instance.nextState = STATE.END;
        }
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this, instance, `[APPLICATION:ERROR] : ${error.message}`);
        LOG.DEBUG.ERROR.call(this, instance, `[APPLICATION:ERROR] : ${error.message}`);
        utils.getPrivateIdResponse.call(this, instance, res, STATUS.SYSTEM_ERROR, undefined, undefined, undefined, error.message, STAT.AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE);
    }
}