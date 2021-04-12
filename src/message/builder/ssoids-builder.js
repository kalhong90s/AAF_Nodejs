const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const messageUtils = require('../../utils/message-utils');
const optAttr = require('./http-option-attribute');

let NODE = NODES.SSOIDS;
let HOST = '';
let TIMEOUT = '';

loadSSOIDSConfig = function(){
    let ssoidsConfig = this.utils().services('ssoids').conf('default');
    HOST = `${ssoidsConfig.conn_type}://${ssoidsConfig.ip}:${ssoidsConfig.port}`;
    TIMEOUT = ssoidsConfig.timeout * 1000;
}

exports.Ssoids = (instance) => {
    loadSSOIDSConfig.call(this);
    let url = `${HOST}${this.utils().services('ssoids').conf('ssoids').path}`;
    let params = { scope: 'sub' };
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.POST_IDENTITYSERVICE, undefined, NODE, params);
    return httpClient.request(instance, url, optionAttribute);
}