#!/bin/bash

for file in *.json
do
mongoimport --db omega --collection courses --file "$file" --jsonArray
done


