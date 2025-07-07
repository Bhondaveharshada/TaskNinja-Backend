const express = require('express')
const router = express.Router()
const taskController = require('./task.controller')

// Middleware to protect routes
const authMiddleware = require('../middleware/auth')        

// Route to create a new task
router.post('/create', authMiddleware, taskController.createTask);
router.get('/gettasksbyprojectId/:projectId', authMiddleware, taskController.getTasksByProjectId);
router.patch('/update/:taskId', authMiddleware, taskController.updateTask);
router.delete('/deletetask/:taskId', authMiddleware, taskController.deleteTask);

module.exports = router