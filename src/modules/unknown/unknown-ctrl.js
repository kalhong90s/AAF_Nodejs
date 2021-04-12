const STATUS = require('../../constants/fz-status');
const STAT = require('../../constants/fz-stat');
const COMMANDNAME = require('../../constants/fz-aaf-command-name');
const LOG = require('../../manager/log/log-manager');
const STATE = require('../../constants/fz-state');

module.exports.process = async function(req, res) {
    let instance = req.instance;
    let sessionID = req.sessionID;
    let command = COMMANDNAME.UNKNOWN;
    instance.cmd = command;
    let statusCode = STATUS.UNKNOWN_API;
    LOG.INIT.call(this, req, instance.initInvoke, 'AAF', command, '');
    LOG.DEBUG.DEBUG.call(this, instance, `#################### [${command}][${STATE.END}] ####################`);
    try {
        LOG.STAT.call(this, STAT.AAF_RECEIVED_UNKNOWN_REQUEST);
        //rollback
        //await unknownFunctions.rollback(instance);
        //console.debug(instance.count);
    } catch (error) {
        LOG.DEBUG.DEBUG.call(this, instance, error.message);
        statusCode = STATUS.SYSTEM_ERROR;
    }

    let responseMessage = {
        resultCode : statusCode.RESULT_CODE,
        developerMessage : statusCode.DEVELOPER_MESSAGE
    };
    res.status(statusCode.STATUS_CODE).send(responseMessage);
    LOG.STAT.call(this, STAT.AAF_RECEIVED_UNKNOWN_RESPONSE);
    //LOG.DETAILLOG.END.call(this, instance);
}