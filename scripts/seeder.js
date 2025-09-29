const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Content = require('../models/Content');
const connectDB = require('../config/database');
require('dotenv').config();

// Sample content data
const sampleContent = [
  {
    type: 'service',
    title: 'Electrical Troubleshooting Excellence',
    subtitle: 'Expert diagnosis and resolution of electrical issues',
    description: 'Our experienced technicians provide comprehensive electrical troubleshooting services, identifying and resolving complex electrical problems with precision and efficiency.',
    image: '/images/main-services/Trouble Shooting Electrical system.jpg',
    icon: 'fas fa-search-plus',
    features: [
      { title: 'Advanced Diagnostics', description: 'State-of-the-art testing equipment', icon: 'fas fa-microscope' },
      { title: '24/7 Emergency Service', description: 'Round-the-clock support', icon: 'fas fa-clock' },
      { title: 'Expert Technicians', description: 'Certified and experienced professionals', icon: 'fas fa-user-check' }
    ],
    metadata: {
      category: 'electrical',
      tags: ['troubleshooting', 'diagnostics', 'repair'],
      priority: 10,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Advanced Electrical Systems',
    subtitle: 'Cutting-edge electrical infrastructure solutions',
    description: 'We design, install, and maintain advanced electrical systems for industrial, commercial, and residential applications, ensuring optimal performance and safety.',
    image: '/images/main-services/Electrical Control Center 1.jpg',
    icon: 'fas fa-bolt',
    features: [
      { title: 'System Design', description: 'Custom electrical system design', icon: 'fas fa-drafting-compass' },
      { title: 'Installation', description: 'Professional installation services', icon: 'fas fa-tools' },
      { title: 'Maintenance', description: 'Ongoing system maintenance', icon: 'fas fa-cogs' }
    ],
    metadata: {
      category: 'electrical',
      tags: ['systems', 'installation', 'design'],
      priority: 9,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Equipment Leasing Services',
    subtitle: 'Flexible equipment rental solutions',
    description: 'Access to high-quality industrial equipment through our comprehensive leasing program, providing cost-effective solutions for your project needs.',
    image: '/images/main-services/Mechinary.jpg',
    icon: 'fas fa-handshake',
    features: [
      { title: 'Flexible Terms', description: 'Customizable leasing options', icon: 'fas fa-calendar-alt' },
      { title: 'Quality Equipment', description: 'Well-maintained machinery', icon: 'fas fa-award' },
      { title: 'Support Included', description: 'Technical support and maintenance', icon: 'fas fa-life-ring' }
    ],
    metadata: {
      category: 'equipment',
      tags: ['leasing', 'rental', 'machinery'],
      priority: 8,
      isActive: true
    }
  },
  {
    type: 'mission',
    title: 'Our Mission',
    subtitle: 'Empowering industries through innovative engineering solutions',
    description: 'At SANATECH Global, our mission is to provide world-class engineering services that drive industrial excellence. We are committed to delivering innovative, reliable, and sustainable solutions that meet the evolving needs of our clients while maintaining the highest standards of safety and quality.',
    metadata: {
      priority: 10,
      isActive: true
    }
  },
  {
    type: 'policy',
    title: 'Quality Policy',
    subtitle: 'Commitment to excellence in every project',
    description: 'We are committed to providing services that meet or exceed customer expectations through continuous improvement of our quality management system, adherence to industry standards, and investment in our team\'s professional development.',
    metadata: {
      category: 'quality',
      priority: 9,
      isActive: true
    }
  },
  {
    type: 'policy',
    title: 'Safety Policy',
    subtitle: 'Safety first in all our operations',
    description: 'The safety of our employees, clients, and the public is our top priority. We maintain strict safety protocols, provide comprehensive training, and ensure compliance with all relevant safety regulations and industry best practices.',
    metadata: {
      category: 'safety',
      priority: 8,
      isActive: true
    }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Admin.deleteMany({});
    await Content.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminData = {
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@sanatechglobal.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'super-admin'
    };

    const admin = await Admin.create(adminData);
    console.log(`✅ Admin created: ${admin.email}`);

    // Create sample content
    console.log('📝 Creating sample content...');
    const content = await Content.insertMany(sampleContent);
    console.log(`✅ ${content.length} content items created`);

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('\n⚠️  Please change the admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;