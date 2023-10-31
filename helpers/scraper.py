from bs4 import BeautifulSoup

with open('anthro.html', 'r') as webdoc:
    htmlContent = webdoc.read()

soup = BeautifulSoup(htmlContent, 'html.parser')

with open('scraper_test.txt', 'w') as out:
    for tag in soup.find_all('h3'):
        temp = tag.get_text()
        out.write(temp)
        out.write("\n")

# for tag in soup.find_all('h3'):
#     temp = tag.get_text()
#     print(temp)


# for tag in soup.find_all('span'):
#     temp = tag.get_text()
#     print(temp)

