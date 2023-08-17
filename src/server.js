const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require('cors')
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors())

io.on("connection", (socket) => {
  console.log("connection...");

  socket.on("confirmsOrder", (data) => {
    io.emit(data?.phone, data);
  });

  socket.on("newOrder", (data) => {
    io.emit("admin", data);
  });


  socket.on("disconnect", () => {
    console.log("disconnect...");
  });
});

app.get("/audio", (req, res) => {
  const filePath = path.join(__dirname, "audio/Simple.mp3");
  const stat = fs.statSync(filePath);
  const readStream = fs.createReadStream(filePath);

  res.setHeader("Content-Length", stat.size);
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Disposition", "inline");

  readStream.pipe(res);
});

const port = process.env.PORT || 3001

server.listen(port, () => {
  console.log("Сервер сокетов запущен на порту " + port);
});
