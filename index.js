/**
 * Created by youngsc on 2016/11/5.
 */
var cookies = require('./helper/cookies.js');
var tools = require('./helper/tools.js');
var logger = require('./helper/logger.js');
var config = require('./config/config.js')
var cheerio = require('cheerio')

var cookies;
var delay = 100;
var threadnum = 5;
var _boardcursor = 0;
var byr_url = 'https://bbs.byr.cn';

//为了获取cookies登陆一次即可，频繁post表达是没有必要的
cookies.getCookies(function (_cookies) {
    cookies = _cookies;
    getHtml();
});

function getHtml() {
    tools.get(config.start_url, cookies, function (err, res) {
        parseHtml(res.text, '/board/\\w+', function (boards) {
            for (var i = 0; i < threadnum; i++) {
                getArticles(boards);
            }
        });
    })
}

function parseHtml(html, regExp, callback) {
    var list = new Array();
    $ = cheerio.load(html);
    $('a').each(function (index, element) {
        try {
            var res = $(element).attr('href')
            if (typeof(res) !== 'undefined') {
                res = res.match(regExp);
                if (res != null) {
                    list.push(res[0]);
                    console.log(byr_url+res[0]);
                }
            }
        }
        catch (err) {
            logger.erro(element);
        }
    });
    callback(list);
}

function getArticles(boards) {
    cursor = getcursor();
    if (cursor > boards.length) {
        return;
    }
    tools.get(byr_url + boards[cursor], cookies, function (err, res) {
        parseHtml(res.text, '/article/\\w+/\\d+', function (list) {
            setTimeout(function () {
                getArticles(boards);
            }, delay);
        });
    })
}

function getcursor() {
    _boardcursor++;
    return _boardcursor - 1;
}