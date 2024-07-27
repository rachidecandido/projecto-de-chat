(function () {
    const app = document.querySelector(".app");
    const socket = io();
    let uname;

    // Evento de clique no botão de "juntar-se"
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length === 0) {
            alert("Por favor, insira um nome de usuário.");
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Evento de clique no botão de "enviar mensagem"
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length === 0) {
            alert("Por favor, insira uma mensagem.");
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Evento de clique no botão de "sair"
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    // Recebe atualizações e mensagens do servidor
    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    // Função para renderizar mensagens
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        let el = document.createElement("div");
        el.classList.add("message");

        if (type === "my") {
            el.classList.add("my-message");
            el.innerHTML = `
                <div>
                    <div class="name">Você</div>
                    <div class="text">${message.text}</div>
                </div>`;
        } else if (type === "other") {
            el.classList.add("other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>`;
        } else if (type === "update") {
            el.classList.add("update");
            el.innerHTML = `${message}`;
        }

        messageContainer.appendChild(el);

        // Rola o chat para o fim
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();

