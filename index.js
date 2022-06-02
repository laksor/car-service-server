const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
const serverName = "car service";

require("dotenv").config();

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
    const userCollection = client.db("car-service").collection("users");
   console.log('db connected');
} finally {

  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running car server");
});

app.listen(port, () => {
  console.log(`${serverName} server is running on port ${port}`);
});
