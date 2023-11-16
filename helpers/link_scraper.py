from bs4 import BeautifulSoup
import scraping_methods as sm

with open('html/bulletin.html', 'r') as webpage:
    htmlContent = webpage.read()

soup = BeautifulSoup(htmlContent, 'html.parser')
relativeLinks = []
absoluteLinks = []
baseURL = "https://www.scu.edu/bulletin/undergraduate/"

# Get all relative links from html
for link in soup.find_all('a'):
    # print(link.get('href'))
    relativeLinks.append(link.get('href'))

# Filter for the relative links that can have class information
relativeLinks = [link for link in relativeLinks if link.startswith('./chapter-3')
                                                        or link.startswith('./chapter-4')
                                                        or link.startswith('./chapter-5')
                                                        or link.startswith('./chapter-6')]

# Generate the array with the absolute links
for link in relativeLinks:
    absoluteLinks.append(sm.createAbsoluteURL(baseURL, link))

# Put the absolute links in a text file
with open('links.txt', 'w') as out:
    for link in absoluteLinks:
        out.write(link)
        out.write('\n')

