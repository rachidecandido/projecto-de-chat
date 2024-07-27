const express = require("express");
const path = require("path");
const http = require("http");  // Corrigido: não precisa de importação duplicada
const socketIo = require("socket.io");  // Importa o socket.io

const app = express();
const server = http.createServer(app);
const io = socketIo(server);  // Corrigido: cria a instância do socket.io

app.use(express.static(path.join(__dirname, "public")));  // Corrigido: `path.join` e removida a `/`

io.on("connection", function (socket) {
    console.log("Um novo usuário se conectou");

    socket.on("newuser", function (username) {
        socket.broadcast.emit("update", username + " entrou no chat");  // Corrigido: `broadcast.emit`
    });

    socket.on("exituser", function (username) {
        socket.broadcast.emit("update", username + " saiu do chat");  // Corrigido: `broadcast.emit`
    });

    socket.on("chat", function (message) {
        socket.broadcast.emit("chat", message);  // Corrigido: `broadcast.emit`
    });
});

const PORT = process.env.PORT || 5000;  // Adicionado suporte a variáveis de ambiente
server.listen(PORT, () => {
    console.log(`Servidor ouvindo na porta ${PORT}`);
});
