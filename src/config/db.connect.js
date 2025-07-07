const mongoose = require("mongoose");

async function connectMongoDb(url){
    return mongoose.connect(url)
    .then(()=>{console.log("Mongodb Connected ",`${mongoose.connection.host}`)})
    .catch((err)=>{console.log("Mongo error",err);})
}

module.exports = {
    connectMongoDb,
}