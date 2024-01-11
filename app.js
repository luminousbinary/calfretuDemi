// var express = require ('express')

const server = require("./backend/api/server")


// stasrt the server
var port = 3000;
server.listen(port, function(){
    console.log('server started on port ' + port);
})