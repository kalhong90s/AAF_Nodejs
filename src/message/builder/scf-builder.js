const CONFIG = require('../../configurations/config');
const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const optAttr = require('./http-option-attribute');

let NODE = NODES.SCF;
let HOST = '';
let TIMEOUT = '';

loadSCFConfig = function(){
    let scfConfig = this.utils().services('scf').conf('default');
    HOST = `${scfConfig.conn_type}://${scfConfig.ip}:${scfConfig.port}`;
    TIMEOUT = scfConfig.timeout * 1000;
}
exports.getDecryptPartnerSpecificPrivateId = (instance, identityValue, commmandId) => {
    loadSCFConfig.call(this);
    let identityValueEncode = encodeURI(identityValue);
    let url = `${HOST}${this.utils().services('scf').conf('getDecryptPartnerSpecificPrivateId').path}`;
    url = messageUtils.getUrlPath(url,'','','identityValueEncode',identityValueEncode);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.GET_DECRYPTPARTNERSPECIFIC, undefined, NODE, undefined);
    return httpClient.request(instance, url, optionAttribute);
}


exports.postGeneratePartnerSpecificPrivateId = (instance, data, xtid) => {
    loadSCFConfig.call(this);
    let url = `${HOST}${this.utils().services('scf').conf('postGeneratePartnerSpecificPrivateId').path}`;
    let headers = {};
    headers['x-tid'] = xtid;
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GENERATEPARTNERSPECIFICPRIVATEID, headers, NODE, undefined);
    return httpClient.request(instance, url, optionAttribute);
}


