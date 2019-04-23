var app = require("express")(); // initialize as function handler that takes http server
var http = require("http").createServer(app); // HTTP server
var io = require("socket.io")(http);
/**
 * serve the index.html file
 */
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

/**
 * handler for when a client connects
 */
io.on("connection", function(socket) {
  console.log("client has connected");
});

/**
 * display that the server is listening on the console
 */
http.listen(8888, function() {
  console.log("listening on port 8888");
});
