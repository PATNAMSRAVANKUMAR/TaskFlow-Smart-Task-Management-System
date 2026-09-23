const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');
const Task = require('../models/Task');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'taskflow_secret_fallback', {
    expiresIn: '30d'
  });
};

// Default categories template
const DEFAULT_CATEGORIES = [
  { name: 'Work', color: '#3b82f6', icon: 'briefcase', isDefault: true },
  { name: 'Personal', color: '#10b981', icon: 'user', isDefault: true },
  { name: 'Study', color: '#8b5cf6', icon: 'book', isDefault: true },
  { name: 'Health', color: '#f43f5e', icon: 'heart', isDefault: true },
  { name: 'Shopping', color: '#f59e0b', icon: 'shopping-bag', isDefault: true },
  { name: 'Other', color: '#6b7280', icon: 'tag', isDefault: true }
];

// Helper to seed categories for a user
const seedCategoriesForUser = async (userId) => {
  const existing = await Category.find({ user: userId });
  if (existing.length === 0) {
    const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      user: userId
    }));
    await Category.insertMany(categoriesToInsert);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password
    });

    // Seed default categories
    await seedCategoriesForUser(user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await seedCategoriesForUser(user._id);

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.email) {
      const emailExists = await User.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: user._id }
      });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      }
      user.email = req.body.email.toLowerCase();
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
      token
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Instant Demo Login with pre-populated sample tasks
// @route   POST /api/auth/demo
// @access  Public
const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'demo@taskflow.dev';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Alex Morgan',
        email: demoEmail,
        password: 'TaskFlowDemoPassword123!'
      });

      await seedCategoriesForUser(user._id);

      // Seed realistic sample tasks
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0);
      const overdue = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const tomorrow = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
      const thisWeek = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      const nextWeek = new Date(Date.now() + 8 * 24 * 60 * 60 * 1000);
      const completedRecent = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);

      const sampleTasks = [
        {
          title: 'Complete React dashboard implementation',
          description: 'Implement responsive widgets, charts, and dark mode toggling with smooth transitions.',
          priority: 'High',
          category: 'Work',
          status: 'In Progress',
          dueDate: today,
          user: user._id
        },
        {
          title: 'Submit quarterly budget proposal',
          description: 'Finalize spreadsheet calculations and send PDF to the finance committee.',
          priority: 'High',
          category: 'Work',
          status: 'Pending',
          dueDate: overdue,
          user: user._id
        },
        {
          title: 'Review pull request #42 for JWT authentication',
          description: 'Verify token expiration handling, refresh mechanics, and error status codes.',
          priority: 'Medium',
          category: 'Work',
          status: 'Pending',
          dueDate: today,
          user: user._id
        },
        {
          title: 'Weekly grocery shopping',
          description: 'Organic vegetables, whole grain bread, almond milk, and ground coffee.',
          priority: 'Low',
          category: 'Shopping',
          status: 'Pending',
          dueDate: tomorrow,
          user: user._id
        },
        {
          title: 'Dentist regular cleaning appointment',
          description: 'Dental clinic at 4th Avenue, 10:30 AM appointment with Dr. Chen.',
          priority: 'Medium',
          category: 'Health',
          status: 'Pending',
          dueDate: thisWeek,
          user: user._id
        },
        {
          title: 'Study Chapter 4: Distributed Systems Design',
          description: 'Focus on consensus algorithms: Raft, Paxos, and leader election protocols.',
          priority: 'Medium',
          category: 'Study',
          status: 'Pending',
          dueDate: nextWeek,
          user: user._id
        },
        {
          title: 'Morning 5km endurance run',
          description: 'Interval pacing in the park before breakfast.',
          priority: 'Low',
          category: 'Health',
          status: 'Completed',
          dueDate: completedRecent,
          completedAt: completedRecent,
          user: user._id
        },
        {
          title: 'Initialize GitHub repository and documentation',
          description: 'Setup initial commit, write README.md, and configure CI/CD actions.',
          priority: 'High',
          category: 'Work',
          status: 'Completed',
          dueDate: completedRecent,
          completedAt: completedRecent,
          user: user._id
        }
      ];

      await Task.insertMany(sampleTasks);
    } else {
      await seedCategoriesForUser(user._id);
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  updatePassword,
  demoLogin,
  seedCategoriesForUser
};
