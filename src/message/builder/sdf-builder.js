const httpClient = require('../../service/axios/http-client');
const METHOD = require('../../constants/fz-http-method');
const NODES = require('../../constants/fz-node-name');
const COMMAND = require('../../constants/fz-client-command-name');
const messageUtils = require('../../utils/message-utils');
const optAttr = require('./http-option-attribute');
const KEYNAME = require('../../constants/fz-key-name');

let NODE = NODES.SDF;
let HOST = '';
let TIMEOUT = '';

loadSDFConfig = function(){
    let sdfConfig = this.utils().services('sdf').conf('default');
    HOST = `${sdfConfig.conn_type}://${sdfConfig.ip}:${sdfConfig.port}`;
    TIMEOUT = sdfConfig.timeout * 1000;
}

exports.getGupCommon = function(instance, keyName, keyValue)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('getGupCommon').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue);
    let params = { scope: 'sub' };
    //let headers = { 'Content-Type': 'text/plain', };
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.GET_GUPCOMMON, undefined, NODE, params);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.getGupGlobalService = function(instance)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('getGupGlobalService').path}`;
    let params = { scope: 'sub' };
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.GET_GUPGLOBALSERVICE, undefined, NODE, params);
    return httpClient.request.call(this, instance, url, optionAttribute);
}


exports.getStbManageDeviceProfile = function(instance, deviceId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('getStbManageDeviceProfile').path}`;
    url = messageUtils.getUrlPath(url,'','','deviceId',messageUtils.convertDeviceIdFormatFollowConfig(deviceId));
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.GET_STBMANAGEDEVICEPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.getGupDevice = function(instance, deviceId, keyName, keyValue)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('getGupDevice').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'deviceId',deviceId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.GET, undefined, COMMAND.GET_GUPDEVICE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postInsertSubscriber = function(instance, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postInsertSubscriber').path}`;
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_INSERTSUBSCRIBER, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postModifyIdentity = function(instance, identityName, identityValue, uid)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postModifyIdentity').path}`;
    let val = {
        type : 'add',
        identityName : identityName,
        identityValue : identityValue,
        uid, uid
    }
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, val, COMMAND.POST_MODIFYIDENTITY, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteModifyIdentity = function(instance, identityName, identityValue, uid)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteModifyIdentity').path}`;
    let val = {
        type : 'delete',
        identityName : identityName,
        identityValue : identityValue,
        uid, uid
    }
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, val, COMMAND.DELETE_MODIFYIDENTITY, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.putGupServiceElement = function(instance, keyName, keyValue, serviceProfileId, serviceId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('putGupServiceElement').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'serviceProfileId',serviceProfileId,'serviceId',serviceId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.PUT, data, COMMAND.PUT_GUPSERVICEELEMENT, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.putGupSubProfile = function(instance, msisdn, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('putGupSubProfile').path}`;
    url = messageUtils.getUrlPath(url,KEYNAME.MSISDN,msisdn,'msisdn',msisdn);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.PUT, data, COMMAND.PUT_GUPSUBPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.putGupImpu = function(instance, keyName, keyValue, publicId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('putGupImpu').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'msisdn',msisdn);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.PUT, data, COMMAND.PUT_GUPIMPU, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupServiceProfile = function(instance, keyName, keyValue, serviceProfileId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupServiceProfile').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'serviceProfileId',serviceProfileId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPSERVICEPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupServiceProfile = function(instance, keyName, keyValue, serviceProfileId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteGupServiceProfile').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'serviceProfileId',serviceProfileId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, undefined, COMMAND.DELETE_GUPSERVICEPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupServiceElement = function(instance, keyName, keyValue, serviceProfileId, serviceId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupServiceElement').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'serviceProfileId',serviceProfileId,'serviceId',serviceId);    
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPSERVICEELEMENT, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupServiceElement = function(instance, keyName, keyValue, serviceProfileId, serviceId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteGupServiceElement').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'serviceProfileId',serviceProfileId,'serviceId',serviceId);    
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, undefined, COMMAND.DELETE_GUPSERVICEELEMENT, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteInsertSubscriber = function(instance, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteInsertSubscriber').path}`;
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.DELETE_INSERTSUBSCRIBER, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupImpi = function(instance, keyName, keyValue, privateId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupImpi').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'privateId',privateId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPIMPI, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.putGupImpi = function(instance, keyName, keyValue, privateId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('putGupImpi').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'privateId',privateId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.PUT, data, COMMAND.PUT_GUPIMPI, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupImpi = function(instance, keyName, keyValue, privateId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteGupImpi').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'privateId',privateId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, undefined, COMMAND.DELETE_GUPIMPI, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupImpu = function(instance, keyName, keyValue, publicId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupImpu').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'publicId',publicId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPIMPU, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupImpu = function(instance, keyName, keyValue, publicId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteGupImpu').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'publicId',publicId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, undefined, COMMAND.DELETE_GUPIMPU, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupSubProfile = function(instance, msisdn, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupSubProfile').path}`;
    url = messageUtils.getUrlPath(url,KEYNAME.MSISDN,msisdn,'msisdn',msisdn);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPSUBPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupSubProfile = function(instance, msisdn, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('deleteGupSubProfile').path}`;
    url = messageUtils.getUrlPath(url,KEYNAME.MSISDN,msisdn,'msisdn',msisdn);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, data, COMMAND.DELETE_GUPSUBPROFILE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.postGupDevice = function(instance, keyName, keyValue, deviceId, data)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupDevice').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'deviceId',deviceId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.POST, data, COMMAND.POST_GUPDEVICE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}

exports.deleteGupDevice = function(instance, keyName, keyValue, deviceId)  {
    loadSDFConfig.call(this);
    let url = `${HOST}${this.utils().services('sdf').conf('postGupDevice').path}`;
    url = messageUtils.getUrlPath(url,keyName,keyValue,'deviceId',deviceId);
    let optionAttribute = optAttr(instance.sessionID, TIMEOUT, METHOD.DELETE, undefined, COMMAND.DELETE_GUPEVICE, undefined, NODE, undefined);
    return httpClient.request.call(this, instance, url, optionAttribute);
}