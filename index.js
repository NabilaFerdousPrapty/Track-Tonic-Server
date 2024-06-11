require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 7000;


app.use(cors(
    {
        origin: ["http://localhost:5173",
            "https://tracktonicfitnesstraining.web.app",
            "https://tracktonicfitnesstraining.firebaseapp.com",
        ],
        credentials: true
    }
))
app.use(express.json());


// jwt verify middleware
const verifyToken = (req, res, next) => {
    if (!req?.headers?.authorization) {
        return res.status(401).send({ message: 'Unauthorized Access' });
    }
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }
        req.decoded = decoded
        next();
    })

}


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
const newsletterCollection = client.db("TrackTonic").collection("newsletter");
const bookedTrainersCollection = client.db("TrackTonic").collection("bookedTrainers");
const paymentCollection = client.db("TrackTonic").collection("payments");
const classesCollection = client.db("TrackTonic").collection("classes");



async function dbConnect() {
    try {
        // await client.db('admin').command({ ping: 1 })
        console.log('You successfully connected to MongoDB!')
    } catch (err) {
        console.log(err)
    }
}
dbConnect()


app.get('/', (req, res) => {
    res.send('Fitness trainer is running!');
});



app.post('/jwt', async (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    })
    res.send({ token });

})

const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await usersCollections.findOne(query);
    const isAdmin = user?.role === 'admin';
    if (!isAdmin) {
        return res.status(403).send({ message: 'Forbidden Access' });
    }
    next();
}


app.get('/reviews', async (req, res) => {
    const cursor = reviewCollection.find({});
    const reviews = await cursor.toArray();
    res.send(reviews)
});
app.post('/reviews', async (req, res) => {
    const newReview = req.body;
    const result = await reviewCollection.insertOne(newReview);
    res.send(result);
}
);
app.get('/reviews/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const review = await reviewCollection.findOne(query);
    res.send(review)
}
);

app.get('/trainers', async (req, res) => {
    const cursor = trainersCollection.find({ status: 'approved' });
    const trainers = await cursor.toArray();
    res.send(trainers)
}
);
app.get('/trainers/all', async (req, res) => {
    const cursor = trainersCollection.find({});
    const trainers = await cursor.toArray();
    res.send(trainers)
}
);
app.get('/trainers/pending', async (req, res) => {
    const cursor = trainersCollection.find({ status: 'pending' });
    const trainers = await cursor.toArray();
    res.send(trainers)
}
);
app.post('/trainers', async (req, res) => {
    const newTrainer = req.body;
    const result = await trainersCollection.insertOne(newTrainer);
    res.send(result);
}
);
app.get('/trainers/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const trainer = await trainersCollection.findOne(query);
    res.send(trainer)
}
);
app.get('/trainers/email/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const trainer = await trainersCollection.find(query).toArray();
    res.send(trainer);
}
);
app.patch('/approveTrainer/:id', verifyAdmin, verifyToken, async (req, res) => {

    const id = req.params.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            status: 'approved'
        },
    };
    const result = await trainersCollection.updateOne(query, updateDoc);
    res.send(result);
});
app.patch('/rejectTrainer/:id', verifyToken, verifyAdmin, async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            status: 'rejected'
        },
    };
    const result = await trainersCollection.updateOne(query, updateDoc);
    res.send(result);
}
);
app.delete('/trainers/delete/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await trainersCollection.deleteOne(query);
    res.send(result)
}
);
app.post('/bookedTrainers', async (req, res) => {
    const newBooking = req.body;
    const result = await bookedTrainersCollection.insertOne(newBooking);
    res.send(result);
}
);
app.get('/posts', async (req, res) => {
    const cursor = postsCollection.find({});
    const posts = await cursor.toArray();
    res.send(posts)
}
);
app.post('/posts', async (req, res) => {
    const newPost = req.body;
    const result = await postsCollection.insertOne(newPost);
    res.send(result);
}
);

app.get('/posts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const post = await postsCollection.findOne(query);
    res.send(post)
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
app.post('/newsletter', async (req, res) => {
    const newEmail = req.body;
    const query = { email: newEmail.email };
    const existingEmail = await newsletterCollection.findOne(query);
    if (existingEmail) {
        res.send({ message: "Email already exists", insertedId: null })
        return

    }
    const result = await newsletterCollection.insertOne(newEmail);
    res.send(result);
}
);
app.get('/newsletter', async (req, res) => {
    const cursor = newsletterCollection.find({});
    const emails = await cursor.toArray();
    res.send(emails)
}
);


app.get('/users', async (req, res) => {
    const cursor = usersCollections.find({});
    const users = await cursor.toArray();
    res.send(users)
}
);


app.get('/users/admin/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollections.findOne(query);
    let admin = false;
    if (user) {
        admin = user?.role === 'admin';
    }
    res.send({ admin })
}
);
app.get('/users/trainer/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollections.findOne(query);
    let trainer = false;
    if (user) {
        trainer = user?.role === 'trainer';
    }
    res.send({ trainer })
}
);
app.post('/classes', verifyAdmin, verifyToken, async (req, res) => {
    const newClass = req.body;
    const result = await classesCollection.insertOne(newClass);
    res.send(result);
}
);
app.get('/classes', async (req, res) => {
    try {
        const { page = 1, limit = 6 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch classes with pagination
        const classes = await classesCollection.find().skip(skip).limit(parseInt(limit)).toArray();

        res.json(classes);
    } catch (err) {
        console.error('Error fetching classes:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/classes/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const classes = await classesCollection.findOne(query);
    res.send(classes)
}
);
app.get('/featuredClasses', async (req, res) => {
    try {
        const featuredClasses = await classesCollection.find().sort({ total_bookings: -1 }).limit(6).toArray();
        res.json(featuredClasses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post("/create_payment_intent", async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',

        payment_method_types: ['card']
    });

    res.send({
        clientSecret: paymentIntent.client_secret

    });
    console.log('secret', paymentIntent.client_secret);
}
);
app.post('/payments', async (req, res) => {
    const payment = req.body;
    const paymentResult = await paymentCollection.insertOne(payment);

    //  carefully delete each item from the cart
    console.log('payment info', payment);


    res.send(payment);
})
// Backend API for handling upvotes
app.patch('/posts/upvote/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        // console.log('postId:', postId);

        // Update the post in the database to increment the upvote count
        const query = { _id: new ObjectId(postId) };
        const result = await postsCollection.updateOne(query, { $inc: { upvote: 1 } });
        if (result.modifiedCount === 1) {
            res.status(200).json({ message: 'Upvote count updated successfully' });
        }else{
            res.status(404).json({ error: 'Query document not found' });
        }
    } catch (error) {
        console.error('Error upvoting post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Backend API for handling downvotes
app.patch('/posts/downvote/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        // console.log('postId:', postId);

      const query= { _id: new ObjectId(postId) };
      const result= await postsCollection.updateOne(query, { $inc: { downvote: 1 } });

      if (result.modifiedCount === 1) {
        res.status(200).json({ message: 'Downvote count updated successfully' });
      } else {
        res.status(404).json({ error: 'Query document not found' });
      }
    } catch (error) {
        console.error('Error downvoting post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/payments', async (req, res) => {
    const cursor = paymentCollection.find({});
    const payments = await cursor.toArray();
    res.send(payments)
}
);
app.get('/payments/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email };
        const cursor = paymentCollection.find(query);
        const payments = await cursor.toArray();
        res.send(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
