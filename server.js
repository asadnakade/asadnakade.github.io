const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// SendGrid setup
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// MIME types for static files
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.ico': 'image/x-icon'
};

// Server setup
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Handle email API endpoint
    if (pathname === '/api/send-email' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const formData = JSON.parse(body);
                
                // Validate required fields
                if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
                    return;
                }
                
                // Prepare email content
                const emailHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>New Portfolio Contact Message</title>
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
                
                // Send email using SendGrid
                const msg = {
                    to: 'asadnakade1@gmail.com',
                    from: 'asadnakade1@gmail.com', // Use your own email as sender
                    replyTo: formData.email,
                    subject: `Portfolio Contact: ${formData.subject}`,
                    html: emailHtml,
                    text: `
New message from ${formData.name} (${formData.email}):

Subject: ${formData.subject}

Message:
${formData.message}

Sent at: ${new Date().toLocaleString()}
                    `
                };
                
                try {
                    await sgMail.send(msg);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Email sent successfully' }));
                    
                    console.log(`Email sent successfully from ${formData.name} (${formData.email})`);
                } catch (sendGridError) {
                    // If SendGrid fails, log the message and still show success to user
                    console.log('SendGrid sending failed, but message was received:');
                    console.log(`From: ${formData.name} (${formData.email})`);
                    console.log(`Subject: ${formData.subject}`);
                    console.log(`Message: ${formData.message}`);
                    console.log(`Timestamp: ${new Date().toLocaleString()}`);
                    console.log('-------------------');
                    
                    // Store message to file as backup
                    const messageLog = `
=== NEW CONTACT FORM MESSAGE ===
From: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}
Message: ${formData.message}
Timestamp: ${new Date().toLocaleString()}
================================

`;
                    
                    fs.appendFileSync('contact-messages.txt', messageLog);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: true, message: 'Message received successfully' }));
                    
                    console.log('Message saved to contact-messages.txt file');
                }
                
            } catch (error) {
                console.error('Email sending error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Failed to send email' }));
            }
        });
        
        return;
    }
    
    // Handle admin messages view
    if (pathname === '/admin/messages' && req.method === 'GET') {
        try {
            const messages = fs.readFileSync('contact-messages.txt', 'utf8');
            const htmlResponse = `
<!DOCTYPE html>
<html>
<head>
    <title>Portfolio Contact Messages</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .message { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        .header { background: #667eea; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Portfolio Contact Messages</h1>
            <p>All messages received through your portfolio contact form</p>
        </div>
        <div class="message">
            <pre>${messages || 'No messages yet'}</pre>
        </div>
    </div>
</body>
</html>
            `;
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(htmlResponse);
        } catch (error) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>No messages file found</h1><p>No contact messages have been received yet.</p>');
        }
        return;
    }
    
    // Serve static files
    let filePath = pathname === '/' ? './index.html' : `.${pathname}`;
    const extname = path.extname(filePath);
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - Page Not Found</h1>');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running on port ${PORT}`);
    console.log('Contact form email functionality is active');
});