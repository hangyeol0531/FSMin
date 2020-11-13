const fs = require('fs');
const { exec } = require("child_process");
const path = require('path');

module.exports.header = `FILE`;
module.exports.delimiter = `@`;
module.exports.tail = `END`;

const bufHeader = Buffer.from(this.header);
const bufDelimiter = Buffer.from(this.delimiter);

module.exports.sendStreamSlave = (stream, conn, fileName, cb) => {
    const bufLenHead = Buffer.from('SIZE');
    const bufFileName = Buffer.from(fileName);
    const nameLen = ('00' + bufFileName.length.toString(16)).slice(-2);
    const bufNameLen = Buffer.from(nameLen);
    console.log(`${fileName} -> ${fileName.length}`);

    const namePack = Buffer.concat([bufLenHead,bufNameLen,bufFileName,bufDelimiter]);
    conn.write(namePack);

    //const rs = fs.createReadStream(filePath, {highWaterMark: blockSize});
    let packages = 0;
    let totalBytes = 0;

    stream.on('data', chunk => {
        packages++;

        const packSize = ('00000' + chunk.length.toString(16)).slice(-5);
        const bufFileSize = Buffer.from(packSize);
        
        console.log(`size: ${chunk.length} / hex: ${packSize.toString()}`);

        const pack = Buffer.concat([bufHeader,bufFileSize,chunk,bufDelimiter]);
        totalBytes += pack.length;
        conn.write(pack);
        console.log(pack);
    });

    stream.on('close', ()=>{
        conn.end();
        console.log("total packages", packages);
        console.log("total bytes sent", totalBytes);
        cb(packages,totalBytes);
    });
};

module.exports.recvFileMaster = (conn, dir) =>{
    let packets = 0;
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
            console.log(filename.toString());
            buffer = buffer.slice(nameLen + 7, buffer.length);
        }
        
        const writeStream = fs.createWriteStream(path.join(dir, fileName));
        console.log("buffer size", buffer.length);
        
        while(buffer.length){
            console.log('data');
            const head = buffer.slice(0, 4);
            if(head.toString() != "FILE"){
                console.log("Error Occurred.");
                console.log(`header: ${head.toString()}`);
                //process.exit(1);
            }

            const size = parseInt(buffer.slice(4, 9), 16);
            console.log("size", size);

            const content = buffer.slice(9, size + 9);
            const delimiter = buffer.slice(size + 9, size + 10);
            
            if(delimiter != "@"){
                console.log(`Wrong delimiter. -> ${delimiter.toString()}`);
                //process.exit(1);
            }

            writeStream.write(content);
            buffer = buffer.slice(size + 10, buffer.length);
        }
        console.log('Receive the file');
    })
};

module.exports.sendFileSlave = (conn, filePath, blockSize) => {
    const bufLenHead = Buffer.from('SIZE');

    const fileName = path.parse(filePath).base;
    const bufFileName = Buffer.from(fileName);

    const nameLen = ('00' + fileName.length.toString(16)).slice(-2);
    const bufNameLen = Buffer.from(nameLen);

    console.log(`${fileName} -> ${fileName.length}`);

    const namePack = Buffer.concat([bufLenHead,bufNameLen,bufFileName,bufDelimiter]);

    conn.write(namePack);

    const rs = fs.createReadStream(filePath, {highWaterMark: blockSize});
    let packages = 0;
    let totalBytes = 0;

    rs.on('data', chunk => {
        packages++;

        const packSize = ('0000' + chunk.length.toString(16)).slice(-4);
        const bufFileSize = Buffer.from(packSize);
        
        console.log(`size: ${chunk.length} / hex: ${packSize.toString()}`);

        const pack = Buffer.concat([bufHeader,bufFileSize,chunk,bufDelimiter]);
        totalBytes += pack.length;
        conn.write(pack);
        console.log(pack);
    });

    rs.on('close', ()=>{
        conn.end();
        console.log("total packages", packages);
        console.log("total bytes sent", totalBytes);
    });
};


module.exports.getDirInfo = (path, callback) => {
    exec(`du -sD ${path}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        const size = stdout.toString().split('\t')[0];
        
        callback(size);
        //return (stdout.toString().split('\t')[0]).toString;
    });  
};