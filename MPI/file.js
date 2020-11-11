const fs = require('fs');

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