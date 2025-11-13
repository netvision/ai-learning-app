Write-Host "AI Learning App - Quick Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find PostgreSQL installation
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $psqlPath) {
    # Check common installation paths
    $pgPaths = @(
        "C:\Program Files\PostgreSQL\18\bin",
        "C:\Program Files\PostgreSQL\17\bin",
        "C:\Program Files\PostgreSQL\16\bin",
        "C:\Program Files\PostgreSQL\15\bin"
    )
    
    foreach ($path in $pgPaths) {
        if (Test-Path "$path\psql.exe") {
            $env:Path += ";$path"
            Write-Host "Found PostgreSQL at $path" -ForegroundColor Green
            break
        }
    }
    
    # Check again after adding to PATH
    $psqlPath = Get-Command psql -ErrorAction SilentlyContinue
    if (-not $psqlPath) {
        Write-Host "PostgreSQL is not installed. Please install it first:" -ForegroundColor Red
        Write-Host "   Download from: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "PostgreSQL found" -ForegroundColor Green

$dbExists = & psql -U postgres -lqt 2>$null | Select-String -Pattern "ai_learning_db" -Quiet
if ($dbExists) {
    Write-Host "Database 'ai_learning_db' already exists" -ForegroundColor Green
}
else {
    Write-Host "Creating database 'ai_learning_db'..." -ForegroundColor Yellow
    & createdb -U postgres ai_learning_db 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database created" -ForegroundColor Green
    }
    else {
        Write-Host "Failed to create database. Please create it manually." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Setting up backend..." -ForegroundColor Cyan
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "Backend dependencies already installed" -ForegroundColor Green
}

if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "IMPORTANT: Edit backend\.env with your credentials" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after updating the .env file"
}
else {
    Write-Host ".env file already exists" -ForegroundColor Green
}

Write-Host "Initializing database tables..." -ForegroundColor Cyan
npm run init-db

Write-Host ""
Write-Host "Setting up frontend..." -ForegroundColor Cyan
Set-Location ../frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}
else {
    Write-Host "Frontend dependencies already installed" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd backend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open http://localhost:5173 in your browser" -ForegroundColor Cyan
