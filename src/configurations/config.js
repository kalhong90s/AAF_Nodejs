const FCONFIG = require('../constants/fz-config');
const loadConfig = require('../manager/config/verify-config');

const CONFIG = {};

CONFIG.POSTSUBSCRIPTIONS = {};
CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_CSPNAME_CHECKPROFILE_LIST = {};
CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_APPNAME_ALLOW_CREATE_SUB = {};
CONFIG.POSTSUBSCRIPTIONS.NAFA_CREATE_AMF_ENABLE = {};
CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_CLASS_OF_SERVICE_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_CLASS_OF_SERVICE_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3_BRAND_ID_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.NAFA_DS3SPNAME_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.EMAIL_CREATE_AMF_ENABLE = {};
CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_CLASS_OF_SERVICE_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_CLASS_OF_SERVICE_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3_BRAND_ID_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.EMAIL_DS3SPNAME_NON_AIS = {};
CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_MASTEREDBY = {};
CONFIG.POSTSUBSCRIPTIONS.SUBSCRIPTIONS_STBMANAGEDEVICE_STATUS_LIST = {};
CONFIG.POSTSUBSCRIPTIONS.CORRELATE_TIME = {};

CONFIG.APPNAME_CHECK_ADDING_SUFFIX = {};
CONFIG.APPNAME_LIST_CHECKCREDENTIAL_GUPSERVICEELEMENT = {};
CONFIG.RE_GETGUPGLOBALSERVICE = {};
CONFIG.SERVICEPROFILEID_IS_NOT_AIS = {};
CONFIG.SERVICEPROFILEID_FBBID = {};
CONFIG.SUFFIX_DOMAIN_FOR_GENERATE_PRIVATEID_45_DIGIT = {};
CONFIG.FBB_ID_FORMAT = {};
CONFIG.MANAGED_DEVICE_ID_FORMAT = {};

CONFIG.POSTAUTHENTICATE = {};
CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_THIRD_PARTY_APPNAME_LIST = {};
CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_SSO_IDS_APPNAME_LIST = {};
CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_SSO_IDS_LOCATION_APPNAME_LIST = {};
CONFIG.POSTAUTHENTICATE.AUTHENTICATION_CUSTOMER_LDAP_APPNAME_LIST = {};

CONFIG.CHECKPUBLICAVAILABILITY = {};
CONFIG.CHECKPUBLICAVAILABILITY.CHECKPUBLICAVAILABILITY_APPNAME_CHECKCREDENTIAL_LIST = {};


CONFIG.verifyConfiguration = function() { //method
    let pass = loadConfig.verifyConfiguration.call(this);
    if(pass === true){
        load();
    }
    return pass;
}

load = () => {
    CONFIG.FBB_ID_FORMAT = loadConfig.getValue(FCONFIG.FBB_ID_FORMAT);
    CONFIG.POSTSUBSCRIPTIONS = loadConfig.getValue(FCONFIG.POSTSUBSCRIPTIONS);
    CONFIG.POSTAUTHENTICATE = loadConfig.getValue(FCONFIG.POSTAUTHENTICATE);
    CONFIG.RE_GETGUPGLOBALSERVICE = loadConfig.getValue(FCONFIG.RE_GETGUPGLOBALSERVICE);
    CONFIG.MANAGED_DEVICE_ID_FORMAT = loadConfig.getValue(FCONFIG.MANAGED_DEVICE_ID_FORMAT);
    CONFIG.SUFFIX_DOMAIN_FOR_GENERATE_PRIVATEID_45_DIGIT = loadConfig.getValue(FCONFIG.SUFFIX_DOMAIN_FOR_GENERATE_PRIVATEID_45_DIGIT);
    CONFIG.APPNAME_CHECK_ADDING_SUFFIX = loadConfig.getValue(FCONFIG.APPNAME_CHECK_ADDING_SUFFIX);
    CONFIG.APPNAME_LIST_CHECKCREDENTIAL_GUPSERVICEELEMENT = loadConfig.getValue(FCONFIG.APPNAME_LIST_CHECKCREDENTIAL_GUPSERVICEELEMENT);
    CONFIG.SERVICEPROFILEID_IS_NOT_AIS = loadConfig.getValue(FCONFIG.SERVICEPROFILEID_IS_NOT_AIS);
    CONFIG.SERVICEPROFILEID_FBBID = loadConfig.getValue(FCONFIG.SERVICEPROFILEID_FBBID);
    CONFIG.CHECKPUBLICAVAILABILITY = loadConfig.getValue(FCONFIG.CHECKPUBLICAVAILABILITY);

}

module.exports = CONFIG;