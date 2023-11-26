#!/bin/bash

FILE="links.txt"
SAVE_TO="html"

while IFS= read -r line     #  Read the text file line-by-line
do
    # (?<=) is a positive lookbehind
    # /chapter-3/|/chapter-4/|/chapter-5/|/chapter-6/ is the pattern inside the lookbehind, "|" acts like an or
    # [^.] match any character that is not "."
    # + match one or more ocurrences of the preceding character or group
    DEPT_NAME=$(echo "$line" | grep -oP '(?<=/chapter-3/|/chapter-4/|/chapter-5/|/chapter-6/)[^.]+')

    # Use cURL to download the html document
    curl "$line" -o "${SAVE_TO}/${DEPT_NAME}.html"
done < "$FILE"

