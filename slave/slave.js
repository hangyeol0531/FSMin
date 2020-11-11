const net = require('net');
const fs = require('fs');
const path = require('path');

const masterIP = ['192.168.0.55','192.168.137.200'];
const masterPORT = 4737;

const client = net.createConnection(masterPORT,masterIP[0],()=>{
    console.log(`Connected to master node${masterIP[0]}.`);
    //client.write(`asdf\r\n`);
});

let packets = 0;
let buffer = Buffer.alloc(0);
client.on('data', (chunk)=>{
    if(chunk != 'END'){
        packets++;
        console.log(chunk);
        buffer = Buffer.concat([buffer, chunk]);
    }
});

//client.on('close', () => {
client.on('data', (data) => {
    if(data == 'END'){
        console.log("total packages", packets);

        const writeStream = fs.createWriteStream(path.join(__dirname, "recv.txt"));
        console.log("buffer size", buffer.length);
        while(buffer.length){
            const head = buffer.slice(0, 4);
            
            if(head.toString() != "FILE"){
                console.log("Error Occurred.");
                console.log(`header: ${head.toString()}`);
                process.exit(1);
            }

            const size = parseInt(buffer.slice(4, 8), 16);
            console.log("size", size);

            const content = buffer.slice(8, size + 8);
            const delimiter = buffer.slice(size + 8, size + 9);
            
            if(delimiter != "@"){
                console.log(`Wrong delimiter. -> ${delimiter.toString()}`);
                process.exit(1);
            }

            writeStream.write(content);
            buffer = buffer.slice(size + 9, buffer.length);
        }
        console.log('Receive the file');
    }
    
});
