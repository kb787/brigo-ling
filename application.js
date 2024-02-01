const express = require('express') ;
const socketIo = require('socket.io') ;
const http = require('http') ;
const app = express() ;
const server = http.createServer(app) ;
const io = socketIo(server) ;
const dbConnection = require('./dbConfiguration') ;
const registerRouter = require('./authenticationController') ;
const loginRouter = require('./authenticationController') ;

dbConnection() ;

io.on('connection', (socket) => {
      console.log('Connection established') ;

      socket.on('disconnect', () => {
         console.log('Disconnected from server') ;  
      })

      socket.on('message', (message) => {
         io.emit(message) ;
      })
})
app.get("/", (req,res) => {
      res.send('App running on port number 3500') ;
})

app.use('/auth/api',registerRouter) ;
app.use('/auth/api',loginRouter) ;

server.listen("3500", () => {
    console.log('App started successfully') ;
})

