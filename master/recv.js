const net = require('net');
const fs = require('fs');
const path = require('path');
const mpi = require('../MPI/file.js');

const PORT = 4737;

const nodeList = [];

// mpi.getDirInfo(path.join(`./userimage`), size=>{
//     console.log(size);
// });

const server = net.createServer( (conn) => {
    conn.on('data',data=>{
    });
    mpi.recvFileMaster(conn,__dirname);
    /*let packets = 0;
    let buffer = Buffer.alloc(0);

    
    conn.on('data', (chunk) => {
        console.log(chunk);
        if(chunk != 'END'){
            packets++;
            
            buffer = Buffer.concat([buffer, chunk]);
        }
    });

    conn.on('close',()=>{
        console.log("total packages", packets);
        let fileName;

        const head = buffer.subarray(0, 4);
        console.log(head);
        if(head.toString() == "SIZE"){
            console.log('size');
            const nameLen = parseInt(buffer.slice(4, 6), 16);    
            fileName = buffer.slice(6, nameLen + 6).toString();
            buffer = buffer.slice(nameLen + 7, buffer.length);
        }
        
        const writeStream = fs.createWriteStream(path.join(__dirname, fileName));
        console.log("buffer size", buffer.length);
        
        while(buffer.length){
            console.log('data');
            const head = buffer.slice(0, 4);
            if(head.toString() != "FILE"){
                console.log("Error Occurred.");
                console.log(`header: ${head.toString()}`);
                //process.exit(1);
            }

            const size = parseInt(buffer.slice(4, 8), 16);
            console.log("size", size);

            const content = buffer.slice(8, size + 8);
            const delimiter = buffer.slice(size + 8, size + 9);
            
            if(delimiter != "@"){
                console.log(`Wrong delimiter. -> ${delimiter.toString()}`);
                //process.exit(1);
            }

            writeStream.write(content);
            buffer = buffer.slice(size + 9, buffer.length);
        }
        console.log('Receive the file');
    })*/
});



server.on('error',(err)=>{
    console.log('Error occurred');
    throw err;
});
server.listen(PORT, ()=>{
    console.log(`Server listen on ${PORT} port.`);
});
