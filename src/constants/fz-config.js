const TYPE = require('./fz-value-type');

module.exports = Object.freeze ({

    POSTSUBSCRIPTIONS : {name : 'postsubscriptions', isMandatory : true, isMultiple : false, regExFormat : TYPE.OBJECT, subConfig :{
        SUBSCRIPTIONS_CSPNAME_CHECKPROFILE_LIST : {name : 'Subscriptions_CSPName_CheckProfile_List', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        SUBSCRIPTIONS_APPNAME_ALLOW_CREATE_SUB : {name : 'Subscriptions_AppName_Allow_Create_Sub', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        NAFA_CREATE_AMF_ENABLE : {name : 'Nafa_Create_Amf_Enable', isMandatory : true, isMultiple : false, regExFormat : TYPE.BOOLEAN},
        NAFA_DS3_CLASS_OF_SERVICE_AIS : {name : 'Nafa_Ds3_Class_Of_Service_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        NAFA_DS3_CLASS_OF_SERVICE_NON_AIS : {name : 'Nafa_Ds3_Class_Of_Service_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        NAFA_DS3_BRAND_ID_NON_AIS : {name : 'Nafa_Ds3_Brand_Id_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        NAFA_DS3SPNAME_NON_AIS : {name : 'Nafa_Ds3spname_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        EMAIL_CREATE_AMF_ENABLE : {name : 'Email_Create_Amf_Enable', isMandatory : true, isMultiple : false, regExFormat : TYPE.BOOLEAN},
        EMAIL_DS3_CLASS_OF_SERVICE_AIS : {name : 'Email_Ds3_Class_Of_Service_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        EMAIL_DS3_CLASS_OF_SERVICE_NON_AIS : {name : 'Email_Ds3_Class_Of_Service_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        EMAIL_DS3_BRAND_ID_NON_AIS : {name : 'Email_Ds3_Brand_Id_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        EMAIL_DS3SPNAME_NON_AIS : {name : 'Email_Ds3spname_Non_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
        SUBSCRIPTIONS_MASTEREDBY : {name : 'Subscriptions_Masteredby', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},   
        SUBSCRIPTIONS_STBMANAGEDEVICE_STATUS_LIST : {name : 'Subscriptions_StbManageDevice_Status_List', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        CORRELATE_TIME : {name : 'correlate_time', isMandatory : true, isMultiple : false, regExFormat : TYPE.NUMBER},
    }},
    FBB_ID_FORMAT : {name : 'Fbb_Id_Format', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
    RE_GETGUPGLOBALSERVICE : {name : 'Re_Get_GupGlobalService', isMandatory : true, isMultiple : false, regExFormat : TYPE.NUMBER},
    APPNAME_CHECK_ADDING_SUFFIX : {name : 'Appname_Check_Adding_Suffix', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
    APPNAME_LIST_CHECKCREDENTIAL_GUPSERVICEELEMENT : {name : 'AppName_List_CheckCredential_GupServiceElement', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
    SERVICEPROFILEID_IS_NOT_AIS : {name : 'ServiceProfileId_Is_Not_Ais', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
    SERVICEPROFILEID_FBBID : {name : 'ServiceProfileId_FbbId', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
    MANAGED_DEVICE_ID_FORMAT : {name : 'Managed_Device_Id_Format', isMandatory : true, isMultiple : false, regExFormat : TYPE.STRING},
    SUFFIX_DOMAIN_FOR_GENERATE_PRIVATEID_45_DIGIT : {name : 'suffix_domian_for_generate_privateid_45_digit', isMandatory :true, isMultiple : false, regExFormat : TYPE.STRING},

    POSTAUTHENTICATE : {name : 'postauthenticatecustomer', isMandatory : true, isMultiple : false, regExFormat : TYPE.OBJECT, subConfig :{
        AUTHENTICATION_CUSTOMER_THIRD_PARTY_APPNAME_LIST : {name : 'Authentication_Customer_Third_party_appname_list', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        AUTHENTICATION_CUSTOMER_SSO_IDS_APPNAME_LIST : {name : 'Authentication_Customer_sso_ids_appname_list', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        AUTHENTICATION_CUSTOMER_SSO_IDS_LOCATION_APPNAME_LIST : {name : 'Authentication_Customer_sso_ids_location_appname_list', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        AUTHENTICATION_CUSTOMER_LDAP_APPNAME_LIST : {name : 'Authentication_Customer_ldap_appname_list', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
        
    }},

    CHECKPUBLICAVAILABILITY : {name : 'checkpublicavailability', isMandatory : true, isMultiple : false, regExFormat : TYPE.OBJECT, subConfig :{
        CHECKPUBLICAVAILABILITY_APPNAME_CHECKCREDENTIAL_LIST : {name : 'CheckPublicAvailability_appName_checkCredential_list', isMandatory : true, isMultiple : true, regExFormat : TYPE.STRING},
    }}
});