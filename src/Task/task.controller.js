
const Task = require('./task.model');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, deadline, priority, createdBy, projectId, assignedTo } = req.body;

    const newTask = new Task({
      title,
      description,
      status,
      deadline,
      createdBy, // Assuming createdBy is a string (user ID)
      priority: priority || 'medium', // Default to 'medium' if not provided
      projectId,
      assignedTo
    });

    const savedTask = await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: savedTask });
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}


exports.getTasksByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await Task.find({
      projectId: projectId
    }).populate('assignedTo', 'Name email').populate('createdBy', 'Name email');
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this project' });
    }
    res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks by project ID:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}

