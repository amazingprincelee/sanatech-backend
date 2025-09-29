const Admin = require('../models/Admin');
const Contact = require('../models/Contact');
const Content = require('../models/Content');

// @desc    Register admin
// @route   POST /api/admin/register
// @access  Public (should be restricted in production)
const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({email});

    if (existingAdmin) {
      return res.status(400).json({
        status: 'error',
        message: 'Admin with this email or username already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      email,
      password,
      role: role || 'admin'
    });

    // Generate token
    const token = admin.getSignedJwtToken();

    res.status(201).json({
      status: 'success',
      message: 'Admin registered successfully',
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is deactivated'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = admin.getSignedJwtToken();

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          lastLogin: admin.lastLogin
        },
        token
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      status: 'success',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin,
          createdAt: admin.createdAt
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      { username, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // Get contact statistics
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'new' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });

    // Get recent contacts
    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email subject status createdAt');

    // Get content statistics
    const totalContent = await Content.countDocuments();
    const activeContent = await Content.countDocuments({ 'metadata.isActive': true });
    const contentByType = await Content.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get email delivery stats
    const emailStats = await Contact.aggregate([
      {
        $group: {
          _id: null,
          totalEmails: { $sum: 1 },
          successfulEmails: {
            $sum: { $cond: [{ $eq: ['$emailSent', true] }, 1, 0] }
          },
          failedEmails: {
            $sum: { $cond: [{ $eq: ['$emailSent', false] }, 1, 0] }
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        contacts: {
          total: totalContacts,
          new: newContacts,
          read: readContacts,
          replied: repliedContacts,
          recent: recentContacts
        },
        content: {
          total: totalContent,
          active: activeContent,
          byType: contentByType
        },
        email: emailStats[0] || {
          totalEmails: 0,
          successfulEmails: 0,
          failedEmails: 0
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getDashboardStats
};