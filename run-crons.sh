#!/bin/bash

# Set the base URL for your local development server
BASE_URL="http://localhost:3000/api/cron"

# Function to call a cron route
call_cron() {
    echo "Calling $1..."
    curl -X POST "$BASE_URL/$1"
    echo ""
}

# Main loop
while true; do
    call_cron "communityEngagement"
    call_cron "dataCollectors"
    call_cron "formDataCollector"
    call_cron "generateMedias"
    call_cron "sendNotifications"
    
    echo "Waiting for 2 minutes..."
    sleep 120
done
