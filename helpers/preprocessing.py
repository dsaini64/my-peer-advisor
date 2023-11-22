from bs4 import BeautifulSoup, NavigableString

def merge_paragraphs(soup):
    for h3_tag in soup.find_all('h3'):
        next_tag = h3_tag.find_next_sibling()

        # Collect all the p tags until the next h3 tag
        p_tags = []
        while next_tag and next_tag.name != 'h3':
            if next_tag.name == 'p':
                p_tags.append(next_tag)
            next_tag = next_tag.find_next_sibling()

        # If there's more than one p tag, merge their contents
        if len(p_tags) > 1:
            merged_text = ' '.join(p.get_text() for p in p_tags)

            # Create a new p tag with the merged text
            new_p_tag = soup.new_tag('p')
            new_p_tag.string = merged_text

            # Replace the first p tag with the new merged p tag and delete the others
            h3_tag.insert_after(new_p_tag)
            for p in p_tags:
                p.decompose()

with open('html/university-honors-program.html', 'r') as webpage:
    html_content = webpage.read()

soup = BeautifulSoup(html_content, 'html.parser')
merge_paragraphs(soup)

# Write the modified HTML back to the file
with open('html/university-honors-program.html', 'w') as file:
    file.write(str(soup))