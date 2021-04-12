module.exports = Object.freeze ({
     //====================== MongoDB =======================
    AAF_MONGODB_READ_SERVICE_REQUEST : 'mAAF Sent MongoDB Read Service Request',
    AAF_MONGODB_READ_SERVICE_RESPONSE : 'mAAF Received MongoDB Read Service Response',
    AAF_MONGODB_READ_SERVICE_RESPONSE_ERROR : 'mAAF Received MongoDB Read Service Error',

    AAF_MONGODB_INSERT_SERVICE_REQUEST : 'mAAF Sent MongoDB Insert Service Request',
    AAF_MONGODB_INSERT_SERVICE_RESPONSE : 'mAAF Received MongoDB Insert Service Response',
    AAF_MONGODB_INSERT_SERVICE_RESPONSE_ERROR : 'mAAF Received MongoDB Insert Service Error',

    AAF_MONGODB_UPDATE_SERVICE_REQUEST : 'mAAF Sent MongoDB Update Service Request',
    AAF_MONGODB_UPDATE_SERVICE_RESPONSE : 'mAAF Received MongoDB Update Service Response',
    AAF_MONGODB_UPDATE_SERVICE_RESPONSE_ERROR : 'mAAF Received MongoDB Update Service Error',

    AAF_MONGODB_READ_SUBSCRIPTION_REQUEST : 'mAAF Sent MongoDB Read Subscription Request',
    AAF_MONGODB_READ_SUBSCRIPTION_RESPONSE : 'mAAF Received MongoDB Read Subscription Response',
    AAF_MONGODB_READ_SUBSCRIPTION_RESPONSE_ERROR : 'mAAF Received MongoDB Read Subscription Error',

    AAF_MONGODB_INSERT_SUBSCRIPTION_REQUEST : 'mAAF Sent MongoDB Insert Subscription Request',
    AAF_MONGODB_INSERT_SUBSCRIPTION_RESPONSE : 'mAAF Received MongoDB Insert Subscription Response',
    AAF_MONGODB_INSERT_SUBSCRIPTION_RESPONSE_ERROR : 'mAAF Received MongoDB Insert Subscription Error',

    AAF_MONGODB_UPDATE_SUBSCRIPTION_REQUEST : 'mAAF Sent MongoDB Update Subscription Request',
    AAF_MONGODB_UPDATE_SUBSCRIPTION_RESPONSE : 'mAAF Received MongoDB Update Subscription Response',
    AAF_MONGODB_UPDATE_SUBSCRIPTION_RESPONSE_ERROR : 'mAAF Received MongoDB Update Subscription Error',

    AAF_MONGODB_DELETE_SUBSCRIPTION_REQUEST : 'mAAF Sent MongoDB Delete Subscription Request',
    AAF_MONGODB_DELETE_SUBSCRIPTION_RESPONSE : 'mAAF Received MongoDB Delete Subscription Response',
    AAF_MONGODB_DELETE_SUBSCRIPTION_RESPONSE_ERROR : 'mAAF Received MongoDB Delete Subscription Error',

    //====================== AAF =======================
    //Unknown
    AAF_RECEIVED_UNKNOWN_REQUEST : 'mAAF Received UnknownCommand Request',
    AAF_RECEIVED_UNKNOWN_RESPONSE : 'mAAF Received UnknownCommand Response',
    
    //Get PrivateId
    AAF_RECEIVED_GET_PRIVATEID_REQUEST : 'mAAF Received Get PrivateId Request',
    AAF_RECEIVED_GET_PRIVATEID_BAD_REQUEST : 'mAAF Received Bad Get PrivateId Request',
    AAF_RETURN_GET_PRIVATEID_RESPONSE : 'mAAF Returned Get PrivateId Success',
    AAF_RETURN_GET_PRIVATEID_ERROR_RESPONSE : 'mAAF Returned Get PrivateId Error',

    AAF_RETURN_POST_SUBSCRIPTION_ERROR : 'mAAF Returned Post Subscriptions Error',
    AAF_RETURN_POST_SUBSCRIPTION_RESPONSE : 'mAAF Returned Post Subscriptions Success',
    AAF_RECEIVED_POST_SUBSCRIPTION_REQUEST : 'mAAF Received Post Subscriptions Request',
    AAF_RECEIVED_POST_SUBSCRIPTION_ERROR : 'mAAF Received Post Subscriptions Error',
    AAF_RECEIVED_POST_SUBSCRIPTION_TIMEOUT : 'mAAF Received Post Subscriptions Timeout',
    AAF_RECEIVED_BAD_POST_SUBSCRIPTION_REQUEST : 'mAAF Received Bad Post Subscriptions Request',

    //Get CustomerIdentity
    AAF_RECEIVED_GET_CUSTOMERIDENTITY_REQUEST : 'mAAF Received Get CustomerIdentity Request',
    AAF_RECEIVED_GET_CUSTOMERIDENTITY_BAD_REQUEST : 'mAAF Received Bad Get CustomerIdentity Request',
    AAF_RETURN_GET_CUSTOMERIDENTITY_SUCCESS : 'mAAF Returned Get CustomerIdentity Success',
    AAF_RETURN_GET_CUSTOMERIDENTITY_ERROR : 'mAAF Returned Get CustomerIdentity Error',

    //Post CheckPublicAvailibility
    AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_ERROR : 'mAAF Returned Post CheckPublicIdAvailability Error',
    AAF_RETURN_POST_CHECKPUBLICAVAILABILITY_RESPONSE : 'mAAF Returned Post CheckPublicIdAvailability Success',
    AAF_RECEIVED_POST_CHECKPUBLICAVAILABILITY_REQUEST : 'mAAF Received Post CheckPublicIdAvailability Request',
    AAF_RECEIVED_POST_CHECKPUBLICAVAILABILITY_ERROR : 'mAAF Received Post CheckPublicIdAvailability Error',
    AAF_RECEIVED_POST_CHECKPUBLICAVAILABILITY_TIMEOUT : 'mAAF Received Post CheckPublicIdAvailability Timeout',
    AAF_RECEIVED_BAD_POST_CHECKPUBLICAVAILABILITY_REQUEST : 'mAAF Received Bad Post CheckPublicIdAvailability Request',

    //Get ContactNumber
    AAF_RECEIVED_GET_CONTACTNUMBER_REQUEST : 'mAAF Received Get ContactNumber Request' ,
    AAF_RECEIVED_BAD_GET_CONTACTNUMBER_REQUEST : 'mAAF Received Bad Get ContactNumber Request' ,
    AAF_RETURN_GET_CONTACTNUMBER_ERROR : 'mAAF Returned Get ContactNumber Error' ,
    AAF_RETURN_GET_CONTACTNUMBER_SUCCESS : 'mAAF Returned Get ContactNumber Success' ,
    AAF_RECEIVED_GET_CONTACTNUMBER_ERROR : 'mAAF Received Get ContactNumber Error' ,
    AAF_RECEIVED_GET_CONTACTNUMBER_REJECT : 'mAAF Received Get ContactNumber Reject' ,
    AAF_RECEIVED_GET_CONTACTNUMBER_ABORT : 'mAAF Received Get ContactNumber Abort' ,
    AAF_RECEIVED_GET_CONTACTNUMBER_TIMEOUT : 'mAAF Received Get ContactNumber Timeout' ,
    

    //====================== SDF =======================
    AAF_SDF_GET_GUP_COMMON_REQUEST : 'mAAF Sent SDF Get GupCommon Request',
    AAF_SDF_GET_GUP_COMMON_RESPONSE : 'mAAF Received SDF Get GupCommon Response',
    AAF_SDF_GET_GUP_COMMON_RECEIVED_BAD : 'mAAF Received SDF Bad Get GupCommon Response',
    AAF_SDF_GET_GUP_COMMON_RECEIVED_ERROR : 'mAAF Received SDF Get GupCommon Error',
    AAF_SDF_GET_GUP_COMMON_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Get GupCommon Connection Error',
    AAF_SDF_GET_GUP_COMMON_RECEIVED_TIMEOUT : 'mAAF Received SDF Get GupCommon Timeout',

    AAF_SDF_GET_GUP_GLOBAL_SERVICE_REQUEST : 'mAAF Sent SDF Get GupGlobalService Request',
    AAF_SDF_GET_GUP_GLOBAL_SERVICE_RESPONSE : 'mAAF Received SDF Get GupGlobalService Response',
    AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_BAD : 'mAAF Received SDF Bad Get GupGlobalService Response',
    AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_ERROR : 'mAAF Received SDF Get GupGlobalService Error',
    AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Get GupGlobalService Connection Error',
    AAF_SDF_GET_GUP_GLOBAL_SERVICE_RECEIVED_TIMEOUT : 'mAAF Received SDF Get GupGlobalService Timeout',

    AAF_SDF_GET_STB_MANAGED_DEVICE_REQUEST : 'mAAF Sent SDF Get StbManagedDeviceProfile Request',
    AAF_SDF_GET_STB_MANAGED_DEVICE_RESPONSE : 'mAAF Received SDF Get StbManagedDeviceProfile Response',
    AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_BAD : 'mAAF Received SDF Bad Get StbManagedDeviceProfile Response',
    AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_ERROR : 'mAAF Received SDF Get StbManagedDeviceProfile Error',
    AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Get StbManagedDeviceProfile Connection Error',
    AAF_SDF_GET_STB_MANAGED_DEVICE_RECEIVED_TIMEOUT : 'mAAF Received SDF Get StbManagedDeviceProfile Timeout',

    AAF_SDF_GET_GUP_DEVICE_REQUEST : 'mAAF Sent SDF Get GupDevice Request',
    AAF_SDF_GET_GUP_DEVICE_RESPONSE : 'mAAF Received SDF Get GupDevice Response',
    AAF_SDF_GET_GUP_DEVICE_RECEIVED_BAD : 'mAAF Received SDF Bad Get GupDevice Response',
    AAF_SDF_GET_GUP_DEVICE_RECEIVED_ERROR : 'mAAF Received SDF Get GupDevice Error',
    AAF_SDF_GET_GUP_DEVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Get GupDevice Connection Error',
    AAF_SDF_GET_GUP_DEVICE_RECEIVED_TIMEOUT : 'mAAF Received SDF Get GupDevice Timeout',
    
    AAF_SDF_POST_MODIFY_IDENTITY_REQUEST : 'mAAF Sent SDF Post ModifyIdentity Request',
    AAF_SDF_POST_MODIFY_IDENTITY_RESPONSE : 'mAAF Received SDF Post ModifyIdentity Response',
    AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_BAD : 'mAAF Received SDF Bad Post ModifyIdentity Response',
    AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_ERROR : 'mAAF Received SDF Post ModifyIdentity Error',
    AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post ModifyIdentity Connection Error',
    AAF_SDF_POST_MODIFY_IDENTITY_RECEIVED_TIMEOUT : 'mAAF Received SDF Post ModifyIdentity Timeout',

    AAF_SDF_DELETE_MODIFY_IDENTITY_REQUEST : 'mAAF Sent SDF Delete ModifyIdentity Request',
    AAF_SDF_DELETE_MODIFY_IDENTITY_RESPONSE : 'mAAF Received SDF Delete ModifyIdentity Response',
    AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_BAD : 'mAAF Received SDF Bad Delete ModifyIdentity Response',
    AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_ERROR : 'mAAF Received SDF Delete ModifyIdentity Error',
    AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete ModifyIdentity Connection Error',
    AAF_SDF_DELETE_MODIFY_IDENTITY_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete ModifyIdentity Timeout',

    AAF_SDF_INSERT_SUBSCRIBER_REQUEST : 'mAAF Sent SDF Post InsertSubscriber Request',
    AAF_SDF_INSERT_SUBSCRIBER_RESPONSE : 'mAAF Received SDF Post InsertSubscriber Response',
    AAF_SDF_INSERT_SUBSCRIBER_RECEIVED_BAD : 'mAAF Received SDF Bad Post InsertSubscriber Response',
    AAF_SDF_INSERT_SUBSCRIBER_RECEIVED_ERROR : 'mAAF Received SDF Post InsertSubscriber Error',
    AAF_SDF_INSERT_SUBSCRIBER_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post InsertSubscriber Connection Error',
    AAF_SDF_INSERT_SUBSCRIBER_RECEIVED_TIMEOUT : 'mAAF Received SDF Post InsertSubscriber Timeout',

    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_REQUEST : 'mAAF Sent SDF Put GupServiceElement Request',
    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_RESPONSE : 'mAAF Received SDF Put GupServiceElement Response',
    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_RECEIVED_BAD : 'mAAF Received SDF Bad Put GupServiceElement Response',
    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_RECEIVED_ERROR : 'mAAF Received SDF Put GupServiceElement Error',
    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Put GupServiceElement Connection Error',
    AAF_SDF_PUT_GUP_SERVICE_ELEMENT_RECEIVED_TIMEOUT : 'mAAF Received SDF Put GupServiceElement Timeout',

    AAF_SDF_PUT_GUP_SUBPROFILE_REQUEST : 'mAAF Sent SDF Put GupSubProfile Request',
    AAF_SDF_PUT_GUP_SUBPROFILE_RESPONSE : 'mAAF Received SDF Put GupSubProfile Response',
    AAF_SDF_PUT_GUP_SUBPROFILE_RECEIVED_BAD : 'mAAF Received SDF Bad Put GupSubProfile Response',
    AAF_SDF_PUT_GUP_SUBPROFILE_RECEIVED_ERROR : 'mAAF Received SDF Put GupSubProfile Error',
    AAF_SDF_PUT_GUP_SUBPROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Put GupSubProfile Connection Error',
    AAF_SDF_PUT_GUP_SUBPROFILE_RECEIVED_TIMEOUT : 'mAAF Received SDF Put GupSubProfile Timeout',

    AAF_SDF_PUT_GUP_IMPU_REQUEST : 'mAAF Sent SDF Put GupImpu Request',
    AAF_SDF_PUT_GUP_IMPU_RESPONSE : 'mAAF Received SDF Put GupImpu Response',
    AAF_SDF_PUT_GUP_IMPU_RECEIVED_BAD : 'mAAF Received SDF Bad Put GupImpu Response',
    AAF_SDF_PUT_GUP_IMPU_RECEIVED_ERROR : 'mAAF Received SDF Put GupImpu Error',
    AAF_SDF_PUT_GUP_IMPU_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Put GupImpu Connection Error',
    AAF_SDF_PUT_GUP_IMPU_RECEIVED_TIMEOUT : 'mAAF Received SDF Put GupImpu Timeout',

    AAF_SDF_POST_GUP_SERVICEPROFILE_REQUEST : 'mAAF Sent SDF Post GupServiceProfile Request',
    AAF_SDF_POST_GUP_SERVICEPROFILE_RESPONSE : 'mAAF Received SDF Post GupServiceProfile Response',
    AAF_SDF_POST_GUP_SERVICEPROFILE_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupServiceProfile Response',
    AAF_SDF_POST_GUP_SERVICEPROFILE_RECEIVED_ERROR : 'mAAF Received SDF Post GupServiceProfile Error',
    AAF_SDF_POST_GUP_SERVICEPROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupServiceProfile Connection Error',
    AAF_SDF_POST_GUP_SERVICEPROFILE_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupServiceProfile Timeout',
	
	AAF_SDF_POST_GUP_SERVICEELEMENT_REQUEST : 'mAAF Sent SDF Post GupServiceElement Request',
    AAF_SDF_POST_GUP_SERVICEELEMENT_RESPONSE : 'mAAF Received SDF Post GupServiceElement Response',
    AAF_SDF_POST_GUP_SERVICEELEMENT_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupServiceElement Response',
    AAF_SDF_POST_GUP_SERVICEELEMENT_RECEIVED_ERROR : 'mAAF Received SDF Post GupServiceElement Error',
    AAF_SDF_POST_GUP_SERVICEELEMENT_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupServiceElement Connection Error',
    AAF_SDF_POST_GUP_SERVICEELEMENT_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupServiceElement Timeout',

    AAF_SDF_DELETE_SUBSCRIBER_REQUEST : 'mAAF Sent SDF Delete Subscriber Request',
    AAF_SDF_DELETE_SUBSCRIBER_RESPONSE : 'mAAF Received SDF Delete Subscriber Response',
    AAF_SDF_DELETE_SUBSCRIBER_RECEIVED_BAD : 'mAAF Received SDF Bad Delete Subscriber Response',
    AAF_SDF_DELETE_SUBSCRIBER_RECEIVED_ERROR : 'mAAF Received SDF Delete Subscriber Error',
    AAF_SDF_DELETE_SUBSCRIBER_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete Subscriber Connection Error',
    AAF_SDF_DELETE_SUBSCRIBER_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete Subscriber Timeout',

    AAF_SDF_DELETE_GUP_IMPI_REQUEST : 'mAAF Sent SDF Delete GupImpi Request',
    AAF_SDF_DELETE_GUP_IMPI_RESPONSE : 'mAAF Received SDF Delete GupImpi Response',
    AAF_SDF_DELETE_GUP_IMPI_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupImpi Response',
    AAF_SDF_DELETE_GUP_IMPI_RECEIVED_ERROR : 'mAAF Received SDF Delete GupImpi Error',
    AAF_SDF_DELETE_GUP_IMPI_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupImpi Connection Error',
    AAF_SDF_DELETE_GUP_IMPI_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupImpi Timeout',

    AAF_SDF_PUT_GUP_IMPI_REQUEST : 'mAAF Sent SDF Put GupImpi Request',
    AAF_SDF_PUT_GUP_IMPI_RESPONSE : 'mAAF Received SDF Put GupImpi Response',
    AAF_SDF_PUT_GUP_IMPI_RECEIVED_BAD : 'mAAF Received SDF Bad Put GupImpi Response',
    AAF_SDF_PUT_GUP_IMPI_RECEIVED_ERROR : 'mAAF Received SDF Put GupImpi Error',
    AAF_SDF_PUT_GUP_IMPI_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Put GupImpi Connection Error',
    AAF_SDF_PUT_GUP_IMPI_RECEIVED_TIMEOUT : 'mAAF Received SDF Put GupImpi Timeout',
    
    AAF_SDF_POST_GUP_IMPI_REQUEST : 'mAAF Sent SDF Post GupImpi Request',
    AAF_SDF_POST_GUP_IMPI_RESPONSE : 'mAAF Received SDF Post GupImpi Response',
    AAF_SDF_POST_GUP_IMPI_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupImpi Response',
    AAF_SDF_POST_GUP_IMPI_RECEIVED_ERROR : 'mAAF Received SDF Post GupImpi Error',
    AAF_SDF_POST_GUP_IMPI_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupImpi Connection Error',
    AAF_SDF_POST_GUP_IMPI_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupImpi Timeout',

    AAF_SDF_POST_GUP_IMPU_REQUEST : 'mAAF Sent SDF Post GupImpu Request',
    AAF_SDF_POST_GUP_IMPU_RESPONSE : 'mAAF Received SDF Post GupImpu Response',
    AAF_SDF_POST_GUP_IMPU_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupImpu Response',
    AAF_SDF_POST_GUP_IMPU_RECEIVED_ERROR : 'mAAF Received SDF Post GupImpu Error',
    AAF_SDF_POST_GUP_IMPU_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupImpu Connection Error',
    AAF_SDF_POST_GUP_IMPU_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupImpu Timeout',

    AAF_SDF_POST_GUP_SUB_PROFILE_REQUEST : 'mAAF Sent SDF Post GupSubProfile Request',
    AAF_SDF_POST_GUP_SUB_PROFILE_RESPONSE : 'mAAF Received SDF Post GupSubProfile Response',
    AAF_SDF_POST_GUP_SUB_PROFILE_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupSubProfile Response',
    AAF_SDF_POST_GUP_SUB_PROFILE_RECEIVED_ERROR : 'mAAF Received SDF Post GupSubProfile Error',
    AAF_SDF_POST_GUP_SUB_PROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupSubProfile Connection Error',
    AAF_SDF_POST_GUP_SUB_PROFILE_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupSubProfile Timeout',

    AAF_SDF_DELETE_GUP_IMPU_REQUEST : 'mAAF Sent SDF Delete GupImpu Request',
    AAF_SDF_DELETE_GUP_IMPU_RESPONSE : 'mAAF Received SDF Delete GupImpu Response',
    AAF_SDF_DELETE_GUP_IMPU_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupImpu Response',
    AAF_SDF_DELETE_GUP_IMPU_RECEIVED_ERROR : 'mAAF Received SDF Delete GupImpu Error',
    AAF_SDF_DELETE_GUP_IMPU_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupImpu Connection Error',
    AAF_SDF_DELETE_GUP_IMPU_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupImpu Timeout',
	
	AAF_SDF_DELETE_GUP_SUBPROFILE_REQUEST : 'mAAF Sent SDF Delete GupSubProfile Request',
    AAF_SDF_DELETE_GUP_SUBPROFILE_RESPONSE : 'mAAF Received SDF Delete GupSubProfile Response',
    AAF_SDF_DELETE_GUP_SUBPROFILE_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupSubProfile Response',
    AAF_SDF_DELETE_GUP_SUBPROFILE_RECEIVED_ERROR : 'mAAF Received SDF Delete GupSubProfile Error',
    AAF_SDF_DELETE_GUP_SUBPROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupSubProfile Connection Error',
    AAF_SDF_DELETE_GUP_SUBPROFILE_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupSubProfile Timeout',

    AAF_SDF_POST_GUP_DEVICE_REQUEST : 'mAAF Sent SDF Post GupDevice Request',
    AAF_SDF_POST_GUP_DEVICE_RESPONSE : 'mAAF Received SDF Post GupDevice Response',
    AAF_SDF_POST_GUP_DEVICE_RECEIVED_BAD : 'mAAF Received SDF Bad Post GupDevice Response',
    AAF_SDF_POST_GUP_DEVICE_RECEIVED_ERROR : 'mAAF Received SDF Post GupDevice Error',
    AAF_SDF_POST_GUP_DEVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Post GupDevice Connection Error',
    AAF_SDF_POST_GUP_DEVICE_RECEIVED_TIMEOUT : 'mAAF Received SDF Post GupDevice Timeout',

    AAF_SDF_DELETE_GUP_DEVICE_REQUEST : 'mAAF Sent SDF Delete GupDevice Request',
    AAF_SDF_DELETE_GUP_DEVICE_RESPONSE : 'mAAF Received SDF Delete GupDevice Response',
    AAF_SDF_DELETE_GUP_DEVICE_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupDevice Response',
    AAF_SDF_DELETE_GUP_DEVICE_RECEIVED_ERROR : 'mAAF Received SDF Delete GupDevice Error',
    AAF_SDF_DELETE_GUP_DEVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupDevice Connection Error',
    AAF_SDF_DELETE_GUP_DEVICE_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupDevice Timeout',

    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_REQUEST : 'mAAF Sent SDF Delete GupServiceProfile Request',
    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_RESPONSE : 'mAAF Received SDF Delete GupServiceProfile Response',
    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupServiceProfile Response',
    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_RECEIVED_ERROR : 'mAAF Received SDF Delete GupServiceProfile Error',
    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupServiceProfile Connection Error',
    AAF_SDF_DELETE_GUP_SERVICE_PROFILE_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupServiceProfile Timeout',

    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_REQUEST : 'mAAF Sent SDF Delete GupServiceElement Request',
    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_RESPONSE : 'mAAF Received SDF Delete GupServiceElement Response',
    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_RECEIVED_BAD : 'mAAF Received SDF Bad Delete GupServiceElement Response',
    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_RECEIVED_ERROR : 'mAAF Received SDF Delete GupServiceElement Error',
    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_RECEIVED_CONNECTION_ERROR : 'mAAF Received SDF Delete GupServiceElement Connection Error',
    AAF_SDF_DELETE_GUP_SERVICE_ELEMENT_RECEIVED_TIMEOUT : 'mAAF Received SDF Delete GupServiceElement Timeout',
    
    //==========================SCF=================================
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_REQUEST : 'mAAF Sent SCF Get Decryptpartnerspecific Request',
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_RESPONSE : 'mAAF Received SCF Get Decryptpartnerspecific Response',
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_RECEIVED_BAD : 'mAAF Received SCF Bad Get Decryptpartnerspecific Response',
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_RECEIVED_ERROR : 'mAAF Received SCF Get Decryptpartnerspecific Error',
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_RECEIVED_CONNECTION_ERROR : 'mAAF Received SCF Get Decryptpartnerspecific Connection Error',
    AAF_SCF_GET_DECRYPTPARTNERSPECIFIC_RECEIVED_TIMEOUT : 'mAAF Received SCF Get Decryptpartnerspecific Timeout',


    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_REQUEST : 'mAAF Sent SCF Post GeneratePartnerSpecificPrivateId Request',
    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_RESPONSE : 'mAAF Received SCF Post GeneratePartnerSpecificPrivateId Response',
    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_RECEIVED_BAD : 'mAAF Received SCF Bad Get GeneratePartnerSpecificPrivateId Response',
    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_RECEIVED_ERROR : 'mAAF Received SCF Post GeneratePartnerSpecificPrivateId Error',
    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_RECEIVED_CONNECTION_ERROR : 'mAAF Received SCF Post GeneratePartnerSpecificPrivateId Connection Error',
    AAF_SCF_POST_GENERATEPARTNERSPECIFICPRIVATEID_RECEIVED_TIMEOUT : 'mAAF Received SCF Post GeneratePartnerSpecificPrivateId Timeout',

    //========================= DSMP =============================
    AAF_DSMP_INSERT_SUBSCRIBER_REQUEST : 'mAAF Sent DSMP Post InsertSubscriber Request',
    AAF_DSMP_INSERT_SUBSCRIBER_RESPONSE : 'mAAF Received DSMP Post InsertSubscriber Response',
    AAF_DSMP_INSERT_SUBSCRIBER_RECEIVED_BAD : 'mAAF Received DSMP Bad Post InsertSubscriber Response',
    AAF_DSMP_INSERT_SUBSCRIBER_RECEIVED_ERROR : 'mAAF Received DSMP Post InsertSubscriber Error',
    AAF_DSMP_INSERT_SUBSCRIBER_RECEIVED_CONNECTION_ERROR : 'mAAF Received DSMP Post InsertSubscriber Connection Error',
    AAF_DSMP_INSERT_SUBSCRIBER_RECEIVED_TIMEOUT : 'mAAF Received DSMP Post InsertSubscriber Timeout',

    AAF_DSMP_DELETE_SUBSCRIBER_REQUEST : 'mAAF Sent DSMP Delete Subscriber Request',
    AAF_DSMP_DELETE_SUBSCRIBER_RESPONSE : 'mAAF Received DSMP Delete Subscriber Response',
    AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_BAD : 'mAAF Received DSMP Bad Delete Subscriber Response',
    AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_ERROR : 'mAAF Received DSMP Delete Subscriber Error',
    AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_CONNECTION_ERROR : 'mAAF Received DSMP Delete Subscriber Connection Error',
    AAF_DSMP_DELETE_SUBSCRIBER_RECEIVED_TIMEOUT : 'mAAF Received DSMP Delete Subscriber Timeout',

     //========================= PostAuthenticateCustomer =============================
     AAF_RETURN_POST_AUTHENTICATECUSTOMER_ERROR : 'mAAF Returned Post AuthenticateCustomer Error',
     AAF_RETURN_POST_AUTHENTICATECUSTOMER_RESPONSE : 'mAAF Returned Post AuthenticateCustomer Success',
     AAF_RECEIVED_POST_AUTHENTICATECUSTOMER_REQUEST : 'mAAF Received Post AuthenticateCustomer Request',
     AAF_RECEIVED_POST_AUTHENTICATECUSTOMER_ERROR : 'mAAF Received Post AuthenticateCustomer Error',
     AAF_RECEIVED_POST_AUTHENTICATECUSTOMER_TIMEOUT : 'mAAF Received Post AuthenticateCustomer Timeout',
     AAF_RECEIVED_BAD_POST_AUTHENTICATECUSTOMER_REQUEST : 'mAAF Received Bad Post AuthenticateCustomer Request',
 
     //========================= ThirdParty =============================
     AAF_THIRDPARTY_POST_THIRDPARTY_REQUEST : 'mAAF Sent ThirdParty Post ThirdParty Request',
     AAF_THIRDPARTY_POST_THIRDPARTY_RESPONSE : 'mAAF Received ThirdParty Post ThirdParty Response',
     AAF_THIRDPARTY_POST_THIRDPARTY_RECEIVED_BAD : 'mAAF Received ThirdParty Post ThirdParty Response',
     AAF_THIRDPARTY_POST_THIRDPARTY_RECEIVED_ERROR : 'mAAF Received ThirdParty Post ThirdParty Error',
     AAF_THIRDPARTY_POST_THIRDPARTY_RECEIVED_CONNECTION_ERROR : 'mAAF Received ThirdParty Post ThirdParty Connection Error',
     AAF_THIRDPARTY_POST_THIRDPARTY_RECEIVED_TIMEOUT : 'mAAF Received ThirdParty Post ThirdParty Timeout',
 
     //========================= SSO-IDS =============================
     AAF_SSO_IDS_POST_IDENTITYSERVICE_REQUEST : 'mAAF Sent SSO-IDS Post IdentityService Request',
     AAF_SSO_IDS_POST_IDENTITYSERVICE_RESPONSE : 'mAAF Received SSO-IDS Post IdentityService Response',
     AAF_SSO_IDS_POST_IDENTITYSERVICE_RECEIVED_BAD : 'mAAF Received SSO-IDS Post IdentityService Response',
     AAF_SSO_IDS_POST_IDENTITYSERVICE_RECEIVED_ERROR : 'mAAF Received SSO-IDS Post IdentityService Error',
     AAF_SSO_IDS_POST_IDENTITYSERVICE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SSO-IDS Post IdentityService Connection Error',
     AAF_SSO_IDS_POST_IDENTITYSERVICE_RECEIVED_TIMEOUT : 'mAAF Received SSO-IDS Post IdentityService Timeout',
 
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_REQUEST : 'mAAF Sent SSO-IDS Get CustomerProfile Request',
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_RESPONSE : 'mAAF Received SSO-IDS Get CustomerProfile Response',
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_RECEIVED_BAD : 'mAAF Received SSO-IDS Get CustomerProfile Response',
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_RECEIVED_ERROR : 'mAAF Received SSO-IDS Get CustomerProfile Error',
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_RECEIVED_CONNECTION_ERROR : 'mAAF Received SSO-IDS Get CustomerProfile Connection Error',
     AAF_SSO_IDS_GET_CUSTOMERPROFILE_RECEIVED_TIMEOUT : 'mAAF Received SSO-IDS Get CustomerProfile Timeout',
 
     //========================= LDAP =============================
     AAF_LDAP_POST_LDAP_REQUEST : 'mAAF Sent LDAP Post Ldap Request',
     AAF_LDAP_POST_LDAP_RESPONSE : 'mAAF Received LDAP Post Ldap Response',
     AAF_LDAP_POST_LDAP_RECEIVED_BAD : 'mAAF Received LDAP Post Ldap Response',
     AAF_LDAP_POST_LDAP_RECEIVED_ERROR : 'mAAF Received LDAP Post Ldap Error',
     AAF_LDAP_POST_LDAP_RECEIVED_CONNECTION_ERROR : 'mAAF Received LDAP Post Ldap Connection Error',
     AAF_LDAP_POST_LDAP_RECEIVED_TIMEOUT : 'mAAF Received LDAP Post Ldap Timeout',

     AAF_RECEIVED_PUSH_NOTIFICATION_INFO_REQUEST : 'mAAF Received Post PushNotificationInfo Request',
     AAF_RECEIVED_BAD_PUSH_NOTIFICATION_INFO_REQUEST : 'mAAF Received Bad Post PushNotificationInfo Request',
     AAF_RETURN_PUSH_NOTIFICATION_INFO_SUCCESS : 'mAAF Returned Post PushNotificationInfo Success',
     AAF_RETURN_PUSH_NOTIFICATION_INFO_ERROR : 'mAAF Returned Post PushNotificationInfo Error',
     AAF_RECEIVED_PUSH_NOTIFICATION_INFO_ERROR : 'mAAF Received Pantry Post PushNotificationInfo Error',
     AAF_RECEIVED_PUSH_NOTIFICATION_INFO_REJECT : 'mAAF Received Pantry Post PushNotificationInfo Reject',
     AAF_RECEIVED_PUSH_NOTIFICATION_INFO_ABORT : 'mAAF Received Pantry Post PushNotificationInfo Abort',
     AAF_RECEIVED_PUSH_NOTIFICATION_INFO_TIMEOUT : 'mAAF Received Pantry Post PushNotificationInfo Timeout',
     
     AAF_SEND_PANTRY_PUSH_NOTIFICATION_INFO_REQUEST : 'mAAF Sent Pantry Post PushNotificationInfo Request',
     AAF_RECEIVED_PANTRY_PUSH_NOTIFICATION_INFO_RESPONSE : 'mAAF Received Pantry Post PushNotificationInfo Response',
     AAF_RECEIVED_PANTRY_BAD_PUSH_NOTIFICATION_INFO_RESPONSE : 'mAAF Received Pantry Bad Post PushNotificationInfo Response',
})