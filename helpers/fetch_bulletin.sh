#!/bin/bash

curl https://www.scu.edu/bulletin/undergraduate/ -o bulletin.html

if [ $? -ne 0 ]; then
	echo "Failed to get the website!"
	exit 1
fi

