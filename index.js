
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 7000;
const app = express();
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');

// middleware
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        '',
        ''
    ],
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json());
// app.use(cookieParser());


// jwt verify middleware

app.get('/', (req, res) => {
    res.send('Fitness trainer is running!');
});
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pflyccd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const reviewCollection = client.db("TrackTonic").collection("reviews");
const trainersCollection = client.db("TrackTonic").collection("trainers");
const postsCollection = client.db("TrackTonic").collection("forumPost");
const usersCollections = client.db("TrackTonic").collection("users");
async function run() {

    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews)
        });

        app.get('/trainers', async (req, res) => {
            const cursor = trainersCollection.find({});
            const trainers = await cursor.toArray();
            res.send(trainers)
        }
        );
        app.get('/trainers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const trainer = await trainersCollection.findOne(query);
            res.send(trainer)
        }
        );
        app.get('/posts', async (req, res) => {
            const cursor = postsCollection.find({});
            const posts = await cursor.toArray();
            res.send(posts)
        }
        );
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const query = { email: newUser.email };
            const existingUser = await usersCollections.findOne(query);
            if (existingUser) {
              res.send({ message: "User already exists", insertedId: null })
              return
      
            }
            const result = await usersCollections.insertOne(newUser);
            res.send(result);
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
