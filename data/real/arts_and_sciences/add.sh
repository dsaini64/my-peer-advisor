#!/bin/bash

for file in *.json
do
mongoimport --db tau --collection courses --file "$file" --jsonArray
done


