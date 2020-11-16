const net = require('net');
const fs = require('fs');
const path = require('path');
const file = require('./file');

const PORT = 5000;

const server = net.createServer( (conn) => {
    console.log(`IP : ${conn.remoteAddress} connected.`);
    
    conn.on('data',data =>{
        if(data.toString() == '[GET] SIZE'){
            console.log(`IP : ${conn.remoteAddress} / ${data}`);

            file.getDirInfo('./userimage', size=>{
                conn.write(size);
                console.log(size);
            });
        }
        else if(data.toString().substring(0,5) == '[DEL]'){
            console.log(`IP : ${conn.remoteAddress} / ${data}`);

            console.log('Deleting...');
            const fileinfo = data.toString().slice(5,data.length);
            console.log(fileinfo);
            fs.access(fileinfo, fs.constants.F_OK, (err) => {
                if(err) conn.write('[ERROR] Can\'t delete');
                fs.unlink(path.join('./',fileinfo), err =>{
                    if(err === undefined || err == null){
                        console.log('OK');
                        conn.write('OK');
                    }
                    else{
                        console.log(err);
                        conn.write('[ERROR] Delete failed.');
                    }
                });
            });
        }
        else if(data.toString().substring(0,6) == '[POST]'){
            console.log(`IP : ${conn.remoteAddress} / ${data}`);

            file.recvFileMaster(conn, '../userimage');
        }
        else if(data.toString().substring(0,5) == '[GET]'){
            
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