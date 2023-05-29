/*const axios = require('axios');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const challenges3 = require("./challenges3.json")
const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms))
let index = +fs.readFileSync("index.txt", "utf8")


app.get('/get', (req, res) => {
  res.send(index.toString())
});

app.get('/start', (req, res) => {
  res.send("started")
  startLike()
});


async function startLike() {
  for (let i = index; i <= challenges3.length; i++) {
    if (index >= challenges3.length ) return 
    const challenge = challenges3[i]
    if (!challenge.isLiked) {
      await likeSolutions(challenge.id, index)
      await sleep(1500)
      index++
      fs.writeFileSync("index.txt", JSON.stringify(index), "utf8")
    }
  }
}


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});*/

// main.js

const express = require('express');
const cors = require('cors');
const { Worker } = require('worker_threads');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://legend-sabbir:6890lsyt@cluster0.nkllpci.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const app = express();
app.use(cors());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let index

app.get('/get', async (req, res) => {
  res.send(index.toString())
});

async function startLike() {
  const worker = new Worker('./worker.js', { workerData: { index } });

  worker.on('message', async (message) => {
    if (message.type === 'updateIndex') {
      index = message.index;
      if (index % 100 === 0) {
        console.log(index)
        await saveIndex(index)
      } 
    }
  });

  worker.postMessage('start');
}

async function saveIndex() {
  try {
    await client.connect();
    await client.db("indexDb").collection("index").updateOne({}, { $set: { index: index } });
  } finally {
    await client.close();
  }
}

async function retrieveIndex() {
  try {
    await client.connect();
    const result = await client.db("indexDb").collection("index").findOne();
    if (result) {
      index = result.index;
    } else {
      index = 1;
      await saveIndex(index);
    }
    console.log(index)
  } finally {
    await client.close();
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


retrieveIndex().then(startLike).catch(console.error)