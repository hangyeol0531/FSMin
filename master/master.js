const net = require('net');
const fs = require('fs');
const path = require('path');

const PORT = 4737;

const server = net.createServer((conn) => {
    let packages = 0;
    let totalBytes = 0;

    console.log(`Slave connected. IP : ${conn.remoteAddress}`);
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
        conn.end();
        console.log("total packages", packages);
        console.log("total bytes sent", totalBytes);
    });
});
server.on('error',(err)=>{
    console.log('Error occurred');
    throw err;
});
server.listen(PORT, ()=>{
    console.log(`Server listen on ${PORT} port.`);
});
