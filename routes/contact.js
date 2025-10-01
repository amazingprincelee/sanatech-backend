const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for contact form submissions only
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact submissions per hour
  message: {
    status: 'error',
    message: 'Too many contact form submissions, please try again later.'
  }
});

// Public routes
router.post('/', contactLimiter, submitContact);

// Protected routes (Admin only)
router.use(protect); // All routes below this middleware are protected

router.route('/')
  .get(getContacts);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;