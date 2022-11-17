const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function run(){
    try {
        app.get('/article', async (req, res) => {
            const email = req.query.email;
            const date = req.query.date;

            const query = { email: email, date: date }

            const cursor = carsCollection.find(query);
            const cars = await cursor.toArray();
            res.json(cars);
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