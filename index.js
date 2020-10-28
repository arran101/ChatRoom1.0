// im not sure if it would be better to name this index.js or server.js, but for now i'll name it index.js just cos thats what i've normally be naming it

//modules
const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

//bringing in functions from utils
const formatMessage = require("./utilities/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utilities/users");
const users = require("./utilities/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static files
app.use(express.static(path.join(__dirname, "public")));

//port
const port = 3000;

//botName
const botName = "LiveChat Bot";

//run when client connects
io.on("connection", (socket) => {
  //will show up on backend node
//   console.log("new socketio connected");

  //sets out the room joined
  socket.on("joinRoom", ({ username, room }) => {
    //sets out the userJoin function
    const user = userJoin(socket.id, username, room);
    //joins the right room
    socket.join(user.room);

    //sends emit which will just go to the user
    socket.emit("message", formatMessage(botName, "Welcome to LiveChat"));

    //broadcast when a user connects- everyone gets the message apart from the user connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    //emits the chatMessage to everyone
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      //this will emit to all the clients including the user
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: users.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

//app.listen
server.listen(port, () => {
  console.log(`server running on ${port}`);
});
