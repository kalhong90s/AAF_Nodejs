const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');
const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const utils = require('./getcontactnumber-utils');
const idle = require('./getcontactnumber-idle');
const getGupCommon = require('./getcontactnumber-get-gupCommon');

module.exports.process = async function(req, res) {
    let instance = req.instance; //get instance
    let command = require('../../constants/fz-aaf-command-name').GET_CONTACTNUMBER;
    let node = require('../../constants/fz-node-name').AAF;
    let continueProcess = true;
    
    instance.cmd = command; //set command

    try {
        let identity = req.params.idValue;
        LOG.INIT.call(this, req, instance.initInvoke, node, command, identity); //init debugLog, detailLog, summaryLog, stat

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
        utils.getContactNumberResponse.call(this, instance, res, STATUS.SYSTEM_ERROR,undefined,  undefined, undefined, error.message, STAT.AAF_RETURN_GET_CONTACTNUMBER_ERROR);
    }
};