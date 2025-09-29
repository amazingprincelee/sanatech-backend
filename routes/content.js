const express = require('express');
const {
  getContent,
  getContentByType,
  getSingleContent,
  createContent,
  updateContent,
  deleteContent,
  bulkUpdateStatus,
  getContentStats
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getContent);
router.get('/type/:type', getContentByType);
router.get('/:id', getSingleContent);

// Protected routes (Admin only)
router.use(protect); // All routes below this middleware are protected

router.post('/', createContent);
router.put('/bulk/status', bulkUpdateStatus);
router.get('/admin/stats', getContentStats);

router.route('/:id')
  .put(updateContent)
  .delete(deleteContent);

module.exports = router;