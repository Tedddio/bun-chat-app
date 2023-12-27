import { writable } from 'svelte/store';

const messageStore = writable('');
let socket: WebSocket;

const setup = () => {
    socket = new WebSocket('ws://localhost:3000');

    // Connection opened
    socket.addEventListener('open', function() {
        console.log("It's open");
    });

    // Listen for messages
    socket.addEventListener('message', function(event) {
        messageStore.set(event.data);
    });
}


const sendMessage = (username: string, message: string) => {
    if (socket.readyState <= 1) {
        messageStore.set(username + ": " + message);
        socket.send(message);
    }
}


export default {
    setup,
    subscribe: messageStore.subscribe,
    sendMessage
}


