const fs = require('fs');
const net = require('net');

const sendFile = require('./file');

function owfsStorage(opts){
    this.getDestination = (opts.destination);
    this.getFileName = (opts.filename);

    
}

owfsStorage.prototype._handleFile = function _handleFile(req, file, cb){
    var that = this;
    console.log(this.getDestination);
    
    that.getDestination(req, file, function(err, dest){
        if (err) return cb(err);
        console.log(this.getFileName);
        that.getFileName(req, file, function(err, filename){
            
            if(err) return cb(err);
            const conn = net.createConnection(dest.port, dest.ip, ()=>{
                sendFile.sendStreamSlave(file.stream, conn, filename, (packcnt,packsize)=>{
                    cb(null, {
                        path: dest,
                        size: packsize
                    })
                });
            });
            conn.on('error',(error)=>{
                console.log(`Server Error (${host.ip}:${host.port})`);
            });
            
        });
        
        
    });
}

owfsStorage.prototype._removeFile = function _removeFile(req, file, cb){
    var that = this;
    const filename = file.name;
    that.getDestination(err, file, function(err, dest){
        if(err) return cb(err);
        const conn = net.createConnection(dest.port, dst.ip, ()=>{
            conn.write(`[DEL]${filename}`);
        });
        conn.on('data', (data)=>{
            if(data.toString() == 'OK'){
                cb(undefined);
                delete file.destination;
                delete file.filename;
                delete file.path;
            }
            else cb('err');
        }); 
        conn.on('error',(err)=>{
            console.log(`Server Error (${host.ip}:${host.port})`);
            cb(err);
        });
    });
}

module.exports = function(opts){
    return new owfsStorage(opts);
}