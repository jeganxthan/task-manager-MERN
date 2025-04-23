const express = require('express');
const connectDB = require('./db/connect');
const tasks = require('./routes/tasks')
const app = express()
require('dotenv').config()
const cors = require('cors')
const path = require('path')

app.use(cors());

//middleware
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json());
app.use('/api/v1/tasks', tasks)



const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, ()=>{
            console.log(`Server listening on ${port}`)
        })
    } catch (error) {
        console.log(error);
    }
}
start();