const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

//notesTaker
//Uz4YHvefwnu69jlG



const uri = "mongodb+srv://notesTaker:Uz4YHvefwnu69jlG@cluster0.vnhh1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const notesCollection = client.db("notesTaker").collection("notes");
        console.log('connect to db');

        //get api to reads all notes
        app.get("/notes", async (req, res) => {
            const query = {};
            const cursor = notesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //post
        app.post("/note", async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await notesCollection.insertOne(data);
            res.send(result);
        })

        //update 
        app.put("/note/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("from update api", data);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    userName: data.userName,
                    textData: data.textData,
                },
            };
            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })
        //delete
        app.delete("/note/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const result = await notesCollection.deleteOne(filter);

            res.send(result);
        });
    }
    finally {

    }
}
run().catch(console.dir)

app.get("/", (req, res) => {

    res.send("server is running")
})

app.listen(port, () => {
    console.log('server is running');
})