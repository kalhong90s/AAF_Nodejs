const mongoose = require('mongoose');

exports.connectMongoDB = async function() {
    
    let mongoConf = this.utils().services('mongo').conf('default');

    let auth=""
    if(mongoConf.auth){
        auth=mongoConf.auth.user+":"+mongoConf.auth.pwd+"@";
    }

    let uri = `mongodb://${auth}${mongoConf.ip}:${mongoConf.port}/${mongoConf.db}?authSource=admin`;
    
    // let uri = 'mongodb://' + CONFIG.DB.HOST + ':' + CONFIG.DB.PORT + '/' + CONFIG.DB.NAME;
    // if (CONFIG.DB.USERNAME && CONFIG.DB.PASSWORD) {
    //     uri = `mongodb://${CONFIG.DB.USERNAME}:${CONFIG.DB.PASSWORD}@${CONFIG.DB.HOST}:${CONFIG.DB.PORT}/${CONFIG.DB.NAME}`;
    // }
    mongoose.set("useNewUrlParser", true);
    // mongoose.set('debug', CONFIG.DB.DEBUG_ENABLE);
    mongoose.set('useCreateIndex', true)

    let db = await mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(result => {
        require('../mongodb/models/service-model');
        require('../mongodb/models/subscriptions-model');
        console.info(`connect db success : ${uri}`);
        return true;
    }).catch( error => {
        if (error) {
            console.info(`connect db error : ${error}`);
            process.exit(1);
        }
        return false;
    })  
    
    
    
    
}