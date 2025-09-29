const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getDashboardStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.get('/dashboard-stats', getDashboardStats);

module.exports = router;