const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: ['service', 'mission', 'policy', 'about', 'hero', 'testimonial'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [300, 'Subtitle cannot be more than 300 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  image: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  features: [{
    title: String,
    description: String,
    icon: String
  }],
  metadata: {
    category: String,
    tags: [String],
    priority: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
contentSchema.index({ type: 1, 'metadata.isActive': 1, 'metadata.priority': -1 });

// Static method to get content by type
contentSchema.statics.getByType = function(type, activeOnly = true) {
  const query = { type };
  if (activeOnly) {
    query['metadata.isActive'] = true;
  }
  return this.find(query).sort({ 'metadata.priority': -1, createdAt: -1 });
};

module.exports = mongoose.model('Content', contentSchema);