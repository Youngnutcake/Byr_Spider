/**
 * Created by youngsc on 2016/11/5.
 */
var charset = require('superagent-charset');
var request = require('superagent');
charset(request);

var cookies_test = 'nforum[UTMPUSERID]=youngsc; nforum[UTMPKEY]=15687886; nforum[UTMPNUM]=2469; nforum[PASSWORD]=IJhz6CfE2BOKU2%2FK86pSPA%3D%3D';
exports.get = function (url, cookies, callback) {
    var headers = {
        'authority': 'bbs.byr.cn',
        'method': 'GET',
        'accept': '*/*',
        'accept-encoding': 'gzip, deflate, sdch, br',
        'accept-language': 'zh-CN,zh;q=0.8',
        'referer': 'https://bbs.byr.cn/',
        'cache-control': 'max-age=0',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36',
        'cookie': cookies,
        'x-requested-with': 'XMLHttpRequest',
    };
    request.get(url)
        .charset('gbk')
        .set(headers)
        .end(callback);
}

exports.post = function (url, cookies, body, callback) {
    var headers = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh-CN,zh;q=0.8',
        'content-length': '39',
        'origin': 'https//bbs.byr.cn',
        'referer': 'https://bbs.byr.cn/index',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.87 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'cookie': cookies,
        'x-requested-with': 'XMLHttpRequest',
    };
    request.post(url).charset('gbk')
        .set(headers).send(body)
        .end(callback);
}