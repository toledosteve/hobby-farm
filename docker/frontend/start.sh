#!/bin/sh
set -e

cd /usr/app

# Install deps inside docker volume
npm install

# Run Vite in development mode without opening the browser
npm run dev -- --no-open --host 0.0.0.0