var request = require('superagent');
module.exports = {
    check : function (data,callback) {
        if(!data.uid || !data.token){
            callback('please input uid and token');
        }else{
            request.get('https://api.weixin.qq.com/sns/userinfo?access_token='+data.token+'&openid='+data.uid)
                .end(function (err, res) {
                    var result = JSON.parse(res.text);
                    if(err || (result && result.errcode)){
                        console.log(err || result);
                        return callback(null,false);
                    }
                    if(result && result.openid && result.openid === data.uid ){
                        callback(null,true);
                    }else{
                        console.log(result)
                        callback(null,false);
                    }
                });
        }
    }
};