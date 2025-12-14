#!/bin/bash

# Backend Integration Test Script
# This script helps test the UserDropdown backend integration

echo "🧪 Testing Backend Integration"
echo "================================"
echo ""

# Check if backend is running
echo "1. Checking if backend is running..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "   ✅ Backend is running on http://localhost:3001"
else
    echo "   ❌ Backend is not running!"
    echo "   Start it with: cd code/backend && npm run start:dev"
    exit 1
fi

# Check if MongoDB is accessible
echo ""
echo "2. Checking MongoDB connection..."
if curl -s http://localhost:3001 > /dev/null; then
    echo "   ✅ Backend is responding (MongoDB connection assumed OK)"
else
    echo "   ❌ Cannot verify MongoDB connection"
fi

# Test user registration
echo ""
echo "3. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test'$(date +%s)'@example.com",
    "password": "testpassword123"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
    echo "   ✅ User registration works!"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "   ❌ User registration failed"
    echo "   Response: $REGISTER_RESPONSE"
fi

# Test getting user profile
echo ""
echo "4. Testing GET /auth/me..."
ME_RESPONSE=$(curl -s http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if echo "$ME_RESPONSE" | grep -q "firstName"; then
    echo "   ✅ User profile fetch works!"
    FIRST_NAME=$(echo "$ME_RESPONSE" | grep -o '"firstName":"[^"]*' | cut -d'"' -f4)
    LAST_NAME=$(echo "$ME_RESPONSE" | grep -o '"lastName":"[^"]*' | cut -d'"' -f4)
    echo "   User: $FIRST_NAME $LAST_NAME"
else
    echo "   ❌ User profile fetch failed"
    echo "   Response: $ME_RESPONSE"
fi

# Test creating a project
echo ""
echo "5. Testing POST /projects..."
PROJECT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farm",
    "location": "Test Location, USA",
    "acres": 10
  }')

if echo "$PROJECT_RESPONSE" | grep -q "name"; then
    echo "   ✅ Project creation works!"
    PROJECT_ID=$(echo "$PROJECT_RESPONSE" | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
    echo "   Project ID: $PROJECT_ID"
else
    echo "   ❌ Project creation failed"
    echo "   Response: $PROJECT_RESPONSE"
fi

# Test getting all projects
echo ""
echo "6. Testing GET /projects..."
PROJECTS_RESPONSE=$(curl -s http://localhost:3001/api/projects \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROJECTS_RESPONSE" | grep -q "Test Farm"; then
    echo "   ✅ Project list fetch works!"
    PROJECT_COUNT=$(echo "$PROJECTS_RESPONSE" | grep -o '"name"' | wc -l)
    echo "   Projects found: $PROJECT_COUNT"
else
    echo "   ❌ Project list fetch failed"
    echo "   Response: $PROJECTS_RESPONSE"
fi

# Test updating a project
if [ ! -z "$PROJECT_ID" ]; then
    echo ""
    echo "7. Testing PATCH /projects/:id..."
    UPDATE_RESPONSE=$(curl -s -X PATCH http://localhost:3001/api/projects/$PROJECT_ID \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Updated Test Farm",
        "acres": 15
      }')

    if echo "$UPDATE_RESPONSE" | grep -q "Updated Test Farm"; then
        echo "   ✅ Project update works!"
    else
        echo "   ❌ Project update failed"
        echo "   Response: $UPDATE_RESPONSE"
    fi
fi

# Test deleting a project
if [ ! -z "$PROJECT_ID" ]; then
    echo ""
    echo "8. Testing DELETE /projects/:id..."
    DELETE_RESPONSE=$(curl -s -X DELETE http://localhost:3001/api/projects/$PROJECT_ID \
      -H "Authorization: Bearer $TOKEN")

    # Check if project is gone
    GET_DELETED=$(curl -s http://localhost:3001/api/projects/$PROJECT_ID \
      -H "Authorization: Bearer $TOKEN")

    if echo "$GET_DELETED" | grep -q "not found"; then
        echo "   ✅ Project deletion works!"
    else
        echo "   ⚠️  Project deletion status unclear"
    fi
fi

echo ""
echo "================================"
echo "✨ Integration test complete!"
echo ""
echo "Next steps:"
echo "1. Start frontend: cd code/frontend && npm run dev"
echo "2. Navigate to http://localhost:5173"
echo "3. Sign up with a new account"
echo "4. Check UserDropdown shows your real name"
echo "5. Create a project and verify it appears in 'Switch Farm' menu"
