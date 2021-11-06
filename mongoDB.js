const { MongoClient } = require('./node_modules/mongodb');
const Config = require('./VCconfig');
class Db {
    static getInstance() {
        if (!Db.instance) {
            Db.instance = new Db();
        }
        return Db.instance;
    }

    constructor() {
        this.dbClient = '';
        this.connect()
    }

    connect() {
        return new Promise((resolve, reject) => {
            if (!this.dbClient) {
                console.log('Connecting to DB');
                MongoClient.connect(Config.dbUrl, (err, client) => {
                    if (err) {
                        reject(err);
                    }
                    console.log('Connected success');
                    this.dbClient = client.db(Config.dbName);
                    resolve(this.dbClient);
                });
            } else {
                resolve(this.dbClient);
            }
        });
    }


    find(coll, query) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).find(query).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(docs);
                });
            })
        })
    }

    aggregate(coll, query) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).aggregate(query).toArray((err, docs) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(docs);
                });
            })
        })
    }


    insertOne(coll, data) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).insertOne(data, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }


    deleteOne(coll, query) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).deleteOne(query, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }


    updateOne(coll, query, data) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).updateOne(query, data, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                })
            })
        })
    }


    updateMany(coll, query, data) {
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(coll).updateMany(query, data, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            })
        })
    }


}

module.exports = Db.getInstance();


