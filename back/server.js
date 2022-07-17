const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const messages = [{
    type: 'text',
    message: 'Один',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Два',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Три',
    date: '13-07-2022 20:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Четыре',
    date: '12-07-2022 22:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Пять',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Шесть',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Семь',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Восемь',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
}, {
    type: 'text',
    message: 'Девять',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Десять',
    date: '13-07-2022 20:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Одиннадцать',
    date: '12-07-2022 22:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Двенадцать',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Тринадцать',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'text',
    message: 'Четырнадцать',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'text',
    message: 'Пятнадцать',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},];

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '20mb' }));

const jsonParser = express.json();
app.use(cors());
app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`server start to port ${process.env.PORT}`);
});

// app.get("/all", (req, res) => {
//     res.send(messages.slice(Math.max(messages.length - 10 - req.query.first, 0), Math.max(messages.length - req.query.first,0)).reverse());
// });
app.get("/messages", (req, res) => {
    let searchText = req.query.searchtext.toLowerCase();
    let first = req.query.first;
    let afterfilter = messages.filter(elem => { return elem.message.toLowerCase().includes(searchText) || elem.date.includes(searchText) });
    let afterslice = afterfilter.slice(Math.max(afterfilter.length - 10 - first, 0), Math.max(afterfilter.length - first, 0)).reverse()
    res.send(afterslice);
});
app.post("/add", jsonParser, (req, res) => {
    messages.push({
        type: req.body.type,
        message: req.body.message,
        date: req.body.date,
        data: req.body.data
    })
    res.send({ ok: true });
});

function dateConvert(unix_timestamp) {
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}