const express = require('express');
const bodyParser = require('body-parser');
const Rcon = require('rcon');

const app = express();
const port = 3000;

app.use(express.json());

let authenticated = false;

app.use(bodyParser.urlencoded({ extended: true }));







// const rcon = new Rcon("localhost",25575,"123123123");

// rcon.on('auth', function() {
//     // You must wait until this event is fired before sending any commands,
//     // otherwise those commands will fail.
//     console.log("Authenticated");
//     authenticated = true;
//     }).on('response', function(str) {
//             console.log("Response: " + str);
//     }).on('error', function(err) {
//             console.log("Error: " + err);
//     }).on('end', function() {
//             console.log("Connection closed");
//             process.exit();
//     });
  
// rcon.connect();


  

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/ip_input',  (req, res) => {
    const ip = req.body.ip;
    const port = req.body.port;
    const hasPassword = req.body.hasPassword;
    const password = req.body.password;

    rcon = new Rcon(ip, port, password);

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
  
    if (hasPassword) {
        rcon.connect(ip, port, password);
    } else {
        rcon.connect(ip, port);
    }


});



app.post('/summonMob', (req, res) => {
    const mobType = req.body.mobType;

    console.log(mobType);
    
    console.log(`sending command for ${mobType}....`);

    if (authenticated) {
        sendCommandToServer(`summon ${mobType} 1 1 1`, res);
    } else {
        res.status(401).json({ error: 'Not authenticated with RCON server' });
    }
});

function sendCommandToServer(command, res) {
    rcon.send(command);
    rcon.once('response', function(response) {
        res.json({ response: response });
    }).once('error', function(error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to send command' });
    });
}



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});