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

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const { Worker } = require('worker_threads');

const app = express();
app.use(cors());

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
let index = +fs.readFileSync("index.txt", "utf8");

app.get('/get', (req, res) => {
  res.send(index.toString());
});

app.get('/start', (req, res) => {
  res.send("started");
  startLike();
});

async function startLike() {
  // Create a new web worker instance
  const worker = new Worker('./worker.js');

  // Listen for messages from the web worker
  worker.on('message', (message) => {
    if (message.type === 'updateIndex') {
      // Update the index variable and save it to the file
      index = message.index;
      fs.writeFileSync("index.txt", JSON.stringify(index), "utf8");
    }
  });

  // Start the web worker
  worker.postMessage('start');
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
