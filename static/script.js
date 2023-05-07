const messager = document.getElementById("messager");
const chat = document.getElementById("chat");
const input = document.getElementById("input");
const chatCont = document.getElementById("chat-cont");
const form = document.getElementById("form");
var nick = "";
var color = "";
const ps = new PerfectScrollbar(chat, {
    wheelSpeed: 0.5,
    wheelPropagation: true,
    minScrollbarLength: 20,
    swipeEasing: true,
    suppressScrollX: true,
});
var emoticon = true;

function setNick() {
    nick = input.value;
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    color = `rgb(${r},${g},${b})`;
    form.style.display = "none";
    chatCont.style.display = "flex";
    document.title = "Chat";
    fetch("/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            action: "load",
        }),
    })
        .catch((err) => console.log(err))
        .then((res) => res.json())
        .then((data) => {
            for (let message of data.messages.reverse()) {
                displayMessage(message.nick, message.message, message.color);
            }
        });
    document.onkeydown = (e) => {
        const key = e.key;
        switch (key) {
            case "Enter":
                sendMessage();
                break;
            default:
                break;
        }
    };
    alp();
}

async function alp() {
    console.log("wysylam alp");
    fetch("/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            action: "alp",
            nick: nick,
        }),
    })
        .catch((err) => console.log(err))
        .then((res) => res.json())
        .then((data) => displayMessage(data.nick, data.message, data.color))
        .finally(() => alp());
}

function sendMessage() {
    if (messager.value != "") {
        if (messager.value.trim() == "/quit") {
            open(location, "_self").close();
        } else if (messager.value.trim() == "/color") {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            color = `rgb(${r},${g},${b})`;
            let cont = document.createElement("div");
            cont.setAttribute("class", "message");
            cont.innerHTML = `<b style="color: white">System|</b> your color ${color}`;
            chat.appendChild(cont);
            messager.value = "";
        } else if (messager.value.trim() == "/emoticons") {
            if (emoticon) {
                emoticon = false;
                let cont = document.createElement("div");
                cont.setAttribute("class", "message");
                cont.innerHTML = `<b style="color: white">System|</b> emoticons off`;
                chat.appendChild(cont);
                messager.value = "";
            } else {
                emoticon = true;
                let cont = document.createElement("div");
                cont.setAttribute("class", "message");
                cont.innerHTML = `<b style="color: white">System|</b> emoticons on`;
                chat.appendChild(cont);
                messager.value = "";
            }
        } else {
            fetch("/", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    action: "message",
                    nick: nick,
                    message: messager.value,
                    color: color,
                }),
            });
            messager.value = "";
            console.log("klik");
        }
    }
}

function displayMessage(user, message, color) {
    let cont = document.createElement("div");
    cont.setAttribute("class", "message");
    cont.innerHTML = `<b style="color: ${color}">${user}|</b><p style="word-wrap: break-word;"> ${message}</p>`;
    cont.style.wordWrap = "break-word";
    if (emoticon) {
        $(cont).emoticonize(true);
    }
    chat.appendChild(cont);
}
