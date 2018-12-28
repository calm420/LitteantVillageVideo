#! /bin/bash
while true; do
    {
        node LitteantVideoServer.js
        echo "LitteantVideoServer stopped unexpected, restarting"
    }
    sleep 1
done