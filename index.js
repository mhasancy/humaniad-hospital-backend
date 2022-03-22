//imported and express file
const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//database user-password connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.86fnr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//data async await function
async function run() {
  try {
    await client.connect();
    const database = client.db("humanidadMaster");
    const servicesCollection = database.collection("services");
    const appointmentsCollection = database.collection("appointments");
    const blogsCollection = database.collection("blogs");
    const doctorsCollection = database.collection("doctors");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");

    //products data load
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    //users data load
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //reviews data load
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    //blogs data load
    app.get("/blogs", async (req, res) => {
      const cursor = blogsCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs);
    });
    //orders data load
    app.get("/appointments", async (req, res) => {
      const cursor = appointmentsCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });
    //products data adding
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });
    //users data adding
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    //users data updating
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    //admin data making
    app.put("/users/admin", async (req, res) => {
      const email = req.body.email;
      const filter = { email: email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //admin data checking
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    //orders data adding
    app.post("/appointments", async (req, res) => {
      const order = req.body;
      const result = await appointmentsCollection.insertOne(order);
      res.json(result);
    });
    //products data adding
    app.post("/services", async (req, res) => {
      const products = req.body;
      const result = await servicesCollection.insertOne(products);
      res.json(result);
    });
    //reviews data adding
    app.post("/reviews", async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.json(result);
    });

    //orders data deleting
    app.delete("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await appointmentsCollection.deleteOne(query);
      res.json(result);
    });
    //products data deleting
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
    //status updating from  pending to approved
    app.put("/appointments/:id", async (req, res) => {
      const id = req.params.id;
      const requestedStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const statusChange = {
        $set: {
          status: requestedStatus.status,
        },
      };
      const result = await appointmentsCollection.updateOne(
        filter,
        statusChange,
        option
      );
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);
//data testing if server is running
app.get("/", (req, res) => {
  res.send("Humanidad server is running on heroku.");
});
//server is running and showing server console
app.listen(port, () => {
  console.log("Running on port ", port);
});
