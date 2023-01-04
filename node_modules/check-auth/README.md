# check-auth
服务端对客户端的第三方授权登录进行校验

## Installation

node:

```
$ npm install check-auth
```

## Usage


```js
var check = require('check-auth');
var qqParams = {
    type   : 'GET',
    appkey : 'n7zMLj1O1AsZmVn6',
    uri    : '/v3/user/is_login',
    data   : {
        pf: "desktop_m_qq",
        appid: "111111111",
        format: "json",
        userip: "123.17.218.101",
        openid: "111111111111",
        openkey: "11111111111111111"
    }
};
var wechatParams = {
    uid : "111111111111",
    token: "11111111111111111"
};
var weiboParams = {
    uid : "111111",
    token: "111111111111111111111111"
};
check({platform:'QQ',data: qqParams},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log('QQ', result);
    }
});
check({platform:'Wechat',data: wechatParams},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log('Wechat:',result);
    }
});
check({platform:'SinaWeibo',data: weiboParams},function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log('SinaWeibo',result);
    }
});

```