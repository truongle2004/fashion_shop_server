from utils import fetch_html
import json
from bs4 import BeautifulSoup # type: ignore
from slugify import slugify
import re
import os


# TODO: get color

url_base = "https://marc.com.vn"
url_category = "https://marc.com.vn/collections/all"
url_detail_product = "https://marc.com.vn/products"
url_product_ao_thun_nu = "https://marc.com.vn/collections/ao-thun-nu"

defaultSizes = ["S", "M", "L", "XL"]

defaultCategories = {
    "SIGNATURE": 1,
    "Back in stock": 2,
    "Áo kiểu": 3,
    "Áo thun": 4,
    "Đầm": 5,
    "Quần": 6,
    "Váy": 7,
}


set_name = set()


products = []


def split_money(text):
    price = text[:-1]
    currency = text[-1]

    price = price.replace(",", "")

    if price is not None and currency is not None:
        return {"currency": currency, "price": int(price)}

    return {"currency": "", "price": None}


def clean_text(text):
    """
    Remove non-breaking spaces from text. (&nbsp;)
    """
    # Replace non-breaking spaces with regular spaces
    return text.replace("\xa0", " ")


def parse_category_data(html_content):
    soup = BeautifulSoup(html_content, "html.parser")
    categories = soup.find_all(class_="category-item")

    if categories:
        for category in categories:
            all_a_tag = category.select("a")

            # Get url from attribute
            if all_a_tag:

                urls = set()
                for i in all_a_tag:
                    urls.add(i["href"])

                for url in urls:

                    html_content = fetch_html(url)

                    print("Current Url " + url)

                    if html_content is None:
                        continue

                    if html_content:
                        products = parse_product_details(
                            html_content, category.get_text(strip=True)
                        )

                        # display_products(products)


# FIX: cannot handle non-ascii characters


def to_slug(text):
    """
    Converts a Vietnamese string to a URL-friendly slug.
    """

    text = slugify(text)

    return text


def split_description(
    text,
):  # Regular expression to match .-, . -, and - with optional surrounding whitespace
    sentences = re.split(r"\.\s*-\s*|-\s*", text)
    # Strip whitespace from each sentence and remove any empty strings
    split_sentences = [
        {"description": clean_text(sentence.strip())}
        for sentence in sentences
        if sentence.strip()
    ]
    return split_sentences


def parse_product_details(html_content, category):
    """
    Parses the HTML content and extracts details of each product with class 'product-detail'.
    """
    soup = BeautifulSoup(html_content, "html.parser")

    product_details = soup.find_all(class_="product-detail")

    for product in product_details:
        a_tag = product.find_all("a", href=True)

        a_tag_href = set()

        for i in a_tag:
            a_tag_href.add(url_base + i["href"])

        for url in a_tag_href:

            print("URL from a tag: " + url)

            try:

                print("Starting fetching detail")
                data_detail = fetch_html(url)

                html_content = BeautifulSoup(data_detail, "html.parser")

                title_element = html_content.select_one(".product-title h1")
                title = (
                    title_element.get_text(strip=True)
                    if title_element
                    else "Product name not found"
                )

                # making sure all product name is unique
                if title in set_name:
                    continue

                set_name.add(title)

                image_list = html_content.select_one("ul.list-images")

                images_color = []
                if image_list:
                    images_color = [
                        {"url": li["data-image"], "color": li.get("data-title", "")}
                        for li in image_list.select("li")
                        if li.has_attr("data-image")
                    ]

                productPrice_element = html_content.select_one(".product-price span")

                price = (
                    productPrice_element.get_text(strip=True)
                    if productPrice_element
                    else "Product price not found"
                )

                properties_tag = html_content.select_one(".pro-property__wrapper")

                properties = []

                if properties_tag:
                    all_tag = properties_tag.select(".pro-property__item")

                    for i in all_tag:
                        title_des = i.select_one(".property-title")
                        des = i.select_one("property-des")

                        if title_des is not None and des is not None:
                            properties.append({title: title_des, des: des})

                description_container = html_content.select(".description-content")

                feaatures = []

                description_use = []

                if description_container:

                    for i in description_container[0].find_all("div"):
                        text = i.getText(strip=True)
                        if text is None or text == "Xem thêm":
                            continue

                        feaatures.append(i.getText(strip=True))

                    for i in description_container[1].find_all("div"):
                        description_use.append(i.getText(strip=True))

                money = split_money(price)

                if (
                    title
                    and price
                    and images_color
                    and len(description_use)
                    and len(feaatures)
                ):

                    products.append(
                        {
                            "name": title,
                            "price": money["price"],
                            "category": category,
                            "currency": money["currency"],
                            "sizes": defaultSizes,
                            "descriptionOfUse": description_use,
                            "features": feaatures,
                            "images_color": images_color,
                        }
                    )

            except Exception as e:
                print(e)

        else:
            print("URL from a tag not found")


def display_products(product):
    """
    Prints the extracted product information.
    """
    for product in products:
        print("=" * 40)
        print("Name:", product["name"])
        print("Currency:", product["currency"])
        print("Price:", product["price"])
        print("Color:", product["color"])
        print("Sizes:", product["sizes"])
        print("Description:", product["description_use"])
        print("Features:", product["features"])
        print("Category:", product["category"])
        print("=" * 40)


def export_to_typescript(
    data,
    variable_name="products",
    file_name="products.ts",
    directory="D:/projects/tools",
):

    try:
        # Convert to JSON with indentation for readability
        json_data = json.dumps(data, indent=4, ensure_ascii=False)

        # Wrap the JSON data in a TypeScript export statement
        ts_data = f"export const {variable_name} = {json_data};\n"

        # Ensure the target directory exists
        os.makedirs(directory, exist_ok=True)

        # Define the full file path
        file_path = os.path.join(directory, file_name)

        # Write the data to the TypeScript file
        with open(file_path, "w", encoding="utf-8") as ts_file:
            ts_file.write(ts_data)

        print(f"File successfully written to {file_path}")
    except Exception as e:
        print(f"Failed to export to TypeScript: {e}")


def convert_description_to_dict(description):
    """
    Converts a description string with items separated by hyphens into a dictionary.
    Each item becomes a key in the dictionary without a value.
    """
    # Split the description by hyphen and strip whitespace
    items = [item.strip() for item in description.split("-") if item.strip()]

    # Create a dictionary from the items with empty string as the value
    description_dict = {item: "" for item in items}

    return description_dict


def get_detail_data(url):
    html_content = fetch_html(url)

    if html_content:
        soup = BeautifulSoup(html_content, "html.parser")
        descriptions_meta = soup.select_one('meta[name="description"]')

        # Debugging output to check if the meta tag is found
        if descriptions_meta is not None:
            # Return the content if it exists
            return descriptions_meta.get("content", None)
        else:
            print("Meta tag for description not found.")
            return None
    else:
        print("No HTML content retrieved.")
        return None


def main():
    html_content = fetch_html(url_product_ao_thun_nu)
    html_category_content = fetch_html(url_category)
    if html_content:
        parse_category_data(html_category_content)

        # display_products(products)

        export_to_typescript(products, directory="D:/projects/shop/server/src/mockdata")

        print(products[0])


if __name__ == "__main__":
    main()
