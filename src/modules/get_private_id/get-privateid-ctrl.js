const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./get-privateid-utils');
const idle = require('./get-privateid-idle');
const getGupCommon = require('./get-privateid-get-gupCommon');

module.exports.process = async function(req, res) {
    let instance = req.instance; //get instance
    let command = require('../../constants/fz-aaf-command-name').GET_PRIVATEID;
    let node = require('../../constants/fz-node-name').AAF;
    let continueProcess = true;

    instance.cmd = command; //set command

    try {
        let publicId = req.query.publicId ? req.query.publicId : '';
        LOG.INIT.call(this, req, instance.initInvoke, node, command, publicId); //init debugLog, detailLog, summaryLog, stat

        let state = STATE.IDLE;
        while(continueProcess){
            LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${state}] ####################`);
            if(state === STATE.IDLE){
                await idle.call(this, req, res, instance);
            }else if(state === STATE.W_GET_GUPCOMMON){
                await getGupCommon.call(this, req, res, instance);
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