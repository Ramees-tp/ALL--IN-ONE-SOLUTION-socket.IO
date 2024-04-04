const express = require('express');
const app = express();
const port = 918;
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const { connected } = require('process');

app.use(cors())
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: 'http://184.73.25.154/',
        methods: ['GET', 'POST'],
    },
});

const connectedPersons = []

io.on('connection', (socket)=>{
    
    socket.on('userConnection', ({sender})=>{

        connectedPersons[sender]=socket.id
        console.log(`${sender} userconnected, userId:${sender}`);
        io.emit('userConnection', sender)
    })

    socket.on('workerConnection', ({sender})=>{

        connectedPersons[sender]=socket.id
        console.log(`${sender} workerconnected, workerId:${sender}`);
        io.emit('userConnection', sender)
    })

    console.log(`user Connected ${socket.id}`);
    socket.on('sendMessage', ({message, sender, receiver, requestId })=>{
        console.log(`${message} from ${sender} to ${receiver}`);
        const receiverId = connectedPersons[receiver];
        console.log(receiverId);
        if(receiverId){
            io.to(receiverId).emit('sendMessage', {message, sender, requestId });
            console.log(`message send to ${receiver}`);
        } else {
            console.log(`reciepient not Found`);
        }
    });

    socket.on('updateRequest', ({workerId }) => {
        const receiverId = connectedPersons[workerId];
        if (receiverId) {
            io.to(receiverId).emit('updateRequest',{message: 'sented requests'})
            console.log(`Update notification sent to ${workerId}`);
        } else {
            console.log(`Worker ${workerId} not connected`);
        }
    });

    socket.on('userUpdateRequest', ({ userId }) => {
        const receiverId = connectedPersons[userId];
        if (receiverId) {
            io.to(receiverId).emit('userUpdateRequest', {message: 'user approved'})
            console.log(`Update notification sent to ${userId}`);
        } else {
            console.log(`user ${userId} not connected`);
        }
    });
})


console.log(connectedPersons);


server.listen(port, () => {
    console.log(`server is rinning at http://localhost:${port}`);
  })