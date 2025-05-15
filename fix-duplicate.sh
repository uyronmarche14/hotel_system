#!/bin/bash
# Script to fix duplicate variable declaration in the availability page
FILE="/home/ronmarche14/code/hotelproject/hotel_system/app/(main)/hotelRoomDetails/[category]/[roomId]/availability/page.tsx"
# Delete the duplicate line (the original one that doesn't use String())
sed -i '105d' "$FILE"
echo "Removed duplicate apiBase declaration from $FILE"
