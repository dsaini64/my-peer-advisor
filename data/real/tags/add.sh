#!/bin/bash

for file in *.json
do
mongoimport --db omega --collection tags --file "$file" --jsonArray
done


