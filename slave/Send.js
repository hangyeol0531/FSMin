const net = require('net');
const fs = require('fs');
const path = require('path');
const mpi = require('../MPI/file');

const nodeIP = ['192.168.0.55','192.168.0.53','192.168.0.54'];
const PORT = 4737;

const client = net.createConnection(PORT,nodeIP[0],()=>{
    console.log(`Connected to master node : ${nodeIP[0]}.`);
    
    mpi.sendFileSlave(client, path.join(__dirname,'nodejs.png'), 0x4000);
});
