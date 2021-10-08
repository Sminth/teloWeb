var http = require("http");
var fs = require("fs");

var server = http.createServer(function (req, res) {
  fs.readFile("./main.html", "utf-8", function (error, content) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
  });
});
// Chargement de socket.io
// var io = require('socket.io').listen(server);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const client = io.of("/client");
const api = io.of("/api");
const speech = io.of("/speech");

// Quand un client se connecte, on le note dans la console
client.on("connection", function (client) {
  console.log("Un client est connecté !" + io.of('/client').id);
  client.emit("message", {
    content: "AKW@BA",
  });
  client.on("speak", function(data){
    speech.emit("pitch", {
      content: data,
    });
  });
});

client.on("info-personal", function (data) {
  console.log(data);
});



// Communication with Python API
api.on("connection", function (api) {
  console.log("Connexion via API namespace!" + io.of('/api').id);
  api.emit("message", {
    content: "AKW@BA",
  });
  api.on("info-personal", function (data) {
    client.emit("test", {
        content: data,
    });
    console.log(data);
    console.log(typeof(data));
  });
  api.on("info-manager-section", function (data) {
    client.emit("manager-section", {
        content: data,
    });
    console.log(data);
    console.log(typeof(data));
  });
  api.on("info-section", function (data) {
    client.emit("info-section", {
        content: data,
    });
    console.log(data);
    console.log(typeof(data));
  });
  api.on("start-speak", function (data) {
    speech.emit("pitch", {
        content: data,
    });
    console.log(data);
    console.log(typeof(data));
  });
  api.on("start-song", function(data){
    console.log(data);
    speech.emit("song", { content: data });
  });

  api.on("speak-section", function(data){
    console.log(data);
    speech.emit("speak-section", { content: data });
  });

  api.on("guide-section", function (data) {
      // client.emit("info-section", {
      //     content: data,
      // });
    console.log('guide moi');
    console.log(data[0].road);
  });
});



// Communication with Python API
speech.on("connection", function (speech) {
  console.log("Connexion via speech namespace!");
  speech.emit("pitch", {
    content: "Salut , je suis Télo !",
  });


  speech.on('home', function(data){
    console.log(data);
    client.emit('home', data)
  });

  speech.on('requests-user', function(data){
    console.log("requests-user : " + data);
  });

  speech.on('requests-count', function(data){
    console.log("requests-count : " + data);
  });

  speech.on('rasa-responses', function(data){
    console.log("rasa-responses : " + data);
  });

});




server.listen(9400);

// const io = require("socket.io-client");
// const socket = io ( "192.168.252.249:8000");
