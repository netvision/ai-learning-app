#!/bin/bash

echo "🚀 AI Learning App - Quick Setup Script"
echo "========================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   brew install postgresql"
    echo "   brew services start postgresql"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if database exists, create if not
if psql -lqt | cut -d \| -f 1 | grep -qw ai_learning_db; then
    echo "✅ Database 'ai_learning_db' already exists"
else
    echo "📦 Creating database 'ai_learning_db'..."
    createdb ai_learning_db
    echo "✅ Database created"
fi

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env with your credentials:"
    echo "   - DATABASE_URL (PostgreSQL connection)"
    echo "   - JWT_SECRET (any random string)"
    echo "   - OPENAI_API_KEY (your OpenAI API key)"
    echo ""
    read -p "Press Enter after you've updated the .env file..."
fi

# Initialize database
echo "🗄️  Initializing database tables..."
npm run init-db

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser"
echo ""
