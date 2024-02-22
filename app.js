const uri =require("./secret").uri;
const mongo = require("./mongo");
const { MongoClient } = require("mongodb");

async function retrieveData() {
  // Your MongoDB connection URI
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let result = null;
  try {
    await client.connect();
    const db = client.db("PlaceData"); // Replace with your database name
    const collection = db.collection("places"); // Replace with your collection name

    // Retrieve all documents
    result = await collection.find({}).toArray();
    console.log("Retrieved documents:", result);
  } catch (error) {
    console.error("Error retrieving data:", error);
  } finally {
    await client.close();
  }
  return result;
}



const express = require("express");

const app = express();


app.get("/", async (req, res) => {
  const mdb = new mongo.mongodb(uri, "PlaceData");
  await  mdb.Ready
    res.send( await mdb.find ("places",{}));
  
  
}
);
 
  

app.get("/:place_id", async (req, res) => {
  const mdb = new mongo.mongodb(uri, "PlaceData");
  await  mdb.Ready
    res.send(await mdb.find("place_details", {place_id:req.params.place_id}));
  });

app.listen(3000, () => {
  console.log("app is running");
});
