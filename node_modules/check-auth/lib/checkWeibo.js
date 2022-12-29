var request = require('superagent');
module.exports = {
    check : function (data,callback) {
        if(!data.uid || !data.token){
            callback('please input uid and token');
        }else{
            request.get('https://api.weibo.com/2/account/get_uid.json?access_token=' + data.token)
                .end(function (err, res) {
                    var result = JSON.parse(res.text);
                    if(err){
                        console.log(err);
                        return callback(null,false);
                    }
                    if(result && result.uid && result.uid == data.uid ){
                        callback(null,true);
                    }else{
                        callback(null,false);
                    }
                });
        }
    }
};