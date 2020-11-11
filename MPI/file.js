const fs = require('fs');
const { exec } = require("child_process");

module.exports.header = `FILE`;
module.exports.delimiter = `@`;
module.exports.tail = `END`;

const bufHeader = Buffer.from(this.header);
const bufDelimiter = Buffer.from(this.delimiter);


module.exports.sendFile = (sock, path, blockSize) => {
    const rs = fs.createReadStream(path, {highWaterMark: blockSize});
    let packages = 0;
    let totalBytes = 0;

    rs.on('data', chunk => {
        packages++;

        const size = ('0000' + chunk.length.toString(16)).slice(-4);
        const bufSize = Buffer.from(size);
        console.log(`size: ${chunk.length} / hex: ${size.toString()}`);

        const pack = Buffer.concat([bufHeader,bufSize,chunk,bufDelimiter]);
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