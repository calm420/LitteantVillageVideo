#! /bin/bash
while true; do
    {
        node LitteantVideoServer.js
        echo "webrtc_to_rtmp_server stopped unexpected, restarting"
    }
    sleep 1
done