const express = require("express")
const path = require("path")
const app = express()
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000
var connections = []

app.use(express.static(__dirname + '/static'))
app.use(express.static(__dirname + '/node_modules'))
app.use(express.static(__dirname + '/static/gpx'))
app.use(bodyParser.json());

app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"))
    res.end()
})

app.post('/', (req, res) => {
    console.log(req.body.action)
    switch (req.body.action) {
        case 'alp':
            console.log('dostalem alp od ', req.body.nick)
            connections.push(res)
            break
        case 'message':
            let obj = {
                nick: req.body.nick,
                message: req.body.message,
                color: req.body.color
            }
            console.log(connections.length)
            for (let res of connections) {
                res.end(JSON.stringify(obj))
            }
            connections = []
            console.log('wysylam message')
            res.end() //perfect scrollbar! <-- 
            break
        default:
            break
    }
})


app.listen(PORT, function () {
    console.log("startuje serwer na porcie 3000")
})