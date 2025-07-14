// controllers/projectController.js
const Project = require('./project.model');
const User = require('../user/user.model');

exports.createProject = async (req, res) => {
    console.log("Creating project with body:", req.body);
  try {
    const { title, description, deadline, members } = req.body;
   // const deadlineDate = new Date(deadline);
    // Assuming the authenticated user is available via middleware (e.g. req.user)
    const creatorId = req.user.userId;

    // Step 1: Find users by email (filter only registered users)
    const memberUsers = await User.find({ email: { $in: members } });

    if (memberUsers.length !== members.length) {
      const foundEmails = memberUsers.map(u => u.email);
      const notFound = members.filter(email => !foundEmails.includes(email));
      return res.status(400).json({
        message: 'Some member emails are not registered users.',
        notFound
      });
    }

    // Step 2: Create project
    const project = new Project({
      name:title,
      description,
      deadline: deadline ? new Date(deadline) : null, // Convert to Date if provided
      owner: creatorId,
      members: memberUsers.map(user => user._id)
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully.',
      project
    });
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.getProjectsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({ message: 'ownerId is required in request body' });
    }

    const projects = await Project.find({ owner: ownerId })
      .populate('members','Name email _id') // populate only selected fields from User
      .sort({ deadline: 1 }); // optional: sort by upcoming deadlines

    res.status(200).json({ projects });

  } catch (error) {
    console.error('Error fetching projects by owner:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getProjectsByMemberId = async (req, res) => {
  try {
    const { memberId } = req.params.memberId ? req.params : req.query; // allow both body and query params

    if (!memberId) {
      return res.status(400).json({ message: 'memberId is required in request body' });
    }

    const projects = await Project.find({ members: memberId })
      .populate('members', 'Name email _id') // populate owner details
      .sort({ deadline: 1 }); // optional: sort by upcoming deadlines

    res.status(200).json({ projects });

  } catch (error) {
    console.error('Error fetching projects by member:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('members', 'Name email') // populate members details
      .populate('owner', 'Name email'); // populate owner details

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name, description, deadline, members } = req.body;

    // Find the project by ID
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = new Date(deadline);
    
    // Update members
    if (members && members.length > 0) {
      const memberUsers = await User.find({ email: { $in: members } });
      project.members = memberUsers.map(user => user._id);
    }

    await project.save();

    res.status(200).json({
      message: 'Project updated successfully.',
      project
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteProject = async (req,res) =>{
   try {
     const projectId = req.params.projectId;
     if (!projectId) {
       return res.status(404).json({ message: 'Project not found' });
      }
     await Project.findByIdAndDelete(projectId);

     return res.status(200).json({ message: 'Project deleted successfully' });
   } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
   }
}


exports.getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId)
      .populate('members', 'Name email'); // populate members details 
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json({ members: project.members });
  } catch (error) {
    console.error('Error fetching members by project ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  } 
}