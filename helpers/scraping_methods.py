import html
from urllib.parse import urljoin
import re

# Get rid of weird characters in the scrapped text
def clean_string(courseString):
    courseString = courseString.replace('\xa0', ' ')
    courseString = courseString.replace('\r', ' ')
    courseString = courseString.replace('\n', ' ')
    courseString = courseString.replace('\t', ' ')
    courseString = html.unescape(courseString)

    return courseString

# A courseString has the form "4. Geology and Botany",
# we want to transform this into "ANTH 4" and "Geology and Botany"
# where the former is the class code and the later is the class name
def add_course_code_and_name(courseString, codeString):
    # courseList = courseString.split('. ', 1)
    courseList = re.split(r"\. |: ", courseString, maxsplit=1)

    if len(courseList) != 2:
        print(f"Something went wrong with the course string: {courseString}")
        return

    classCode = codeString + ' ' + courseList[0].strip()
    classCode = clean_string(classCode)
    courseName = courseList[1].strip()
    courseName = clean_string(courseName)

    courseJSON = {"courseName": courseName, "classCode": classCode}

    return courseJSON

# This function takes the output of add_course_code_and_name()
# and adds the description field
def add_description_field(courseJSON, description):
    description = description.strip()
    description = clean_string(description)

    courseJSON['description'] = description

    return courseJSON

# This function takes the output of add_description_field
# and adds the remaining fields of the course_schema.js
# with their default values
def add_remaining_course_fields(courseJSON):
    courseJSON['professors'] = []
    courseJSON['ratingCount'] = 0
    courseJSON['ratingTotal'] = 0
    courseJSON['quarterAvailability'] = []
    courseJSON['tags'] = []
    courseJSON['rating'] = None

# Check if two bs4.element.ResultSet have the same number of tags
def isLengthEqual(setOne, setTwo):
    return (len(setOne) == len(setTwo))

# Joins the absolute URL with the relative URL
# relative URLs look like ./chapter-4/marketing.html#5e445d7bc235
def createAbsoluteURL(base, relative):
    absoluteURL = urljoin(base, relative)
    return absoluteURL

