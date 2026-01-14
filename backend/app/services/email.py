"""Email service for sending transactional emails."""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """SMTP-based email service."""
    
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAIL_FROM
        self.from_name = settings.EMAIL_FROM_NAME
    
    @property
    def is_configured(self) -> bool:
        """Check if email is configured."""
        return all([
            self.smtp_host,
            self.smtp_port,
            self.smtp_user,
            self.smtp_password,
            self.from_email
        ])
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email."""
        if not self.is_configured:
            logger.warning("Email not configured, skipping send")
            return False
        
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"{self.from_name} <{self.from_email}>"
            msg["To"] = to_email
            
            if text_content:
                msg.attach(MIMEText(text_content, "plain"))
            
            msg.attach(MIMEText(html_content, "html"))
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.sendmail(self.from_email, to_email, msg.as_string())
            
            logger.info(f"Email sent to {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            return False
    
    async def send_verification_email(
        self,
        to_email: str,
        to_name: str,
        verification_token: str
    ) -> bool:
        """Send email verification link."""
        verification_url = f"https://app.onaaseyori.com/verify-email?token={verification_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #6366f1, #a855f7); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .footer {{ text-align: center; color: #666; font-size: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to OnaAseyori! 🚀</h1>
                </div>
                <div class="content">
                    <p>Hi {to_name},</p>
                    <p>Thank you for joining OnaAseyori! Please verify your email address to get started on your learning journey.</p>
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="button">Verify Email Address</a>
                    </div>
                    <p>Or copy this link: {verification_url}</p>
                    <p>This link expires in 24 hours.</p>
                </div>
                <div class="footer">
                    <p>© 2026 OnaAseyori. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Verify your email - OnaAseyori",
            html_content=html_content
        )
    
    async def send_password_reset_email(
        self,
        to_email: str,
        to_name: str,
        reset_token: str
    ) -> bool:
        """Send password reset link."""
        reset_url = f"https://app.onaaseyori.com/reset-password?token={reset_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: #1f2937; padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .button {{ display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }}
                .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset</h1>
                </div>
                <div class="content">
                    <p>Hi {to_name},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </div>
                    <div class="warning">
                        <strong>⚠️ Security Notice:</strong> This link expires in 1 hour. If you didn't request this, please ignore this email.
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(
            to_email=to_email,
            subject="Reset your password - OnaAseyori",
            html_content=html_content
        )
    
    async def send_session_reminder(
        self,
        to_email: str,
        to_name: str,
        session_title: str,
        session_date: str,
        meeting_url: str
    ) -> bool:
        """Send mentorship session reminder."""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #6366f1, #a855f7); padding: 30px; text-align: center; color: white; border-radius: 8px 8px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
                .session-card {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
                .button {{ display: inline-block; background: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Session Reminder</h1>
                </div>
                <div class="content">
                    <p>Hi {to_name},</p>
                    <p>Your mentorship session is coming up soon!</p>
                    <div class="session-card">
                        <h3>{session_title}</h3>
                        <p>🕐 <strong>{session_date}</strong></p>
                    </div>
                    <div style="text-align: center;">
                        <a href="{meeting_url}" class="button">Join Session</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        return await self.send_email(
            to_email=to_email,
            subject=f"Reminder: {session_title} - OnaAseyori",
            html_content=html_content
        )
