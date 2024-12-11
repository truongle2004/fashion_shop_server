import requests

def fetch_html(url):
    """
    Fetches the HTML content of a given URL.
    """
    response = requests.get(url)
    if response.status_code == 200:
        return response.text
    else:
        print("Failed to retrieve the page. Status code:", response.status_code)
        return None
