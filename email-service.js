// Email service using SendGrid
class EmailService {
    constructor() {
        this.apiKey = process.env.SENDGRID_API_KEY;
        this.apiUrl = 'https://api.sendgrid.com/v3/mail/send';
    }

    async sendContactFormEmail(formData) {
        const emailData = {
            personalizations: [{
                to: [{
                    email: 'asadnakade1@gmail.com',
                    name: 'Asad Nakade'
                }],
                subject: `Portfolio Contact: ${formData.subject}`
            }],
            from: {
                email: 'noreply@portfolio.com',
                name: 'Portfolio Contact Form'
            },
            content: [{
                type: 'text/html',
                value: this.generateEmailTemplate(formData)
            }]
        };

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (response.ok) {
                return { success: true, message: 'Email sent successfully' };
            } else {
                const error = await response.text();
                console.error('SendGrid API Error:', error);
                return { success: false, message: 'Failed to send email' };
            }
        } catch (error) {
            console.error('Email sending error:', error);
            return { success: false, message: 'Network error occurred' };
        }
    }

    generateEmailTemplate(formData) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>New Contact Form Message</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                    .field { margin-bottom: 15px; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #667eea; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>New Message from Portfolio Contact Form</h2>
                    </div>
                    <div class="content">
                        <div class="field">
                            <div class="label">From:</div>
                            <div class="value">${formData.name}</div>
                        </div>
                        <div class="field">
                            <div class="label">Email:</div>
                            <div class="value">${formData.email}</div>
                        </div>
                        <div class="field">
                            <div class="label">Subject:</div>
                            <div class="value">${formData.subject}</div>
                        </div>
                        <div class="field">
                            <div class="label">Message:</div>
                            <div class="value">${formData.message.replace(/\n/g, '<br>')}</div>
                        </div>
                        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 12px;">
                            This message was sent from your portfolio contact form at ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}