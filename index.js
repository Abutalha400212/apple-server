const express = require("express");
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const url = process.env.DB_URL;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
app.use(cors());
app.use(express.json());
async function DBConnect() {
  try {
    client.connect()
    console.log("DB connected");
    const productsCollection = client.db('apple').collection('productCollection')
    app.get('/products',async(rea,res)=>{
        const result = await productsCollection.find({}).toArray()
        res.send(result)
    })
    app.get('/products/:id',async(req,res)=>{
        const {id} = req.params
        const result = await productsCollection.findOne({_id:ObjectId(id)})
        res.send(result)
    })
    app.get("/category", async (req, res) => {
      const result = await productsCollection
        .find({})
        .project({ name: 1 })
        .toArray();
      res.send(result);
    });
    app.put("/products/:id", async (req, res) => {
      const { id } = req.params;
      const status = req.body.quantity;
      const options = { upsert: true }
      const updateStatus = {
        $set: {
          quantity: status,
        },
      };
      const result = await productsCollection.updateOne(
        { _id: ObjectId(id) },
        updateStatus,options
      );
      res.send(result);
    })
  } finally {
  }
}
DBConnect().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("server is running");
});
app.listen(port, () => {
  console.log("server is running", port);
});
