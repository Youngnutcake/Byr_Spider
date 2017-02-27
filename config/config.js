/**
 * Created by sun48 on 2016/11/5.
 */

exports.login_url = 'https://bbs.byr.cn/index';
exports.start_url = 'https://bbs.byr.cn/default?_uid=youngsc';

exports.dbconfig = {
    host: 'localhost',//数据库服务器
    user: 'dbuser',//数据库用户名
    password: 'dbpassword',//数据库密码
    database: 'dbname',//数据库名
    port: 3306,//数据库服务器端口
    poolSize: 20,
    acquireTimeout: 30000
};

exports.mailservice = "QQ";//邮件通知服务类型，也可以用Gmail，前提是你访问得了Gmail
exports.mailuser = "296763240@qq.com";//邮箱用户名
exports.mailpass = "sun2SC5cong39";//邮箱密码
exports.mailfrom = "296763240@qq.com";//发送邮件地址
exports.mailto = "296763240@qq.com";//接收通知邮件地址