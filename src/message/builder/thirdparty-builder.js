const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const messageUtils = require('../../utils/message-utils');
const optAttr = require('./http-option-attribute');

let NODE = NODES.THIRDPARTY;
let HOST = '';
let TIMEOUT = '';

loadThirdPartyConfig = function(){
    let thirdPartyConfig = this.utils().services('thirdparty').conf('default');
    HOST = `${thirdPartyConfig.conn_type}://${thirdPartyConfig.ip}:${thirdPartyConfig.port}`;
    TIMEOUT = thirdPartyConfig.timeout * 1000;
}

exports.ThirdParty = function(instance) {
    loadThirdPartyConfig.call(this);
    let url = `${HOST}${this.utils().services('thirdparty').conf('thirdparty').path}`;
    let params = { scope: 'sub' };
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.POST_THIRDPARTY, undefined, NODE, params);
    return httpClient.request.call(this,instance, url, optionAttribute);
}