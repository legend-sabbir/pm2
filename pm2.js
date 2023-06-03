const express = require('express');
const axios = require("axios")
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const users = require("./users.json")

const app = express();
app.use(cors());

const uri = `mongodb+srv://${process.env.id}:${process.env.pass}@cluster0.nkllpci.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const len = users.length
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2Q1NmI4Njg0NDhlNTBjYTc0NGRmNWEiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTY4NTAwOTQ5MywiZXhwIjoxNjg3NjAxNDkzfQ.mRbSxGri3MUC74gNcIuh0ywNRGwliukApAyP2Rs1yg0',
    'Content-Length': '0',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://www.frontendmentor.io',
    'Referer': 'https://www.frontendmentor.io/',
    'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
    'Sec-Ch-Ua-Mobile': '?1',
    'Sec-Ch-Ua-Platform': '"Android"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 9; JKM-LX1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
  };
let index

app.get('/get', async (req, res) => {
  res.send(index.toString())
});

async function saveIndex(index) {
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

async function startFollow() {
  await followUser(users[index])
  await sleep(2000)
  if (index % 50 === 0) {
    await saveIndex(index)
    console.log(index)
  }
  index++
  if (index >= len) {
    return 
  } else {
    startFollow()
  }
}

async function followUser(user) {
  try {
    const response = await axios.post(`https://backend.frontendmentor.io/rest/v2/auth/profile/follow/users/${user}`, null, {
      headers
    });
  } catch (error) {
    console.log("fail: " + user)
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


retrieveIndex().then(startFollow).catch(console.error)