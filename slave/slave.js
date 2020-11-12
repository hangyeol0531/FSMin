const net = require('net');
const fs = require('fs');
const path = require('path');

const masterIP = ['192.168.0.55','192.168.137.200'];
const masterPORT = 4737;

const client = net.createConnection(masterPORT,masterIP[0],()=>{
    console.log(`Connected to master node : ${masterIP[0]}.`);
    //client.write(`asdf\r\n`);
});

let packets = 0;
let buffer = Buffer.alloc(0);

//client.on('close', () => {
client.on('data', (data) => {
    if(data != 'END'){
        packets++;
        console.log(data);
        buffer = Buffer.concat([buffer, data]);
    }
    
    if(data == 'END'){
        console.log("total packages", packets);
        let fileName;

        const head = buffer.slice(0, 4);
        if(head.toString() == "SIZE"){
            console.log('size');
            const nameLen = parseInt(buffer.slice(4, 6), 16);    
            fileName = buffer.slice(6, nameLen + 6);
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
