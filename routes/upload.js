const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { upload: uploadToCloudinary } = require('../config/cloudinary');

// @desc    Upload image to Cloudinary
// @route   POST /api/upload/image
// @access  Private (Admin only)
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    // Convert buffer to base64 for Cloudinary upload
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload to Cloudinary in 'sanatech-content' folder
    const result = await uploadToCloudinary(base64Image, 'sanatech-content');

    res.status(200).json({
      status: 'success',
      message: 'Image uploaded successfully',
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/image
// @access  Private (Admin only)
router.delete('/image', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'Image URL is required'
      });
    }

    // Import deleteFromCloudinary function
    const { deleteFromCloudinary } = require('../config/cloudinary');
    
    // Delete from Cloudinary
    await deleteFromCloudinary(imageUrl);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Image delete error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Apply error handling middleware
router.use(handleMulterError);

module.exports = router;