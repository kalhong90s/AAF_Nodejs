const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const optAttr = require('./http-option-attribute');

let NODE = NODES.LDAP;
let HOST = '';
let TIMEOUT = '';

loadLDAPConfig = function(){
    let ldapConfig = this.utils().services('ldap').conf('default');
    HOST = `${ldapConfig.conn_type}://${ldapConfig.ip}:${ldapConfig.port}`;
    TIMEOUT = ldapConfig.timeout * 1000;
}

exports.Ladp = (instance) => {
    loadLDAPConfig.call(this);
    let url = `${HOST}${this.utils().services('ldap').conf('ladp').path}`;
    let params = { scope: 'sub' };
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.POST_IDENTITYSERVICE, undefined, NODE, params);
    return httpClient.request(instance, url, optionAttribute);
}