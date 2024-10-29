#!/bin/bash

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
fi

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
