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
  if (!data.phone?.trim()) errors.push('Phone number is required');
  if (!data.gender?.trim()) errors.push('Gender is required');
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (data.phone && !/^[0-9+\-\s]{10,15}$/.test(data.phone)) {
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
  // Log incoming request
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body ? JSON.stringify(req.body).substring(0, 200) + '...' : 'No body'
  });

  // Set CORS headers
  const allowedOrigin = process.env.NODE_ENV === 'production' 
    ? (process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com')
    : '*';
    
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    const errorMessage = `Method ${req.method} not allowed`;
    console.error(errorMessage);
    return res.status(405).json({ 
      success: false,
      message: errorMessage 
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

  const { name, email, phone, gender } = body;

  // Validate input
  const validationErrors = validateInput({ name, email, phone, gender });
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

    // Format the gender for display
    const formattedGender = {
      male: 'Male',
      female: 'Female',
      other: 'Other',
    }[gender] || gender;

    // Current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Send email to admin
    const adminEmail = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.adminEmail,
      reply_to: email,
      subject: `New Free Trial Booking - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #e53e3e; margin-bottom: 20px; text-align: center;">New Free Trial Booking</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #3182ce; text-decoration: none;">${email}</a></p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color: #3182ce; text-decoration: none;">${phone}</a></p>
            <p style="margin: 8px 0;"><strong>Gender:</strong> ${formattedGender}</p>
            <p style="margin: 8px 0 0 0;"><strong>Booking Date:</strong> ${formattedDate}</p>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <a href="mailto:${email}?subject=Confirm%20Your%20Free%20Trial%20at%20Muscle%20Works&body=Hi%20${encodeURIComponent(name.split(' ')[0])}%2C%0A%0AThank%20you%20for%20booking%20a%20free%20trial%20at%20Muscle%20Works!%20We're%20excited%20to%20have%20you.%0A%0APlease%20let%20us%20know%20your%20preferred%20date%20and%20time%20for%20your%20first%20session.%0A%0ALooking%20forward%20to%20seeing%20you!%0A%0ABest%20regards%2C%0AMuscle%20Works%20Team" 
               style="display: inline-block; background-color: #e53e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">
              Confirm Booking
            </a>
            <a href="tel:${phone.replace(/[^0-9+]/g, '')}" 
               style="display: inline-block; background-color: #2d3748; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Call to Confirm
            </a>
          </div>
          
          <p style="margin-top: 20px; color: #718096; font-size: 12px; text-align: center;">
            This booking was made on ${formattedDate}.
          </p>
        </div>
      `,
    });

    // Send confirmation email to the user
    const userEmail = await resend.emails.send({
      from: emailConfig.from,
      to: email,
      reply_to: emailConfig.replyTo,
      subject: 'Your Free Trial at Muscle Works',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #e53e3e; margin-bottom: 5px;">Thank You for Booking a Free Trial!</h1>
            <p style="color: #4a5568; margin-top: 0;">We're excited to help you start your fitness journey</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
            <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 8px 0;"><strong>Gender:</strong> ${formattedGender}</p>
            <p style="margin: 8px 0 0 0;"><strong>Booking Date:</strong> ${formattedDate}</p>
          </div>
          
          <p style="margin-bottom: 20px; line-height: 1.6;">
            Our team will contact you shortly to confirm your trial session and answer any questions you may have.
          </p>
          
          <div style="background-color: #ebf8ff; border-left: 4px solid #3182ce; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: 500; color: #2c5282;">
              What to bring for your first session:
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px;">
              <li>Comfortable workout clothes</li>
              <li>Water bottle</li>
              <li>Towel</li>
              <li>Valid ID proof</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="margin: 0 0 15px 0; color: #4a5568;">Need help? Contact us:</p>
            <a href="tel:+919281151518" style="display: inline-block; background-color: #2d3748; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500; margin-right: 10px;">
              Call Us: +91-9281151518
            </a>
            <a href="mailto:${emailConfig.adminEmail}" style="display: inline-block; background-color: #e53e3e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Email Us
            </a>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
            <p style="margin: 0 0 5px 0; font-weight: 500;">Muscle Works - The Fitness Coliseum</p>
            <p style="margin: 0 0 5px 0;">Level 4, Pavani Equinox, Road Number 10</p>
            <p style="margin: 0 0 5px 0;">Jubilee Hills, Hyderabad, Telangana 500033</p>
            <p style="margin: 0 0 5px 0;">Phone: +91-9281151518 | Email: ${emailConfig.adminEmail}</p>
          </div>
        </div>
      `
    });

    const errors = [adminEmail.error, userEmail.error].filter(Boolean);
    if (errors.length > 0) {
      console.error('Error sending emails:', errors);
      return res.status(500).json({
        success: false,
        message: 'Failed to send one or more confirmation emails. Your booking was received, but there was an issue sending the confirmation.'
      });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Trial session booked successfully! Check your email for confirmation.'
    });
  } catch (error) {
    console.error('Error processing trial booking:', error);
    const isProduction = process.env.NODE_ENV === 'production';
    const errorMessage = isProduction 
      ? 'Failed to book trial session. Please try again later.' 
      : error.message;
    
    return res.status(500).json({ 
      success: false, 
      message: errorMessage 
    });
  }
}
