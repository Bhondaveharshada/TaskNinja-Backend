require("dotenv").config()
const http = require("http")
const port = process.env.PORT || 4000
const app = require("./app")



const myServer = http.createServer(app)

myServer.listen(port, ()=>{
    console.log("Server started at port:",port);
    
})