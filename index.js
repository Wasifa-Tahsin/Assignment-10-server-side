const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.miz4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });


// 2. vercel deploy

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      // await client.connect();
      const gameReview=client.db("game-Review").collection('review')


      app.get('/addReview',async(req,res)=>{
        const cursor=gameReview.find()
        const result=await cursor.toArray()
        res.send(result)
      })
      app.get('/addReview/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id: new ObjectId(id)}
        const result=await gameReview.findOne(query)
        res.send(result)
      })

      app.get('/sixReview', async (req, res) => {
        try {
          const result = await gameReview.find({}).sort({ ratingNmbr: -1 }).limit(6).toArray();
          res.send(result);
          
        } catch (error) {
            console.log(error.message);
            res.status(500).send({ error: 'Something went wrong' });
        }
    });

    const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

    app.get('/exploreDetails/:id', async (req, res) => {
      const id = req.params.id;
 
      try {
        const query = { _id: new ObjectId(id) };
        const result = await gameReview.findOne(query);
        
    res.send(result)
      } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).send({ message: "Server error" });
      }
    });
    
    

      app.post('/addReview',async(req,res)=>{
        const data=req.body
        console.log(data);
       const result=await gameReview.insertOne(data)
        res.send(result)
    })




// watchList
   app.post('/watchList', async (req, res) => {
  const data = req.body;
  console.log(data);
  const watchListCollection = client.db('game-Review').collection('watchList');
  const result = await watchListCollection.insertOne(data);
  res.send(result);
});


app.get('/watchList', async (req, res) => {
  
  const watchListCollection = client.db('game-Review').collection('watchList');
  const cursor=watchListCollection.find()
  const result=await cursor.toArray()
  res.send(result);
});


    app.put('/addReview/:id', async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const options={upsert:true};
      const updatedReview=req.body
      const review={
        $set:{
          title:updatedReview.title,
          url:updatedReview.url,
          description:updatedReview.description,
          rating:updatedReview.rating,
          year:updatedReview.year,
          genres:updatedReview.genres,
          email:updatedReview.email,
          name:updatedReview.name,
        }
      }


      const result=await gameReview.updateOne(filter,review,options)
      res.send(result)
    })


    app.delete('/addReview/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id: new ObjectId(id)}
      const result=await gameReview.deleteOne(query)
      res.send(result)
    })
      // Send a ping to confirm a successful connection
      // await client.db("admin").command({ ping: 1 });

// const userCollection=client.db("game-Review").collection('users')


      // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('coffee making server is running')
})


app.listen(port,()=>{
    console.log(`coffee making server is running on port : ${port}`)
})