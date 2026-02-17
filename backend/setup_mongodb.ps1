# MongoDB Setup Script for FutureSkillsSyntax
# This script helps you configure MongoDB Atlas connection

Write-Host "MongoDB Atlas Setup for FutureSkillsSyntax" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found .env file" -ForegroundColor Green
Write-Host ""

# Prompt for MongoDB password
Write-Host "Please enter your MongoDB Atlas password:" -ForegroundColor Yellow
Write-Host "(This is the password for user: careernig24)" -ForegroundColor Gray
$password = Read-Host -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

if ([string]::IsNullOrWhiteSpace($passwordPlain)) {
    Write-Host "Error: Password cannot be empty!" -ForegroundColor Red
    exit 1
}

# Read .env file
$envContent = Get-Content ".env" -Raw

# Replace the placeholder with actual password
$newContent = $envContent -replace 'MONGODB_URI=mongodb\+srv://careernig24:YOUR_ACTUAL_PASSWORD@', "MONGODB_URI=mongodb+srv://careernig24:$passwordPlain@"

# Write back to .env
Set-Content ".env" -Value $newContent -NoNewline

Write-Host ""
Write-Host "MongoDB password configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Verify MongoDB Atlas network access (IP whitelist)" -ForegroundColor White
Write-Host "2. Start the backend server: uvicorn app.main:app --reload" -ForegroundColor White
Write-Host "3. Check logs for 'MongoDB connected - Goals system ready'" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see MONGODB_SETUP_GUIDE.md" -ForegroundColor Gray
