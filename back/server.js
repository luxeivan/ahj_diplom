const express = require('express');
const cors = require('cors');
const app = express();
const messages = [{
    type: 'text',
    message: 'lorem ipsum',
    date: '11-07-2022 10:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'audio',
    message: 'audio',
    date: '13-07-2022 21:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
},
{
    type: 'image',
    message: 'my first image',
    date: '13-07-2022 20:30',
    data: 'dasdasdasdasdasdasdasdasdasdasd'
},
{
    type: 'audio',
    message: 'audio',
    date: '12-07-2022 22:30',
    data: 'jhejrghvjldknehfgiejdflkbmvsdlkgo'
}];

app.use(cors());
app.listen(3000, () => {
    console.log('server start to port 3000');
});

app.get("/all", (req, res) => {
    res.send(messages);
});
app.get("/messages", (req, res) => {
    console.log(req.query.searchtext);
    res.send(messages.filter(elem => {
        return elem.message.includes(req.query.searchtext) || elem.date.includes(req.query.searchtext)
    }));
});

function dateConvert(unix_timestamp){
    let date = new Date(unix_timestamp * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    return formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}