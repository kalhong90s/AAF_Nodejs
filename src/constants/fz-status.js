module.exports = Object.freeze ({
    UNKNOWN_API : { 
        STATUS_CODE : '404', RESULT_CODE : '40400', DEVELOPER_MESSAGE : 'Unknown URL'
    },
    SUCCESS : {
        STATUS_CODE : '200', RESULT_CODE : '20000', DEVELOPER_MESSAGE : 'Success'
    },
    CREATE_SUCCESS : {
        STATUS_CODE : '201', RESULT_CODE : '20100', DEVELOPER_MESSAGE : 'Create Success'
    },
    DATA_NOT_FOUND : {
        STATUS_CODE : '404', RESULT_CODE : '40401', DEVELOPER_MESSAGE : 'Data Not Found'
    },
    MISSING_OR_INVALID_PARAMETER : {
        STATUS_CODE : '403', RESULT_CODE : '40300', DEVELOPER_MESSAGE : 'Missing Or Invalid Parameter'
    },
    SYSTEM_ERROR : {
        STATUS_CODE : '500', RESULT_CODE : '50000', DEVELOPER_MESSAGE : 'System Error'
    },
    CONNECTION_ERROR : {
        STATUS_CODE : '500', RESULT_CODE : '50003', DEVELOPER_MESSAGE : 'Connection Error'
    },
    CONNECTION_TIMEOUT : {
        STATUS_CODE : '500', RESULT_CODE : '50002', DEVELOPER_MESSAGE : 'Connection Timeout'
    },
    MSISDN_IS_NOT_MATCHED : {
        STATUS_CODE : '403', RESULT_CODE : '40311', DEVELOPER_MESSAGE : 'Msisdn Is Not Matched'
    },
    ACCESS_DENIED : {
        STATUS_CODE : '401', RESULT_CODE : '40101', DEVELOPER_MESSAGE : 'Access Denied'
    },
    DATABASE_ERROR : {
        STATUS_CODE : '500', RESULT_CODE : '50001', DEVELOPER_MESSAGE : 'Database Error'
    },
    DATA_EXIST : {
        STATUS_CODE : '403', RESULT_CODE : '40301', DEVELOPER_MESSAGE : 'Data Exist'
    },
    ORDER_STILL_IN_PROCESSING : {
        STATUS_CODE : '401', RESULT_CODE : '40114', DEVELOPER_MESSAGE : 'Order Still In Processing'
    },
    INACTIVE_USER : {
        STATUS_CODE : '403', RESULT_CODE : '40310', DEVELOPER_MESSAGE : 'Inactive User'
    }
})