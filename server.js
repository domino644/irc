const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
var connections = [];
var messages = [];
var old_messages = [];

app.use(express.static(__dirname + "/static"));
app.use(express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname + "/static/gpx"));
app.use(bodyParser.json());

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"));
    res.end();
});

app.post("/", (req, res) => {
    console.log(req.body.action);
    switch (req.body.action) {
        case "alp":
            connections.push(res);
            break;
        case "message":
            let obj = {
                nick: req.body.nick,
                message: req.body.message,
                color: req.body.color,
            };
            messages.push(obj);
            old_messages.unshift(obj);
            for (let res of connections) {
                for (let mess of messages) {
                    res.end(JSON.stringify(mess));
                }
            }
            connections = [];
            messages = [];
            res.end();
            break;
        case "load":
            let tab = [];
            for (let i = 0; i < old_messages.length; i++) {
                if (i < 50) tab.push(old_messages[i]);
            }
            let loader = {
                messages: tab,
            };
            res.end(JSON.stringify(loader));
            break;
        default:
            break;
    }
});

app.listen(PORT, function () {
    console.log("startuje serwer na porcie 3000");
});
