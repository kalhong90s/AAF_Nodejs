const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const optAttr = require('./http-option-attribute');

let NODE = NODES.DSMP;
let HOST = '';
let TIMEOUT = '';

loadDSMPConfig = function(){
    let dsmpConfig = this.utils().services('dsmp').conf('default');
    HOST = `${dsmpConfig.conn_type}://${dsmpConfig.ip}:${dsmpConfig.port}`;
    TIMEOUT = dsmpConfig.timeout * 1000;
}

exports.postInsertSubscriber = function(instance, data) {
    loadDSMPConfig.call(this);
    let url = `${HOST}${this.utils().services('dsmp').conf('postInsertSubscriber').path}`;
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_INSERTSUBSCRIBER, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}


exports.deleteInsertSubscriber = function(instance, data) {
    loadDSMPConfig.call(this);
    let url = `${HOST}${this.utils().services('dsmp').conf('deleteInsertSubscriber').path}`;
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.DELETE_INSERTSUBSCRIBER, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}
