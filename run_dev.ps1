# BLUCE LOCK - Launcher Script for SIH Presentation
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "BLUCE LOCK - National Cybercrime Forensics Intelligence" -ForegroundColor White
Write-Host "Real-Time Crypto Fraud Attribution & VASP Platform" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend in background job
Write-Host "[1/2] Launching Python FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location -Path $using:PSScriptRoot\backend
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
}

Start-Sleep -Seconds 2

# 2. Start React + Vite Frontend
Write-Host "[2/2] Launching Vite Frontend on http://localhost:5173..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot\frontend"
npm run dev
