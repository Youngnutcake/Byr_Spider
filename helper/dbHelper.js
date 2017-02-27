/**
 * Created by youngsc on 2016/11/26.
 */
var mysql = require('mysql');
var logger = require('./logger');
var moment = require('moment');
var uuid = require('uuid');

var pool;
var RecordID;

function dbHelper(dbname, server, port, uID, pwd) {

    var env = {
        connectionLimit : 100,
        connectTimeout  : 60 * 60 * 1000,
        aquireTimeout   : 60 * 60 * 1000,
        timeout         : 60 * 60 * 1000,
        host: server,
        port: port,
        user: uID,
        password: pwd,
        database: dbname,
        mutipleStatements: true
    };

    pool = mysql.createPool(env);

    this.insertDynamic = function (bbsDynamic, callback) {
        var sql = 'insert into snapshot values ("' + bbsDynamic.author + '","' + bbsDynamic.action + '","' + bbsDynamic.theme + '","' + bbsDynamic.time + '","' + bbsDynamic.abstract + '","' + bbsDynamic.url + '","' + RecordID + '")';
        query(sql, function (err, rows) {
            if (err) {
                logger.erro(err);
                return;
            }
            if (callback) {
                callback(rows);
            }
        })
    }

    this.insertRecords = function () {
        RecordID = uuid.v1();
        var time = moment().format('YYYY-MM-DD hh:mm:ss');
        var sql = 'insert into records values("' + RecordID + '","' + time + '")';
        query(sql);
    }
}

function query(sql, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            logger.erro(err);
            if (callback) {
                callback(err);
            }
            return;
        }
        connection.query(sql, function (err, rows) {
            if (err) {
                logger.erro(err);
                if (callback) {
                    callback(err);
                }
                return;
            }
            connection.release();
            if (callback) {
                callback(null, rows);
            }
        })
    })
}

module.exports = dbHelper;