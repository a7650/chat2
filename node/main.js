const http = require('http')
const express = require('express')
const server = http.createServer(express())
const io = require('socket.io')(server)
exports.io = io
const init = require('./socketEvent')

server.listen(8000,()=>console.log('服务器已启动'))

io.on('connection',(socket)=>{
    console.log('连接成功')
    init(socket)
})
