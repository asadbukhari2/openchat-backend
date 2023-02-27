const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
	},
});

app.use(cors());

app.get("/", (req, res) => {
	res.send("yha kya kr rhy ho?");
});

let users = [];

io.on("connection", socket => {
	console.log(`⚡: ${socket?.id} user just connected!`);

	socket.on("newUser", data => {
		users.push(data);
		io.emit("newUserResponse", users);
	});

	socket.on("message", data => {
		io.emit("messageResponse", data);
	});

	socket.on("typing", data => socket.broadcast.emit("typingResponse", data));

	socket.on("disconnect", () => {
		console.log("'🔥: A user disconnected'");
		users = users.filter(user => user.socketID !== socket.id);
		io.emit("newUserResponse", users);
	});
});

server.listen(5001, () => {
	console.log("listening on *:5001");
});
