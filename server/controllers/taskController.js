const Task = require('../models/Task');

// @desc    Get all tasks with smart search, filter, and sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { search, status, priority, category, sort, view } = req.query;
    const query = { user: req.user._id };

    // Search filter across title, description, and category
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ];
    }

    // Status filter
    const now = new Date();
    if (status && status !== 'All') {
      if (status === 'Overdue') {
        query.dueDate = { $lt: now, $ne: null };
        query.status = { $ne: 'Completed' };
      } else {
        query.status = status;
      }
    }

    // View-specific presets
    if (view === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (view === 'upcoming') {
      const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gt: endOfToday };
      query.status = { $ne: 'Completed' };
    } else if (view === 'completed') {
      query.status = 'Completed';
    }

    // Priority filter
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Sorting definition
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'dueDate-asc') {
      sortOption = { dueDate: 1 };
    } else if (sort === 'dueDate-desc') {
      sortOption = { dueDate: -1 };
    } else if (sort === 'priority-desc') {
      // Custom priority weighting via collation or sort by custom field
      sortOption = { priority: 1, dueDate: 1 };
    } else if (sort === 'title-asc') {
      sortOption = { title: 1 };
    } else if (sort === 'createdAt-asc') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'createdAt-desc') {
      sortOption = { createdAt: -1 };
    }

    let tasks = await Task.find(query).sort(sortOption);

    // If sorting by priority High -> Low: High (1), Medium (2), Low (3)
    if (sort === 'priority-desc') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    } else if (sort === 'priority-asc') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => (weight[a.priority] || 0) - (weight[b.priority] || 0));
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const taskData = {
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      category: category ? category.trim() : 'Work',
      status: status || 'Pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user._id
    };

    if (taskData.status === 'Completed') {
      taskData.completedAt = new Date();
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const { title, description, priority, category, dueDate, status } = req.body;

    if (title !== undefined) {
      if (title.trim() === '') {
        return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
      }
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category.trim();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    if (status !== undefined) {
      if (status === 'Completed' && task.status !== 'Completed') {
        task.completedAt = new Date();
      } else if (status !== 'Completed' && task.status === 'Completed') {
        task.completedAt = null;
      }
      task.status = status;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const toggleCompleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (task.status === 'Completed') {
      task.status = 'Pending';
      task.completedAt = null;
    } else {
      task.status = 'Completed';
      task.completedAt = new Date();
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: task.status === 'Completed' ? 'Task marked as completed' : 'Task restored to pending',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & productivity summary
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      completedToday,
      completedThisWeek,
      todayTasksCount
    ] = await Promise.all([
      Task.countDocuments({ user: userId }),
      Task.countDocuments({ user: userId, status: 'Completed' }),
      Task.countDocuments({ user: userId, status: 'In Progress' }),
      Task.countDocuments({ user: userId, status: 'Pending' }),
      Task.countDocuments({
        user: userId,
        status: { $ne: 'Completed' },
        dueDate: { $lt: now, $ne: null }
      }),
      Task.countDocuments({
        user: userId,
        status: 'Completed',
        completedAt: { $gte: startOfToday, $lte: endOfToday }
      }),
      Task.countDocuments({
        user: userId,
        status: 'Completed',
        completedAt: { $gte: sevenDaysAgo }
      }),
      Task.countDocuments({
        user: userId,
        dueDate: { $gte: startOfToday, $lte: endOfToday }
      })
    ]);

    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completedToday,
        completedThisWeek,
        todayTasksCount,
        progressPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleCompleteTask,
  deleteTask,
  getTaskStats
};
