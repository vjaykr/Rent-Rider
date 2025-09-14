# Firebase Domain Authorization Fix

## Problem
"Domain is not authorized" error when accessing from network devices.

## Solution
Add your network IP to Firebase authorized domains:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your network IP: `192.168.0.200` (replace with your actual IP)
3. Save changes

## Get Your Network IP
```bash
npm run network:ip
```

## Alternative: Use localhost tunneling
```bash
# Install ngrok globally
npm install -g ngrok

# Tunnel your local server
ngrok http 3000
```

Then add the ngrok URL to Firebase authorized domains.