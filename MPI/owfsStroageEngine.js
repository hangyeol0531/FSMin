const fs = require('fs');
const net = require('net');

const sendFile = require('./file');

function owfsStorage(opts){
    this.getDestination = (opts.destination);
    this.getFilename = (opts.filename);
}

owfsStorage.prototype._handleFile = function _handleFile(req, file, cb){
    this.getDestination(req, file, function(err, dest){
        if (err) return cb(err);
        const conn = net.createConnection(dest.port, dest.ip, ()=>{
            sendFile.sendStreamSlave(file.stream, conn, 'asdf.jpg');
        });
        // this.getFilename(req, file, function(err, filename){
        //     if(err) return cb(err);
            
            
        // });
    });
}

owfsStorage.prototype._removeFile = function _removeFile(req, file, cb){
    fs.unlink(file.path, cb);
}

module.exports = function(opts){
    return new owfsStorage(opts);
}