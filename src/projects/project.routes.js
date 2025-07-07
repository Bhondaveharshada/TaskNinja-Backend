const express = require('express')
const router = express.Router()
const projectController = require('./project.controller')
const authMiddleware = require('../middleware/auth')

// Middleware to protect routes
router.post('/create', authMiddleware, projectController.createProject);
router.get('/getprojectsbyOwnerId/:ownerId', projectController.getProjectsByOwner);
router.get('/getprojectsbyMemberId/:memberId', projectController.getProjectsByMemberId);
router.get('/getprojectbyId/:projectId', projectController.getProjectById);
router.patch('/updateproject/:projectId', authMiddleware, projectController.updateProject);
router.delete('/deleteproject/:projectId', authMiddleware, projectController.deleteProject);
module.exports = router