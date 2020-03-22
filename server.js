const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server, { origins: '*:*'})

server.listen(3000, ()=> {
    console.log('server running')
})

app.use('/files', express.static(__dirname+'/files'))

app.get('/', (req,res) => {
    res.sendFile(__dirname+'/index.html')
})

class User {
    constructor(name, socket) {
        this.name = name
        this.socket = socket
    }
}

let users = []
let connections = []

io.on('connection', socket => {
    connections.push(socket)
    console.log(`connected sockets: ${connections.length}`)

    //disconnect
    socket.on('disconnect', ()=> {
        console.log(`disconnected socket ${socket}`)
        connections.splice(connections.indexOf(socket), 1)
        console.log(`connected sockets: ${connections.length}`)
    })

    //add a user
    socket.on('add user', (name) => {
        console.log(`user added ${name}`)
        users.push(name)
        io.emit('get users', users)
    })

    //socke.io message
    socket.on('msg1', data => {
        io.emit('print msg1', data);
    })
})