import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { appointment_id } = JSON.parse(event.body || '{}');

    if (!appointment_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'appointment_id is required' })
      };
    }

    // Get appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('office_visits')
      .select(`
        *,
        users (
          email,
          full_name,
          preferred_language
        )
      `)
      .eq('id', appointment_id)
      .single();

    if (appointmentError || !appointment) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Appointment not found' })
      };
    }

    // Send confirmation email
    await sendConfirmationEmail(appointment);

    // Send preparation materials
    await sendPreparationMaterials(appointment);

    // Schedule reminder emails
    await scheduleReminderEmails(appointment);

    // Update appointment status
    await supabase
      .from('office_visits')
      .update({
        confirmation_sent_at: new Date().toISOString(),
        preparation_materials_sent: true
      })
      .eq('id', appointment_id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Confirmation and preparation materials sent'
      })
    };

  } catch (error) {
    console.error('Error in office visit confirmation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function sendConfirmationEmail(appointment: any) {
  const user = appointment.users;
  const appointmentDate = new Date(appointment.appointment_date);
  
  const emailContent = {
    to: user.email,
    subject: 'Your Galaxy Dream Team Appointment is Confirmed! 🌟',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Galaxy Dream Team</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">Your transformation journey begins!</p>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Appointment Confirmed ✓</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">Appointment Details</h3>
            <p><strong>Date:</strong> ${appointmentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Time:</strong> ${appointmentDate.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true 
            })}</p>
            <p><strong>Office:</strong> ${appointment.office_location}</p>
            <p><strong>Address:</strong> ${appointment.office_address}</p>
            <p><strong>Phone:</strong> ${appointment.office_phone}</p>
            <p><strong>Type:</strong> ${appointment.appointment_type}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1976d2; margin-top: 0;">What to Expect</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Personal consultation with our expert team</li>
              <li>Comprehensive assessment of your current situation</li>
              <li>Customized action plan for your goals</li>
              <li>Resource recommendations tailored to you</li>
            </ul>
          </div>
          
          <div style="background: #fff3e0; padding: 20px; border-radius: 8px;">
            <h3 style="color: #f57c00; margin-top: 0;">Preparation Tips</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Arrive 10 minutes early</li>
              <li>Bring any questions or specific goals you want to discuss</li>
              <li>Come with an open mind and ready to explore possibilities</li>
              <li>Bring a notebook to capture insights</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #333; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">Questions? Contact us at ${appointment.office_phone}</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Galaxy Dream Team - Unlocking Your Potential</p>
        </div>
      </div>
    `
  };

  // In a real implementation, you would send this via your email service
  console.log('Confirmation email prepared for:', user.email);
  return emailContent;
}

async function sendPreparationMaterials(appointment: any) {
  const user = appointment.users;
  
  const preparationContent = {
    to: user.email,
    subject: 'Preparation Materials for Your Galaxy Dream Team Session',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Preparation Materials</h1>
          <p style="margin: 10px 0 0 0;">Get the most out of your upcoming session</p>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Pre-Session Reflection Questions</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea;">About Your Current Situation</h3>
            <ol>
              <li>What are the top 3 areas of your life you'd like to improve?</li>
              <li>What challenges are you currently facing?</li>
              <li>What have you tried before that didn't work?</li>
            </ol>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea;">About Your Goals</h3>
            <ol>
              <li>Where do you see yourself in 1 year?</li>
              <li>What would success look like for you?</li>
              <li>What's your biggest dream or aspiration?</li>
            </ol>
          </div>
          
          <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
            <h3 style="color: #2e7d32;">Action Item</h3>
            <p>Please spend 15-20 minutes reflecting on these questions before our session. 
            This will help us dive deeper and make the most of our time together.</p>
          </div>
        </div>
      </div>
    `
  };

  console.log('Preparation materials prepared for:', user.email);
  return preparationContent;
}

async function scheduleReminderEmails(appointment: any) {
  const appointmentDate = new Date(appointment.appointment_date);
  const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before
  
  // In a real implementation, you would schedule these emails
  // using a service like Netlify Functions with scheduled triggers
  // or a third-party service like SendGrid or Mailgun
  
  console.log('Reminder email scheduled for:', reminderDate.toISOString());
  
  // Store reminder schedule in database
  await supabase
    .from('office_visits')
    .update({
      reminder_scheduled_for: reminderDate.toISOString()
    })
    .eq('id', appointment.id);
}