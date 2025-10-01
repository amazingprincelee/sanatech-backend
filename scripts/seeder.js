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
    type: 'service',
    title: 'Instrumentation and Control Services',
    subtitle: 'Advanced instrumentation, control systems, and automation',
    description: 'Advanced instrumentation, control systems, and automation for industrial processes.',
    image: '/images/main-services/Instrumentation and Control System 1.jpg',
    icon: 'md md-precision-manufacturing',
    features: [
      { title: 'Process Control Systems', description: 'Advanced automation solutions', icon: 'fas fa-cogs' },
      { title: 'Instrumentation Design', description: 'Precision measurement systems', icon: 'fas fa-ruler' },
      { title: 'SCADA Systems', description: 'Supervisory control and data acquisition', icon: 'fas fa-desktop' },
      { title: 'PLC Programming', description: 'Programmable logic controllers', icon: 'fas fa-microchip' }
    ],
    metadata: {
      category: 'instrumentation',
      tags: ['control', 'automation', 'scada', 'plc'],
      priority: 9,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Mechanical Services',
    subtitle: 'Piping, welding, equipment services, and maintenance',
    description: 'Piping, welding, equipment services, and maintenance for industrial applications.',
    image: '/images/main-services/Mechanical Pipeline System 1.jpg',
    icon: 'fas fa-tools',
    features: [
      { title: 'Pipeline Installation', description: 'Industrial piping systems', icon: 'fas fa-pipe' },
      { title: 'Welding Services', description: 'Certified welding professionals', icon: 'fas fa-fire' },
      { title: 'Equipment Maintenance', description: 'Preventive and corrective maintenance', icon: 'fas fa-wrench' },
      { title: 'Fabrication', description: 'Custom mechanical fabrication', icon: 'fas fa-hammer' }
    ],
    metadata: {
      category: 'mechanical',
      tags: ['piping', 'welding', 'maintenance', 'fabrication'],
      priority: 8,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Renewable Energy Sustainability',
    subtitle: 'Energy, installation, and implementation of renewable energy',
    description: 'Energy, installation, and implementation of renewable energy solutions.',
    image: '/images/main-services/Solar Panel Installation 2.jpg',
    icon: 'fas fa-solar-panel',
    features: [
      { title: 'Solar Panel Installation', description: 'Photovoltaic system design and installation', icon: 'fas fa-sun' },
      { title: 'Wind Energy Systems', description: 'Wind turbine installation and maintenance', icon: 'fas fa-wind' },
      { title: 'Energy Storage', description: 'Battery and energy storage solutions', icon: 'fas fa-battery-full' },
      { title: 'Grid Integration', description: 'Renewable energy grid connection', icon: 'fas fa-plug' }
    ],
    metadata: {
      category: 'renewable',
      tags: ['solar', 'wind', 'energy', 'sustainability'],
      priority: 7,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Borehole and Water Treatment Services',
    subtitle: 'Geological surveys, drilling, and water treatment systems',
    description: 'Geological surveys, drilling, and water treatment systems for clean water access.',
    image: '/images/main-services/Water Treament Plant 1.jpg',
    icon: 'fas fa-water',
    features: [
      { title: 'Borehole Drilling', description: 'Professional water well drilling', icon: 'fas fa-drill' },
      { title: 'Water Treatment', description: 'Water purification and treatment systems', icon: 'fas fa-filter' },
      { title: 'Geological Surveys', description: 'Site assessment and analysis', icon: 'fas fa-search' },
      { title: 'Pump Installation', description: 'Water pump systems and maintenance', icon: 'fas fa-tint' }
    ],
    metadata: {
      category: 'water',
      tags: ['borehole', 'drilling', 'treatment', 'geological'],
      priority: 6,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Civil Engineering Services',
    subtitle: 'Infrastructure development for buildings and construction',
    description: 'Infrastructure development for buildings and construction projects.',
    image: '/images/main-services/Residential Building Under Construction.JPG',
    icon: 'fas fa-hard-hat',
    features: [
      { title: 'Structural Design', description: 'Building and infrastructure design', icon: 'fas fa-building' },
      { title: 'Construction Management', description: 'Project management and oversight', icon: 'fas fa-tasks' },
      { title: 'Site Preparation', description: 'Land development and preparation', icon: 'fas fa-bulldozer' },
      { title: 'Quality Control', description: 'Construction quality assurance', icon: 'fas fa-check-circle' }
    ],
    metadata: {
      category: 'civil',
      tags: ['construction', 'infrastructure', 'design', 'management'],
      priority: 5,
      isActive: true
    }
  },
  {
    type: 'service',
    title: 'Communication System Services',
    subtitle: 'Structured cabling, networking, surveillance, and cybersecurity',
    description: 'Structured cabling, networking, surveillance, and cybersecurity solutions.',
    image: '/images/main-services/Instrumentation and Control System 6.jpg',
    icon: 'fas fa-satellite-dish',
    features: [
      { title: 'Network Infrastructure', description: 'LAN/WAN setup and configuration', icon: 'fas fa-network-wired' },
      { title: 'CCTV Systems', description: 'Surveillance and security systems', icon: 'fas fa-video' },
      { title: 'Structured Cabling', description: 'Data, voice, and video networks', icon: 'fas fa-ethernet' },
      { title: 'Cybersecurity', description: 'Network security and monitoring', icon: 'fas fa-shield-alt' }
    ],
    metadata: {
      category: 'communication',
      tags: ['networking', 'cctv', 'cabling', 'cybersecurity'],
      priority: 4,
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

const seedContent = async () => {
  try {
    // Clear existing content
    await Content.deleteMany({});
    console.log('Existing content cleared');

    // Sample content data based on existing frontend content
     const contentData = [
       {
         type: 'hero',
         title: 'Welcome to Sanatech Global',
         subtitle: 'Engineering Excellence in Every Project',
         description: 'Leading provider of comprehensive engineering solutions across electrical, mechanical, instrumentation, and renewable energy sectors.',
         image: '/images/hero-bg.jpg',
         metadata: {
           isActive: true,
           priority: 10,
           category: 'homepage'
         },
         seo: {
           metaTitle: 'Sanatech Global - Engineering Excellence',
           metaDescription: 'Professional engineering services including electrical, mechanical, instrumentation, and renewable energy solutions.',
           keywords: ['engineering', 'electrical', 'mechanical', 'instrumentation', 'renewable energy']
         }
       },
       {
         type: 'mission',
         title: 'Our Mission',
         subtitle: 'Commitment to Excellence',
         description: 'Our mission at Sanatech Global is to uphold the highest standards of work ethics by ensuring productivity, proactivity, and accountability in every project we undertake. We are dedicated to delivering uncompromising quality, safety, and reliability, while giving each project our utmost attention through a detail-oriented and professional approach.',
         image: '/images/mission.png',
         metadata: {
           isActive: true,
           priority: 9,
           category: 'company'
         },
         seo: {
           metaTitle: 'Our Mission - Sanatech Global',
           metaDescription: 'Learn about Sanatech Global\'s mission and commitment to excellence in engineering.',
           keywords: ['mission', 'work ethics', 'quality', 'safety', 'reliability']
         }
       },
       {
          type: 'about',
          title: 'Our Core Values',
          subtitle: 'Foundation of Our Success',
          description: 'The core values that guide our operations and define our company culture.',
          image: '/images/core-values.jpg',
          features: [
            { title: 'Integrity and Transparency', description: 'We maintain the highest ethical standards in all our operations.' },
            { title: 'Quality and Excellence', description: 'We strive for excellence in every project we undertake.' },
            { title: 'Innovation and Continuous Improvement', description: 'We embrace innovation and continuously improve our processes.' },
            { title: 'Customer Satisfaction', description: 'Our clients\' satisfaction is our top priority.' },
            { title: 'Safety and Environmental Responsibility', description: 'We prioritize safety and environmental stewardship.' }
          ],
          metadata: {
            isActive: true,
            priority: 8,
            category: 'company'
          },
          seo: {
            metaTitle: 'Core Values - Sanatech Global',
            metaDescription: 'Discover the core values that drive Sanatech Global\'s commitment to excellence.',
            keywords: ['core values', 'integrity', 'quality', 'innovation', 'safety']
          }
        },
       {
         type: 'about',
         title: 'About Sanatech Global',
         subtitle: 'Your Trusted Engineering Partner',
         description: 'With years of experience in the engineering industry, we deliver innovative solutions that meet the highest standards of quality and safety.',
         image: '/images/about-us.jpg',
         metadata: {
           isActive: true,
           priority: 7,
           category: 'company'
         },
         seo: {
           metaTitle: 'About Sanatech Global - Engineering Experts',
           metaDescription: 'Learn about our engineering expertise and commitment to delivering quality solutions.',
           keywords: ['about', 'engineering company', 'expertise', 'quality']
         }
       },
       {
         type: 'service',
         title: 'Electrical Engineering',
         subtitle: 'Power Systems & Solutions',
         description: 'Comprehensive electrical engineering services including power generation, transmission, distribution, and testing.',
         image: '/images/electrical-service.jpg',
         features: [
           { title: 'Power system design and analysis', description: 'Complete electrical system design and analysis services.' },
           { title: 'Electrical installation and commissioning', description: 'Professional installation and commissioning of electrical systems.' },
           { title: 'Testing and maintenance services', description: 'Comprehensive testing and maintenance for electrical equipment.' },
           { title: 'Energy efficiency solutions', description: 'Innovative solutions to improve energy efficiency.' }
         ],
         metadata: {
           isActive: true,
           priority: 6,
           category: 'services'
         },
         seo: {
           metaTitle: 'Electrical Engineering Services - Sanatech Global',
           metaDescription: 'Professional electrical engineering services including power systems, installation, and testing.',
           keywords: ['electrical engineering', 'power systems', 'electrical installation']
         }
       },
       {
         type: 'service',
         title: 'Mechanical Engineering',
         subtitle: 'Mechanical Systems & Solutions',
         description: 'Professional mechanical engineering services including HVAC, piping systems, and mechanical equipment installation.',
         image: '/images/mechanical-service.jpg',
         features: [
           { title: 'HVAC system design and installation', description: 'Complete HVAC system design and installation services.' },
           { title: 'Piping and plumbing systems', description: 'Professional piping and plumbing system solutions.' },
           { title: 'Mechanical equipment commissioning', description: 'Expert commissioning of mechanical equipment.' },
           { title: 'Maintenance and repair services', description: 'Comprehensive maintenance and repair services.' }
         ],
         metadata: {
           isActive: true,
           priority: 5,
           category: 'services'
         },
         seo: {
           metaTitle: 'Mechanical Engineering Services - Sanatech Global',
           metaDescription: 'Expert mechanical engineering services including HVAC, piping, and equipment installation.',
           keywords: ['mechanical engineering', 'HVAC', 'piping systems', 'commissioning']
         }
       }
     ];

    // Insert content data
    const createdContent = await Content.insertMany(sampleContent);
    console.log(`${createdContent.length} content items created successfully`);

    return createdContent;
  } catch (error) {
    console.error('Error seeding content:', error);
    throw error;
  }
};

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

    // Create sample content using the new function
    console.log('📝 Creating sample content...');
    const content = await seedContent();
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