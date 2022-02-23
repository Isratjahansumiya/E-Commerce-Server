const express = require('express');
const bodyParser = require('body-parser');
const cors=require('cors');
const { MongoClient} = require('mongodb');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e93px.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.json());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("e-commerce").collection("items");
  const OrdersCollection = client.db("e-commerce").collection("orders");
  app.post('/addProduct',(req, res) => {
      const products =req.body;
      productCollection.insertOne(products)
      .then(result => {
          console.log(result);
          res.send(result.insertedCount);
      })
  })
  app.get('/products',(req, res) => {
    productCollection.find({})
    .toArray((err,documents) => {
      res.send(documents)
    })

  })
  app.get('/product/:key',(req, res) => {
    productCollection.find({key: req.params.key})
    .toArray((err,documents) => {
      res.send(documents[0])
    })

  })
  app.post('/productsByKeys',(req, res) => {
    const productKeys=req.body;
    productCollection.find({key: {$in: productKeys}})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder',(req, res) => {
    const order =req.body;
    OrdersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount>0);
    })
})

});


app.listen(process.env.DB_PASS || port)