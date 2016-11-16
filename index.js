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
var nb = false;
var boards = new Array();

var NewArticles = new Array();
var NewReplies = new Array();

function main() {
    if (process.argv.length > 2) {
        var argv = new Array();
        for (var i = 2; i < process.argv.length; i++) {
            argv.push(process.argv[i].trim().toLowerCase());
        }
        if (argv.indexOf('-i') != -1) {

        }
        if (argv.indexOf('-d' != -1))
            logger.enabledebug();
        if (argv.indexOf('-nb') != -1)
            nb = true;
    }

    if (!nb) {
        //为了获取cookies登陆一次即可，频繁post表达是没有必要的
        cookies.getCookies(function (_cookies) {
            cookies = _cookies;
            getBoards(config.start_url);
        });
    }
    else {
        //TODO:read board information and cookies from a file
        for (var i = 0; i < threadnum; i++) {
            getArticles(boards, i);
        }
    }
}

function getBoards(url) {
    tools.get(url, cookies, function (err, res) {
        parseHtml(res.text, '/section/\\w+', function (sections) {
            for (var i = 0; i < sections; i++) {
                getBoardsbySection(byr_url + sections[i]);
            }
            parseHtml(res.text, '/board/\\w+', function (_boards) {
                boards = boards.concat(_boards);
                for (var i = 0; i < threadnum; i++) {
                    getArticles(boards, i);
                }
            });
        });
    })
}

function getBoardsbySection(url) {
    parseHtml(res.text, '/board/\\w+', function (_boards) {
        boards = boards.concat(_boards);
    });
}

function getArticles(boards, i) {
    var cursor = getcursor();
    if (cursor > boards.length - 1) {
        logger.log('本时间段第 ' + i + ' 个线程抓取完成');
        return;
    }
    tools.get(byr_url + boards[cursor], cookies, function (err, res) {
        if (err) {
            logger.erro(err);
            return;
        }
        parseTableTag(res.text, function (list) { //'/article/\\w+/\\d+'
            //TODO:Grab new replies
            setTimeout(function () {
                getArticles(boards, i);
            }, delay);
        });
    })
}

//parse html and get all url by a tag
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
                    logger.debug(byr_url + res[0]);
                }
            }
        }
        catch (err) {
            logger.erro(element);
        }
    });
    callback(list);
}

//parse html and get all article information include content,time and so on
function parseTableTag(html, callback) {
    var list = new Array();
    $ = cheerio.load(html);
    $('tbody tr', 'table[class="board-list tiz"]').each(function (index, element) {
        var current_tr = $(element);
        var theme = current_tr.children().eq(1).text();
        var start_time_str = current_tr.children().eq(2).text().trim();
        var last_reply_time_str = current_tr.children().eq(5).find('a').text().trim();
        var grab_url = byr_url + current_tr.children().eq(5).find('a').attr('href');

        logger.debug(current_tr.children().eq(1).text());                                  //文章主题
        logger.debug("发帖时间:" + current_tr.children().eq(2).text());                   //发帖时间
        logger.debug("最新回复:" + current_tr.children().eq(5).find('a').text());         //最新回复

        var start_time = tools.str2time(start_time_str);
        var last_reply_time = tools.str2time(last_reply_time_str);

        if (tools.isNewArticles(start_time)) {
            logger.log("目标URL:" + grab_url);
            list.push(grab_url);
        } else if (tools.isHaveNewReplies(last_reply_time)) {
            logger.log("目标URL:" + grab_url);
            list.push(grab_url);
        }
    });
    callback(list);
}

function getcursor() {
    _boardcursor++;
    return _boardcursor - 1;
}


main();