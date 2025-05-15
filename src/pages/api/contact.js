import nodemailer from 'nodemailer';

// Validate environment variables
const isProduction = process.env.NODE_ENV === 'production';

// Helper function to send error response
const sendErrorResponse = (res, status, message) => {
  return res.status(status).json({ 
    success: false, 
    message: isProduction && status >= 500 ? 'An error occurred. Please try again later.' : message
  });
};

import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
const emailConfig = {
  from: 'Muscle Works <onboarding@resend.dev>',
  to: 'akkenapally.reddy@gmail.com',
  adminEmail: 'akkenapally.reddy@gmail.com',
  replyTo: 'akkenapally.reddy@gmail.com'
};

// Verify Resend API key is set
if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set in environment variables');
}

// Input validation schema
function validateInput(data) {
  const errors = [];
  if (!data.name?.trim()) errors.push('Name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.message?.trim()) errors.push('Message is required');
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (data.phone && !/^[0-9+\-\s]+$/.test(data.phone)) {
    errors.push('Please enter a valid phone number');
  }
  
  return errors;
}

// Middleware to parse JSON body
export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed'
    });
  }

  // Parse JSON body
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid request body'
    });
  }

  const { name, email, phone, message } = body;

  // Validate input
  const validationErrors = validateInput({ name, email, phone, message });
  if (validationErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationErrors
    });
  }

  try {
    // Verify Resend API key is set
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Email service is not properly configured');
    }

    const currentDate = new Date().toLocaleString();
    
    // Send email to admin
    const adminEmail = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      reply_to: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #e53e3e; margin-bottom: 20px; text-align: center;">New Contact Form Submission</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></p>
            ${phone ? `<p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color: #3182ce; text-decoration: none;">${phone}</a></p>` : ''}
          </div>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
            <h3 style="color: #4a5568; margin-top: 0; margin-bottom: 10px;">Message:</h3>
            <p style="margin: 0; white-space: pre-line;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="margin-top: 20px; color: #718096; font-size: 12px; text-align: center;">
            This message was sent from the contact form on ${currentDate}.
          </p>
        </div>
      `,
    });

    // Send confirmation email to user
    const userEmail = await resend.emails.send({
      from: emailConfig.from,
      to: email,
      reply_to: emailConfig.replyTo,
      subject: 'Thank you for contacting Muscle Works',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #e53e3e; margin-bottom: 20px; text-align: center;">Thank you for contacting Muscle Works, ${name}!</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p>We've received your message and will get back to you as soon as possible.</p>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-left: 4px solid #3182ce;">
              <p style="margin: 0 0 10px 0; font-style: italic;">Your message:</p>
              <p style="margin: 0; white-space: pre-line;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            
            <p>If you have any urgent inquiries, please feel free to contact us directly at <a href="mailto:${emailConfig.replyTo}" style="color: #3182ce; text-decoration: none;">${emailConfig.replyTo}</a>.</p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://yourwebsite.com'}" style="display: inline-block; background-color: #e53e3e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Visit Our Website</a>
          </p>
          
          <p style="margin-top: 30px; color: #718096; font-size: 12px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <em>This is an automated message. Please do not reply to this email.</em><br>
            Message sent on: ${currentDate}
          </p>
        </div>
      `,
    });

    const errors = [adminEmail.error, userEmail.error].filter(Boolean);
    if (errors.length > 0) {
      console.error('Error sending emails:', errors);
      return sendErrorResponse(res, 500, 'Failed to send one or more emails');
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! You will receive a confirmation email shortly.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return sendErrorResponse(res, 500, 'Failed to send message. Please try again later.');
  }
}
