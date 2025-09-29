const Contact = require('../models/Contact');
const { sendEmail } = require('../config/email');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      subject,
      message
    });

    // Prepare email notification
    const emailOptions = {
      from: process.env.EMAIL_USER || 'sanatechglobal@gmail.com',
      to: 'sanatechglobal@gmail.com',
      subject: `New Contact Form Submission - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #3498db; margin: 20px 0;">
            <h3 style="color: #2c3e50; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          
          <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #2c3e50;">
              <strong>Action Required:</strong> Please check your admin dashboard to view and respond to this message.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #7f8c8d; font-size: 12px;">
              This email was automatically generated from your website contact form.
            </p>
          </div>
        </div>
      `
    };

    // Attempt to send email notification (with bypass mechanism)
    let emailResult = { success: false, error: 'Email service not attempted' };
    
    try {
      emailResult = await sendEmail(emailOptions);
      
      // Update contact record with email status
      await Contact.findByIdAndUpdate(contact._id, {
        emailSent: emailResult.success,
        emailError: emailResult.success ? null : emailResult.error
      });

      if (emailResult.success) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.warn('⚠️ Email notification failed, but contact saved:', emailResult.error);
      }
    } catch (emailError) {
      console.warn('⚠️ Email notification bypassed due to error:', emailError.message);
      
      // Update contact record with email error
      await Contact.findByIdAndUpdate(contact._id, {
        emailSent: false,
        emailError: emailError.message
      });
    }

    // Always return success response (email failure doesn't affect contact submission)
    res.status(201).json({
      status: 'success',
      message: 'Contact form submitted successfully',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          createdAt: contact.createdAt
        },
        emailNotification: {
          sent: emailResult.success,
          message: emailResult.success 
            ? 'Admin notification sent' 
            : 'Contact saved, email notification bypassed'
        }
      }
    });

  } catch (error) {
    console.error('❌ Contact submission error:', error);
    next(error);
  }
};

// @desc    Get all contacts (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: contacts.length,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      data: { contacts }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get single contact (Admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    // Mark as read if it was new
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContact = async (req, res, next) => {
  try {
    const { status, priority } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, priority },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { contact }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
};