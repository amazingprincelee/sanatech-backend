const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', submitContact);

// Protected routes (Admin only)
router.use(protect); // All routes below this middleware are protected

router.route('/')
  .get(getContacts);

router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;