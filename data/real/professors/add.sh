#!/bin/bash

for file in *.json
do
mongoimport --db tau --collection professors --file "$file" --jsonArray
done


