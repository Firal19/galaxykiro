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
    // Get appointments that need reminders (24 hours before appointment)
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 24);

    const { data: appointments, error } = await supabase
      .from('office_visits')
      .select(`
        *,
        users (
          email,
          full_name,
          preferred_language
        )
      `)
      .eq('status', 'scheduled')
      .is('reminder_sent_at', null)
      .gte('appointment_date', new Date().toISOString())
      .lte('appointment_date', reminderTime.toISOString());

    if (error) {
      throw error;
    }

    let remindersSent = 0;

    for (const appointment of appointments || []) {
      try {
        await sendReminderEmail(appointment);
        
        // Update reminder sent timestamp
        await supabase
          .from('office_visits')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', appointment.id);

        remindersSent++;
      } catch (err) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        remindersSent,
        message: `Sent ${remindersSent} appointment reminders`
      })
    };

  } catch (error) {
    console.error('Error in office visit reminder:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function sendReminderEmail(appointment: any) {
  const user = appointment.users;
  const appointmentDate = new Date(appointment.appointment_date);
  const isAmharic = appointment.preferred_language === 'am';

  const emailContent = {
    to: user.email,
    subject: isAmharic 
      ? 'የእርስዎ Galaxy Dream Team ቀጠሮ ነገ ነው! 🌟'
      : 'Your Galaxy Dream Team Appointment is Tomorrow! 🌟',
    html: isAmharic ? getAmharicReminderTemplate(appointment, appointmentDate) : getEnglishReminderTemplate(appointment, appointmentDate)
  };

  // In a real implementation, send via your email service
  console.log('Reminder email prepared for:', user.email);
  return emailContent;
}

function getEnglishReminderTemplate(appointment: any, appointmentDate: Date) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Galaxy Dream Team</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your appointment is tomorrow!</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">Appointment Reminder ⏰</h2>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">Tomorrow's Appointment</h3>
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
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #155724; margin-top: 0;">Final Preparation Checklist</h3>
          <ul style="margin: 0; padding-left: 20px; color: #155724;">
            <li>Arrive 10 minutes early</li>
            <li>Bring your reflection questions (sent earlier)</li>
            <li>Bring a notebook and pen</li>
            <li>Come with specific goals you want to discuss</li>
            <li>Bring any questions about your personal development</li>
          </ul>
        </div>
        
        <div style="background: #cce5ff; border: 1px solid #99d6ff; padding: 20px; border-radius: 8px;">
          <h3 style="color: #004085; margin-top: 0;">What to Expect</h3>
          <ul style="margin: 0; padding-left: 20px; color: #004085;">
            <li>Comprehensive assessment of your current situation</li>
            <li>Personalized development plan creation</li>
            <li>Goal setting and priority identification</li>
            <li>Resource recommendations tailored to you</li>
            <li>90-day action plan with specific steps</li>
          </ul>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">Need to reschedule? Contact us at ${appointment.office_phone}</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">We're excited to see you tomorrow!</p>
      </div>
    </div>
  `;
}

function getAmharicReminderTemplate(appointment: any, appointmentDate: Date) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Galaxy Dream Team</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">የእርስዎ ቀጠሮ ነገ ነው!</p>
      </div>
      
      <div style="padding: 30px; background: #f8f9fa;">
        <h2 style="color: #333; margin-bottom: 20px;">የቀጠሮ ማስታወሻ ⏰</h2>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">የነገ ቀጠሮ</h3>
          <p><strong>ቀን:</strong> ${appointmentDate.toLocaleDateString('am-ET', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p><strong>ሰዓት:</strong> ${appointmentDate.toLocaleTimeString('am-ET', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          })}</p>
          <p><strong>ቢሮ:</strong> ${appointment.office_location}</p>
          <p><strong>አድራሻ:</strong> ${appointment.office_address}</p>
          <p><strong>ስልክ:</strong> ${appointment.office_phone}</p>
        </div>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #155724; margin-top: 0;">የመጨረሻ ዝግጅት ዝርዝር</h3>
          <ul style="margin: 0; padding-left: 20px; color: #155724;">
            <li>10 ደቂቃ ቀደም ብለው ይምጡ</li>
            <li>የማሰብ ጥያቄዎችዎን ይዘው ይምጡ</li>
            <li>ማስታወሻ ደብተር እና እስክሪብቶ ይዘው ይምጡ</li>
            <li>ለመወያየት የሚፈልጓቸውን ግቦች ይዘው ይምጡ</li>
            <li>ስለ ግላዊ እድገትዎ ጥያቄዎች ይዘው ይምጡ</li>
          </ul>
        </div>
      </div>
      
      <div style="background: #333; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0;">ቀጠሮ መቀየር ከፈለጉ በ ${appointment.office_phone} ያግኙን</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">ነገ እርስዎን ለማየት በጣም ተጓጉተናል!</p>
      </div>
    </div>
  `;
}