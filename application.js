const express = require('express') ;
const socketIo = require('socket.io') ;
const http = require('http') ;
const app = express() ;
const server = http.createServer(app) ;
const io = socketIo(server) ;
const dbConnection = require('./dbConfiguration') ;
const  { registerRouter,loginRouter} = require('./authenticationController') ;
const videoStreamingRouter = require('./videoStreamingController') ;
const dotenv = require('dotenv') ;
const bodyParser = require('body-parser') ;

dotenv.config() ;

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

app.use(bodyParser.json()) ;
app.use(express.json()) ;
app.get("/", (req,res) => {
      res.send(`App running on port number ${process.env.port_no}`) ;
})

app.use('/auth/api',registerRouter) ;
app.use('/auth/api',loginRouter) ;
app.use('/video/api',videoStreamingRouter) ;

server.listen(process.env.port_no, () => {
    console.log('App started successfully') ;
})

