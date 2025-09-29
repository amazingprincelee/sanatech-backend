const Content = require('../models/Content');

// @desc    Get all content or filter by type
// @route   GET /api/content
// @access  Public
const getContent = async (req, res, next) => {
  try {
    const { type, active = 'true' } = req.query;
    
    let query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (active === 'true') {
      query['metadata.isActive'] = true;
    }

    const content = await Content.find(query)
      .sort({ 'metadata.priority': -1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: content.length,
      data: { content }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get content by type (optimized for frontend)
// @route   GET /api/content/type/:type
// @access  Public
const getContentByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { active = 'true' } = req.query;

    const content = await Content.getByType(type, active === 'true');

    res.status(200).json({
      status: 'success',
      results: content.length,
      data: { content }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single content item
// @route   GET /api/content/:id
// @access  Public
const getSingleContent = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { content }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new content
// @route   POST /api/content
// @access  Private/Admin
const createContent = async (req, res, next) => {
  try {
    const content = await Content.create(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Content created successfully',
      data: { content }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update content
// @route   PUT /api/content/:id
// @access  Private/Admin
const updateContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Content updated successfully',
      data: { content }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete content
// @route   DELETE /api/content/:id
// @access  Private/Admin
const deleteContent = async (req, res, next) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({
        status: 'error',
        message: 'Content not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Content deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update content status
// @route   PUT /api/content/bulk/status
// @access  Private/Admin
const bulkUpdateStatus = async (req, res, next) => {
  try {
    const { ids, isActive } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide an array of content IDs'
      });
    }

    const result = await Content.updateMany(
      { _id: { $in: ids } },
      { 'metadata.isActive': isActive }
    );

    res.status(200).json({
      status: 'success',
      message: `${result.modifiedCount} content items updated`,
      data: { modifiedCount: result.modifiedCount }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get content statistics
// @route   GET /api/content/stats
// @access  Private/Admin
const getContentStats = async (req, res, next) => {
  try {
    const totalContent = await Content.countDocuments();
    const activeContent = await Content.countDocuments({ 'metadata.isActive': true });
    
    const contentByType = await Content.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$metadata.isActive', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const recentContent = await Content.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('type title metadata.isActive updatedAt');

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          total: totalContent,
          active: activeContent,
          inactive: totalContent - activeContent
        },
        byType: contentByType,
        recent: recentContent
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContent,
  getContentByType,
  getSingleContent,
  createContent,
  updateContent,
  deleteContent,
  bulkUpdateStatus,
  getContentStats
};