#!/bin/bash

FILE="links.txt"
SAVE_TO="html"

mkdir -p "$SAVE_TO"

while IFS= read -r line
do
    # Extract the department code from the URL
    DEPT_CODE=$(echo "$line" | grep -oP '(?<=/chapter-3/|/chapter-4/|/chapter-5/|/chapter-6/)[^/]+')

    # Use curl to download the content
    curl -s "$line" -o "${SAVE_TO}/${DEPT_CODE}.html"
done < "$FILE"