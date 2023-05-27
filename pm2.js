const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms))
const arr = []

app.get('/start', (req, res) => {
  res.send("started")
  for (let i = 0; i < 50; i++) {
    arr.push(i)
  }
});

let track = 1

app.get('/get', (req, res) => {
  res.json(arr)
  console.log("success: " + track++)
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});