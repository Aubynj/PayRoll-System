/**
 * Database connectivity
 */
var Datastore = require('nedb');
var db = {};
db.administrator = new Datastore({filename : './Database/DB/administrator.json', corruptAlertThreshold : 1 , autoload : true});
db.customers = new Datastore({filename : './Database/DB/customers.json', corruptAlertThreshold : 1 , autoload : true});
db.earnings = new Datastore({filename : './Database/DB/earnings.json', corruptAlertThreshold : 1 , autoload : true});
db.deductions = new Datastore({filename : './Database/DB/deductions.json', corruptAlertThreshold : 1 , autoload : true});
db.salaries = new Datastore({filename : './Database/DB/salaries.json', corruptAlertThreshold : 1 , autoload : true});

module.exports = db;