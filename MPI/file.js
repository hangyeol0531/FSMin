const fs = require('fs');
const { exec } = require("child_process");
const path = require('path');

module.exports.header = `FILE`;
module.exports.delimiter = `@`;
module.exports.tail = `END`;

const bufHeader = Buffer.from(this.header);
const bufDelimiter = Buffer.from(this.delimiter);


module.exports.sendFile = (sock, filePath, blockSize) => {
    const bufLenHead = Buffer.from('SIZE');

    const fileName = path.parse(filePath).base;
    const bufFileName = Buffer.from(fileName);

    const nameLen = ('00' + fileName.length.toString(16)).slice(-2);
    const bufNameLen = Buffer.from(nameLen);

    console.log(`${fileName} -> ${fileName.length}`);

    const namePack = Buffer.concat([bufLenHead,bufNameLen,bufFileName,bufDelimiter]);

    sock.write(namePack);
    sock.write('END');

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
        sock.write(pack);
    });

    rs.on('close', ()=>{
        sock.write(this.tail);
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