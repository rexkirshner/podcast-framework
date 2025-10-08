/**
 * Test Email Configuration
 *
 * Verifies that Resend is configured correctly and can send emails
 * from the verified domain (noreply.strangewater.xyz)
 *
 * Usage: node scripts/test-email.js
 */

import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  console.log('🧪 Testing Email Configuration\n');

  // Check environment variables
  console.log('Environment Variables:');
  console.log(`  RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  RESEND_FROM_EMAIL: ${process.env.RESEND_FROM_EMAIL || '❌ Missing'}`);
  console.log(`  NOTIFICATION_EMAIL: ${process.env.NOTIFICATION_EMAIL || '❌ Missing'}\n`);

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Missing RESEND_API_KEY');
    process.exit(1);
  }

  try {
    console.log('📧 Sending test email...');

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'contribution@noreply.strangewater.xyz',
      to: process.env.NOTIFICATION_EMAIL || 'swrequests@rexkirshner.com',
      subject: '[TEST] Email Configuration Test',
      html: `
        <h1>Email Configuration Test</h1>
        <p>This is a test email to verify Resend configuration.</p>
        <p><strong>From:</strong> ${process.env.RESEND_FROM_EMAIL}</p>
        <p><strong>To:</strong> ${process.env.NOTIFICATION_EMAIL}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p>If you receive this email, the configuration is working correctly! ✅</p>
      `,
    });

    console.log('\n✅ Email sent successfully!');
    console.log('Result:', result);
    console.log('\n📬 Check your inbox at:', process.env.NOTIFICATION_EMAIL);

  } catch (error) {
    console.error('\n❌ Email sending failed:');
    console.error('Error:', error.message);

    if (error.message?.includes('403')) {
      console.error('\n💡 This usually means:');
      console.error('   - Domain not verified in Resend');
      console.error('   - API key doesn\'t have permission');
      console.error('   - From email doesn\'t match verified domain');
      console.error('\n🔗 Verify domain at: https://resend.com/domains');
    }

    process.exit(1);
  }
}

testEmail();
