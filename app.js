const uri =require("./secret").uri;
const mongo = require("./mongo");

const rapid_api = require("./rapid_api");

const express = require("express");

const app = express();
app.use(express.json())


app.get("/get_place" ,async (req , res)=>
{
  let r = await rapid_api.search_place_details("Popular Tourist spots");
  if(r.success)
  {
    res.status(200).send(r.data);
  }
  else
  {
    res.status(500).send(r.error);
  }
});

app.post("/user_feedback" , async (req , res)=>
{

  const msg = `Your response regarding app has been submitted
  APP RATING: ${req.body.app_rating}
  MESSAGE: ${req.body.message}`;

  rapid_api.send_mail(req.body.name , req.body.email , "Feedback Received - Calcutta Compass" , msg);
  res.status(200).end();
});

app.get("/search_place/:name",async (req, res)=>
{
  let r = await rapid_api.search_place_details(req.params.name);
  if(r.success)
  {
    res.status(200).send(r.data);
  }
  else
  {
    res.status(500).send(r.error);
  }
});

app.get("/search_subitems/:query" , async (req,res)=>
{
  let r = await rapid_api.search_sub_items(req.params.query);
  if(r.success)
  {
    res.status(200).send(r.data);
  }
  else
  {
    res.status(500).send(r.error);
  }
});

/*app.get("/get_place", async (req, res) => 
{
  const mdb = new mongo.mongodb(uri, "PlaceData");
  await  mdb.Ready
  console.log("REQUEST LOADED");
  res.send(await mdb.find("places",{},{_id:0,description:0}));  
});*/
 
app.get("/get_place_details/:place_id", async (req, res) => 
{
  const mdb = new mongo.mongodb(uri, "PlaceData");
  await mdb.Ready

  let place_data = await mdb.find("places", {place_id:req.params.place_id},{_id:0});

  let map_url = new URL("http://dev.virtualearth.net/REST/v1/Locations");
  let map_key = "AjMKxLlsExzF24GrXDTAAVrTv11D_UA9vYV2FMjFelfyrqIUHINH43gEdpjX7Ypw";

  let place = place_data[0]["place_name"] + ',' + place_data[0]["location"] + ',' + 'kolkata';

  map_url.searchParams.append("q" , place);
  map_url.searchParams.append("key" , map_key);

  let d = await fetch(map_url , {
    method: "GET"
  });

  let jsd = (await d.json())["resourceSets"][0]["resources"][0]["point"]["coordinates"];
  
  place_data[0]["lat"] = jsd[0];
  place_data[0]["lon"] = jsd[1];

  res.send(place_data);
});

app.get("/search_place/:name",async (req, res)=>
{
  const mdb = new mongo.mongodb(uri, "PlaceData");
  await mdb.Ready;

  let exp = new RegExp(req.params.name,"i");
  let data = await mdb.find("places",{ place_name : { "$regex": exp } },{_id:0,description:0});
  res.send(data);
});

app.get("/get_images/:name",async (req,res)=>
{

  let key = "2d4a95744e8348bf85daf38212a4e1a0";

  //let search_api_endpoint = `https://api.bing.microsoft.com/v7.0/search?q=${search_str}&count=10&offset=0&mkt=en-us&safesearch=Moderate&responseFilter=places`

  let search_api_endpoint = `https://api.bing.microsoft.com/v7.0/images/search?q=${req.params.name}&count=10`;

  let headers = {"Ocp-Apim-Subscription-Key": key };

  let re = await fetch(search_api_endpoint , {headers});
  let res_json = await re.json();

  res_json = res_json["value"].map((data)=>
  {
    return { thumbnail: data["thumbnailUrl"] , content: data["contentUrl"]};
  });

  res.send(res_json);

});

app.listen(3000, () => {
  console.log("app is running");
});
