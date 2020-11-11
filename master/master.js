const net = require('net');
const fs = require('fs');
const path = require('path');
const mpi = require('../MPI/file.js');

const PORT = 4737;

const nodeList = [];

mpi.getDirInfo(path.join(`./userimage`), size=>{
    console.log(size);
});

const server = net.createServer( async(conn) => {

    nodeList.push(conn);
    console.log(nodeList[0].remoteAddress);
    
    //console.log(conn.remoteAddress);

    //console.log(`Node connected. IP : ${conn.remoteAddress}`);
    //MPI.sendFile(conn, path.join(__dirname,`test.txt`), 0x4000);
    /*
    const readStream = fs.createReadStream(path.join(__dirname,`test.txt`), {highWaterMark: 0x5000});

    readStream.on('data', (chunk)=>{
        packages++;
        const header = Buffer.from(`FILE`);
        const delimiter = Buffer.from(`@`);
        const size = Buffer.from(('0000' + chunk.length.toString(16)).slice(-4));
        //console.log(`size: ${chunk.length} / hex: ${size.toString()}`);

        const pack = Buffer.concat([header,size,chunk,delimiter]);
        totalBytes += pack.length;
        conn.write(pack);
    });

    readStream.on('close', function(){
        //conn.end();
        conn.write('END');
        console.log("total packages", packages);
        console.log("total bytes sent", totalBytes);
    });*/
});



server.on('error',(err)=>{
    console.log('Error occurred');
    throw err;
});
server.listen(PORT, ()=>{
    console.log(`Server listen on ${PORT} port.`);
});
