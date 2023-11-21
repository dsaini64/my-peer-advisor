from bs4 import BeautifulSoup
import scraping_methods as sm
import sys
import json

with open('html/business.html', 'r') as webpage:
    htmlContent = webpage.read()

soup = BeautifulSoup(htmlContent, 'html.parser')
jsonArray = []
classCode = 'BUSN'

# Locate the first course code, name and description in the html document
for tag in soup.find_all('h3'):
    if tag.get_text() == "70. Contemporary Business Issues":
        firstCodeAndName = tag
        break

for tag in soup.find_all('p'):
    if "An introduction to the nature, forms, and objectives of the contemporary business firm and its relationship" in tag.get_text():
        firstDescription = tag
        break

# Find the remaning tags with course codes, names and descriptions in the html document
otherCodesAndNames = firstCodeAndName.find_next_siblings('h3')
otherDescriptions = firstDescription.find_next_siblings('p')

# Make sure that the two sets have the same number or elements, otherwise abort
if sm.isLengthEqual(otherCodesAndNames, otherDescriptions) == False:
    print("Sets don't contain the same number of elements")
    sys.exit()
    
# Add the first triple of course name, code and description to the json array
temp = sm.add_course_code_and_name(firstCodeAndName.get_text(), classCode)
sm.add_description_field(temp, firstDescription.get_text())
jsonArray.append(temp)

# Add the remaining triples of course names, codes and descriptions to the json array
for (tagCodeAndName, tagDescription) in zip(otherCodesAndNames, otherDescriptions):
    temp = sm.add_course_code_and_name(tagCodeAndName.get_text(), classCode)
    sm.add_description_field(temp, tagDescription.get_text())
    jsonArray.append(temp)

# Add the remaining fields specified in the course_schema.js
for document in jsonArray:
    sm.add_remaining_course_fields(document)

# Write the json array to a file
with open('json/test.json', 'w') as out:
    json.dump(jsonArray, out)

