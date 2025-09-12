#!/bin/bash

# Test script for Registration and OTP flow

BASE_URL="http://localhost:5001/api"
PHONE="9$(date +%s | tail -c 10)" # Generate unique 10-digit phone number
EMAIL="testuser$(date +%s)@example.com"

echo "🧪 Testing Registration and OTP Flow"
echo "=================================="

# Test 1: Send OTP
echo "📱 Step 1: Sending OTP to ${PHONE}"
OTP_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/send-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"${PHONE}\"}")

echo "Response: ${OTP_RESPONSE}"

# Extract OTP from response (for demo mode)
if echo "${OTP_RESPONSE}" | grep -q "demoMode"; then
  echo "✅ OTP sent successfully (Demo mode)"
else
  echo "❌ Failed to send OTP"
  exit 1
fi

# Test 2: Verify OTP (Demo mode)
echo -e "\n🔐 Step 2: Verifying OTP (Demo: 123456)"
VERIFY_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"${PHONE}\", \"otp\": \"123456\"}")

echo "Response: ${VERIFY_RESPONSE}"

if echo "${VERIFY_RESPONSE}" | grep -q "success.*true"; then
  echo "✅ OTP verified successfully"
else
  echo "❌ OTP verification failed"
  exit 1
fi

# Test 3: Register user
echo -e "\n👤 Step 3: Registering user"
REGISTER_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"firstName\": \"Test\",
    \"lastName\": \"User\",
    \"email\": \"${EMAIL}\",
    \"phone\": \"${PHONE}\",
    \"password\": \"password123\",
    \"role\": \"customer\",
    \"otp\": \"123456\"
  }")

echo "Response: ${REGISTER_RESPONSE}"

if echo "${REGISTER_RESPONSE}" | grep -q "success.*true"; then
  echo "✅ User registered successfully"
  
  # Extract token for further tests
  TOKEN=$(echo "${REGISTER_RESPONSE}" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  
  if [ -n "${TOKEN}" ]; then
    echo "🔑 Token received: ${TOKEN:0:50}..."
    
    # Test 4: Get user profile
    echo -e "\n👤 Step 4: Getting user profile"
    PROFILE_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/profile" \
      -H "Authorization: Bearer ${TOKEN}")
    
    echo "Response: ${PROFILE_RESPONSE}"
    
    if echo "${PROFILE_RESPONSE}" | grep -q "success.*true"; then
      echo "✅ Profile retrieved successfully"
    else
      echo "❌ Failed to retrieve profile"
    fi
  fi
else
  echo "❌ User registration failed"
fi

echo -e "\n🎉 Test completed!"
