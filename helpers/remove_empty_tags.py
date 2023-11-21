from bs4 import BeautifulSoup

def is_tag_empty(tag):
    return not tag.get_text().strip()

with open('html/business.html', 'r') as webpage:
    html_content = webpage.read()

soup = BeautifulSoup(html_content, 'html.parser')

# First remove all empty <span> tags
for tag in soup.find_all('span'):
    if is_tag_empty(tag):
        tag.decompose()

# Second remove all empty <p> tags
for tag in soup.find_all('p'):
    if is_tag_empty(tag):
        tag.decompose()

# Third remove all empty <h3> tags
for tag in soup.find_all('h3'):
    if is_tag_empty(tag):
        tag.decompose()

# Save the changes to the file
with open('html/business.html', 'w') as webpage:
    webpage.write(str(soup))

