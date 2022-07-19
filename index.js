const express = require("express");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const serverName = "car service";


// middleware
app.use(cors());
app.use(express.json());

// connecting mongodb and crud

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6up5erp.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db('car').collection('services');
    const orderCollection = client.db('car').collection('order');
   
    // Auth
    app.post('/login', async(req,res)=>{
    const user = req.body;
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn : '1d'
    })
    res.send({accessToken});
   })

    // service api
    app.get('/service', async (req,res) =>{
    const query = {};
    const cursor = serviceCollection.find(query);
    const services = await cursor.toArray();
    res.send(services);
   })
   
   app.get('/service/:id', async (req,res) =>{
     const id = req.params.id; 
     const query = {_id: ObjectId(id)};
     const service = await serviceCollection.findOne(query);
     res.send(service);
   })

   //Post

   app.post('/service', async (req,res) =>{
      const newService = req.body;
      const result = await serviceCollection.insertOne(newService);
      res.send(result);
   })

   //Delete

   app.delete('/service/:id', async (req,res) =>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const result = await serviceCollection.deleteOne(query);
    res.send(result);
   })

   //order collection

   app.post('/order', async(req,res) => {
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.send(result);
   })

} finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car service server");
});

app.listen(port, () => {
  console.log(`${serverName} server is running on port ${port}`);
});
