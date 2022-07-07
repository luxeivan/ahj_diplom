import express from "express";
const app = express();
const messages = [];

app.listen(3000, () => {
    console.log('server start to port 3000');
});

app.get("/", (req, res) => {
    res.send('12345678');
});