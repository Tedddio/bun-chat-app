const server = Bun.serve<{ username: string }>({
    fetch(req, server) {
        let username = req.headers.get('cookie')?.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
            return cookies["username"];
        }, {});

        if (!username) {
            username = "anonymous"
        }
        const success = server.upgrade(req, { data: { username } });
        if (success) return undefined;
        return new Response("Upgrade failed :(", { status: 500 });
    },
    websocket: {
        open(ws) {
            const msg = `${ws.data.username} has entered the chat`;
            ws.subscribe("the-group-chat");
            ws.publish("the-group-chat", msg);
        },
        message(ws, message) {
            // this is a group chat
            // so the server re-broadcasts incoming message to everyone
            ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
        },
        close(ws) {
            const msg = `${ws.data.username} has left the chat`;
            ws.unsubscribe("the-group-chat");
            server.publish("the-group-chat", msg);
        },
    },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
