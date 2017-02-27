/**
 * Created by youngsc on 2016/11/16.
 */
var tools = require('./tools');
var cheerio = require('cheerio');
var dynamic = require('../entity/bbsDynamic')
var logger = require('./logger')

var time_pattern = /\((\w{3} \w{3}.{1,2}\d{1,2} \d{2}:\d{2}:\d{2} \d{4})\)/;
var abstract_pattern = /(站内|转信)(.+)--/;
var get_page_parttern = /\?p=(\d+)/;

var change_time_parttern = /(\w{3}) (\w{3}).{1,2}(\d{1,2}) (.{8}) (\d{4})/;

exports.GrabReplies = function GrabReplies(url, cookies, callback) {
    var url = url.split('#a')[0];
    get_page_parttern.exec(url);
    var page = RegExp.$1;
    var target_urls = TargetPages(page, url);
    for (var i = 0; i < target_urls.length; ++i) {
        var this_url = target_urls[i];
        tools.get(target_urls[i], cookies, function (err, res) {
            if (err) {
                logger.erro(err + '/n grabber.js 24')
                return;
            }
            GrabOnePageReplies(res.text, this_url, callback);
        });
    }
    //TODO:这里要用类似Promise的形式来完成
    if (page - 5 > 0) {
        setTimeout(function () {
            var new_url = url.replace(get_page_parttern, '?p=' + (page - 5));
            GrabReplies(new_url, cookies, callback)
        }, 2000);
    }
}

function TargetPages(page, url) {
    var target_urls = new Array();
    for (var i = page; i > 0 && i > i - 5; --i) {
        target_urls.push(url.replace(get_page_parttern, '?p=' + i));
    }
    return target_urls;
}

function GrabOnePageReplies(html, target_url, callback) {
    $ = cheerio.load(html);
    try {
        var temp = $('span[class="n-left"]').text();
        var theme = $('span[class="n-left"]').text().split(':')[1].trim();

    }
    catch (err) {
        logger.erro(err + '\n' + temp);
    }
    $('div[class="a-wrap corner"]', 'div[class="b-content corner"]').each(function (index, element) {
        var username = $(element).find('span[class="a-u-name"]>a').text();
        var action = "回复";
        time_pattern.exec($(element).find('div[class="a-content-wrap"]').text());
        var time_str = RegExp.$1;
        abstract_pattern.exec($(element).find('div[class="a-content-wrap"]').text());
        var abstract = RegExp.$2;
        var url = target_url + '#' + $(element).prev().attr('name');

        var time = ParseTime(time_str);

        if (tools.isHaveNewReplies(new Date(time).getTime())) {
            var bbsdynamic = new dynamic(username, action, theme, time, abstract, url);
            logger.debug(bbsdynamic);
            if (callback) {
                callback(bbsdynamic);
            }
        }
    });
}

function ParseTime(time_str) {
    change_time_parttern.exec(time_str);
    var month;
    switch (RegExp.$2) {
        case 'Jan':
            month = 1;
            break;
        case 'Feb':
            month = 2;
            break;
        case 'Mar':
            month = 3;
            break;
        case 'Apr':
            month = 4;
            break;
        case 'May':
            month = 5;
            break;
        case 'Jun':
            month = 6;
            break;
        case 'Jul':
            month = 7;
            break;
        case 'Aug':
            month = 8;
            break;
        case 'Sep':
            month = 9;
            break;
        case 'Oct':
            month = 10
            break;
        case 'Nov':
            month = 11;
            break;
        case 'Dec':
            month = 12;
            break;
    }
    var time_res = RegExp.$5 + '-' + month + '-' + RegExp.$3 + ' ' + RegExp.$4;
    return time_res;
}