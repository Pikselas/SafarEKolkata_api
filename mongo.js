class mongodb {
    constructor(URL, DBName) {
      const Mongo = require('mongodb').MongoClient
      this.Ready = new Promise((resolve , reject)=>{
        Mongo.connect(URL).then((Mdb) => {
          this.db = Mdb.db(DBName);
          resolve(this);
        }).catch((err)=>{
          reject(err);
        })
      });
    }
    async insertOne(collection, data) {
      return await this.db.collection(collection).insertOne(data);
    }
    async find(collection, data) {
      return await this.db.collection(collection).find(data).toArray();
    }
    async updateOne(collection, data, newData) {
      return await this.db.collection(collection).updateOne(data, newData);
    }
    async deleteOne(collection, data) {
      return await this.db.collection(collection).deleteOne(data);
    }
    async deleteMany(collection, data) {
      return await this.db.collection(collection).deleteMany(data);
    }
  }
  
  exports.mongodb = mongodb;