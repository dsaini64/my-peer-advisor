#!/bin/bash

for file in *.json
do
mongoimport --db tau --collection tags --file "$file" --jsonArray
done


