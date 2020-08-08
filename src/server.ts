import app from './app'
import config from './config/config'
import url from "url";
import chat from "./chat";

const server = app.listen(`${config.PORT}`, error => {
    if (error) {
        console.error(error)
    } else {
        console.log(`Server is listening on ${config.PORT}`)
    }
})

server.on('upgrade', (req, socket, head) => {
    const pathname = url.parse(req.url).pathname

    if (pathname === '/') {
        chat.handleUpgrade(req, socket, head, ws => {
            chat.emit('connection', ws, req)
        })
    } else {
        socket.destroy()
    }
})

export default server