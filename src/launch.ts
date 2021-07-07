import http from "http";

let server: http.Server;

import init from "./server";

function onError(error: NodeJS.ErrnoException){
    switch(error.code) {
        case 'EACCES':
            console.error(`Port ${process.env.PORT} requires elevated privileges`);
            process.exit(1);
        case 'EADDRINUSE':
            console.error(`Port ${process.env.PORT} is already in use by another process`);
            process.exit(1);
        default:
            throw error;
    }
}

function terminate(){
    if(server.listening)
        server.close();
    console.log('Shutting down server');
    process.exit();
}

function onListenting() {
    console.log(`Listening on ${process.env.PORT}`);
}

init()
    .then(app => {
        server = http.createServer(app);
        process.env.PORT = process.env.PORT || '3000';
        server.listen(process.env.PORT);
        server.on('error', onError);
        server.on('listening', onListenting);
    })
    .finally(() => {
        process.on('SIGTERM', terminate);
        process.on('SIGINT', terminate);
    })

