/**
 * Created by yongsc on 2016/11/5.
 */
var tools = require('./tools.js');
var config = require('../config/config.js');
var config_user = require('../config/config_user')
var logger = require('./logger.js')

var data_str = 'id=' + config_user.user + '&passwd=' + config_user.pwd + '&mode=0&CookieDate=0';

exports.getCookies = function (callback) {
    tools.post('https://bbs.byr.cn/user/ajax_login.json', null, data_str, function (err, res) {
        var arry = res.header['set-cookie'];
        arry.splice(0, 3);
        var cookies_str = '';
        arry.forEach(function (item, index) {
            item = item.split(';')[0] + ';';
            cookies_str += item;
        });
        logger.debug(cookies_str);
        callback(cookies_str);
    });
}