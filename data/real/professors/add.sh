#!/bin/bash

for file in *.json
do
mongoimport --db omega --collection professors --file "$file" --jsonArray
done


