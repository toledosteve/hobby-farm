#!/bin/bash

# Test Authentication Flow
echo "=== Testing NestJS Authentication ==="
echo ""

# Step 1: Register a new user
echo "1. Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@example.com",
    "password": "password123"
  }')

echo "Register Response:"
echo "$REGISTER_RESPONSE" | jq '.'
echo ""

# Extract token from registration (optional - we'll login instead)
# TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken')

# Step 2: Login with the user
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token from login
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed - no token received"
  exit 1
fi

echo "✅ Token received: ${TOKEN:0:50}..."
echo ""

# Step 3: Get user profile with token
echo "3. Getting user profile with token..."
PROFILE_RESPONSE=$(curl -s -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "Profile Response:"
echo "$PROFILE_RESPONSE" | jq '.'
echo ""

# Check if profile was retrieved successfully
if echo "$PROFILE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
  echo "✅ Authentication test successful!"
else
  echo "❌ Failed to get profile - authentication issue"
  exit 1
fi
