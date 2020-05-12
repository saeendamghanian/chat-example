const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname + "/public"));

var clients = 0;
var client = {};

io.on("connection", socket => {
  // client = prompt("Choose an username please: ");
  clients++;

  socket.on("user name", userName => {
    client[socket.id] = { id: socket.id, userName: userName };
    socket.broadcast.emit(
      "broadcast",
      `${client[socket.id].userName} connected - ${clients} persons are online ...`
    );
  });

  socket.on("disconnect", () => {
    clients--;
    socket.broadcast.emit(
      "broadcast",
      `${client[socket.id].userName} disconnected - ${clients} persons are online ...`
    );
    delete client[socket.id];
  });
  socket.on("chat message", msg => {
    io.emit("chat message", `${msg} id: ${socket.id}`);
  });
});

http.listen(5000, () => {
  console.log("listening on *:5000");
});
