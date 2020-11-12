const net = require('net');
const fs = require('fs');
const path = require('path');
const file = require('./file');

const PORT = 5000;

const server = net.createServer( (conn) => {
    console.log(`Connected (${conn.remoteAddress})`);
    conn.on('data',data =>{
        if(data.toString() == '[GET] SIZE'){
            file.getDirInfo('./userimage', size=>{
                conn.write(size);
                console.log(size);
            });
        }
    });
});


server.on('error',(err)=>{
    console.log('Error occurred');
    throw err;
});
server.listen(PORT, ()=>{
    console.log(`Server listen on ${PORT} port.`);
});