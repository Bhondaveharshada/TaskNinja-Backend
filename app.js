const express = require('express');
const app = express();
const cors = require("cors");
const { connectMongoDb } = require('./src/config/db.connect');
const bodyParser = require('body-parser');
const userRoutes = require('./src/user/user.routes');
const projectRoutes = require('./src/projects/project.routes');
const TaskRoutes = require('./src/Task/task.routes');

app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json())
app.use(cors());


connectMongoDb(process.env.MONGO_URI)



app.use("/user",userRoutes);
app.use("/projects", projectRoutes);
app.use("/task", TaskRoutes);
module.exports = app