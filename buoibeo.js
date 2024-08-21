const express = require('express');
const bodyParser = require('body-parser');
const Rcon = require('rcon');

const app = express();
const port = 3000;

app.use(express.json());

let authenticated = false;

app.use(bodyParser.urlencoded({ extended: true }));

const rcon = new Rcon("localhost",25575,"123123123");

rcon.on('auth', function() {
    // You must wait until this event is fired before sending any commands,
    // otherwise those commands will fail.
    console.log("Authenticated");
    authenticated = true;
    }).on('response', function(str) {
            console.log("Response: " + str);
    }).on('error', function(err) {
            console.log("Error: " + err);
    }).on('end', function() {
            console.log("Connection closed");
            process.exit();
    });
  
rcon.connect();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/placeblock.html');
});

app.post('/input', (req,res) => {
    const x = req.body.x;
    const y = req.body.y;
    const z = req.body.z;
    const blockType = req.body.blockType;

    console.log(`${x} ${y} ${z} ${blockType}`);

    rcon.send(`setblock ${x} ${y} ${z} ${blockType}`);

    rcon.once('response', function(response) {
        res.json({ response: response });
    }).once('error', function(error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send command' });
    });



});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

