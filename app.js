require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/main.js");
const secureRoutes = require("./routes/secure.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");

const uri = process.env.MONGO_CONNECTION_URL;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on("error", error => {
  console.log("ON connection error", error);
  process.exit(1);
});
mongoose.connection.on("connected", function() {
  console.log("connected to mongo");
});

const app = express();

const server = require("http").Server(app);
const io = require("socket.io").listen(server);

const players = {};

const scores = 0;

io.on("connection", function(socket) {
  console.log("a user connected: ", socket.id);

  players[socket.id] = {
    playerId: socket.id
  };

  socket.emit("currentPlayers", players);
  socket.broadcast.emit("newPlayer", players[socket.id]);
  //on update score
  socket.emit("scoreUpdate", scores);
  socket.broadcast.emit("newPlayer", players[socket.id]);

  socket.on("score", function() {
    //score logic here

    io.emit("scoreUpdate", scores);
  });
  // socket.broadcast.emit('updare', {player: socket.id, score: score from messagte});
  //forward the score to other  users
  socket.on("disconnect", function() {
    console.log("user disconnected: ", socket.id);
    delete players[socket.id];
    io.emit("disconnect", socket.id);
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

require("./auth/auth.js");

app.get(
  "/game.html",
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    res.sendFile(__dirname + "/public/game.html");
  }
);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use("/", routes);
app.use("/", passport.authenticate("jwt", { session: false }), secureRoutes);

app.use((req, res, next) => {
  res.status(404);
  res.json({ message: "404 - Not Found" });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
