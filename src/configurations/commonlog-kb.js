let conf = {};
conf.projectName = require('../constants/fz-node-name').AAF;  //project name

conf.log = {};
conf.log.time = 15;  //Minute
conf.log.path = './logs/appLog/';  //path file
conf.log.level = require('./config').APP_LOG.LEVEL; //debug,info,warn,error
conf.log.console = false;
conf.log.file = true;
//conf.log.size = null;   //maxsize per file, k


conf.summary = {};
conf.summary.time = 15;
conf.summary.path = './logs/summaryLog/';
conf.summary.console = false;
conf.summary.file = true;
//conf.summary.size = null;

conf.detail = {};
conf.detail.time = 15;
conf.detail.path = './logs/detailLog/';
conf.detail.console = false;
conf.detail.file = true;
conf.detail.rawData = require('./config').APP_LOG.RAWDATA_ENABLE;
//conf.detail.size = null;

conf.stat={};
conf.stat.time = 15;
conf.stat.path = './logs/stat/'; //optional, folder path DB
conf.stat.mode = 0; //0 == file, 1== :memory:
conf.stat.pathDB = undefined; //optional, folder path DB
conf.stat.statInterval = 1;
conf.stat.console = false;
conf.stat.file = true;
//conf.stat.size = 15;
//conf.stat.flush = false;

module.exports = conf;