#!/bin/bash
# Script to fix TypeScript error in the availability page
FILE="/home/ronmarche14/code/hotelproject/hotel_system/app/(main)/hotelRoomDetails/[category]/[roomId]/availability/page.tsx"
LINE_NUM=105
# Replace the problematic line with a safe string conversion
sed -i "${LINE_NUM}s/.*/      const apiBase = String(API_URL).endsWith(\"\\/\") ? String(API_URL).slice(0, -1) : String(API_URL);/" "$FILE"
echo "Fix applied to $FILE at line $LINE_NUM"
