/**
 * Created by sun48 on 2016/11/6.
 */

var isdebug = false;

exports.enabledebug = function () {
    isdebug = true;
}

exports.disabledebug = function () {
    isdebug = false;
}

exports.log = function (msg) {
    console.log(msg);
}

exports.debug = function (msg) {
    if (isdebug) {
        console.log('debug message is ' + msg + 'at ' + getCurrentTime());
    }
}

exports.erro = function (msg) {
    console.log('erro message is ' + msg + getCurrentTime());
}

function getCurrentTime() {
    var myDate = new Date();
    return myDate.toLocaleString();
}