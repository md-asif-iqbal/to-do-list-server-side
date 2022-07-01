const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oasro.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db("task").collection("todo");
    // add Task here
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
      console.log(result);
    });
    app.get("/task", async (req, res) => {
      const email = req.query.email;
      if (email) {
        const quary = { email: email };
        const result = await taskCollection.find(quary).toArray();
        res.send(result);
      } else {
        return res.status(403).send({ message: "Forbidden Access" });
      }
    });
    // Update complete
    app.put('/task/:id', async (req, res) => {
        const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const options = { upsert: true };
      const update = req.body;
        console.log(update,'yes');
        const updateDoc = {
          $set: {
            status:'completed'
          }
        };
  
        const result = await taskCollection.updateOne(query, updateDoc);
        
        res.send(result);
      });
    //   Update Task
    app.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const update = req.body;
      console.log(update);
      const options = { upsert: true };

        const updateDoc = {
          $set: {
            name:update.name,
            description:update.description
        
          }
        };
  
        const result = await taskCollection.updateOne(query, updateDoc);
        
        res.send(result);
      });
    //   delete
    app.delete('/task/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await taskCollection.deleteOne(query);
        res.send(result)
      });
    //   complete task
    app.get("/taskcomplete", async (req, res) => {
        const email = req.query.email;
        const status = req.query.status;
        if (email && status) {
          const quary = { email: email , status: status};
          const result = await taskCollection.find(quary).toArray();
          res.send(result);
        } else {
          return res.status(403).send({ message: "Forbidden Access" });
        }
      });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From todo..!");
});

app.listen(port, () => {
  console.log(`To-do is listening on port ${port}`);
});
