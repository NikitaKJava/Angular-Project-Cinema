var request = require('superagent');
var crypto = require('crypto');
module.exports = {
    check : function (params,callback) {
        if(!params.type || !params.data || !params.appkey ||!params.uri){
            callback('please input type,data(),appkey,uri');
        }else{
            request.get('http://openapi.tencentyun.com'+params.uri+'?sig='+sign(params) +'&'+ objectToSting(params.data))
                .end(function (err, res) {
                    var result = JSON.parse(res.text);
                    if(err || !result ){
                        console.log(err || 'qq no response');
                        return callback(null,false);
                    }
                    if(result.ret === 0){
                        callback(null,true);
                    }else{
                        console.log(result);
                        callback(null,false);
                    }
                });
        }
    }
};
function objectToSting(data) {
    var dataKeys = Object.keys(data).sort();
    var dataString = '';
    dataKeys.forEach(function (key) {
        dataString += key + '=' + data[key] + '&';
    });
    return dataString.substring(0,dataString.length-1);
}

function sign(params) {
    var encodeUrI =  encodeURIComponent(params.uri);
    var dataKeys = Object.keys(params.data).sort();
    var dataString = objectToSting(params.data);
    var encodeData = encodeURIComponent(dataString);
    var signSting = params.type + '&' + encodeUrI + '&' + encodeData;
    return encodeURIComponent(crypto.createHmac('sha1', params.appkey + '&').update(signSting).digest().toString('base64'));
}

