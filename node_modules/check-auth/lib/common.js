/**
 * Created by wayne on 16-7-1.
 */
var qq = require('./checkQq');
var wechat = require('./checkWechat');
var weibo = require('./checkWeibo');
module.exports = function(params,callback){
    if(params.platform == 'QQ'){
        qq.check(params.data,callback);
    }else if(params.platform == 'Wechat'){
        wechat.check(params.data,callback);
    }else if(params.platform == 'SinaWeibo'){
        weibo.check(params.data,callback);
    }else{
        callback('Not supported platform！');
    }
};