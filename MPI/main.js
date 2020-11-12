const net = require('net');
const file = require('./file');

const hosts = require('../config.json').hosts;

const getDiskSize = (nodeList, callback) =>{
    let arr = [];
    nodeList.forEach((host,idx) => {
        const conn = net.createConnection(host.port, host.ip, ()=>{
            conn.write('[GET] SIZE');
            conn.on('data', size =>{
                arr.push(parseInt(size.toString()));    
                conn.end('OK');
                console.log(idx)
                if(idx+1 == nodeList.length) callback(arr);
            });
        });
    });
};


getDiskSize([{"ip":"localhost","port":5000}],(data)=>{
    console.log(data);
});
