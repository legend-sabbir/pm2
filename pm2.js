const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const sleep = (ms) =>  new Promise(resolve => setTimeout(resolve, ms))
const arr = []
let index = +fs.readFileSync("index.txt", "utf8")


app.get('/get', (req, res) => {
  res.send(index.toString())
});

setTimeout(async () => {
  while (true) {
    index = +fs.readFileSync("index.txt", "utf8") + 1
    fs.writeFileSync("index.txt", JSON.stringify(index), "utf8")
    await sleep(2000)
  }
}, 100)


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});