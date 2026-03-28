import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

sender_email = "heshankoralagamage2002@gmail.com"
sender_password = "icdw hhch rjpm jfrr"

msg = MIMEMultipart()
msg['From'] = sender_email
msg['To'] = sender_email  # Send to self for testing
msg['Subject'] = "Test Email with Spaces"

body = "This is a test email."
msg.attach(MIMEText(body, 'plain'))

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(sender_email, sender_password)
    server.send_message(msg)
    server.quit()
    print("Email sent successfully with spaces!")
except Exception as e:
    print(f"Failed to send email with spaces: {type(e).__name__}: {str(e)}")
    sys.exit(1)
