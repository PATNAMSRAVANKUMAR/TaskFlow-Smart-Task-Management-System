const Category = require('../models/Category');
const Task = require('../models/Task');
const { seedCategoriesForUser } = require('./authController');

// @desc    Get all categories for logged-in user with task counts
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Ensure user has default categories
    await seedCategoriesForUser(userId);

    const categories = await Category.find({ user: userId }).sort({ isDefault: -1, createdAt: 1 });

    // Aggregate task counts per category for this user
    const taskStats = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $ne: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = {};
    taskStats.forEach((stat) => {
      statsMap[stat._id] = {
        total: stat.total,
        completed: stat.completed,
        pending: stat.pending
      };
    });

    const enrichedCategories = categories.map((cat) => {
      const stats = statsMap[cat.name] || { total: 0, completed: 0, pending: 0 };
      return {
        _id: cat._id,
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        isDefault: cat.isDefault,
        createdAt: cat.createdAt,
        totalTasks: stats.total,
        completedTasks: stats.completed,
        pendingTasks: stats.pending
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedCategories.length,
      data: enrichedCategories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const trimmedName = name.trim();

    const existing = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name: trimmedName,
      color: color || '#6366f1',
      icon: icon || 'folder',
      user: req.user._id,
      isDefault: false
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        _id: category._id,
        name: category.name,
        color: category.color,
        icon: category.icon,
        isDefault: category.isDefault,
        createdAt: category.createdAt,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete custom category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.id, user: req.user._id });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.isDefault) {
      return res.status(400).json({ success: false, message: 'Default categories cannot be deleted' });
    }

    // Move associated tasks to "Other"
    await Task.updateMany(
      { user: req.user._id, category: category.name },
      { $set: { category: 'Other' } }
    );

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: `Category "${category.name}" deleted. Any existing tasks were reassigned to "Other".`,
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory
};
