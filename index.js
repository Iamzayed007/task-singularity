const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anawu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });





async function run(){
    try {
        await client.connect();
        const database = client.db("portalDB");
        const usersCollection = database.collection("users");
        const articlesCollection = database.collection("articles");

        app.get('/users', async (req, res) => {
     

            const cursor = usersCollection.find({});
       
            const users = await cursor.toArray();
            res.json(users);
        })
        app.post('/users', async (req, res) => {
            const query= usersCollection.find({role: "editor", status: "active"});
            const isEditorActive = await query.toArray();

            if (isEditorActive.length==0) {
                const data = req.body;
                        const newUser = {
                            ...data,
                            status: "active"
                        }
                        const result = await usersCollection.insertOne(newUser);
                                res.json(result);
            }
            else{
                res.json({message:"there can only be ONE editor active in the system"})
            }
                    
      
          }); 


          app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
      
          
            res.json(user);
          });


          app.put('/users/:id',async (req, res) => {
   
                
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            
            const updateDoc = {
                $set: {
                    status: "inactive"
                }
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
    })


  // API for Articles
        app.get('/articles', async (req, res) => {
     

            const cursor = articlesCollection.find({});
       
            const articles = await cursor.toArray();
            res.json(articles);
        })

        app.post('/articles', async (req, res) => {
            console.log("dd");
            const newArticle = req.body;
            const result = await articlesCollection.insertOne(newArticle);
            res.json(result); 
          });

          app.get('/articles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await articlesCollection.findOne(query);
      
          
            res.json(user);
          });

          app.put('/articles/:id',async (req, res) => {
   
                
                const id = req.params.id;
                const filter = { _id: ObjectId(id) };
                const options = { upsert: true };
                const updateDoc = {
                    $set: 
                        req.body

                    
                };
                const result = await articlesCollection.updateOne(filter, updateDoc, options);
                res.json(result);
        })





    } catch (error) {
        
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})


app.listen(port, () => {
    console.log(`listening at ${port}`)
})