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
    async find(collection, data , project = null, sort_by = null) {
      let find_cursor = this.db.collection(collection).find(data);
      if(project != null)
      {
        find_cursor = find_cursor.project(project);
      }
      if(sort_by != null)
      {
        find_cursor = find_cursor.sort(sort_by);
      }
      return await find_cursor.toArray();
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
    async aggregate(collection,data)
    {
      return await this.db.collection(collection).aggregate(data).toArray();
    }

  }
  
  exports.mongodb = mongodb;